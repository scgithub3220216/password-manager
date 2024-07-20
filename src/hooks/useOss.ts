import {OssForm} from "../components/type.ts";
import OSS from "ali-oss";
import {useOssStore} from "../store/oss.ts";

export default function () {
    const ossStore = useOssStore()


// 设置oss信息并验证是否正确
    async function login(form: OssForm) {
        return new Promise((resolve, reject) => {
            const client = new OSS({
                accessKeyId: form.keyId,
                accessKeySecret: form.key_secret,
                region: form.region,
                bucket: form.bucket,
            })

            // @ts-ignore 获取文件列表验证权限是否正确
            client.list({'max-keys': 1}).then(() => {
                ossStore.setClient(client);
                resolve(client)
            }).catch((err: any) => {
                reject(err);
            });
        })
    }

// 上传文件
    async function putFile(ossKey: string, json: string) {
        try {
            console.log(`putFile ossKey:${ossKey}`)
            // @ts-ignore
            let buffer = new OSS.Buffer(JSON.stringify(json));
            // const blob = new Blob([new Uint8Array(JSON.stringify(json).split('').map(c => c.charCodeAt(0)))], {type: 'application/json'});

            const result = await getClient().put(ossKey, buffer);
            console.log(result);
            return '';
        } catch (e) {
            console.log("putFile  error:", e);
            return e;
        }
    }

// 获取文件
    /**
     *  oss  返回内容格式
     * {
     *         "res": {
     *             "status": 200,
     *                 "statusCode": 200,
     *                 "headers": {
     *                 "cache-control": "no-cache",
     *                     "content-length": "16081",
     *                     "content-type": "application/octet-stream",
     *                     "etag": "\"8DABFB339F5529CFF7A43185CEA368FB\"",
     *                     "last-modified": "Sun, 14 Jul 2024 02:33:24 GMT"
     *             },
     *             "size": 16081,
     *                 "aborted": false,
     *                 "rt": 61,
     *                 "keepAliveSocket": false,
     *                 "data": {
     *                 "type": "Buffer",
     *                     "data": []
     *             },
     *             "requestUrls": [
     *                 "http://password-manager-sc.oss-cn-hangzhou.aliyuncs.com/password?response-cache-control=no-cache"
     *             ],
     *                 "timing": null,
     *                 "remoteAddress": "",
     *                 "remotePort": ""
     *         },
     *         "content": {
     *             "type": "Buffer",
     *                 "data":[]
     *         }
     *     }
     * @param ossKey
     */
    async function getFile(ossKey: string): Promise<string> {
        console.log('getFile client ossKey:', ossKey)

        try {
            let client = getClient();
            // console.log(client)
            const result = await client.get(ossKey);
            // console.log(result);
            // @ts-ignore
            if (!result || result.res.statusCode !== 200) {
                return '';
            }
            return JSON.parse(result.content);
        } catch (e) {
            console.log("getFile  error:", e);
            return '';
        }
    }

    function getClient(): OSS {
        const ossStore = useOssStore();
        return ossStore.getClient();
    }

    return {login, putFile, getFile};
}