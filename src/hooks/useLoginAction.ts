export default function () {

    function login() {
        window.location.hash = '/index'
    }

    function logout() {
        window.location.hash = '/login'
    }

    return {login, logout};
}