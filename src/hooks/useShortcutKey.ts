import {onBeforeUnmount, onMounted} from 'vue'
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import {storeToRefs} from "pinia";


export default function () {
    const userDataInfoStore = useUserDataInfoStore();
    const pressedKeys = new Set()

    const {shortCutKeyCombs} = storeToRefs(userDataInfoStore);
    onMounted(() => {
        console.log('useShortcutKey onMounted')
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('keydown', handleKeyDown);
    })
    onBeforeUnmount(() => {
        console.log('useShortcutKey onBeforeUnmount')
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('keydown', handleKeyDown);
    })

    function handleKeyDown(event: any) {
        // console.log('handleKeyDown:', event.key)
        let value = convertCtrlKey(event);
        pressedKeys.add(value?.trim())
        checkCombinations();
    }

    function convertCtrlKey(event: any) {
        let toLowerCase = event.key?.toLowerCase();
        return toLowerCase === 'control' ? 'ctrl' : toLowerCase;
    }

    function handleKeyUp(event: any) {
        // console.log('handleKeyUp:', event.key)

        pressedKeys.delete(convertCtrlKey(event)?.trim());
    }

    function checkCombinations() {
        // console.log('checkCombinations pressedKeys:', pressedKeys)
        // console.log('checkCombinations shortCutKeyCombs:', shortCutKeyCombs.value)
        for (const combination of shortCutKeyCombs.value) {
            const {keys, action, desc} = combination;

            if (keys.every(key => pressedKeys.has(key?.trim().toLowerCase()))) {
                console.log(`pressed desc: ${desc} ,keys: ${keys}, pressedKeys: ${pressedKeys}`)
                // 执行对应操作
                action?.();
            }
        }
    }


    return {};
}