import {IPC_SQLITE_SELECT_SHORTCUT_KEY_DATA, IPC_SQLITE_UPDATE_SHORTCUT_KEY_DATA} from "../../electron/constant.ts";
import {ShortCutKeyComb} from "../components/type.ts";

export default function () {

    async function listShortcutKey(): Promise<ShortCutKeyComb[]> {
        console.log(`listShortcutKey `)
        return await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_SHORTCUT_KEY_DATA);
    }

    function updateShortCutKey(actionName: string, desc: string) {
        console.log(`setConfigValue actionName:${actionName} , desc:${desc}`)
        window.ipcRenderer.invoke(IPC_SQLITE_UPDATE_SHORTCUT_KEY_DATA, desc, actionName);
    }

    return {listShortcutKey, updateShortCutKey};
}