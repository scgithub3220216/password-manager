import {onBeforeUnmount, onMounted} from 'vue'
import {IPC_CLOSE_WIN} from "../../electron/constant.ts";

export default function () {
    const pressedKeys = new Set()
    onMounted(async () => {
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
        console.log('checkCombinations pressedKeys:', pressedKeys)
        // console.log('checkCombinations shortCutKeyCombs:', shortCutKeyCombs.value)
        // 如果按下的是ecs ,则打印日志
        if (pressedKeys.has('escape')) {
            console.log(`pressed esc `)
            // 最小化
            console.log(`最小化窗口`)
            window.ipcRenderer.invoke(IPC_CLOSE_WIN);
        }

    }


    return {};
}