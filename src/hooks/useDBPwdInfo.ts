import {
    IPC_SQLITE_DELETE_PWD_INFO_DATA,
    IPC_SQLITE_INSERT_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_LIST_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA,
    IPC_SQLITE_UPDATE_PWD_INFO_DATA
} from "../../electron/constant.ts";
import {PwdInfo} from "../components/type.ts";

export default function () {

    async function insertPwdInfo(groupId: number, groupTitle: string): Promise<number> {
        console.log(`useDBPwdInfo.ts insertPwdInfo`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_INSERT_PWD_INFO_DATA, groupId, groupTitle);
    }

    async function delPwdInfo(id: number) {
        console.log(`useDBPwdInfo.ts delPwdInfo id:${id}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_PWD_INFO_DATA, id);
    }

    async function updatePwdInfo(pwdInfo: PwdInfo) {
        console.log(`useDBPwdInfo.ts updatePwdInfo  pwdInfo:${pwdInfo}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_UPDATE_PWD_INFO_DATA, pwdInfo.group_id, pwdInfo.group_title, pwdInfo.title, pwdInfo.username, pwdInfo.password, pwdInfo.link, pwdInfo.remark, pwdInfo.id);
    }

    async function listPwdInfo(groupId: number): Promise<PwdInfo[]> {
        console.log(`useDBPwdInfo.ts listPwdInfo groupId:${groupId}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_LIST_PWD_INFO_DATA, groupId);
    }

    async function listPwdInfoBySearch(searchValue: string): Promise<PwdInfo[]> {
        console.log(`useDBPwdInfo.ts listPwdInfoBySearch searchValue:${searchValue}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA, searchValue);
    }


    return {insertPwdInfo, delPwdInfo, updatePwdInfo, listPwdInfo,listPwdInfoBySearch};
}