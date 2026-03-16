import PwdInfo from "./indexview/PwdInfo.vue";


export interface OssSyncObj {
    pwdInfoList:PwdInfo[];
    groupList: PwdGroup[];
    imageList?: PwdImage[];
}

export interface OssForm {

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
export interface UpdateVersion {

    id: number;

    skip_version: string;

    auto_check_switch: string; // 1 开启自动检查更新 0 关闭自动检查更新
    auto_switch: string; // 1 开启自动更新 0 关闭自动更新
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
export interface PwdCache{
    id: number;

    title: string;

    username: string;
}

export interface PwdGroup {
    id: number;


    title: string;

    father_id: number;

    pwdList: PwdInfo[];

    editFlag: boolean;

}

// 图片附件（数据库存储格式，data 为加密后的 Base64）
export interface PwdImage {
    id: number;
    pwd_id: number;
    file_name: string;
    file_size: number;
    mime_type: string;
    data: string;
    sort_order: number;
    created_at: string;
}

// 图片元数据（列表展示用，不含 data）
export interface PwdImageMeta {
    id: number;
    pwd_id: number;
    file_name: string;
    file_size: number;
    mime_type: string;
    sort_order: number;
    created_at: string;
}