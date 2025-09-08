import {
    IPC_SQLITE_DELETE_ALL_PWD_INFO_DATA,
    IPC_SQLITE_DELETE_PWD_INFO_DATA,
    IPC_SQLITE_INSERT_BY_IMPORT_PWD_INFO_DATA,
    IPC_SQLITE_INSERT_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_COUNT_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_LIST_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA,
    IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA_IDS,
    IPC_SQLITE_UPDATE_PWD_INFO_DATA
} from "../../electron/constant.ts";
import {PwdInfo} from "../components/type.ts";
import useCrypto from "./useCrypto.ts";
import {usePwdListCacheStore} from "../store/pwdListCache.ts";

export default function () {
    const {encryptData, decryptList} = useCrypto()
    const {refreshCache} = usePwdListCacheStore()

    async function insertPwdInfo(groupId: number, groupTitle: string): Promise<number> {
        console.log(`useDBPwdInfo.ts insertPwdInfo`)
        const res = await window.ipcRenderer.invoke(IPC_SQLITE_INSERT_PWD_INFO_DATA, groupId, groupTitle);
        refreshCache()
        return res;
    }

    async function insertPwdInfoByImport(pwdInfo: PwdInfo): Promise<number> {
        console.log(`useDBPwdInfo.ts insertPwdInfoByImport`)
        const res = await window.ipcRenderer.invoke(IPC_SQLITE_INSERT_BY_IMPORT_PWD_INFO_DATA, pwdInfo.group_id, pwdInfo.group_title, pwdInfo.title, pwdInfo.username, encryptData(pwdInfo.password), pwdInfo.link, pwdInfo.remark);
        refreshCache()
        return res;
    }

    async function delPwdInfo(id: number) {
        console.log(`useDBPwdInfo.ts delPwdInfo id:${id}`)
        const res = await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_PWD_INFO_DATA, id);
        refreshCache()
        return res;
    }

    async function delAllPwdInfo() {
        console.log(`useDBPwdInfo.ts delAllPwdInfo }`)
        const res = await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_ALL_PWD_INFO_DATA);
        refreshCache()
        return res;
    }

    async function updatePwdInfo(pwdInfo: PwdInfo) {
        console.log(`useDBPwdInfo.ts updatePwdInfo  pwdInfo:${pwdInfo}`)
        let password = pwdInfo.password;
        if (password) password = encryptData(password);

        const res = await window.ipcRenderer.invoke(IPC_SQLITE_UPDATE_PWD_INFO_DATA, pwdInfo.group_id, pwdInfo.group_title, pwdInfo.title, pwdInfo.username, password, pwdInfo.link, pwdInfo.remark, pwdInfo.id);
        refreshCache()
        return res;
    }

    async function listPwdInfo(groupId: number): Promise<PwdInfo[]> {
        console.log(`useDBPwdInfo.ts listPwdInfo groupId:${groupId}`)
        let pwdInfoList: PwdInfo[] = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_LIST_PWD_INFO_DATA, groupId);
        if (!pwdInfoList) return pwdInfoList;
        return decryptList(pwdInfoList);
    }

    async function listPwdInfoBySearch(searchValue: string): Promise<PwdInfo[]> {
        console.log(`useDBPwdInfo.ts listPwdInfoBySearch searchValue:${searchValue}`)
        let pwdInfoList: PwdInfo[] = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA, searchValue);
        return decryptList(pwdInfoList);
    }

    async function listPwdInfoByIds(ids: number[]): Promise<PwdInfo[]> {
        console.log(`useDBPwdInfo.ts listPwdInfoByIds ids:${ids}`)
        let pwdInfoList: PwdInfo[] = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_SEARCH_PWD_INFO_DATA_IDS, ids);
        return decryptList(pwdInfoList);
    }

    async function countPwdInfo(groupId: number): Promise<number> {
        console.log(`useDBPwdInfo.ts countPwdInfo groupId:${groupId}`)
        let data = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_COUNT_PWD_INFO_DATA, groupId);
        return data?.count;
    }


    return {
        insertPwdInfo,
        insertPwdInfoByImport,
        delPwdInfo,
        delAllPwdInfo,
        updatePwdInfo,
        listPwdInfo,
        listPwdInfoBySearch,
        listPwdInfoByIds,
        countPwdInfo
    };
}