import useLoginAction from "./useLoginAction.ts";
import useBasicSet from "./useBasicSet.ts";
import {onMounted} from "vue";
import {useDark} from "@vueuse/core";
import {darkSwitch} from "../../electron/db/sqlite/components/configConstants.ts";
import useDBConfig from "./useDBConfig.ts";
import {toggleDark} from "../styles/dark/dark.ts";
import useDataSync from "./useDataSync.ts";

export default function () {


    const {logout} = useLoginAction();
    const {getLockTime} = useBasicSet()
    const {getConfigValue} = useDBConfig()
    const {syncToLocal} = useDataSync()

    onMounted(() => {
            console.log(`App onMounted `)
            setDarkTheme()
            setAutoLogout()
            syncToLocal()
        }
    )


    async function setDarkTheme() {
        // 设置主题
        let darkSwitchValue = parseInt(await getConfigValue(darkSwitch));
        console.log('darkSwitchValue:', darkSwitchValue)

        // darkFlag 当前值  : false 白色  ; true 黑色
        const isDark = useDark()
        console.log('isDark:', isDark.value)

        if (darkSwitchValue && isDark.value) {
            console.log('开关 黑色 => 保持')
            return;
        }
        if (darkSwitchValue && !isDark.value) {
            console.log('开关 => 黑色')
            toggleDark()
            return;
        }
        if (!darkSwitchValue && isDark.value) {
            // 如果 isDark == true , 再使用 toggleDark() 就会切换主题 或者说就是取反
            console.log('开关 => 白色')
            toggleDark()
            return;
        }

    }

// 规定时间中不操作, 默认退出 (自动回登录页面)
    let timeoutId: NodeJS.Timeout;

    function resetTimer() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            logout();
        }, getLockTime());
    }

    function setAutoLogout() {
        document.addEventListener('mousemove', resetTimer);
        document.addEventListener('keydown', resetTimer);
        document.addEventListener('scroll', resetTimer);
    }

    return {};
}