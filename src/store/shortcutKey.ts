// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {ShortCutKeyComb} from "../components/type.ts";
import {
    defaultCopyLinkShortcutKey,
    defaultCopyPwdShortcutKey,
    defaultCopyUsernameShortcutKey,
    defaultInsertGroupShortcutKey,
    defaultInsertPwdInfoShortcutKey,
    defaultLogoutShortcutKey,
    defaultOpenMainWinShortcutKey
} from "../config/config.ts";

export const useShortcutKeyStore = defineStore('shortcutKey', {
    // 动作
    actions: {
        initData(shortcutKeyList: ShortCutKeyComb[]) {
            if (!shortcutKeyList) return;
            this.shortCutKeyCombs = [];
            shortcutKeyList.forEach((shortcutKey) => {
                let keys: string[] = [];
                if (shortcutKey.desc) {
                    keys = shortcutKey.desc.split("+");
                }
                this.shortCutKeyCombs.push({keys: keys, action_name: shortcutKey.action_name, desc: shortcutKey.desc})
            })
        },
        setShortCutKeyCombs(shortCutKeyCombs: ShortCutKeyComb[]) {
            this.shortCutKeyCombs = shortCutKeyCombs;
        },
        setShortCutKeyComb(index: number, desc: string) {
            this.shortCutKeyCombs[index].desc = desc;
            this.shortCutKeyCombs[index].keys = desc.split("+");
        },

    },
    // 状态
    state(): { shortCutKeyCombs: ShortCutKeyComb[] } {
        return {
            shortCutKeyCombs: [
                {
                    keys: ['Ctrl', 'Alt', "E"],
                    action_name: 'openMainWindows',
                    desc: defaultOpenMainWinShortcutKey
                },
                {
                    keys: ["Escape"],
                    action_name: 'logout',
                    desc: defaultLogoutShortcutKey
                },
                // 2
                {
                    keys: ['Ctrl', 'U'],
                    action_name: 'copyUsername',
                    desc: defaultCopyUsernameShortcutKey
                },
                // 3
                {
                    keys: ['Ctrl', 'P'],
                    action_name: 'copyPwd',
                    desc: defaultCopyPwdShortcutKey
                },
                // 4
                {
                    keys: ['Ctrl', 'L'],
                    action_name: 'copyLink',
                    desc: defaultCopyLinkShortcutKey
                },
                // 5
                {
                    keys: ['Ctrl', 'G'],
                    action_name: 'insertGroup',
                    desc: defaultInsertGroupShortcutKey
                },
                // 6
                {
                    keys: ['Ctrl', 'N'],
                    action_name: 'insertPwdInfo',
                    desc: defaultInsertPwdInfoShortcutKey
                },

            ]
        }
    },
})