// electron
import {ipcMain} from 'electron';

// const
import {
    IPC_SQLITE_DELETE_GROUP_DATA,
    IPC_SQLITE_DELETE_PWD_INFO_DATA,
    IPC_SQLITE_GET_ID_GROUP_DATA,
    IPC_SQLITE_INSERT_BY_IMPORT_PWD_INFO_DATA,
    IPC_SQLITE_INSERT_GROUP_DATA,
    IPC_SQLITE_INSERT_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_CONFIG_DATA,
    IPC_SQLITE_SELECT_COUNT_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_GET_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_GROUP_DATA,
    IPC_SQLITE_SELECT_LIST_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_SHORTCUT_KEY_DATA,
    IPC_SQLITE_UPDATE_CONFIG_DATA,
    IPC_SQLITE_UPDATE_GROUP_DATA,
    IPC_SQLITE_UPDATE_PWD_INFO_DATA,
    IPC_SQLITE_UPDATE_SHORTCUT_KEY_DATA,
} from '../../constant.ts';
import {getConfig, updateConfig} from "./mapper/config.ts";
import {delGroup, getIdByTitle, insertGroup, listGroup, updateGroup} from "./mapper/group.ts";
import {
    countPwdInfo,
    delPwdInfo,
    getPwdInfo,
    insertPwdInfo,
    insertPwdInfoByImport,
    listPwdInfo,
    listPwdInfoBySearch,
    updatePwdInfo
} from "./mapper/pwdInfo.ts";
import {listShortcutKey, updateShortcutKey} from "./mapper/shortcutKey.ts";


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

    ipcMain.handle(IPC_SQLITE_GET_ID_GROUP_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_GET_ID_GROUP_DATA  args : ${args}`);
        return await getIdByTitle(args);
    });

    // pwdInfo
    // ipc sqlite insert data
    ipcMain.handle(IPC_SQLITE_INSERT_PWD_INFO_DATA, async (_event, ...args) => {
        console.log(`IPC_SQLITE_INSERT_PWD_INFO_DATA  args : ${args}`);
        return await insertPwdInfo(...args);
    });
    // ipc sqlite insert IMPORT data
    ipcMain.handle(IPC_SQLITE_INSERT_BY_IMPORT_PWD_INFO_DATA, async (_event, ...args) => {
        console.log(`IPC_SQLITE_INSERT_BY_IMPORT_PWD_INFO_DATA  args : ${args}`);
        return await insertPwdInfoByImport(...args);
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

    // ipc sqlite select searchValue data
    ipcMain.handle(IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA  args : ${args}`);
        return await listPwdInfoBySearch(args);
    });

    // ipc sqlite select COUNT data
    ipcMain.handle(IPC_SQLITE_SELECT_COUNT_PWD_INFO_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_COUNT_PWD_INFO_DATA  args : ${args}`);
        return await countPwdInfo(args);
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
        return await listShortcutKey();
    });

};
