// 引入defineStore用于创建store
import {defineStore} from 'pinia'
import {FileDataObj, PwdGroup, PwdInfo, UserInfo} from "./type.ts";

// 存放用户的一些设置数据
export const useDataInfoStore = defineStore('useDataInfo', {
    // 动作
    actions: {
        setUserInfo(fileDataObj: FileDataObj) {
            this.userInfo = fileDataObj.userInfo;
            this.pwdInfoList = fileDataObj.pwdInfoList;
            this.pwdGroupList = fileDataObj.pwdGroupList;
        },
        updatePwdInfo(pwdInfo: PwdInfo) {
            if (!pwdInfo) {
                return;
            }
            // 修改 pwdGroupList 中的 pwdList
            this.pwdGroupList.forEach(pwdGroup => {
                console.log('pwdGroup.id:', pwdGroup.id, 'pwdInfo.groupId:', pwdInfo.groupId)
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
        }
    },
    // 状态
    state(): { userInfo: UserInfo, pwdInfoList: PwdInfo[], pwdGroupList: PwdGroup[] } {
        return {
            userInfo: {
                startup: 1,
                pwd: '123456',
                firstLoginFlag: 1,
                pwdInfoId: 1,
                pwdGroupId: 1
            },
            pwdInfoList: [],
            pwdGroupList: [
                {
                    id: 1,
                    title: '默认分组',
                    fatherId: 0,
                    subList: [],
                    pwdList: [
                        {
                            id: 1,
                            groupId: 1,
                            title: '百度',
                            username: 'admin',
                            password: '123456',
                            link: 'https://www.baidu.com',
                            remark: '这是百度的密码'
                        },
                        {
                            id: 2,
                            groupId: 1,
                            title: '谷歌',
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