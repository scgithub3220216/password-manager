import useLoginAction from "./useLoginAction.ts";
import useBasicSet from "./useBasicSet.ts";
import {computed, onMounted, ref} from "vue";
import Login from "../components/Login.vue";
import Index from "../components/Index.vue";
import {useDark} from "@vueuse/core";
import {toggleDark} from "../styles/dark/dark.ts";
import {darkSwitch} from "../../electron/db/sqlite/components/configConstants.ts";
import useDBConfig from "./useDBConfig.ts";

export default function () {


    const {logout} = useLoginAction();
    const {getLockTime} = useBasicSet()
    const {getConfigValue} = useDBConfig()

    onMounted(() => {
        console.log(`App onMounted `)
        setDarkTheme()
    });

    async function setDarkTheme() {
        // 设置主题
        let darkSwitchValue = await getConfigValue(darkSwitch);
        // darkFlag 当前值  : false 白色  ; true 黑色
        let darkFlag = useDark();
        console.log('darkFlag:', darkFlag.value)
        if (darkSwitchValue && !darkFlag.value) {
            console.log('darkSwitch')
            toggleDark();
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

    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keydown', resetTimer);
    document.addEventListener('scroll', resetTimer);


    // 监听路由哈希
    const routes = {
        '/login': Login,
        '/index': Index,
    }

    const currentPath = ref(window.location.hash)
    window.addEventListener('hashchange', () => {
        currentPath.value = window.location.hash
    })

    const currentView = computed(() => {
        let slice = currentPath.value.slice(1);
        // @ts-ignore
        return routes[slice || '/'] || Login
    })

    return {currentView};
}