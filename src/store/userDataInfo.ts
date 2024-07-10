// 引入defineStore用于创建store
import {defineStore} from 'pinia'
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

    },
    // 状态
    state(): {
        darkSwitch: boolean,
        lockTime: number,
        timeUnit: number,
        changePwdInfoFlag: boolean,
        importFlag: boolean,
        shortCutKeyCombs: ShortCutKeyComb[],
        curGroup: PwdGroup,
        curPwdInfo: PwdInfo
    } {
        return {
            darkSwitch: true,
            lockTime: 60,
            timeUnit: 1000,
            changePwdInfoFlag: false,
            importFlag: false,
            // @ts-ignore
            curGroup: {},
            // @ts-ignore
            curPwdInfo: {}
        }
    },
    // 计算
    getters: {}
})