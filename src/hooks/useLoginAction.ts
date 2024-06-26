import {userDataInfoStore} from "../store/userDataInfo.ts";

export default function () {
    const userInfoStore = userDataInfoStore();

    function login() {
        userInfoStore.login();
        window.location.hash = '/index'
    }

    function logout() {
        userInfoStore.logout();
        window.location.hash = '/login'
    }

    return {login, logout};
}