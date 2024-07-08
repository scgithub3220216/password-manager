import {
    IPC_SQLITE_DELETE_GROUP_DATA,
    IPC_SQLITE_INSERT_GROUP_DATA,
    IPC_SQLITE_SELECT_GROUP_DATA,
    IPC_SQLITE_UPDATE_GROUP_DATA
} from "../../electron/constant.ts";
import {PwdGroup} from "../components/type.ts";

export default function () {

    async function insertGroup(group: PwdGroup): Promise<number> {
        console.log(`useDBGroup.ts insertGroup group:${group}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_INSERT_GROUP_DATA, group.title, group.fatherId);
    }

    function delGroup(id: number) {
        console.log(`useDBGroup.ts delGroup id:${id}`)
        window.ipcRenderer.invoke(IPC_SQLITE_DELETE_GROUP_DATA, id);
    }

    function updateGroup(group: PwdGroup) {
        console.log(`useDBGroup.ts updateGroup group:${group}`)
        window.ipcRenderer.invoke(IPC_SQLITE_UPDATE_GROUP_DATA, group.title, group.id);
    }

    async function listGroup(): Promise<PwdGroup[]> {
        console.log(`useDBGroup.ts listGroup`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_GROUP_DATA);
    }


    return {insertGroup, delGroup, updateGroup, listGroup};
}