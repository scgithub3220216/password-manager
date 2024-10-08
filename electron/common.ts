import {app, BrowserWindow, globalShortcut} from "electron";

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

// 设置 全局快捷键
export const registerGlobalShortcut = (openMainWindows: string, win: BrowserWindow | null) => {
    console.log('openMainWindows:', openMainWindows)

    if (!openMainWindows) {
        globalShortcut.unregisterAll()
        return;
    }

    let replaceValue = 'CommandOrControl';
    // userInfo.shortcutKey.openMainWindows 如果有 Ctrl 则更换成 CommandOrControl
    let openMainWindows2 = openMainWindows.replace('Ctrl', replaceValue)
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

// 设置开机启动
export const setAutoStart = (autoStart: boolean) => {
    console.log('设置开机启动 autoStart:', autoStart)
    // 设置开机启动 第一种方案
    app.setLoginItemSettings({
        openAtLogin: autoStart, // 设置为true以启用开机启动
        path: process.execPath, // 可选，应用的启动路径
        args: [], // 可选，启动时传递给应用的命令行参数
    });
}

export const openDevTools = (win: BrowserWindow) => {
    console.log('openDevTools')
    // 调试窗口
    win.webContents.openDevTools()
}