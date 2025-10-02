import {computed, onMounted, ref} from "vue";
import Login from "../components/Login.vue";
import Index from "../components/Index.vue";

export default function () {


    onMounted(() => {
            console.log(`useCurrentPath.ts onMounted `)

        }
    )
    const checkCurrentPath = () => {
        let currentPath = window.location.hash;
        if (!currentPath) return
        const slice = currentPath.slice(1);
        if (slice === '/login') {
            console.log('当前在首登录页')
            // pwdInputRef.value.focus();
            return true
        }
        return false
    }


// 监听路由哈希
    const routes = {
        '/login': Login,
        '/index': Index,
    }

    const currentPath = ref(window.location.hash)
    window.addEventListener('hashchange', () => {
        currentPath.value = window.location.hash
    })

    const currentView = computed(() => {
        let slice = currentPath.value.slice(1);
        // @ts-ignore
        return routes[slice || '/'] || Login
    })

    return {currentView, checkCurrentPath};
}