import {AUTO_CHECK_UPDATE_SWITCH_SELECT, AUTO_UPDATE_SWITCH_UPDATE, CHECK_UPDATE} from "../../electron/constant.ts";
import {UpdateVersion} from "../components/type.ts";
import {ElMessage} from "element-plus";

export default function () {

    async function checkUpdate() {
        console.log('checkUpdate')
        const result = await window.ipcRenderer.invoke(CHECK_UPDATE);
        console.log(`result:${JSON.stringify(result)}`)
        if(!result?.isUpdateAvailable){
            ElMessage.success("当前已经是最新版本")
        }
    }

    async function getAutoCheckUpdateSwitch() {
        console.log('getAutoUpdateSwitch')
        const valueObj = await window.ipcRenderer.invoke(AUTO_CHECK_UPDATE_SWITCH_SELECT) as UpdateVersion;
        return valueObj?.auto_check_switch === "1";
    }

    function setUpdateSwitch(flag: boolean) {
        console.log(`setUpdateSwitch:${flag}`)
        let value = flag ? '1' : '0';
        window.ipcRenderer.invoke(AUTO_UPDATE_SWITCH_UPDATE, value);
    }

    return {checkUpdate, getAutoCheckUpdateSwitch, setUpdateSwitch};
}