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
        clearSearchResultData()
        userDataInfoStore.setCurPwdInfo(null)
    }

    function setSearchResultData(pwdInfoList: PwdInfo[]) {
        console.log('setSearchResultData')
        clearSearchResultData()
        if (!pwdInfoList || pwdInfoList.length === 0) {
            console.log('setSearchResultData pwdInfoList 为空')
            return;
        }
        Object.assign(searchResultList, pwdInfoList)
        userDataInfoStore.setCurPwdInfo(pwdInfoList[0])
    }

    function clearSearchResultData() {
        searchResultList.splice(0, searchResultList.length)
        userDataInfoStore.setCurPwdInfo(null)
    }

    function updateRowTitle(id: number, newTitle: string) {
        if (!id || !newTitle) return;
        const pwdList = searchResultList.findIndex(u => u.id === id)
        if (pwdList !== -1) {
            searchResultList[pwdList].title = newTitle
        }
    }


    return {searchViewShowFlag, searchResultList, updateRowTitle, openSearchView, closeSearchView, setSearchResultData}
})