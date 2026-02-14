import {onBeforeUnmount, onMounted} from 'vue'
import emitter from "../utils/emitter.ts";
import {emitterGroupShortcutKeyTopic} from "../config/config.ts";

export default function () {
    const pressedKeys = new Set()
    onMounted(async () => {
        console.log('useGroupShortcutKey onMounted')
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('keydown', handleKeyDown);
    })
    onBeforeUnmount(() => {
        console.log('useGroupShortcutKey onBeforeUnmount')
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
        console.log('useGroupShortcutKey checkCombinations pressedKeys:', pressedKeys)
        // console.log('checkCombinations shortCutKeyCombs:', shortCutKeyCombs.value)

        // 检测 Ctrl + 数字键
        if (pressedKeys.has('ctrl')) {
            const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
            for (const num of numbers) {
                if (pressedKeys.has(num)) {
                    console.log(`按下了 Ctrl + ${num}`);
                    let index = parseInt(num) -1 ;
                    emitter.emit(emitterGroupShortcutKeyTopic, index)
                    pressedKeys.delete(num); // 只删除数字键，保留 ctrl
                    break;
                }
            }
        }

    }


    return {};
}