import PwdInfo from "./indexview/PwdInfo.vue";


export interface OssSyncObj {
    pwdInfoList:PwdInfo[];
    groupList: PwdGroup[];
}

export interface Oss {

    id: number;
    type: string; // 1 阿里云 2 腾讯云
    region: string;
    keyId: string;
    key_secret: string;
    bucket: string;
}

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