// electron
import {ipcMain} from 'electron';

// const
import {
    IPC_SQLITE_DELETE_GROUP_DATA,
    IPC_SQLITE_DELETE_PWD_INFO_DATA,
    IPC_SQLITE_INSERT_GROUP_DATA,
    IPC_SQLITE_INSERT_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_CONFIG_DATA,
    IPC_SQLITE_SELECT_GET_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_GROUP_DATA,
    IPC_SQLITE_SELECT_LIST_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_SHORTCUT_KEY_DATA,
    IPC_SQLITE_UPDATE_CONFIG_DATA,
    IPC_SQLITE_UPDATE_GROUP_DATA,
    IPC_SQLITE_UPDATE_PWD_INFO_DATA,
    IPC_SQLITE_UPDATE_SHORTCUT_KEY_DATA,
} from '../../constant.ts';
import {getConfig, updateConfig} from "./mapper/config.ts";
import {delGroup, insertGroup, listGroup, updateGroup} from "./mapper/group.ts";
import {delPwdInfo, getPwdInfo, insertPwdInfo, listPwdInfo, updatePwdInfo} from "./mapper/pwdInfo.ts";
import {getShortcutKey, updateShortcutKey} from "./mapper/shortcutKey.ts";


// sqlite

/**
 * SQLiteIPC
 */
export const SQLiteIPC = () => {
    // config
    // ipc sqlite update data
    ipcMain.handle(IPC_SQLITE_UPDATE_CONFIG_DATA, (_event, ...args) => {
        console.log(`IPC_SQLITE_UPDATE_CONFIG_DATA  args : ${args}`);
        updateConfig(...args);
    });

    // ipc sqlite select data
    ipcMain.handle(IPC_SQLITE_SELECT_CONFIG_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_CONFIG_DATA  args : ${args}`);
        return await getConfig(args);
    });


    // group
    // ipc sqlite insert data
    ipcMain.handle(IPC_SQLITE_INSERT_GROUP_DATA, async (_event, ...args) => {
        console.log(`IPC_SQLITE_INSERT_GROUP_DATA  args : ${args}`);
        return await insertGroup(...args);
    });

    // ipc sqlite delete data
    ipcMain.handle(IPC_SQLITE_DELETE_GROUP_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_DELETE_GROUP_DATA  args : ${args}`);
        return await delGroup(args);
    });


    // ipc sqlite update data
    ipcMain.handle(IPC_SQLITE_UPDATE_GROUP_DATA, async (_event, ...args) => {
        console.log(`IPC_SQLITE_UPDATE_GROUP_DATA  args : ${args}`);
        return await updateGroup(...args);
    });

    // ipc sqlite select data
    ipcMain.handle(IPC_SQLITE_SELECT_GROUP_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_GROUP_DATA  args : ${args}`);
        return await listGroup();
    });

    // pwdInfo
    // ipc sqlite insert data
    ipcMain.handle(IPC_SQLITE_INSERT_PWD_INFO_DATA, async (_event, ...args) => {
        console.log(`IPC_SQLITE_INSERT_PWD_INFO_DATA  args : ${args}`);
        return await insertPwdInfo(...args);
    });

    // ipc sqlite delete data
    ipcMain.handle(IPC_SQLITE_DELETE_PWD_INFO_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_DELETE_PWD_INFO_DATA  args : ${args}`);
        return await delPwdInfo(args);
    });


    // ipc sqlite update data
    ipcMain.handle(IPC_SQLITE_UPDATE_PWD_INFO_DATA, async (_event, ...args) => {
        console.log(`IPC_SQLITE_UPDATE_PWD_INFO_DATA  args : ${args}`);
        return await updatePwdInfo(...args);
    });

    // ipc sqlite select list data
    ipcMain.handle(IPC_SQLITE_SELECT_LIST_PWD_INFO_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_PWD_INFO_DATA  args : ${args}`);
        return await listPwdInfo(args);
    });

    // ipc sqlite select get data
    ipcMain.handle(IPC_SQLITE_SELECT_GET_PWD_INFO_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_GET_PWD_INFO_DATA  args : ${args}`);
        return await getPwdInfo(args);
    });

    // shortcutKey
    // ipc sqlite update data
    ipcMain.handle(IPC_SQLITE_UPDATE_SHORTCUT_KEY_DATA, async (_event, ...args) => {
        console.log(`IPC_SQLITE_UPDATE_SHORTCUT_KEY_DATA  args : ${args}`);
        return await updateShortcutKey(...args);
    });

    // ipc sqlite select data
    ipcMain.handle(IPC_SQLITE_SELECT_SHORTCUT_KEY_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_SHORTCUT_KEY_DATA  args : ${args}`);
        return await getShortcutKey(args);
    });

};
