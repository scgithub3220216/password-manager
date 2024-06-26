export class FileDataObj {
    userInfo: UserInfo;
    pwdGroupList: PwdGroup[];


    constructor(userInfo: UserInfo, pwdGroupList: PwdGroup[]) {
        this.userInfo = userInfo;
        this.pwdGroupList = pwdGroupList;
    }
}

// 存放用户的一些设置数据
export class UserInfo {

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


    constructor(autoStart: boolean, pwd: string, firstLoginFlag: number, curLoginStatus: number, saveFlag: boolean, pwdInfoId: number, pwdGroupId: number, darkSwitch: boolean, autoLock: AutoLock, shortcutKey: ShortcutKey) {
        this.autoStart = autoStart;
        this.pwd = pwd;
        this.firstLoginFlag = firstLoginFlag;
        this.curLoginStatus = curLoginStatus;
        this.saveFlag = saveFlag;
        this.pwdInfoId = pwdInfoId;
        this.pwdGroupId = pwdGroupId;
        this.darkSwitch = darkSwitch;
        this.autoLock = autoLock;
        this.shortcutKey = shortcutKey;
    }
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
export class PwdInfo {
    id: number;

    groupId: number;

    groupTitle: string;

    title: string;

    username: string;

    password: string;

    link: string;

    remark: string;

    constructor(id: number, groupId: number, groupTitle: string, title: string, username: string, password: string, link: string, remark: string) {
        this.id = id;
        this.groupId = groupId;
        this.groupTitle = groupTitle;
        this.title = title;
        this.username = username;
        this.password = password;
        this.link = link;
        this.remark = remark;
    }
}

export class PwdGroup {
    id: number;

    // fatherId: number;

    title: string;

    pwdList: PwdInfo[];

    editFlag: boolean = false;

    // subList: PwdGroup[];


    constructor(id: number, title: string, pwdList: PwdInfo[]) {
        this.id = id;
        this.title = title;
        this.pwdList = pwdList;
    }
}