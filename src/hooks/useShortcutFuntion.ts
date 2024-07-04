// @ts-ignore


import {ShortCutKeyComb} from "../store/type.ts";
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import {storeToRefs} from "pinia";
import emitter from "../utils/emitter.ts";
import {emitterInsertGroupTopic, emitterInsertPwdInfoTopic, emitterLockTopic} from "../config/config.ts";

export default function () {
    const userDataInfoStore = useUserDataInfoStore();
    const {curPwdInfo} = storeToRefs(userDataInfoStore);
    //设置秘钥和秘钥偏移量
    const functionMap: { [key: string]: () => void } = {
        // 'openMainWin': openMainWin,
        'logout': logout,
        'copyUsername': copyUsername,
        'copyPwd': copyPwd,
        'copyLink': copyLink,
        'insertGroup': insertGroup,
        'insertPwdInfo': insertPwdInfo,
        // 其他函数...
    };

    function getShortCuts(shortCutKeyCombs: ShortCutKeyComb[]): ShortCutKeyComb[] {
        if (!shortCutKeyCombs) {
            return [];
        }
        shortCutKeyCombs.forEach(comb => {
            if (comb.actionName in functionMap) {
                comb.action = functionMap[comb.actionName];
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

    return {getShortCuts};
}