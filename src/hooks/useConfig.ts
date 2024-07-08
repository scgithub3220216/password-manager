import {IPC_SQLITE_SELECT_CONFIG_DATA, IPC_SQLITE_UPDATE_CONFIG_DATA} from "../../electron/constant.ts";
import {Config} from "../components/type.ts";

export default function () {

    async function getConfigValue(code: string) {
        console.log(`getConfigValue code:${code}`)
        let config: Config = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_CONFIG_DATA, code);
        if (!config || !config?.value) {
            return '';
        }
        return config?.value;
    }

    function setConfigValue(code: string, value: string) {
        console.log(`setConfigValue code:${code} value:${value}`)
        window.ipcRenderer.invoke(IPC_SQLITE_UPDATE_CONFIG_DATA, code, value);
    }

    return {getConfigValue, setConfigValue};
}