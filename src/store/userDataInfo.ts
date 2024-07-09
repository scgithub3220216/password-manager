// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {
    defaultCopyLinkShortcutKey,
    defaultCopyPwdShortcutKey,
    defaultCopyUsernameShortcutKey,
    defaultInsertGroupShortcutKey,
    defaultInsertPwdInfoShortcutKey,
    defaultLogoutShortcutKey,
    defaultOpenMainWinShortcutKey
} from "../config/config.ts";
import {PwdGroup, PwdInfo, ShortCutKeyComb} from "../components/type.ts";

// 存放用户的一些设置数据
export const useUserDataInfoStore = defineStore('userDataInfo', {
    // 动作
    actions: {
        setChangePwdInfoFlag(value: boolean) {
            this.changePwdInfoFlag = value;
        },

        setLockTime(autoLockTime: number, autoLockTimeUnit: number) {
            console.log('userDataInfoStore setLockTime:', autoLockTime, '----', autoLockTimeUnit)
            this.lockTime = autoLockTime ? autoLockTime : 60;
            this.timeUnit = autoLockTimeUnit ? autoLockTimeUnit : 1000;
        },

        setCurGroup(group: PwdGroup | null) {
            console.log('setCurGroup:', group)
            if (!group) {
                this.curGroup.id = -1;
                return;
            }
            this.curGroup.id = group.id;
            this.curGroup.title = group.title;
        },

        setCurPwdInfo(pwdInfo: PwdInfo | null) {
            console.log('setCurPwdInfo:', pwdInfo)
            if (!pwdInfo) {
                // @ts-ignore
                this.curPwdInfo = {};
                return;
            }
            Object.assign(this.curPwdInfo, pwdInfo)
        },
        setCurPwdInfoPwd(pwd: string) {
            this.curPwdInfo.password = pwd;
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
    state(): {
        darkSwitch:boolean,
        lockTime: number,
        timeUnit: number,
        changePwdInfoFlag: boolean,
        shortCutKeyCombs: ShortCutKeyComb[],
        curGroup: PwdGroup,
        curPwdInfo: PwdInfo
    } {
        return {
            darkSwitch:true,
            lockTime: 60,
            timeUnit: 1000,
            changePwdInfoFlag: false,
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

            ],

            // @ts-ignore
            curGroup: {},
            // @ts-ignore
            curPwdInfo: {}
        }
    },
    // 计算
    getters: {}
})