import {app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, Tray} from 'electron'
import {exec} from 'child_process'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {readFile, writeFile} from "../src/utils/fileUtils.ts";
import useCrypto from "../src/hooks/useCrypto.ts";
import {defaultOpenMainWinShortcutKey} from "../src/config/config.ts";
/* 引入storeToRefs */

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
let tray
let clickExitTime = 0;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        // 菜单是否隐藏
        autoHideMenuBar: true,
        icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),

        // skipTaskbar: true, // this will hide the window from the taskbar
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            spellcheck: false, // 关闭拼写检查
            // nodeIntegration: true,
            // contextIsolation: false
        },
    })
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
    let trayIcon = nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, 'icon.png'))
    trayIcon = trayIcon.resize({width: 22, height: 22})

    tray = new Tray(trayIcon)

    tray.setToolTip('密码管理器')

    const trayMenu = Menu.buildFromTemplate([


        {
            label: '显示主界面', click() {
                win.show();
            }
        },
        // {
        //     label: '设置', click() {
        //         // 先发送消息跳转到设置页面
        //         toSettingView()
        //         // 再打开页面
        //         win.show(); // 如果窗口未显示或被隐藏，则显示
        //         if (process.platform === 'darwin') {
        //             app.dock.show(); // 在macOS上，从Dock中显示应用
        //         }
        //
        //     }
        // },
        {label: '帮助'},
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

// function toSettingView() {
//     win?.webContents.send('to-setting-view')
// }


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
        registerGlobalShortcut(userInfo.shortcutKey?.openMainWindows);

    })
    .then(() => {
        createWindow()
        createTrayMenu()
    })

function registerGlobalShortcut(openMainWindows: string) {
    console.log('openMainWindows:', openMainWindows)
    // userInfo.shortcutKey.openMainWindows 如果有 Ctrl 则更换成 CommandOrControl
    let openMainWindows1 = openMainWindows ? openMainWindows : defaultOpenMainWinShortcutKey;
    let openMainWindows2 = openMainWindows1.replace('Ctrl', 'CommandOrControl')

    globalShortcut.register(openMainWindows2, () => {
        showWindows()
    })
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

app.on('before-quit', (e) => {
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
ipcMain.handle('init-data', (event, arg) => {
    console.log(`Received message from renderer:`);
    return initDataStr;
});

ipcMain.handle('save-data', (event, arg) => {
    console.log(`Received save-data:`);
    saveInfoToDB(arg);
});

ipcMain.handle('save-shortcuts', (event, arg) => {
    console.log(`Received auto-start: ${arg}`);
    registerGlobalShortcut(arg)
});

ipcMain.handle('auto-start', (event, arg) => {
    console.log(`Received auto-start: ${arg}`);
    setAutoStart(arg);
});

// todo 有问题
function setAutoStart(autoStart: boolean) {
    const appName = app.getName();
    const key = `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run`;
    const value = `"${app.getPath('exe')} --hidden"`; // `--hidden` 可选，使应用后台启动

    const command = autoStart
        ? `reg add "${key}" /v "${appName}" /t REG_SZ /d "${value}"`
        : `reg delete "${key}" /v "${appName}" /f`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Failed to set auto start: ${error}`);
        } else {
            console.log(`Auto start set successfully.`);
        }
    });
}


