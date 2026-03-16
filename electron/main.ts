import {app, BrowserWindow, ipcMain, Menu, shell} from 'electron'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import {
    AUTO_HIDE_MENU_BAR,
    CHECK_UPDATE,
    FRAME,
    IPC_AUTO_START,
    IPC_CLOSE_WIN,
    IPC_DEV_TOOLS,
    IPC_FIRST_LOGIN,
    IPC_IMAGE_DELETE_ALL_LOCAL,
    IPC_IMAGE_DELETE_LOCAL_DIR,
    IPC_IMAGE_DELETE_LOCAL_FILE,
    IPC_IMAGE_GET_ENCRYPTED_CONTENT,
    IPC_IMAGE_READ_FROM_LOCAL,
    IPC_IMAGE_SAVE_ENCRYPTED_CONTENT,
    IPC_IMAGE_SAVE_TO_LOCAL,
    IPC_MAXIMIZE,
    IPC_MINIMIZE,
    IPC_OPEN_BROWSER,
    IPC_SAVE_IMAGE_TO_DESKTOP,
    IPC_SAVE_SHORTCUTS,
    TRANSPARENT,
    WINDOW_INDEX_HEIGHT,
    WINDOW_INDEX_WIDTH
} from "./constant.ts";
import {createTrayMenu} from "./tray-menu.ts";
import {openDevTools, registerGlobalShortcut, setAutoStart} from "./common.ts";
import {initTable} from "./db/sqlite/components/initSql.ts";
import {SQLiteIPC} from "./db/sqlite/sqlite-ipc.ts";
import {openMainWindows} from "./db/sqlite/components/configConstants.ts";
import {getShortcutKey} from "./db/sqlite/mapper/shortcutKey.ts";
import {updateManager} from './updater';
import {
    deleteAllImageFiles,
    deleteImageDir,
    deleteImageFile,
    getEncryptedFileContent,
    readImageFile,
    saveEncryptedFileContent,
    saveImageFile,
} from './image-file.ts';
//@ts-ignore
const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST
//@ts-ignore
let win: BrowserWindow | null
const appState = {isAppClosing: false};
// 检查是否已有实例运行
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    // 如果已有实例，直接退出
    app.quit()
} else {
    app.whenReady().then(async () => {
        createWindow()
        createTrayMenu(win, appState)
        SQLiteIPC();
        await initTable();
        registerGlobalShortcut((await getShortcutKey(openMainWindows))?.desc, win);

        setupIPC();

        updateManager.launchCheckUpdate();
    })
}

function createWindow() {
    // 在创建浏览器窗口之前设置AppUserModelId
    app.setAppUserModelId('password-manager')
    win = new BrowserWindow({
        width: WINDOW_INDEX_WIDTH,
        height: WINDOW_INDEX_HEIGHT,
        // 外边框是否展示
        frame: FRAME,
        // 设置窗口的背景透明
        transparent: TRANSPARENT,
        // 菜单是否隐藏 按住 Alt 还会展示
        autoHideMenuBar: AUTO_HIDE_MENU_BAR,
        icon: path.join(process.env.VITE_PUBLIC, 'assets/icon.ico'),

        // skipTaskbar: true, // this will hide the window from the taskbar
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            spellcheck: false, // 关闭拼写检查
        },
    })
    // 隐藏菜单栏 直接关闭,
    Menu.setApplicationMenu(null);
    // openDevTools(win);


    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }
    win.on('close', (event) => {
        console.log('close event')
        if (!appState.isAppClosing) {
            console.log('win?.hide()')
            event.preventDefault();
            win?.hide();
            return false;
        }
        quit();
    });
    // 主窗口完成后显示托盘
    win.webContents.on('dom-ready', () => {
        // 如果需要在启动时就显示窗口，可以取消注释下面这行
        // win.show();
        console.log('hide app to pallet')
        // 或者直接隐藏
        win?.hide();
    });

}

function quit() {
    console.log('quit')
    app.quit()
    win = null
}

app.on('before-quit', () => {
    console.log('before-quit')
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    console.log('退出之前')
    if (process.platform !== 'darwin') {
        quit();
    }
})


app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})


ipcMain.handle(IPC_SAVE_SHORTCUTS, (_event, arg) => {
    console.log(`Received IPC_SAVE_SHORTCUTS: ${arg}`);
    registerGlobalShortcut(arg, win);
});
ipcMain.handle(IPC_FIRST_LOGIN, (_event, arg) => {
    console.log(`Received ${IPC_FIRST_LOGIN}: ${arg}`);
    setAutoStart(true);
});

ipcMain.handle(IPC_AUTO_START, (_event, arg) => {
    console.log(`Received auto-start: ${arg}`);
    setAutoStart(arg);
});
ipcMain.handle(IPC_OPEN_BROWSER, (_event, arg) => {
    console.log(`IPC_OPEN_BROWSER:${arg} `);
    shell.openExternal(arg);
});

