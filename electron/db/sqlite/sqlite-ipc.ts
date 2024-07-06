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
    IPC_SQLITE_UPDATE_CONFIG_DATA,
    IPC_SQLITE_UPDATE_GROUP_DATA,
    IPC_SQLITE_UPDATE_PWD_INFO_DATA,
} from '../../constant.ts';
import {
    delGroup,
    delPwdInfo,
    getConfig,
    getPwdInfo,
    insertGroup,
    insertPwdInfo,
    listGroup,
    listPwdInfo,
    updateConfig,
    updateGroup,
    updatePwdInfo
} from "./sql-main.ts";

// sqlite

/**
 * SQLiteIPC
 */
export const SQLiteIPC = () => {
    // config
    // ipc sqlite update data
    ipcMain.handle(IPC_SQLITE_UPDATE_CONFIG_DATA, async (event, ...args) => {
        console.log(`IPC_SQLITE_UPDATE_CONFIG_DATA  args : ${args}`);
        return await updateConfig(...args);
    });

    // ipc sqlite select data
    ipcMain.handle(IPC_SQLITE_SELECT_CONFIG_DATA, async (event, args) => {
        console.log(`IPC_SQLITE_SELECT_CONFIG_DATA  args : ${args}`);
        return await getConfig(args);
    });


    // group
    // ipc sqlite insert data
    ipcMain.handle(IPC_SQLITE_INSERT_GROUP_DATA, async (event, ...args) => {
        console.log(`IPC_SQLITE_INSERT_GROUP_DATA  args : ${args}`);
        return await insertGroup(...args);
    });

    // ipc sqlite delete data
    ipcMain.handle(IPC_SQLITE_DELETE_GROUP_DATA, async (event, args) => {
        console.log(`IPC_SQLITE_DELETE_GROUP_DATA  args : ${args}`);
        return await delGroup(args);
    });


    // ipc sqlite update data
    ipcMain.handle(IPC_SQLITE_UPDATE_GROUP_DATA, async (event, ...args) => {
        console.log(`IPC_SQLITE_UPDATE_GROUP_DATA  args : ${args}`);
        return await updateGroup(...args);
    });

    // ipc sqlite select data
    ipcMain.handle(IPC_SQLITE_SELECT_GROUP_DATA, async (event, args) => {
        console.log(`IPC_SQLITE_SELECT_GROUP_DATA  args : ${args}`);
        return await listGroup();
    });

    // pwdInfo
    // ipc sqlite insert data
    ipcMain.handle(IPC_SQLITE_INSERT_PWD_INFO_DATA, async (event, ...args) => {
        console.log(`IPC_SQLITE_INSERT_PWD_INFO_DATA  args : ${args}`);
        return await insertPwdInfo(...args);
    });

    // ipc sqlite delete data
    ipcMain.handle(IPC_SQLITE_DELETE_PWD_INFO_DATA, async (event, args) => {
        console.log(`IPC_SQLITE_DELETE_PWD_INFO_DATA  args : ${args}`);
        return await delPwdInfo(args);
    });


    // ipc sqlite update data
    ipcMain.handle(IPC_SQLITE_UPDATE_PWD_INFO_DATA, async (event, ...args) => {
        console.log(`IPC_SQLITE_UPDATE_PWD_INFO_DATA  args : ${args}`);
        return await updatePwdInfo(...args);
    });

    // ipc sqlite select list data
    ipcMain.handle(IPC_SQLITE_SELECT_LIST_PWD_INFO_DATA, async (event, args) => {
        console.log(`IPC_SQLITE_SELECT_PWD_INFO_DATA  args : ${args}`);
        return await listPwdInfo(args);
    });

    // ipc sqlite select get data
    ipcMain.handle(IPC_SQLITE_SELECT_GET_PWD_INFO_DATA, async (event, args) => {
        console.log(`IPC_SQLITE_SELECT_GET_PWD_INFO_DATA  args : ${args}`);
        return await getPwdInfo(args);
    });

};
