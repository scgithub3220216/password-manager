import {defineStore} from 'pinia'
import {ref} from "vue";

export const useOssStore = defineStore('oss', () => {
    /**
     * 上传同步策略
     * 第一种方案:
     *      上传
     *      1. 修改操作就上传
     *      2. 定时上传
     *           判断 lastUpdateTime 和 lastUploadTime 相差是否超过 5s以内
     *               在: 跳过
     *               不在:上传
     *
     *      同步
     *      1. 手动同步 (比如 F5)
     *      2. 启动项目同步 App 内发起调用
     *       本地的 修改时间与 oss 的修改时间进行比较, 如果不一致, 则拉取数据
     *       拉取到本地后 先全部删除 ,然后再新增
     *
     *
     *  第二种方案:
     *      上传
     *         1. 上传完毕后 再上传一个版本号 ossVersion, 本地数据库也保存一个
     *      同步:
     *          同步的时候本地和服务器的版本号去比对, 如果不一致, 则拉取数据
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