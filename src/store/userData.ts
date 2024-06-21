// 引入defineStore用于创建store
import {defineStore} from 'pinia'

// 存放密码数据
export const userDataStore = defineStore('userData', {
    // 动作
    actions: {},
    // 状态
    state() {
        return {
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