import {app, BrowserWindow, Menu, nativeImage, shell, Tray} from "electron";
import path from "node:path";
import {helpLink} from "../src/config/config.ts";
import {showWindows} from "./common.ts";

export const createTrayMenu = (win: BrowserWindow | null) => {
    if (!win) return;

    let trayIcon = nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, 'assets/icon.ico'))
    trayIcon = trayIcon.resize({width: 22, height: 22})

    let tray = new Tray(trayIcon)

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
                app.quit()
            }
        },
    ])
    tray.setContextMenu(trayMenu)
    tray.setToolTip('密码管理器')
    tray.setTitle('密码管理器')

    tray.on('click', () => {
        showWindows(win)
    });
}