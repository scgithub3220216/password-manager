// @ts-ignore

import {ShortCutKeyComb} from "../eneity/ShortCutKeyComb.ts";

export default function () {

    //设置秘钥和秘钥偏移量
    const functionMap: { [key: string]: () => void } = {
        'openMainWin': openMainWin,
        'lockWin': lockWin,
        'copyUsername': copyUsername,
        'copyPwd': copyPwd,
        'insertGroup': insertGroup,
        'insertPwdInfo': insertPwdInfo,
        // 其他函数...
    };

    function rehydrateActions(shortCutKeyCombs: ShortCutKeyComb[]):ShortCutKeyComb[] {
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

    }

    function lockWin() {

    }

    function copyUsername() {

    }

    function copyPwd() {

    }

    function insertGroup() {

    }

    function insertPwdInfo() {

    }

    return {functionMap};
}