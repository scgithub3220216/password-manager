import {defineStore} from 'pinia'
import {onMounted, ref} from "vue";
import useDBPwdInfo from "../hooks/useDBPwdInfo.ts";
import {PwdCache} from "../components/type.ts";

export const usePwdListCacheStore = defineStore('pwdListCache', () => {
    onMounted(() => {
        initCache()
    })

    const {listPwdInfo} = useDBPwdInfo();
    const cacheList = ref<PwdCache[]>([])


    function initCache() {
        // @ts-ignore
        listPwdInfo().then(sourceList => {
            // 只传递几个属性
            sourceList.forEach(item => {
                cacheList.value.push({
                    id: item.id,
                    title: item.title,
                    username: item.username,
                })
            })
        })

    }

    const refreshCache = () => {
        cacheList.value = []
        initCache()
    }


    return {cacheList, refreshCache}
})