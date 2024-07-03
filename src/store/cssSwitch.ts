import {defineStore} from 'pinia'
import {ref} from "vue";
import {useUserDataInfoStore} from "./userDataInfo.ts";

export const useCssSwitchStore = defineStore('cssSwitch', () => {
    const curGroupIndex = ref(-1)
    const curPwdListIndex = ref(-1)

    const userDataInfoStore = useUserDataInfoStore()

    function setGroupIndex(index: number) {
        curGroupIndex.value = index;
    }

    function setPwdListIndex(index: number) {
        curPwdListIndex.value = index;
    }

    function addGroupSwitch() {
        curGroupIndex.value = userDataInfoStore.getGroupLength() - 1;
    }

    function addPwdListSwitch() {
        curPwdListIndex.value = userDataInfoStore.getPwdListLength() - 1;
    }


    return {curGroupIndex, curPwdListIndex, setGroupIndex, setPwdListIndex, addGroupSwitch, addPwdListSwitch}
})