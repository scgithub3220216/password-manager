import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import useDBConfig from "./useDBConfig.ts";
import {
    autoLockTime,
    autoLockTimeUnit,
    autoStart,
    ossSyncAutoDownloadSwitch,
    ossSyncAutoUploadSwitch,
    ossSyncSwitch
} from "../../electron/db/sqlite/components/configConstants.ts";
import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {IPC_AUTO_START} from "../../electron/constant.ts";
import useDataSync from "./useDataSync.ts";

export default function () {
    const userInfoStore = useUserDataInfoStore();
    const {lockTime, timeUnit} = storeToRefs(userInfoStore)
    const {getConfigValue, setConfigValue} = useDBConfig()
    const autoStartValue = ref(false);
    const ossSwitchValue = ref(false);
    const ossAutoUploadSwitchValue = ref(true);
    const ossAutoDownloadSwitchValue = ref(true);
    const {syncToOss} = useDataSync()

    onMounted(async () => {
        console.log("BasicSet 挂载完毕");
        autoStartValue.value = await getConfigValue(autoStart) === '1';
        ossSwitchValue.value = await getConfigValue(ossSyncSwitch) === '1';
        ossAutoUploadSwitchValue.value = await getConfigValue(ossSyncAutoUploadSwitch) === '1';
        ossAutoDownloadSwitchValue.value = await getConfigValue(ossSyncAutoDownloadSwitch) === '1';
        userInfoStore.setLockTime(+await getConfigValue(autoLockTime), +await getConfigValue(autoLockTimeUnit))
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
        // 如果为true , 就上传
        if (ossSwitchValue.value) {
            syncToOss();
        }
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
        lockTimeChange
    };
}