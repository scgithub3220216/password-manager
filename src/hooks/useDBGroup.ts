import {
    IPC_SQLITE_DELETE_ALL_GROUP_DATA,
    IPC_SQLITE_DELETE_GROUP_DATA,
    IPC_SQLITE_GET_ID_GROUP_DATA,
    IPC_SQLITE_INSERT_GROUP_DATA,
    IPC_SQLITE_INSERT_OSS_GROUP_DATA,
    IPC_SQLITE_SELECT_GROUP_DATA,
    IPC_SQLITE_UPDATE_GROUP_DATA
} from "../../electron/constant.ts";
import {PwdGroup} from "../components/type.ts";
import group from "../components/indexview/Group.vue";

export default function () {

    async function insertGroup(title: string, fatherId: number): Promise<number> {
        console.log(`useDBGroup.ts insertGroup title:${title},fatherId:${fatherId}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_INSERT_GROUP_DATA, title, fatherId);
    }

    async function insertOssGroup(id: number, title: string, fatherId: number): Promise<number> {
        console.log(`useDBGroup.ts insertGroup id:${id},.title:${title},fatherId:${fatherId}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_INSERT_OSS_GROUP_DATA, id, title, fatherId);
    }

    async function delGroup(id: number) {
        console.log(`useDBGroup.ts delGroup id:${id}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_GROUP_DATA, id);
    }

    async function delAllGroup() {
        console.log(`useDBGroup.ts delAllGroup`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_ALL_GROUP_DATA);
    }

    async function updateGroup(title: string, id: number) {
        console.log(`useDBGroup.ts updateGroup title:${group},id:${id}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_UPDATE_GROUP_DATA, title, id);
    }

    async function listGroup(): Promise<PwdGroup[]> {
        console.log(`useDBGroup.ts listGroup`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_GROUP_DATA);
    }

    async function getIdByTitle(title: string): Promise<number> {
        console.log(`useDBGroup.ts getIdByTitle`)
        let group = await window.ipcRenderer.invoke(IPC_SQLITE_GET_ID_GROUP_DATA, title);
        return group?.id;
    }


    return {insertGroup, insertOssGroup, delGroup, delAllGroup, updateGroup, listGroup, getIdByTitle};
}