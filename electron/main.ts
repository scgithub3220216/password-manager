import {app, BrowserWindow, Menu, nativeImage, Tray} from 'electron'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import * as fs from "fs";

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
    height:600,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
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

let tray
function createTrayMenu() {
  let trayIcon = nativeImage.createFromPath('F:\\electron\\electron-vite-project\\electron\\icon.png')
  trayIcon = trayIcon.resize({ width: 22, height: 22 })

  tray = new Tray(trayIcon)
  // tray = new Tray('F:\\electron\\electron-vite-project\\electron\\icon.png')

  tray.setToolTip('密码管理器')

  const trayMenu = Menu.buildFromTemplate([
    { label: '离开', click() { app.quit() } },
    { label: '设置' },
    { label: 'Bar' },
  ])
  tray.setContextMenu(trayMenu)
}

app.whenReady().then(()=>{
  createWindow()
  createTrayMenu()
})

// 读取文件
function readFile(filePath) {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  });
}

// 写入文件
function writeFile(filePath, content) {
  fs.writeFile(filePath, content, 'utf-8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('文件写入成功');
  });
}


const userDataPath = app.getPath('userData');
console.log('path:', userDataPath);
const filePath = path.join(userDataPath, 'example.txt');


try {
  fs.accessSync(filePath, fs.constants.F_OK);
  console.log("文件存在！");
  // 读取示例
  readFile(filePath);
} catch (err) {
  console.error("文件不存在！");
  // 写入示例
  writeFile(filePath, 'Hello, Electron!');
}