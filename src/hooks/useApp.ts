// @ts-ignore
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import useCrypto from "./useCrypto.ts";
import useLoginAction from "./useLoginAction.ts";
import useUserInfo from "./useUserInfo.ts";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {FileDataObj} from "../components/type.ts";
import {saveTime} from "../config/config.ts";
import Login from "../components/Login.vue";
import Index from "../components/Index.vue";
import {useDark} from "@vueuse/core";
import {toggleDark} from "../styles/dark/dark.ts";
import useShortcutFuntion from "./useShortcutFuntion.ts";
import emitter from "../utils/emitter.ts";

export default function () {


    const userInfoStore = useUserDataInfoStore();
    const {encryptData} = useCrypto();
    const {logout} = useLoginAction();
    const {getLockTime} = useUserInfo()
    const {decryptData} = useCrypto();
    const {getShortCuts} = useShortcutFuntion();

    onMounted(() => {
        console.log(`App onMounted `)
        initDataToMain()
            .then(() => {
                setDarkTheme()
            })
            .then(()=>{
                // 发送 初始化完成 事件
                emitter.emit('initSuccess')
            })


        const intervalId = setInterval(() => saveData(), saveTime);
        // 可以考虑将 intervalId 返回以便在 onUnmounted 中清除定时器
        return () => clearInterval(intervalId);
    });

    onBeforeUnmount(() => {
        console.log(`App onBeforeUnmount`)
        saveData()
    })

    function setDarkTheme() {
        // 设置主题
        console.log('darkSwitch:', userInfoStore.userInfo.darkSwitch)
        // darkFlag 当前值  : false 白色  ; true 黑色
        let darkFlag = useDark();
        console.log('darkFlag:', darkFlag.value)
        if (userInfoStore.userInfo.darkSwitch && !darkFlag.value) {
            console.log('darkSwitch')
            toggleDark();
        }
    }

    async function initDataToMain() {
        console.log('initDataToMain')
        const userDataJson = await window.ipcRenderer.invoke('init-data');
        if (!userDataJson) {
            userInfoStore.setShortCutKeyCombs(getShortCuts(userInfoStore.shortCutKeyCombs))
            return;
        }
        // 解密
        let decryptData1 = decryptData(userDataJson);
        // console.log('decryptData1:', decryptData1)
        const fileDataObj: FileDataObj = JSON.parse(decryptData1);
        // 把数据放到 pinia 中
        userInfoStore.setUserInfo(fileDataObj);
        // 设置快捷键
        userInfoStore.setShortCutKeyCombs(getShortCuts(userInfoStore.shortCutKeyCombs))
        console.log('文件数据读取完成')
    }


    function saveData() {
        if (!userInfoStore.userInfo.saveFlag) {
            return;
        }
        userInfoStore.saveOver();
        console.log('saveData 改动')
        try {
            let fileDataObj = new FileDataObj(userInfoStore.userInfo, userInfoStore.pwdGroupList, userInfoStore.shortCutKeyCombs);
            // save-data
            const fileDataObjJson = JSON.stringify(fileDataObj);
            let encryptData1 = encryptData(fileDataObjJson);
            window.ipcRenderer.invoke('save-data', encryptData1);
        } catch (e) {
            console.error('saveData error:', e)
            userInfoStore.editAction();
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