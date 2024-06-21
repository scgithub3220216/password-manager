// 存放用户的一些设置数据

class UserInfo {

    // 1 启动 0 不启动
    startup: number;

    pwd: string;

    pwdInfoId: number;

    pwdGroupId: number;


    constructor(startup: number, pwd: string, pwdInfoId: number, pwdGroupId: number) {
        this.startup = startup;
        this.pwd = pwd;
        this.pwdInfoId = pwdInfoId;
        this.pwdGroupId = pwdGroupId;
    }
}

// 存放 密码数据
class PwdInfo {
    id: number;

    title: string;

    username: string;

    password: string;

    link: string;

    remark: string;


    constructor(id: number, title: string, username: string, password: string, link: string, remark: string) {
        this.id = id;
        this.title = title;
        this.username = username;
        this.password = password;
        this.link = link;
        this.remark = remark;
    }
}

class PwdGroup {
    id: number;

    fatherId: number;

    title: string;

    pwdList: PwdInfo[];

    subList: PwdGroup[];


    constructor(id: number, fatherId: number, title: string, pwdList: PwdInfo[], subList: PwdGroup[]) {
        this.id = id;
        this.fatherId = fatherId;
        this.title = title;
        this.pwdList = pwdList;
        this.subList = subList;
    }
}