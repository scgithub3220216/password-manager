// 数据存储
// import * as cos from "./cos.js";
import * as oss from "./oss.ts";
import {Oss} from "../components/type.ts";
import {useOssStore} from "../store/oss.ts";

const ossStore = useOssStore()
// 未来兼容更多 平台可以启用这个
// @ts-ignore
const databases = {
    // cos: cos,// 腾讯cos
    oss: oss,// 阿里oss
}

// 配置数据库信息并登录
export async function login(form: Oss) {
    return new Promise((resolve, reject) => {
        oss.login(form).then((res: any) => {
            ossStore.setClient(res);
            resolve(res)
        }).catch((e: any) => {
            reject(e)
        });
    })
}

// 上传文件
export function putFile(key: string, json: string) {
    // return databases[databaseType].putFile(key, json)
    return oss.putFile(key, json)
}

// 获取文件
export function getFile(key: string) {
    // return databases[databaseType].getFile(key)
    return oss.getFile(key)
}


