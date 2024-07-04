import {defineStore} from 'pinia'
import {useUserDataInfoStore} from "./userDataInfo.ts";
import {PwdInfo} from "../components/type.ts";
import {reactive, ref} from "vue";

export const useSearchResultStore = defineStore('searchResult', () => {

    const userDataInfoStore = useUserDataInfoStore()
    let searchViewShowFlag = ref(false)

    const searchResultList = reactive<PwdInfo[]>([]);

    function openSearchView() {
        searchViewShowFlag.value = true;
    }

    function closeSearchView() {
        searchViewShowFlag.value = false;
    }

    function setSearchResultData(pwdInfoList: PwdInfo[]) {
        console.log('setSearchResultData')
        if (!pwdInfoList || pwdInfoList.length === 0) {
            console.log('setSearchResultData pwdInfoList 为空')
            searchResultList.splice(0, searchResultList.length)
            // @ts-ignore
            userDataInfoStore.setCurPwdInfo(null)
            return;
        }
        Object.assign(searchResultList, pwdInfoList)
        userDataInfoStore.setCurPwdInfo(pwdInfoList[0])
    }


    return {searchViewShowFlag, searchResultList, openSearchView, closeSearchView, setSearchResultData}
})