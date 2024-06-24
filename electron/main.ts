import {app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, Tray} from 'electron'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {readFile, writeFile} from "../src/utils/fileUtils.ts";
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
        width: 800,
        height: 600,
        // 菜单是否隐藏
        autoHideMenuBar: true,
        icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
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
                quit()
            }
        },
        {label: '设置', type: 'radio'},
        {label: '开机启动', type: 'radio'},
        {label: '帮助', type: 'radio', checked: true},
        {label: '支持/捐赠'},
    ])
    tray.setContextMenu(trayMenu)
    tray.setToolTip('密码管理器')
    tray.setTitle('密码管理器')
}

app.whenReady()
    .then(() => {
        globalShortcut.register('Alt+CommandOrControl+E', () => {
            console.log('Electron loves global shortcuts!')
            //  打开窗口 ,如果已经打开了, 则缩小
            if (win) {
                if (win.isMinimized()) {
                    win.restore()
                } else {
                    win.minimize()
                }
            } else {
                createWindow()
            }

        })
    })
    .then(() => {
        createWindow()
        createTrayMenu()
    })


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
    console.log('before-quit2~~~~~~~~~')
})

function saveInfoToDB(fileDataObjJson: string) {
    // 写入文件
    writeFile(getFilePath(), fileDataObjJson)
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
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
ipcMain.handle('init-data', async (event, arg) => {
    console.log(`Received message from renderer:`);
    return await readFile(getFilePath());
});

ipcMain.handle('save-data', (event, arg) => {
    console.log(`Received save-data:`);
    saveInfoToDB(arg);
});




