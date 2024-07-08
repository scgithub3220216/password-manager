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
            this.editAction()
        },
        setAutoStart(flag: boolean) {
            this.userInfo.autoStart = flag;
            this.editAction()
        },
        setLockTime(autoLockTime: number, autoLockTimeUnit: number) {
            console.log('userDataInfoStore setLockTime:', autoLockTime, '----', autoLockTimeUnit)
            this.userInfo.autoLock.autoLockTime = autoLockTime ? autoLockTime : 60;
            this.userInfo.autoLock.autoLockTimeUnit = autoLockTimeUnit ? autoLockTimeUnit : 1000;
            console.log('userDataInfoStore setLockTime:', this.userInfo.autoLock.autoLockTime, '----', this.userInfo.autoLock.autoLockTimeUnit)
            this.editAction()
        },

        setInitPwd(pass: string) {
            this.userInfo.pwd = pass
            this.userInfo.firstLoginFlag = 0
            this.editAction()
        },
        setPwd(oldPwd: string, newPwd: string) {
            console.log('setPwd')
            if (this.userInfo.pwd === oldPwd) {
                this.userInfo.pwd = newPwd
                this.editAction()
                console.log('setPwd success newPwd:', newPwd)
                return true;
            } else {
                return false;
            }
        },

        insertGroup(pwdGroup: PwdGroup) {
            this.pwdGroupList.push(pwdGroup);
            this.setCurGroup(pwdGroup);
            this.setCurPwdInfo(null);
            this.editAction();
        },
        deleteGroup(groupId: number) {
            this.pwdGroupList = this.pwdGroupList.filter(pwdGroup => pwdGroup.id !== groupId);
            this.editAction();
        },
        editGroupFlag(groupId: number, flag: boolean) {
            if (!groupId) {
                return;
            }
            this.pwdGroupList.forEach(pwdGroup => {
                if (pwdGroup.id === groupId) {
                    pwdGroup.editFlag = flag;
                }
            })
            this.editAction();
        },

        insertPwdInfo(pwdInfo: PwdInfo) {
            this.pwdGroupList.forEach(pwdGroup => {
                if (pwdGroup.id === pwdInfo.group_id) {
                    pwdGroup.pwdList.push(pwdInfo);
                }
            })
            this.setCurPwdInfo(pwdInfo)
            this.editAction()
        },
        updatePwdInfo(pwdInfo: PwdInfo) {
            if (!pwdInfo) {
                return;
            }
            // 修改 pwdGroupList 中的 pwdList
            this.pwdGroupList.forEach(pwdGroup => {
                if (pwdGroup.id === pwdInfo.group_id) {
                    pwdGroup.pwdList.forEach(pwd => {
                        if (pwd.id === pwdInfo.id) {
                            pwd.title = pwdInfo.title;
                            pwd.username = pwdInfo.username;
                            pwd.password = pwdInfo.password;
                            pwd.link = pwdInfo.link;
                            pwd.remark = pwdInfo.remark;
                        }
                    })
                }
            })
            this.editAction()
        },
        deletePwdInfo(pwdInfoId: number) {
            this.pwdGroupList.forEach(pwdGroup => {
                pwdGroup.pwdList = pwdGroup.pwdList.filter(pwd => pwd.id !== pwdInfoId);
            })
            this.editAction()
            this.setCurPwdList(this.getPwdInfoListByGroupId(this.curGroup.id))
        },


        login() {
            this.userInfo.curLoginStatus = 1;
        },
        logout() {
            this.userInfo.curLoginStatus = 0;
        },
        setCurGroup(group: PwdGroup | null) {
            console.log('setCurGroup:', group)
            if (!group) {
                this.curGroup.id = -1;
                return;
            }
            this.curGroup.id = group.id;
            this.curGroup.title = group.title;
            this.setCurPwdList(this.getPwdInfoListByGroupId(group.id))
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
        setCurPwdInfoPwd(pwd: string) {
            this.curPwdInfo.password = pwd;
            this.editAction()
        },
        generateGroupId() {
            this.editAction()
            return ++this.userInfo.pwdGroupId;
        },
        generatePwdInfoId() {
            this.editAction()
            return ++this.userInfo.pwdInfoId;
        },

        setShortCutKeyCombs(shortCutKeyCombs: ShortCutKeyComb[]) {
            this.shortCutKeyCombs = shortCutKeyCombs;
            this.editAction()
        },
        setShortCutKeyComb(index: number, desc: string) {
            this.shortCutKeyCombs[index].desc = desc;
            this.shortCutKeyCombs[index].keys = desc.split("+");
        },

        getGroupLength() {
            return this.pwdGroupList.length;
        },

        getPwdListLength() {
            return this.pwdGroupList.find(pwdGroup => pwdGroup.id === this.curGroup.id)?.pwdList.length || 0;
        },

        editAction() {
            this.userInfo.saveFlag = true;
        },
        saveOver() {
            this.userInfo.saveFlag = false;
        },
    },
    // 状态
    state(): {
        changePwdInfoFlag: boolean,
        userInfo: UserInfo,
        shortCutKeyCombs: ShortCutKeyComb[],
        pwdGroupList: PwdGroup[],
        curGroup: PwdGroup,
        curPwdList: PwdInfo[],
        curPwdInfo: PwdInfo
    } {
        return {
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

            pwdGroupList: [
                {
                    id: 1,
                    title: '默认分组',
                    editFlag: false,
                    // fatherId: 0,
                    // subList: [],
                    pwdList: [
                        {
                            id: 1,
                            group_id: 1,
                            title: '百度',
                            group_title: '默认分组',
                            username: 'admin',
                            password: '123456',
                            link: 'https://www.baidu.com',
                            remark: '这是百度的密码'
                        },
                        {
                            id: 2,
                            group_id: 1,
                            title: '谷歌',
                            group_title: '默认分组',
                            username: 'admin',
                            password: '123456',
                            link: 'https://www.google.com',
                            remark: '这是谷歌的密码'
                        }
                    ]
                }

            ],
            // @ts-ignore
            curGroup: {},
            curPwdList: [],
            // @ts-ignore
            curPwdInfo: {}
        }
    },
    // 计算
    getters: {
        // getPwdInfoListByGroupId(groupId: number):PwdGroup[]  => state.pwdGroupList.find((pwdGroup: PwdGroup) => pwdGroup.id === groupId)?.pwdList || [];
        getPwdInfoListByGroupId: (state) => {
            return (groupId: number) => state.pwdGroupList.find((pwdGroup: PwdGroup) => pwdGroup.id === groupId)?.pwdList || [];
        }

    }
})