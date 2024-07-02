// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {
    defaultCopyLinkShortcutKey,
    defaultCopyPwdShortcutKey,
    defaultCopyUsernameShortcutKey,
    defaultInsertGroupShortcutKey,
    defaultInsertPwdInfoShortcutKey,
    defaultLockWinShortcutKey,
    defaultOpenMainWinShortcutKey,
    defaultPwd
} from "../config/config.ts";
import {FileDataObj, PwdGroup, PwdInfo, ShortCutKeyComb, UserInfo} from "../components/type.ts";

// 存放用户的一些设置数据
export const useUserDataInfoStore = defineStore('userDataInfo', {
    // 动作
    actions: {

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
            // @ts-ignore
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
                if (pwdGroup.id === pwdInfo.groupId) {
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
                if (pwdGroup.id === pwdInfo.groupId) {
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
        },


        login() {
            this.userInfo.curLoginStatus = 1;
        },
        logout() {
            this.userInfo.curLoginStatus = 0;
        },
        setCurGroup(group: PwdGroup) {
            console.log('setCurGroup:', group)
            if (!group) {
                // this.curGroup  设置为空,
                this.curGroup.id = -1;
                return;
            }
            this.curGroup.id = group.id;
            this.curGroup.title = group.title;
        },
        setCurPwdInfoPwd(pwd: string) {
            if (!pwd) {
                return;
            }
            this.curPwdInfo.password = pwd;
            this.editAction()
        },
        setCurPwdInfo(pwdInfo: PwdInfo) {
            console.log('setCurPwdInfo:', pwdInfo)
            if (!pwdInfo) {
                this.curPwdInfo.id = -1;
                return;
            }
            Object.assign(this.curPwdInfo, pwdInfo)
        },
        generateGroupId() {
            this.editAction()
            return ++this.userInfo.pwdGroupId;
        },
        generatePwdInfoId() {
            this.editAction()
            return ++this.userInfo.pwdInfoId;
        },

        setUserInfo(fileDataObj: FileDataObj) {
            this.userInfo = fileDataObj.userInfo;
            this.pwdGroupList = fileDataObj.pwdGroupList;
            this.shortCutKeyCombs = fileDataObj.shortCutKeyCombs;
        },
        setShortCutKeyCombs(shortCutKeyCombs: ShortCutKeyComb[]) {
            this.shortCutKeyCombs = shortCutKeyCombs;
            this.editAction()
        },
        setShortCutKeyComb(index: number, desc: string) {
            this.shortCutKeyCombs[index].desc = desc;
            this.shortCutKeyCombs[index].keys = desc.split("+");
        },

        editAction() {
            this.userInfo.saveFlag = true;
        },
        saveOver() {
            this.userInfo.saveFlag = false;
        },
    },
    // 状态
    state(): { userInfo: UserInfo, shortCutKeyCombs: ShortCutKeyComb[], pwdGroupList: PwdGroup[], curGroup: PwdGroup, curPwdInfo: PwdInfo } {
        return {
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
                    keys: ['Control', 'Alt', "E"],
                    actionName: 'openMainWindows',
                    desc: defaultOpenMainWinShortcutKey
                },
                {
                    keys: ['Alt', "G"],
                    actionName: 'lockWin',
                    desc: defaultLockWinShortcutKey
                },
                {
                    keys: ['Control', 'U'],
                    actionName: 'copyUsername',
                    desc: defaultCopyUsernameShortcutKey
                },
                // 3
                {
                    keys: ['Control', 'P'],
                    actionName: 'copyPwd',
                    desc: defaultCopyPwdShortcutKey
                },
                // 4
                {
                    keys: ['Control', 'L'],
                    actionName: 'copyLink',
                    desc: defaultCopyLinkShortcutKey
                },
                // 5
                {
                    keys: ['Control', 'G'],
                    actionName: 'insertGroup',
                    desc: defaultInsertGroupShortcutKey
                },
                // 6
                {
                    keys: ['Control', 'B'],
                    actionName: 'insertPwdInfo',
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
                            groupId: 1,
                            title: '百度',
                            groupTitle: '默认分组',
                            username: 'admin',
                            password: '123456',
                            link: 'https://www.baidu.com',
                            remark: '这是百度的密码'
                        },
                        {
                            id: 2,
                            groupId: 1,
                            title: '谷歌',
                            groupTitle: '默认分组',
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