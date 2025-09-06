import {contextBridge, ipcRenderer} from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args
        return ipcRenderer.send(channel, ...omit)
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
    },

    // You can expose other APTs you need here.
    // ...

    // 添加更新相关的便捷方法
    update: {
        checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
        downloadUpdate: () => ipcRenderer.invoke('download-update'),
        installUpdate: () => ipcRenderer.invoke('install-update'),
        getCurrentVersion: () => ipcRenderer.invoke('get-current-version'),
        onDownloadProgress: (callback: (progress: any) => void) => {
            ipcRenderer.on('download-progress', (_, progress) => callback(progress))
        },
        removeDownloadProgressListener: () => {
            ipcRenderer.removeAllListeners('download-progress')
        }
    }
})
