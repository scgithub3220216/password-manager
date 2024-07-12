import {IPC_SQLITE_SELECT_OSS_DATA, IPC_SQLITE_UPDATE_OSS_DATA} from "../../electron/constant.ts";

export default function () {

    async function getOss(type: string) {
        console.log(`getOss type:${type}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_OSS_DATA, type);
    }

    async function updateOss(oss: any) {
        console.log(`updateOss oss:${oss}`)
        if (!oss) return;
        return await window.ipcRenderer.invoke(IPC_SQLITE_UPDATE_OSS_DATA, oss.region, oss.keyId, oss.key_secret, oss.bucket, oss.type);
    }

    return {getOss, updateOss};
}