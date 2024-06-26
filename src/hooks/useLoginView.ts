import {onBeforeUnmount, onMounted, ref} from "vue";
import {FileDataObj} from "../store/type.ts";
import useCrypto from "./useCrypto.ts";
import {userDataInfoStore} from "../store/userDataInfo.ts";
import usePwd from "./usePwd.ts";
import useLoginAction from "./useLoginAction.ts";

export default function () {

    const capsLockFlag = ref(false)
    const {decryptData} = useCrypto();
    const userInfoStore = userDataInfoStore();

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
            return;
        }
        // 解密
        let decryptData1 = decryptData(userDataJson);
        // console.log('decryptData1:', decryptData1)
        const fileDataObj: FileDataObj = JSON.parse(decryptData1);
        // 把数据放到 pinia 中
        userInfoStore.setUserInfo(fileDataObj);
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

    return {handleEnter,sendMessageToMain, pwd,capsLockFlag};
}