// electron
import {ipcMain} from 'electron';

// const
import {
    AUTO_CHECK_UPDATE_SWITCH_SELECT,
    AUTO_UPDATE_SWITCH_UPDATE,
    IPC_SQLITE_DELETE_ALL_GROUP_DATA,
    IPC_SQLITE_DELETE_ALL_PWD_INFO_BY_GROUP_ID,
    IPC_SQLITE_DELETE_ALL_PWD_INFO_DATA,
    IPC_SQLITE_DELETE_GROUP_DATA,
    IPC_SQLITE_DELETE_PWD_INFO_DATA,
    IPC_SQLITE_GET_ID_GROUP_DATA,
    IPC_SQLITE_INSERT_BY_IMPORT_PWD_INFO_DATA,
    IPC_SQLITE_INSERT_GROUP_DATA,
    IPC_SQLITE_INSERT_OSS_GROUP_DATA,
    IPC_SQLITE_INSERT_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_CONFIG_DATA,
    IPC_SQLITE_SELECT_COUNT_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_GET_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_GROUP_DATA,
    IPC_SQLITE_SELECT_LIST_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_OSS_DATA,
    IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA_IDS,
    IPC_SQLITE_SELECT_SHORTCUT_KEY_DATA,
    IPC_SQLITE_UPDATE_CONFIG_DATA,
    IPC_SQLITE_UPDATE_GROUP_DATA,
    IPC_SQLITE_UPDATE_OSS_DATA,
    IPC_SQLITE_UPDATE_PWD_INFO_DATA,
    IPC_SQLITE_UPDATE_SHORTCUT_KEY_DATA,
    IPC_SQLITE_INSERT_FILE_DATA,
    IPC_SQLITE_DELETE_FILE_DATA,
    IPC_SQLITE_DELETE_FILES_BY_PWD_ID,
    IPC_SQLITE_DELETE_ALL_FILE_DATA,
    IPC_SQLITE_SELECT_LIST_FILE_META,
    IPC_SQLITE_SELECT_GET_FILE_DATA,
    IPC_SQLITE_SELECT_ALL_FILE_DATA,
    IPC_SQLITE_SELECT_COUNT_FILE_DATA,
    IPC_SQLITE_INSERT_FILE_BY_IMPORT_DATA,
    IPC_SQLITE_UPDATE_FILE_OSS_UPLOADED,
    IPC_SQLITE_SELECT_FILE_PATH,
} from '../../constant.ts';
import {getConfig, updateConfig} from "./mapper/config.ts";
import {delAllGroup, delGroup, getIdByTitle, insertGroup, insertGroupByOss, listGroup, updateGroup} from "./mapper/group.ts";
import {
    countPwdInfo,
    delAllPwdInfo,
    delPwdInfo,
    delPwdInfoByGroupId,
    getPwdInfo,
    insertPwdInfo,
    insertPwdInfoByImport,
    listPwdInfo,
    listPwdInfoByIds,
    listPwdInfoBySearch,
    updatePwdInfo
} from "./mapper/pwdInfo.ts";
import {listShortcutKey, updateShortcutKey} from "./mapper/shortcutKey.ts";
import {getAutoCheckUpateSwitch, updateAutoCheckSwitch,} from "./mapper/version.ts";
import {getOss, updateOss} from "./mapper/oss.ts";
import {
    countImagesByPwdId,
    deleteAllImages,
    deleteImage,
    deleteImagesByPwdId,
    getImageData,
    getImageFilePath,
    insertImage,
    insertImageByImport,
    listAllImages,
    listImageMeta,
    updateOssUploaded,
} from "./mapper/image.ts";


// sqlite

/**
 * SQLiteIPC
 */
