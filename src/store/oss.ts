import {defineStore} from 'pinia'
import {ref} from "vue";

export const useOssStore = defineStore('oss', () => {
    /**
     * 上传同步策略
     * 上传
     * 1. 修改操作就上传
     * 2. 定时上传
     *      判断 lastUpdateTime 和 lastUploadTime 相差是否超过 5s以内
     *          在: 跳过
     *          不在:上传
     *
     * 同步
     * 1. 手动同步 (比如 F5)
     * 2. 启动项目同步 App 内发起调用
     */
    const client = ref();

    const lastUpdateTime = ref();
    const lastUploadTime = ref();

    function setLastUploadTime() {
        lastUploadTime.value = new Date().getTime();
    }

    function getLastUploadTime() {
        return lastUploadTime.value;
    }

    function setLastUpdateTime() {
        lastUpdateTime.value = new Date().getTime();
    }

    function getLastUpdateTime() {
        return lastUpdateTime.value;
    }

    function setClient(value: any) {
        client.value = value;
    }

    function getClient() {
        return client.value;
    }


    return {setClient, getClient, setLastUpdateTime, getLastUpdateTime, setLastUploadTime, getLastUploadTime}
})