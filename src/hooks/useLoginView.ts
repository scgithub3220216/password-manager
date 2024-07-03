import {onBeforeUnmount, onMounted, ref} from "vue";
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import usePwd from "./usePwd.ts";
import useLoginAction from "./useLoginAction.ts";

export default function () {

    const capsLockFlag = ref(false)
    const userInfoStore = useUserDataInfoStore();
    onMounted(() => {
        console.log('useCapsLock onMounted')
        window.addEventListener('keydown', handleCapsKeydown);
    })

    onBeforeUnmount(() => {
        console.log('useCapsLock onBeforeUnmount')
        window.removeEventListener('keydown', handleCapsKeydown);
    })


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

    return {handleEnter, pwd, capsLockFlag};
}