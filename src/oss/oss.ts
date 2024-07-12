// 阿里云oss
import OSS from 'ali-oss'
import {Oss} from "../components/type.ts";
import {useOssStore} from "../store/oss.ts";
// import store from "@/store/index.ts";

const ossStore = useOssStore();

// 设置oss信息并验证是否正确
export async function login(form: Oss) {
    return new Promise((resolve, reject) => {
        const client = new OSS({
            accessKeyId: form.keyId,
            accessKeySecret: form.key_secret,
            region: form.region,
            bucket: form.bucket,
        })

        // 获取文件列表验证权限是否正确
        client.list({'max-keys': 1}).then(() => {
            resolve(client)
        }).catch((err: any) => {
            reject(err);
        });
    })
}

// 上传文件
export async function putFile(ossKey: string, json: string) {
    try {
        const result = await ossStore.getClient().put(ossKey, new Buffer.from(json));
        console.log(result);
        return '';
    } catch (e) {
        console.log(e);
        return e;
    }
}

// 获取文件
export async function getFile(ossKey: string) {
    try {
        const result = await ossStore.getClient().get(ossKey);
        console.log(result);
        return result.content;
    } catch (e) {
        console.log(e);
        return '';
    }
}


