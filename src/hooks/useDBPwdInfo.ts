import {
    IPC_SQLITE_DELETE_PWD_INFO_DATA,
    IPC_SQLITE_INSERT_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_LIST_PWD_INFO_DATA,
    IPC_SQLITE_UPDATE_PWD_INFO_DATA
} from "../../electron/constant.ts";
import group from "../components/indexview/PwdInfo.vue";
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

    function updatePwdInfo(title: string, id: number) {
        console.log(`useDBPwdInfo.ts updatePwdInfo title:${group},id:${id}`)
        window.ipcRenderer.invoke(IPC_SQLITE_UPDATE_PWD_INFO_DATA, title, id);
    }

    async function listPwdInfo(groupId: number): Promise<PwdInfo[]> {
        console.log(`useDBPwdInfo.ts listPwdInfo groupId:${groupId}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_LIST_PWD_INFO_DATA, groupId);
    }


    return {insertPwdInfo, delPwdInfo, updatePwdInfo, listPwdInfo};
}