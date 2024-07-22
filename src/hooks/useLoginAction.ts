import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import {useSearchResultStore} from "../store/searchResult.ts";

export default function () {
    const userInfoStore = useUserDataInfoStore();
    const searchResultStore = useSearchResultStore();
    function login() {
        window.location.hash = '/index'
        userInfoStore.login()
    }

    function logout() {
        window.location.hash = '/login'
        userInfoStore.logout()
        searchResultStore.closeSearchView()
    }

    return {login, logout};
}