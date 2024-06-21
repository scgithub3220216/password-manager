// 引入defineStore用于创建store
import {defineStore} from 'pinia'

// 存放用户的一些设置数据
export const useDataInfoStore = defineStore('useDataInfo', {
    // 动作
    actions: {},
    // 状态
    state() {
        return {
            userInfo: {
                startup: 1,
                pwd: '123456',
                pwdInfoId: 1,
                pwdGroupId: 1
            },
            pwdInfoList: [],
            pwdGroupList: [
                {
                    id: 1,
                    name: '默认分组',
                    pwdInfoList: [
                        {
                            id: 1,
                            name: '百度',
                            account: 'admin',
                            pwd: '123456',
                            url: 'https://www.baidu.com',
                            note: '这是百度的密码'
                        },
                        {
                            id: 2,
                            name: '谷歌',
                            account: 'admin',
                            pwd: '123456',
                            url: 'https://www.google.com',
                            note: '这是谷歌的密码'
                        }
                    ]
                }

            ]
        }
    },
    // 计算
    getters: {}
})