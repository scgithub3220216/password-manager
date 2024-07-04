import {app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, shell, Tray} from 'electron'
// import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {readFile, writeFile} from "./utils/fileUtils.ts";
import useCrypto from "../src/hooks/useCrypto.ts";
import {defaultOpenMainWinShortcutKey, helpLink} from "../src/config/config.ts";

// const require = createRequire(import.meta.url)
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
let tray
let clickExitTime = 0;

function createWindow() {
    // 在创建浏览器窗口之前设置AppUserModelId
    app.setAppUserModelId('password-manager')
    win = new BrowserWindow({
        width: 1000,
        height: 700,
        // 菜单是否隐藏 按住 Alt 还会展示
        autoHideMenuBar: true,
        icon: path.join(process.env.VITE_PUBLIC, 'assets/icon.ico'),

        // skipTaskbar: true, // this will hide the window from the taskbar
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            spellcheck: false, // 关闭拼写检查
            // nodeIntegration: true,
            // contextIsolation: false
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
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }

    win.on('close', (e) => {
        console.log('close event')
        // true 说明是 主窗口触发的
        if (new Date().getTime() - clickExitTime >= 1000) {
            console.log('主窗口关闭, 最小化到托盘')
            // 阻止默认的关闭操作
            e.preventDefault();

            // 最小化窗口到系统托盘
            win?.hide();
            return;
        }

        quit();
    });

}

function createTrayMenu() {
    let trayIcon = nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, 'assets/icon.ico'))
    trayIcon = trayIcon.resize({width: 22, height: 22})

    tray = new Tray(trayIcon)

    tray.setToolTip('密码管理器')

    const trayMenu = Menu.buildFromTemplate([
        {
            label: '显示主界面', click() {
                win?.show();
            }
        },
        {
            label: '帮助', click() {
                shell.openExternal(helpLink);
            }
        },
        {
            label: '退出', click() {
                clickExitTime = new Date().getTime()
                app.quit()
            }
        },
    ])
    tray.setContextMenu(trayMenu)
    tray.setToolTip('密码管理器')
    tray.setTitle('密码管理器')

    tray.on('click', () => {
        showWindows()
    });
}


//  打开窗口 ,如果已经打开了, 则缩小
function showWindows() {
    if (win) {
        if (win.isVisible()) {
            win.hide(); // 如果窗口已显示，则隐藏
        } else {
            win.show(); // 如果窗口未显示或被隐藏，则显示
            if (process.platform === 'darwin') {
                app.dock.show(); // 在macOS上，从Dock中显示应用
            }
        }
    } else {
        createWindow()
    }
}

const {decryptData} = useCrypto();

app.whenReady()
    // 读取 文件内容, 然后根据一些设置进行一些操作
    .then(async () => {
        console.log('准备读取数据')
        initDataStr = await readFile(getFilePath());
        console.log('数据读取成功')
        if (!initDataStr) {
            console.log('数据为空')
            setAutoStart(true)
            registerGlobalShortcut(defaultOpenMainWinShortcutKey);
            return;
        }
        // 解析数据
        let text = decryptData(initDataStr);
        const fileDataObj = JSON.parse(text);
        let userInfo = fileDataObj.userInfo
        // 如果是第一次登录
        if (userInfo.firstLoginFlag) {
            // 设置开机启动
            setAutoStart(true)
        }

        // 设置快捷键
        registerGlobalShortcut(fileDataObj.shortCutKeyCombs[0].desc);

    })
    .then(() => {
        createWindow()
        createTrayMenu()
    })

function registerGlobalShortcut(openMainWindows: string) {
    console.log('openMainWindows:', openMainWindows)
    let replaceValue = 'CommandOrControl';
    // userInfo.shortcutKey.openMainWindows 如果有 Ctrl 则更换成 CommandOrControl
    let openMainWindows1 = openMainWindows ? openMainWindows : defaultOpenMainWinShortcutKey;
    let openMainWindows2 = openMainWindows1.replace('Ctrl', replaceValue)
    // .replace('Control', replaceValue)
    console.log('openMainWindows2:', openMainWindows2)
    // 清除快捷键
    globalShortcut.unregisterAll()
    try {
        globalShortcut.register(openMainWindows2, () => {
            showWindows()
        })
    } catch (e) {
        console.log('注册快捷键失败:', e)
        globalShortcut.unregisterAll()
    }
}

function getFilePath() {
    const userDataPath = app.getPath('userData');
    console.log('path:', userDataPath);
    return path.join(userDataPath, 'example.txt');
}

function quit() {
    app.quit()
    win = null
}

app.on('before-quit', () => {
    console.log('before-quit')
})

function saveInfoToDB(fileDataObjJson: string) {
    // 写入文件
    writeFile(getFilePath(), fileDataObjJson)
}

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
// @ts-ignore
ipcMain.handle('save-data', (event, arg) => {
    console.log(`Received save-data:`);
    saveInfoToDB(arg);
});
// @ts-ignore
ipcMain.handle('save-shortcuts', (event, arg) => {
    console.log(`Received auto-start: ${arg}`);
    registerGlobalShortcut(arg)
});
// @ts-ignore
ipcMain.handle('auto-start', (event, arg) => {
    console.log(`Received auto-start: ${arg}`);
    setAutoStart(arg);
});
// @ts-ignore
ipcMain.handle('open-browser', (event, arg) => {
    console.log(`open-browser:${arg} `);
    shell.openExternal(arg);
});


function setAutoStart(autoStart: boolean) {
    console.log('设置开机启动 autoStart:', autoStart)
    // 设置开机启动 第一种方案
    app.setLoginItemSettings({
        openAtLogin: autoStart, // 设置为true以启用开机启动
        path: process.execPath, // 可选，应用的启动路径
        args: [], // 可选，启动时传递给应用的命令行参数
    });




}


