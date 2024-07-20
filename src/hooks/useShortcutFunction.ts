// @ts-ignore


import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import {storeToRefs} from "pinia";
import emitter from "../utils/emitter.ts";
import {emitterInsertGroupTopic, emitterInsertPwdInfoTopic, emitterLockTopic} from "../config/config.ts";
import {ShortCutKeyComb} from "../components/type.ts";
import useDataSync from "./useDataSync.ts";
import {ElMessage} from "element-plus";

export default function () {
    const userDataInfoStore = useUserDataInfoStore();
    const {curPwdInfo} = storeToRefs(userDataInfoStore);
    const {syncToLocal, syncToOss, getSyncSwitch} = useDataSync()
    //设置秘钥和秘钥偏移量
    const functionMap: { [key: string]: () => void } = {
        // 'openMainWin': openMainWin,
        'logout': logout,
        'copyUsername': copyUsername,
        'copyPwd': copyPwd,
        'copyLink': copyLink,
        'insertGroup': insertGroup,
        'insertPwdInfo': insertPwdInfo,
        'syncLocalToOss': syncLocalToOss,
        'syncOssToLocal': syncOssToLocal,
        // 其他函数...
    };

    function getShortCuts(shortCutKeyCombs: ShortCutKeyComb[]): ShortCutKeyComb[] {
        if (!shortCutKeyCombs) {
            return [];
        }
        shortCutKeyCombs.forEach(comb => {
            if (comb.action_name in functionMap) {
                comb.action = functionMap[comb.action_name];
            }
        });
        return shortCutKeyCombs;
    }

    function copyValue(value: string) {
        console.log("copyValue");
        navigator.clipboard.writeText(value).then(
            () => {
                console.log("复制成功");
            },
            () => {
                console.log("复制失败");
            }
        );
    }

    function logout() {
        console.log('logout')
        emitter.emit(emitterLockTopic, '')
    }

    function copyUsername() {
        console.log('copyUsername')
        copyValue(curPwdInfo.value?.username || '')
    }

    function copyPwd() {
        console.log('copyPwd')
        copyValue(curPwdInfo.value?.password || '')
    }

    function copyLink() {
        console.log('copyLink')
        copyValue(curPwdInfo.value?.link || '')
    }

    function insertGroup() {
        console.log('insertGroup')
        emitter.emit(emitterInsertGroupTopic, '')
    }

    function insertPwdInfo() {
        console.log('insertPwdInfo')
        emitter.emit(emitterInsertPwdInfoTopic, '')
    }

    async function syncLocalToOss() {
        console.log('syncLocalToOss')
        if (await getSyncSwitch()) {
            ElMessage.error('同步开关已关闭,请打开同步开关后重试');
            return;
        }
        syncToOss()
    }

    async function syncOssToLocal() {
        console.log('syncOssToLocal')
        if (await getSyncSwitch()) {
            ElMessage.error('同步开关已关闭,请打开同步开关后重试');
            return;
        }
        syncToLocal()
    }

    return {getShortCuts};
}