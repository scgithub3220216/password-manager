import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import useDBConfig from "./useDBConfig.ts";
import {autoLockTime, autoLockTimeUnit, autoStart} from "../../electron/db/sqlite/components/configConstants.ts";
import {onMounted, ref} from "vue";

export default function () {
    const userInfoStore = useUserDataInfoStore();
    const {getConfigValue, setConfigValue} = useDBConfig()
    const autoStartValue = ref(false);
    const lockTime = ref();
    const timeUnit = ref();

    onMounted(async () => {
        console.log("BasicSet 挂载完毕");
        autoStartValue.value = await getConfigValue(autoStart) === '1';
        lockTime.value = +await getConfigValue(autoLockTime)
        timeUnit.value = +await getConfigValue(autoLockTimeUnit)
    });

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
        let autoLock = userInfoStore.userInfo.autoLock;
        if (!autoLock) {
            return 60 * 1000;
        }
        return autoLock.autoLockTime * autoLock.autoLockTimeUnit;
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
        window.ipcRenderer.invoke("auto-start", autoStartValue.value);
        // 修改 数据
        setConfigValue(autoStartValue.value ? '1' : '0', autoStart)
    }

    return {getLockTime, setLockTime, autoStartChange, autoStartValue, lockTime, timeUnit, timeUnits, lockTimeChange};
}