import {onBeforeUnmount, onMounted, ref} from "vue";
import usePwd from "./usePwd.ts";
import useLoginAction from "./useLoginAction.ts";
import useDBConfig from "./useDBConfig.ts";
import {pwd} from "../../electron/db/sqlite/components/configConstants.ts";
import useCrypto from "./useCrypto.ts";
import useDataSync from "./useDataSync.ts";


export default function () {
    const capsLockFlag = ref(false)
    const {sha512HexHash} = useCrypto()
    const {pwdError} = usePwd()
    const {login} = useLoginAction()
    const {getConfigValue} = useDBConfig()
    const {syncToLocal} = useDataSync()
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

    const password = ref('')

    function loginSuccess() {
        console.log('login success')
        login();
        syncToLocal();
    }

    async function handleEnter() {
        console.log('handlerEnter')
        let pwdValue = await getConfigValue(pwd);
        // console.log(`pwdValue:${pwdValue}; password.value:${password.value}`)
        pwdValue === sha512HexHash((password.value)) ? loginSuccess() : pwdError()
    }

    return {handleEnter, password, capsLockFlag};
}
