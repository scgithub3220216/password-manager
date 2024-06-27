// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {FileDataObj, PwdGroup, PwdInfo, UserInfo} from "./type.ts";
import {defaultCopyPwdShortcutKey, defaultCopyUsernameShortcutKey, defaultOpenMainWinShortcutKey, defaultPwd} from "../config/config.ts";

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
        },
        deleteGroup(groupId: number) {
            this.pwdGroupList = this.pwdGroupList.filter(pwdGroup => pwdGroup.id !== groupId);
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
        },

        insertPwdInfo(pwdInfo: PwdInfo) {
            this.pwdGroupList.forEach(pwdGroup => {
                if (pwdGroup.id === pwdInfo.groupId) {
                    pwdGroup.pwdList.push(pwdInfo);
                }
            })
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

        setUserInfo(fileDataObj: FileDataObj) {
            this.userInfo = fileDataObj.userInfo;
            this.pwdGroupList = fileDataObj.pwdGroupList;
        },

        editAction() {
            this.userInfo.saveFlag = true;
        },
    },
    // 状态
    state(): { userInfo: UserInfo, pwdGroupList: PwdGroup[] } {
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

            ]
        }
    },
    // 计算
    getters: {
        getGroupId: (state) => ++state.userInfo.pwdGroupId,
        getPwdInfoId(): number {
            return ++this.userInfo.pwdInfoId;
        },
        // getPwdInfoListByGroupId(groupId: number):PwdGroup[]  => state.pwdGroupList.find((pwdGroup: PwdGroup) => pwdGroup.id === groupId)?.pwdList || [];
        getPwdInfoListByGroupId: (state) => {
            return (groupId: number) => state.pwdGroupList.find((pwdGroup: PwdGroup) => pwdGroup.id === groupId)?.pwdList || [];
        }

    }
})