import {app, BrowserWindow, ipcMain, Menu, shell} from 'electron'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {AUTO_HIDE_MENU_BAR, FRAME, IPC_FIRST_LOGIN, TRANSPARENT, WINDOW_INDEX_HEIGHT, WINDOW_INDEX_WIDTH} from "./constant.ts";
import {createTrayMenu} from "./tray-menu.ts";
import {registerGlobalShortcut, setAutoStart} from "./common.ts";
import {initTable} from "./db/sqlite/components/initSql.ts";
import {SQLiteIPC} from "./db/sqlite/sqlite-ipc.ts";
import {openMainWindows} from "./db/sqlite/components/configConstants.ts";
import {getShortcutKey} from "./db/sqlite/mapper/shortcutKey.ts";
//@ts-ignore
const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let initDataStr = '';
let win: BrowserWindow | null


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
    // 调试窗口
    // win.webContents.openDevTools()

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }
    win.on('close', () => {
        console.log('close event')
        quit();
    });

}

app.whenReady().then(async () => {
    createWindow()
    createTrayMenu(win)
    SQLiteIPC();
    await initTable();
    registerGlobalShortcut((await getShortcutKey(openMainWindows))?.desc, win);
})



function quit() {
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
ipcMain.handle('init-data', () => {
    console.log(`Received message from renderer`);
    return initDataStr;
});

ipcMain.handle('save-shortcuts', (_event, arg) => {
    console.log(`Received auto-start: ${arg}`);
    registerGlobalShortcut(arg, win);
});
ipcMain.handle(IPC_FIRST_LOGIN, (_event, arg) => {
    console.log(`Received ${IPC_FIRST_LOGIN}: ${arg}`);
    setAutoStart(true);
});

ipcMain.handle('auto-start', (_event, arg) => {
    console.log(`Received auto-start: ${arg}`);
    setAutoStart(arg);
});
ipcMain.handle('open-browser', (_event, arg) => {
    console.log(`open-browser:${arg} `);
    shell.openExternal(arg);
});


// 窗口 （最小化、最大化/还原、关闭）

ipcMain.handle('minimize', () => {
    console.log('minimize')
    win?.minimize()
})

ipcMain.handle('maximize', () => {
    console.log('maximize')
    if (win?.isMaximized()) {
        win.unmaximize()
    } else {
        win?.maximize()
    }
})

ipcMain.handle('close-win', () => {
    console.log('close-win')
    // 最小化窗口到系统托盘
    win?.hide();
})