export const SQLiteIPC = () => {
    // update
    ipcMain.handle(AUTO_CHECK_UPDATE_SWITCH_SELECT, async (_event, args) => {
        console.log(`AUTO_UPDATE_SWITCH  args : ${args}`);
        return await getAutoCheckUpateSwitch();
    });

    ipcMain.handle(AUTO_UPDATE_SWITCH_UPDATE, async (_event, args) => {
        console.log(`AUTO_UPDATE_SWITCH_UPDATE  args : ${args}`);
        return await updateAutoCheckSwitch(args);
    });


    // config
    // ipc sqlite update data
    ipcMain.handle(IPC_SQLITE_UPDATE_OSS_DATA, (_event, ...args) => {
        console.log(`IPC_SQLITE_UPDATE_OSS_DATA  args : ${args}`);
        updateOss(...args);
    });

    // ipc sqlite select data
    ipcMain.handle(IPC_SQLITE_SELECT_OSS_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_OSS_DATA  args : ${args}`);
        return await getOss(args);
    });

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

    ipcMain.handle(IPC_SQLITE_INSERT_OSS_GROUP_DATA, async (_event, ...args) => {
        console.log(`IPC_SQLITE_INSERT_OSS_GROUP_DATA  args : ${args}`);
        return await insertGroupByOss(...args);
    });

    // ipc sqlite delete data
    ipcMain.handle(IPC_SQLITE_DELETE_GROUP_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_DELETE_GROUP_DATA  args : ${args}`);
        return await delGroup(args);
    });

    // ipc sqlite delete data
    ipcMain.handle(IPC_SQLITE_DELETE_ALL_GROUP_DATA, async (_event) => {
        console.log(`IPC_SQLITE_DELETE_ALL_GROUP_DATA `);
        return await delAllGroup();
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

    // ipc sqlite delete data
    ipcMain.handle(IPC_SQLITE_DELETE_ALL_PWD_INFO_BY_GROUP_ID, async (_event, args) => {
        console.log(`IPC_SQLITE_DELETE_ALL_PWD_INFO_BY_GROUP_ID  args : ${args}`);
        return await delPwdInfoByGroupId(args);
    });

    // ipc sqlite delete data
    ipcMain.handle(IPC_SQLITE_DELETE_ALL_PWD_INFO_DATA, async (_event) => {
        console.log(`IPC_SQLITE_DELETE_ALL_PWD_INFO_DATA`);
        return await delAllPwdInfo();
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

    ipcMain.handle(IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA_IDS, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA_IDS  args : ${args}`);
        return await listPwdInfoByIds(args);
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

    // file
    // ipc sqlite insert file
    ipcMain.handle(IPC_SQLITE_INSERT_FILE_DATA, async (_event, ...args) => {
        console.log(`IPC_SQLITE_INSERT_FILE_DATA  args : ${args}`);
        return await insertImage(...args);
    });

    // ipc sqlite insert file by import (OSS sync)
    ipcMain.handle(IPC_SQLITE_INSERT_FILE_BY_IMPORT_DATA, async (_event, ...args) => {
        console.log(`IPC_SQLITE_INSERT_FILE_BY_IMPORT_DATA  args : ${args}`);
        return await insertImageByImport(...args);
    });

    // ipc sqlite delete file
    ipcMain.handle(IPC_SQLITE_DELETE_FILE_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_DELETE_FILE_DATA  args : ${args}`);
        return await deleteImage(args);
    });

    // ipc sqlite delete files by pwd_id
    ipcMain.handle(IPC_SQLITE_DELETE_FILES_BY_PWD_ID, async (_event, args) => {
        console.log(`IPC_SQLITE_DELETE_FILES_BY_PWD_ID  args : ${args}`);
        return await deleteImagesByPwdId(args);
    });

    // ipc sqlite delete all files
    ipcMain.handle(IPC_SQLITE_DELETE_ALL_FILE_DATA, async (_event) => {
        console.log(`IPC_SQLITE_DELETE_ALL_FILE_DATA`);
        return await deleteAllImages();
    });

    // ipc sqlite select file meta list
    ipcMain.handle(IPC_SQLITE_SELECT_LIST_FILE_META, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_LIST_FILE_META  args : ${args}`);
        return await listImageMeta(args);
    });

    // ipc sqlite select file data
    ipcMain.handle(IPC_SQLITE_SELECT_GET_FILE_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_GET_FILE_DATA  args : ${args}`);
        return await getImageData(args);
    });

    // ipc sqlite select all files
    ipcMain.handle(IPC_SQLITE_SELECT_ALL_FILE_DATA, async (_event) => {
        console.log(`IPC_SQLITE_SELECT_ALL_FILE_DATA`);
        return await listAllImages();
    });

    // ipc sqlite select count files
    ipcMain.handle(IPC_SQLITE_SELECT_COUNT_FILE_DATA, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_COUNT_FILE_DATA  args : ${args}`);
        return await countImagesByPwdId(args);
    });

    // ipc sqlite select file path
    ipcMain.handle(IPC_SQLITE_SELECT_FILE_PATH, async (_event, args) => {
        console.log(`IPC_SQLITE_SELECT_FILE_PATH  args : ${args}`);
        return await getImageFilePath(args);
    });

    // ipc sqlite update file oss_uploaded
    ipcMain.handle(IPC_SQLITE_UPDATE_FILE_OSS_UPLOADED, async (_event, ...args) => {
        console.log(`IPC_SQLITE_UPDATE_FILE_OSS_UPLOADED  args : ${args}`);
        return await updateOssUploaded(...args);
    });

};
