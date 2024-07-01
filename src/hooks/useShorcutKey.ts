import {onBeforeUnmount, onMounted} from 'vue'
import {ShortCutKeyComb} from "../eneity/ShortCutKeyComb.ts";
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import {storeToRefs} from "pinia";

export default function () {
    const userDataInfoStore = useUserDataInfoStore();
    const pressedKeys = new Set()
    const dynamicCombinations: ShortCutKeyComb[] = []

    const {userInfo} = storeToRefs(userDataInfoStore);
    onMounted(() => {
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('keydown', handleKeyDown);
    })
    onBeforeUnmount(() => {
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('keydown', handleKeyDown);
    })

    function handleKeyDown(event: any) {
        pressedKeys.add(event.key);
        checkCombinations();
    }

    function handleKeyUp(event: any) {
        pressedKeys.delete(event.key);
    }

    function checkCombinations() {
        for (const combination of userInfo.shortCutKeyCombs) {
            const {keys, action, desc} = combination;
            if (keys.every(key => pressedKeys.has(key))) {
                console.log(`${desc} pressed`);
                // 执行对应操作
                action();
            }
        }
    }


    return {openBrowser};
}