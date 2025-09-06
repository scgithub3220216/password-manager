// src/updater.ts
import {autoUpdater} from 'electron-updater';
import {BrowserWindow, dialog} from 'electron';
import {EventEmitter} from 'events';
import {getAutoCheckUpateSwitch, getSkipVersion, updateSkipVersion} from "./db/sqlite/mapper/version.ts";

export class UpdateManager extends EventEmitter {
    private mainWindow: BrowserWindow | null = null;

    constructor() {
        super();
        this.setupAutoUpdater();
    }

    setMainWindow(window: BrowserWindow) {
        this.mainWindow = window;
    }

    private setupAutoUpdater() {
        // 配置更新源为 GitHub Releases
        // autoUpdater.setFeedURL({
        //     provider: 'github',
        //     owner: 'scgithub3220216',
        //     repo: 'password-manager',
        //     private: false,
        // });
        autoUpdater.setFeedURL({
            provider: 'generic',
            url: 'http://47.98.114.76/passwordManager/'
        });
        // 设置自动下载为 false，手动控制下载
        autoUpdater.autoDownload = false;

        // 监听更新事件
        this.bindUpdateEvents();
    }

    private bindUpdateEvents() {
        // 检查更新出错
        autoUpdater.on('error', (error) => {
            console.error('更新检查失败:', error);
            this.emit('error', error);
        });

        // 检查更新中
        autoUpdater.on('checking-for-update', () => {
            console.log('正在检查更新...');
            this.emit('checking-for-update');
        });

        // 发现可用更新
        autoUpdater.on('update-available', async (info) => {
            console.log('发现新版本:', info.version);
            // 查看跳过版本是否为空
            const updateVersion = await getSkipVersion();
            console.log('updateVersion:',JSON.stringify(updateVersion))
            if(updateVersion?.skip_version === info.version){
                console.log('跳过当前版本更新')
                return;
            }

            this.emit('update-available', info);
            this.showUpdateDialog(info);
        });

        // 没有可用更新
        autoUpdater.on('update-not-available', (info) => {
            console.log('当前已是最新版本');
            this.emit('update-not-available', info);
            // 即使没有更新也要显示通知

        });

        // 下载进度
        autoUpdater.on('download-progress', (progressObj) => {
            const { percent, transferred, total, bytesPerSecond } = progressObj;
            console.log(`下载进度: ${percent.toFixed(2)}%`);
            this.emit('download-progress', progressObj);

            // 向渲染进程发送进度信息
            if (this.mainWindow) {
                this.mainWindow.webContents.send('download-progress', {
                    percent: percent.toFixed(2),
                    transferred,
                    total,
                    speed: bytesPerSecond
                });
            }
        });

        // 下载完成
        autoUpdater.on('update-downloaded', (info) => {
            console.log('更新下载完成');
            this.emit('update-downloaded', info);
            this.showInstallDialog();
        });
    }

    // 显示更新确认对话框
    private async showUpdateDialog(updateInfo: any) {
        const result = await dialog.showMessageBox({
            type: 'info',
            title: '发现新版本',
            message: `发现新版本 ${updateInfo.version}`,
            detail: '是否立即下载更新？',
            buttons: ['立即下载', '稍后提醒', '跳过此版本'],
            defaultId: 0,
            cancelId: 1
        });

        switch (result.response) {
            case 0: // 立即下载
                this.downloadUpdate();
                break;
            case 1: // 稍后提醒
                    // 可以设置定时器稍后再次提醒
                setTimeout(() => {
                    this.checkForUpdates(0)
                }, 1000 * 60 * 10) // 10 分钟后提醒
                break;
            case 2: // 跳过此版本
                updateSkipVersion(updateInfo.version)
                break;
        }
    }

    // 显示安装确认对话框
    private async showInstallDialog() {
        const result = await dialog.showMessageBox({
            type: 'info',
            title: '更新已下载',
            message: '新版本已下载完成',
            detail: '应用将重启以完成更新，是否立即重启？',
            buttons: ['立即重启', '稍后重启'],
            defaultId: 0,
            cancelId: 1
        });

        if (result.response === 0) {
            this.quitAndInstall();
        }
    }
    async launchCheckUpdate(){
        console.log('launchCheckUpdate')
        // 检查开关是否开启
        const updateVersion = await getAutoCheckUpateSwitch();
        if(updateVersion?.auto_check_switch !== '1'){
            console.log('auto checkSwitch is off')
            return;
        }

        setTimeout(() => {
            this.checkForUpdates(0);
        }, 3000); // 延迟3秒检查
    }

    // 检查更新
    //type 0:系统 1:前端页面 2:托盘
    async checkForUpdates(type:number) {
        console.log('checkForUpdates')
        // 去除版本号
        updateSkipVersion("")
        const updateInfo = await autoUpdater.checkForUpdatesAndNotify();
        console.log('更新检查结果:', updateInfo);
        if(type ==2){
            dialog.showMessageBox({
                type: 'info',
                title: '版本检查',
                message: '当前已经是最新版本',
                buttons: ['确定']
            });
        }

        return updateInfo;
    }

    // 手动检查更新
    async checkForUpdatesManually() {
        try {
            return await autoUpdater.checkForUpdates();
        } catch (error) {
            console.error('手动检查更新失败:', error);
            throw error;
        }
    }

    // 下载更新
    downloadUpdate() {
        autoUpdater.downloadUpdate();
    }

    // 退出并安装
    quitAndInstall() {
        autoUpdater.quitAndInstall();
    }

    // 获取当前版本
    getCurrentVersion() {
        return autoUpdater.currentVersion;
    }
}

// 导出单例实例
export const updateManager = new UpdateManager();