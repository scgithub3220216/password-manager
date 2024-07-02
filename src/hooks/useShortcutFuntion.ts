// @ts-ignore


import {ShortCutKeyComb} from "../store/type.ts";

export default function () {

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


    function openMainWin() {
        console.log('openMainWin')
    }

    function lockWin() {
        console.log('lockWin')

    }

    function copyUsername() {
        console.log('copyUsername')

    }

    function copyPwd() {
        console.log('copyPwd')

    }

    function copyLink() {
        console.log('copyLink')
    }

    function insertGroup() {
        console.log('insertGroup')

    }

    function insertPwdInfo() {
        console.log('insertPwdInfo')

    }

    return {getShortCuts};
}