// update-manager.ts
import {autoUpdater, UpdateDownloadedEvent} from 'electron-updater';
import {BrowserWindow, dialog} from 'electron';

interface UpdateInfo {
    version: string;
    releaseName?: string;
    releaseNotes?: string | null;
    releaseDate?: Date;
    path?: string;
    sha512?: string;
    sign?: string;
}

interface ProgressInfo {
    percent: number;
    transferred: number;
    total: number;
    delta?: number;
    bytesPerSecond?: number;
}

class UpdateManager {
    private mainWindow: BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
        this.init();
    }

    private init(): void {
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        autoUpdater.on('checking-for-update', () => {
            this.onCheckingForUpdate();
        });
        // @ts-ignore
        autoUpdater.on('update-available', (info: UpdateInfo) => {
            this.onUpdateAvailable(info);
        });

        autoUpdater.on('update-not-available', () => {
            this.onUpdateNotAvailable();
        });

        autoUpdater.on('error', (err: Error) => {
            this.onError(err);
        });

        autoUpdater.on('download-progress', (progressObj: ProgressInfo) => {
            this.onDownloadProgress(progressObj);
        });

        autoUpdater.on('update-downloaded', (event: UpdateDownloadedEvent) => {
            this.onUpdateDownloaded(event);
        });
    }

    private onCheckingForUpdate(): void {
        console.log('正在检查更新...');
        this.sendMessageToRenderer('checking-for-update', '正在检查更新...');
    }

    private onUpdateAvailable(info: UpdateInfo): void {
        console.log('发现新版本:', info.version);
        this.showUpdateDialog(info);
    }

    private onUpdateNotAvailable(): void {
        console.log('当前已经是最新版本');
        this.sendMessageToRenderer('update-not-available', '当前已经是最新版本');
    }

    private onError(error: Error): void {
        console.error('更新错误:', error);
        this.showErrorDialog('更新错误', '检查更新时发生错误，请稍后重试。');
    }

    private onDownloadProgress(progressObj: ProgressInfo): void {
        const log_message = `下载进度: ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`;
        console.log(log_message);
        this.sendMessageToRenderer('download-progress', {
            percent: progressObj.percent,
            transferred: progressObj.transferred,
            total: progressObj.total
        });
    }

    private onUpdateDownloaded(event: UpdateDownloadedEvent): void {
        console.log('更新已下载，准备安装');
        this.showRestartDialog(event);
    }

    private showUpdateDialog(info: UpdateInfo): void {
        console.log(`info:`,JSON.stringify(info))
        dialog.showMessageBox(this.mainWindow, {
            type: 'info',
            title: '发现新版本',
            message: `发现新版本 ${info.version}，是否现在更新？`,
            buttons: ['是', '否'],
            cancelId: 1
        }).then(result => {
            if (result.response === 0) {
                autoUpdater.downloadUpdate();
            } else {
                this.sendMessageToRenderer('update-cancelled', '用户取消了更新');
            }
        });
    }

    private showRestartDialog(event: UpdateDownloadedEvent): void {
        console.log(`event:`,JSON.stringify(event))

        dialog.showMessageBox(this.mainWindow, {
            type: 'info',
            title: '更新准备就绪',
            message: '新版本已下载完成，程序将在重启后安装更新。',
            buttons: ['立即重启', '稍后重启'],
            cancelId: 1
        }).then(result => {
            if (result.response === 0) {
                setImmediate(() => autoUpdater.quitAndInstall());
            } else {
                this.sendMessageToRenderer('update-ready', '更新已准备好，等待重启安装');
            }
        });
    }

    private showErrorDialog(title: string, message: string): void {
        dialog.showErrorBox(title, message);
    }

    private sendMessageToRenderer(channel: string, data: any): void {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send(channel, data);
        }
    }

    // 公共方法
    public checkForUpdates(): void {
        try {
            autoUpdater.checkForUpdates();
        } catch (error) {
            this.onError(error as Error);
        }
    }

    public downloadUpdate(): void {
        autoUpdater.downloadUpdate();
    }

    public quitAndInstall(): void {
        autoUpdater.quitAndInstall();
    }

    public setFeedURL(config: any): void {
        autoUpdater.setFeedURL(config);
    }
}

export default UpdateManager;
