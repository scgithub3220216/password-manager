// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {FileDataObj, PwdGroup, PwdInfo, UserInfo} from "./type.ts";

// 存放用户的一些设置数据
export const userDataInfoStore = defineStore('userDataInfo', {
    // 动作
    actions: {
        editAction() {
            this.userInfo.saveFlag = true;
        },
        setInitPwd(pass: string) {
            this.userInfo.pwd = pass
            this.userInfo.firstLoginFlag = 0
            this.editAction()
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
        getGroupId() {
            return ++this.userInfo.pwdGroupId;
        },
        getPwdInfoId() {
            return ++this.userInfo.pwdInfoId;
        },
        setUserInfo(fileDataObj: FileDataObj) {
            this.userInfo = fileDataObj.userInfo;
            this.pwdGroupList = fileDataObj.pwdGroupList;
        },
        getPwdInfoListByGroupId(groupId: number) {
            let pwdList: PwdInfo[] = [];
            this.pwdGroupList.forEach(pwdGroup => {
                if (pwdGroup.id === groupId) {
                    pwdList = pwdGroup.pwdList;
                }
            })
            return pwdList;

        },
        insertPwdInfo(pwdInfo: PwdInfo) {
            this.pwdGroupList.forEach(pwdGroup => {
                if (pwdGroup.id === pwdInfo.groupId) {
                    pwdGroup.pwdList.push(pwdInfo);
                }
            })
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
        },
    },
    // 状态
    state(): { userInfo: UserInfo, pwdGroupList: PwdGroup[] } {
        return {
            userInfo: {
                startup: 1,
                pwd: '123456',
                firstLoginFlag: 1,
                curLoginStatus: 0,
                pwdInfoId: 1,
                pwdGroupId: 1,
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
    getters: {}
})