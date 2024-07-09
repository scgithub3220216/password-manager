// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {
    defaultCopyLinkShortcutKey,
    defaultCopyPwdShortcutKey,
    defaultCopyUsernameShortcutKey,
    defaultInsertGroupShortcutKey,
    defaultInsertPwdInfoShortcutKey,
    defaultLogoutShortcutKey,
    defaultOpenMainWinShortcutKey,
    defaultPwd
} from "../config/config.ts";
import {PwdGroup, PwdInfo, ShortCutKeyComb, UserInfo} from "../components/type.ts";

// 存放用户的一些设置数据
export const useUserDataInfoStore = defineStore('userDataInfo', {
    // 动作
    actions: {
        setChangePwdInfoFlag(value: boolean) {
            this.changePwdInfoFlag = value;
        },

        setDarkSwitch(darkSwitch: boolean) {
            this.userInfo.darkSwitch = darkSwitch;
        },
        setAutoStart(flag: boolean) {
            this.userInfo.autoStart = flag;
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
        setCurPwdList(pwdList: PwdInfo[]) {
            console.log('setCurPwdList:', pwdList)
            if (!pwdList) {
                console.log('setCurPwdList pwdList 为空')
                this.curPwdList = [];
                this.setCurPwdInfo(null)
                return;
            }
            this.curPwdList = pwdList;
            this.setCurPwdInfo(pwdList[0])
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

        setShortCutKeyCombs(shortCutKeyCombs: ShortCutKeyComb[]) {
            this.shortCutKeyCombs = shortCutKeyCombs;
        },
        setShortCutKeyComb(index: number, desc: string) {
            this.shortCutKeyCombs[index].desc = desc;
            this.shortCutKeyCombs[index].keys = desc.split("+");
        },
        login() {
            this.userInfo.curLoginStatus = 1;
        },
        logout() {
            this.userInfo.curLoginStatus = 0;
        },
    },
    // 状态
    state(): {
        lockTime: number,
        timeUnit: number,
        changePwdInfoFlag: boolean,
        userInfo: UserInfo,
        shortCutKeyCombs: ShortCutKeyComb[],
        curGroup: PwdGroup,
        curPwdList: PwdInfo[],
        curPwdInfo: PwdInfo
    } {
        return {
            lockTime: 60,
            timeUnit: 1000,
            changePwdInfoFlag: false,
            userInfo: {
                darkSwitch: true,
                autoStart: true,
                pwd: defaultPwd,
                firstLoginFlag: 1,
                autoLock: {
                    autoLockTime: 60,
                    autoLockTimeUnit: 1000
                },
                curLoginStatus: 0,
                pwdInfoId: 3,
                pwdGroupId: 3,
                shortcutKey: {
                    openMainWindows: defaultOpenMainWinShortcutKey,
                    copyUsername: defaultCopyUsernameShortcutKey,
                    copyPwd: defaultCopyPwdShortcutKey,
                },
                saveFlag: false
            },

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
            curPwdList: [],
            // @ts-ignore
            curPwdInfo: {}
        }
    },
    // 计算
    getters: {}
})