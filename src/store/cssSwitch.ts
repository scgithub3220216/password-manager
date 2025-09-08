import {defineStore} from 'pinia'
import {ref} from "vue";

export const useCssSwitchStore = defineStore('cssSwitch', () => {
    const curGroupIndex = ref(-1)
    const curPwdListIndex = ref(-1)

    function setGroupIndex(index: number) {
        curGroupIndex.value = index;
    }

    function setPwdListIndex(index: number) {
        curPwdListIndex.value = index;
    }

    return {curGroupIndex, curPwdListIndex, setGroupIndex, setPwdListIndex}
})