ipcMain.handle(IPC_DEV_TOOLS, (_event, arg) => {
    console.log(`IPC_DEV_TOOLS :${arg} `);
    if (!win) return;
    openDevTools(win);
});


// 窗口 （最小化、最大化/还原、关闭）

ipcMain.handle(IPC_MINIMIZE, () => {
    console.log(IPC_MINIMIZE)
    win?.minimize()
})

ipcMain.handle(IPC_MAXIMIZE, () => {
    console.log(IPC_MAXIMIZE)
    if (win?.isMaximized()) {
        win.unmaximize()
    } else {
        win?.maximize()
    }
})

ipcMain.handle(IPC_CLOSE_WIN, () => {
    console.log(IPC_CLOSE_WIN)
    // 最小化窗口到系统托盘
    win?.hide();
})

// update CHECK_UPDATE
ipcMain.handle(CHECK_UPDATE, () => {
    console.log(CHECK_UPDATE)
    return updateManager.checkForUpdates(1);
})

// 图片下载到桌面
ipcMain.handle(IPC_SAVE_IMAGE_TO_DESKTOP, async (_event, base64Data: string, fileName: string) => {
    const desktopPath = app.getPath('desktop');
    const buffer = Buffer.from(base64Data, 'base64');
    const ext = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, ext);
    let targetPath = path.join(desktopPath, fileName);
    let counter = 1;
    while (fs.existsSync(targetPath)) {
        targetPath = path.join(desktopPath, `${nameWithoutExt}(${counter})${ext}`);
        counter++;
    }
    fs.writeFileSync(targetPath, buffer);
    return targetPath;
})

// 图片文件操作 IPC
ipcMain.handle(IPC_IMAGE_SAVE_TO_LOCAL, async (_event, pwdId: number, base64Data: string, originalName: string) => {
    console.log(`IPC_IMAGE_SAVE_TO_LOCAL pwdId:${pwdId}, originalName:${originalName}`);
    return saveImageFile(pwdId, base64Data, originalName);
})

ipcMain.handle(IPC_IMAGE_READ_FROM_LOCAL, async (_event, relativePath: string) => {
    console.log(`IPC_IMAGE_READ_FROM_LOCAL relativePath:${relativePath}`);
    return readImageFile(relativePath);
})

ipcMain.handle(IPC_IMAGE_DELETE_LOCAL_FILE, async (_event, relativePath: string) => {
    console.log(`IPC_IMAGE_DELETE_LOCAL_FILE relativePath:${relativePath}`);
    deleteImageFile(relativePath);
})

ipcMain.handle(IPC_IMAGE_DELETE_LOCAL_DIR, async (_event, pwdId: number) => {
    console.log(`IPC_IMAGE_DELETE_LOCAL_DIR pwdId:${pwdId}`);
    deleteImageDir(pwdId);
})

ipcMain.handle(IPC_IMAGE_DELETE_ALL_LOCAL, async (_event) => {
    console.log(`IPC_IMAGE_DELETE_ALL_LOCAL`);
    deleteAllImageFiles();
})

ipcMain.handle(IPC_IMAGE_GET_ENCRYPTED_CONTENT, async (_event, relativePath: string) => {
    console.log(`IPC_IMAGE_GET_ENCRYPTED_CONTENT relativePath:${relativePath}`);
    return getEncryptedFileContent(relativePath);
})

ipcMain.handle(IPC_IMAGE_SAVE_ENCRYPTED_CONTENT, async (_event, relativePath: string, content: string) => {
    console.log(`IPC_IMAGE_SAVE_ENCRYPTED_CONTENT relativePath:${relativePath}`);
    saveEncryptedFileContent(relativePath, content);
})

// IPC 事件处理
function setupIPC() {
    // 检查更新
    ipcMain.handle('check-for-updates', async () => {
        try {
            return await updateManager.checkForUpdatesManually();
        } catch (error) {
            throw error;
        }
    });

    // 下载更新
    ipcMain.handle('download-update', () => {
        updateManager.downloadUpdate();
    });

    // 安装更新
    ipcMain.handle('install-update', () => {
        updateManager.quitAndInstall();
    });

    // 获取当前版本
    ipcMain.handle('get-current-version', () => {
        return updateManager.getCurrentVersion();
    });
}

// 监听更新事件
updateManager.on('update-available', (info) => {
    console.log('主进程收到更新可用事件:', info);
});

updateManager.on('download-progress', (progress) => {
    console.log('主进程收到下载进度:', progress);
});

updateManager.on('update-downloaded', () => {
    console.log('主进程收到更新下载完成事件');
});