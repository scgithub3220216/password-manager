import {app, BrowserWindow, globalShortcut} from "electron";
import {defaultOpenMainWinShortcutKey} from "../src/config/config.ts";

//  打开窗口 ,如果已经打开了, 则缩小
export const showWindows = (win: BrowserWindow | null) => {
    if (!win) return;
    if (win.isVisible()) {
        win.hide(); // 如果窗口已显示，则隐藏
    } else {
        win.show(); // 如果窗口未显示或被隐藏，则显示
        if (process.platform === 'darwin') {
            app.dock.show(); // 在macOS上，从Dock中显示应用
        }
    }
}


export const registerGlobalShortcut = (openMainWindows: string, win: BrowserWindow | null) => {
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
            showWindows(win)
        })
    } catch (e) {
        console.log('注册快捷键失败:', e)
        globalShortcut.unregisterAll()
    }
}