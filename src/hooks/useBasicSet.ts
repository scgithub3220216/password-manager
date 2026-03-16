import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import useDBConfig from "./useDBConfig.ts";
import {
    autoLockTime,
    autoLockTimeUnit,
    autoStart,
    defaultDownloadPath,
    defaultDownloadPathSwitch,
    ossSyncAutoDownloadSwitch,
    ossSyncAutoUploadSwitch,
    ossSyncSwitch
} from "../../electron/db/sqlite/components/configConstants.ts";
import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {IPC_AUTO_START, IPC_GET_DESKTOP_PATH, IPC_SELECT_DIRECTORY} from "../../electron/constant.ts";

export default function () {
    const userInfoStore = useUserDataInfoStore();
    const {lockTime, timeUnit} = storeToRefs(userInfoStore)
    const {getConfigValue, setConfigValue} = useDBConfig()
    const autoStartValue = ref(false);
    const ossSwitchValue = ref(false);
    const ossAutoUploadSwitchValue = ref(true);
    const ossAutoDownloadSwitchValue = ref(true);
    const defaultDownloadPathSwitchValue = ref(false);
    const defaultDownloadPathValue = ref('');

    onMounted(async () => {
        console.log("BasicSet 挂载完毕");
        autoStartValue.value = await getConfigValue(autoStart) === '1';
        ossSwitchValue.value = await getConfigValue(ossSyncSwitch) === '1';
        ossAutoUploadSwitchValue.value = await getConfigValue(ossSyncAutoUploadSwitch) === '1';
        ossAutoDownloadSwitchValue.value = await getConfigValue(ossSyncAutoDownloadSwitch) === '1';
        userInfoStore.setLockTime(+await getConfigValue(autoLockTime), +await getConfigValue(autoLockTimeUnit))

        // 下载路径配置
        defaultDownloadPathSwitchValue.value = await getConfigValue(defaultDownloadPathSwitch) === '1';
        defaultDownloadPathValue.value = await getConfigValue(defaultDownloadPath) || '';
    });


    function ossAutoUploadSwitchValueChange(){
        setConfigValue(ossAutoUploadSwitchValue.value ? '1' : '0', ossSyncAutoUploadSwitch)
    }
    function ossAutoDownloadSwitchValueChange(){
        setConfigValue(ossAutoDownloadSwitchValue.value ? '1' : '0', ossSyncAutoDownloadSwitch)
    }

    const timeUnits = [
        {
            label: "秒",
            value: 1000,
        },
        {
            label: "分钟",
            value: 60000,
        },
        {
            label: "小时",
            value: 3600000,
        },
    ];

    const lockTimeChange = () => {
        console.log("lockTimeChange");
        setLockTime(lockTime.value, timeUnit.value);
    };


    function getLockTime() {
        // console.log('getLockTime:', lockTime.value, '----', timeUnit.value)
        return lockTime.value * timeUnit.value;
    }

    function setLockTime(lockTimeValue: number, lockTimeUnitValue: number) {
        console.log('setLockTime:', lockTimeValue, '----', lockTimeUnitValue)
        userInfoStore.setLockTime(lockTimeValue, lockTimeUnitValue)
        setConfigValue(String(lockTimeValue), autoLockTime)
        setConfigValue(String(lockTimeUnitValue), autoLockTimeUnit)
    }

    function autoStartChange() {
        console.log(`autoStartChange:${autoStartValue.value}`);
        // 调用方法 通知主进程
        window.ipcRenderer.invoke(IPC_AUTO_START, autoStartValue.value);
        // 修改 数据
        setConfigValue(autoStartValue.value ? '1' : '0', autoStart)
    }

    function ossSwitchChange() {
        console.log(`ossSwitchChange:${ossSwitchValue.value}`);
        // 修改 数据
        setConfigValue(ossSwitchValue.value ? '1' : '0', ossSyncSwitch)
    }

    async function defaultDownloadPathSwitchChange() {
        console.log(`defaultDownloadPathSwitchChange:${defaultDownloadPathSwitchValue.value}`);
        setConfigValue(defaultDownloadPathSwitchValue.value ? '1' : '0', defaultDownloadPathSwitch)
        // 首次开启且路径为空时，自动填入桌面路径
        if (defaultDownloadPathSwitchValue.value && !defaultDownloadPathValue.value) {
            const desktopPath = await window.ipcRenderer.invoke(IPC_GET_DESKTOP_PATH);
            if (desktopPath) {
                defaultDownloadPathValue.value = desktopPath;
                setConfigValue(desktopPath, defaultDownloadPath)
            }
        }
    }

    async function selectDownloadPath() {
        const selectedPath = await window.ipcRenderer.invoke(IPC_SELECT_DIRECTORY);
        if (selectedPath) {
            defaultDownloadPathValue.value = selectedPath;
            setConfigValue(selectedPath, defaultDownloadPath)
        }
    }

    function downloadPathChange() {
        console.log(`downloadPathChange:${defaultDownloadPathValue.value}`);
        setConfigValue(defaultDownloadPathValue.value, defaultDownloadPath)
    }

    return {
        getLockTime,
        setLockTime,
        autoStartChange,
        ossSwitchChange,
        ossSwitchValue,
        autoStartValue,
        lockTime,
        timeUnit,
        timeUnits,
        ossAutoUploadSwitchValue,
        ossAutoDownloadSwitchValue,
        ossAutoUploadSwitchValueChange,
        ossAutoDownloadSwitchValueChange,
        lockTimeChange,
        defaultDownloadPathSwitchValue,
        defaultDownloadPathValue,
        defaultDownloadPathSwitchChange,
        selectDownloadPath,
        downloadPathChange,
    };
}
