import {onBeforeUnmount, onMounted, ref} from "vue";
import useCrypto from "./useCrypto.ts";
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import usePwd from "./usePwd.ts";
import useLoginAction from "./useLoginAction.ts";
import useShortcutFuntion from "./useShortcutFuntion.ts";
import {FileDataObj} from "../components/type.ts";

export default function () {

    const capsLockFlag = ref(false)
    const {decryptData} = useCrypto();
    const userInfoStore = useUserDataInfoStore();
    const {getShortCuts} = useShortcutFuntion();
    onMounted(() => {
        console.log('useCapsLock onMounted')
        window.addEventListener('keydown', handleCapsKeydown);
    })

    onBeforeUnmount(() => {
        console.log('useCapsLock onBeforeUnmount')
        window.removeEventListener('keydown', handleCapsKeydown);
    })

    async function sendMessageToMain() {
        console.log('sendMessageToMain')
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


    function handleCapsKeydown(event: any) {
        if (event.key !== 'CapsLock') {
            return;
        }
        capsLockFlag.value = !!event.getModifierState('CapsLock');
    }

    const pwd = ref('')

    const {pwdError} = usePwd()
    const {login} = useLoginAction()

    function loginSuccess() {
        console.log('login success')
        login();
    }

    function handleEnter() {
        userInfoStore.userInfo.pwd == pwd.value ? loginSuccess() : pwdError()
    }

    return {handleEnter, sendMessageToMain, pwd, capsLockFlag};
}