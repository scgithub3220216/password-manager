import {useUserDataInfoStore} from "../store/userDataInfo.ts";

export default function () {
    const userInfoStore = useUserDataInfoStore();

    function login() {
        window.location.hash = '/index'
        userInfoStore.login()
    }

    function logout() {
        window.location.hash = '/login'
        userInfoStore.logout()
    }

    return {login, logout};
}