import {onBeforeUnmount, onMounted} from 'vue'
import {storeToRefs} from "pinia";
import useDBShortcutKey from "./useDBShortcutKey.ts";
import {ShortCutKeyComb} from "../components/type.ts";
import {useShortcutKeyStore} from "../store/shortcutKey.ts";
import useShortcutFunction from "./useShortcutFunction.ts";


export default function () {
    const pressedKeys = new Set()
    const {listShortcutKey} = useDBShortcutKey()
    const {getShortCuts} = useShortcutFunction()
    const shortcutKeyStore = useShortcutKeyStore();
    const {shortCutKeyCombs} = storeToRefs(shortcutKeyStore);
    onMounted(async () => {
        console.log('useShortcutKey onMounted')
        let shortcutKeyList: ShortCutKeyComb[] = await listShortcutKey();
        shortcutKeyStore.initData(shortcutKeyList);
        shortcutKeyStore.setShortCutKeyCombs(getShortCuts(shortcutKeyStore.shortCutKeyCombs))
        console.log(shortcutKeyStore.shortCutKeyCombs)
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