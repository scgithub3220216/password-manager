import PwdInfo from "./indexview/PwdInfo.vue";


export interface ShortCutKeyComb {

    keys: string[];

    action?: () => void;

    action_name: string;

    desc: string;

}

export interface Config {

    id: number;

    code: string;

    value: string;
}


// 存放用户的一些设置数据
export interface UserInfo {

    // true 启动 ; false 不启动
    autoStart: boolean;

    pwd: string;

    // 1 第一次登录 ,  0 不是第一次登录
    firstLoginFlag: number;
    // 1 登录  0 下线
    curLoginStatus: number;
    // 保存标志 (修改了内容就是true  否则false)
    saveFlag: boolean;

    pwdInfoId: number;

    pwdGroupId: number;

    darkSwitch: boolean;

    autoLock: AutoLock;

    shortcutKey: ShortcutKey;


}

export class AutoLock {
    // 自动锁定时间
    autoLockTime: number;

    // 自动锁定时间单位
    autoLockTimeUnit: number;

    constructor(autoLockTime: number, autoLockTimeUnit: number) {
        this.autoLockTime = autoLockTime;
        this.autoLockTimeUnit = autoLockTimeUnit;
    }
}

export class ShortcutKey {
    openMainWindows: string;

    copyUsername: string;

    copyPwd: string;


    constructor(openMainWindows: string, copyUsername: string, copyPwd: string) {
        this.openMainWindows = openMainWindows;
        this.copyUsername = copyUsername;
        this.copyPwd = copyPwd;
    }
}

// 存放 密码数据
export interface PwdInfo {
    id: number;

    group_id: number;

    group_title: string;

    title: string;

    username: string;

    password: string;

    link: string;

    remark: string;
}

export interface PwdGroup {
    id: number;


    title: string;

    father_id: number;

    pwdList: PwdInfo[];

    editFlag: boolean;

}