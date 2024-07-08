// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {ShortCutKeyComb} from "../components/type.ts";

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
            shortCutKeyCombs: []
        }
    },
})