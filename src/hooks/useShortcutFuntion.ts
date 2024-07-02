// @ts-ignore


import {ShortCutKeyComb} from "../store/type.ts";
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import {storeToRefs} from "pinia";

export default function () {
    const userDataInfoStore = useUserDataInfoStore();
    const {curPwdInfo} = storeToRefs(userDataInfoStore);
    //设置秘钥和秘钥偏移量
    const functionMap: { [key: string]: () => void } = {
        'openMainWin': openMainWin,
        'lockWin': lockWin,
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

    function openMainWin() {
        console.log('openMainWin')
    }

    function lockWin() {
        console.log('lockWin')

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
    }

    function insertPwdInfo() {
        console.log('insertPwdInfo')

    }

    return {getShortCuts};
}