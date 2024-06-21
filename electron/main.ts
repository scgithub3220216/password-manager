import {app, BrowserWindow, ipcMain, Menu, nativeImage, Tray} from 'electron'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import * as fs from "fs";
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

let win: BrowserWindow | null

function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 600,
        // 菜单是否隐藏
        autoHideMenuBar: true,
        icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            nodeIntegration: true,
            contextIsolation: false
        },
    })

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
}

let tray

function createTrayMenu() {
    let trayIcon = nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, 'icon.png'))
    trayIcon = trayIcon.resize({width: 22, height: 22})

    tray = new Tray(trayIcon)

    tray.setToolTip('密码管理器')

    const trayMenu = Menu.buildFromTemplate([
        {
            label: '离开', click() {
                app.quit()
            }
        },
        {label: '设置'},
        {label: '打开'},
        {label: '开机启动'},
        {label: '帮助'},
        {label: '代码地址'},
    ])
    tray.setContextMenu(trayMenu)
}

app.whenReady().then(() => {
    createWindow()
    createTrayMenu()
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})


ipcMain.handle('get-data', (_, ...args) => {
    console.log('get-data', ...args)
    const userDataPath = app.getPath('userData');
    console.log('path:', userDataPath);
    const filePath = path.join(userDataPath, 'example.txt');
    return readFile(filePath);
})
// ipcMain.on('save-data', (event, data) => {
//     const userDataPath = app.getPath('userData');
//     console.log('path:', userDataPath);
//     const filePath = path.join(userDataPath, 'example.txt');
//
//     fs.writeFile(filePath, data, (err) => {
//         if (err) {
//             event.reply('save-data-reply', '写入文件时出错: ' + err);
//         } else {
//             event.reply('save-data-reply', '文件写入成功');
//         }
//     });
// });

// export function readFileDataToPinia() {
//     const userDataPath = app.getPath('userData');
//     console.log('path:', userDataPath);
//     const filePath = path.join(userDataPath, 'example.txt');
//
//     try {
//         fs.accessSync(filePath, fs.constants.F_OK);
//         console.log("文件存在！");
//         // 读取示例
//         readFile(filePath);
//     } catch (err) {
//         console.error("文件不存在！");
//
//         // 写入示例
//         writeFile(filePath, getUserInfoStr());
//     }
// }
//
function readFile(filePath) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(data);
        return data;
    });
}

//
// // 写入文件
// function writeFile(filePath, content) {
//     fs.writeFile(filePath, content, 'utf-8', (err) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log('文件写入成功');
//     });
// }