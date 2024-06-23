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

    // 1 启动 0 不启动
    startup: number;

    pwd: string;

    // 1 第一次登录 ,  0 不是第一次登录
    firstLoginFlag: 1;

    pwdInfoId: number;

    pwdGroupId: number;


    constructor(startup: number, pwd: string, firstLoginFlag: 1, pwdInfoId: number, pwdGroupId: number) {
        this.startup = startup;
        this.pwd = pwd;
        this.firstLoginFlag = firstLoginFlag;
        this.pwdInfoId = pwdInfoId;
        this.pwdGroupId = pwdGroupId;
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