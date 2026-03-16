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

    /**
     * 上传二进制/文本内容到 OSS（用于图片加密文件上传）
     */
    async function putBinaryFile(ossKey: string, content: string): Promise<string> {
        try {
            console.log(`putBinaryFile ossKey:${ossKey}`)
            // @ts-ignore
            const buffer = new OSS.Buffer(content);
            const result = await getClient().put(ossKey, buffer);
            console.log(`putBinaryFile result:`, result?.res?.statusCode);
            return '';
        } catch (e) {
            console.log("putBinaryFile error:", e);
            return String(e);
        }
    }

    /**
     * 从 OSS 下载文件内容（用于图片加密文件下载）
     */
    async function getBinaryFile(ossKey: string): Promise<string> {
        try {
            console.log(`getBinaryFile ossKey:${ossKey}`)
            const result = await getClient().get(ossKey);
            // @ts-ignore
            if (!result || result.res.statusCode !== 200) {
                return '';
            }
            // content 是 Buffer，转为 utf-8 字符串（加密的文本内容）
            return result.content.toString();
        } catch (e) {
            console.log("getBinaryFile error:", e);
            return '';
        }
    }

    /**
     * 删除 OSS 上的单个文件
     */
    async function deleteOssFile(ossKey: string): Promise<boolean> {
        try {
            console.log(`deleteOssFile ossKey:${ossKey}`)
            await getClient().delete(ossKey);
            return true;
        } catch (e) {
            console.log("deleteOssFile error:", e);
            return false;
        }
    }

    /**
     * 批量删除 OSS 文件
     */
    async function deleteMultiOssFiles(ossKeys: string[]): Promise<boolean> {
        try {
            if (!ossKeys || ossKeys.length === 0) return true;
            console.log(`deleteMultiOssFiles count:${ossKeys.length}`)
            await getClient().deleteMulti(ossKeys);
            return true;
        } catch (e) {
            console.log("deleteMultiOssFiles error:", e);
            return false;
        }
    }

    /**
     * 列出 OSS 上指定前缀的所有文件
     */
    async function listOssFiles(prefix: string): Promise<string[]> {
        try {
            console.log(`listOssFiles prefix:${prefix}`)
            const result = await getClient().list({prefix: prefix, 'max-keys': 1000}, {});
            if (!result || !result.objects) return [];
            return result.objects.map((obj: any) => obj.name);
        } catch (e) {
            console.log("listOssFiles error:", e);
            return [];
        }
    }

    /**
     * 实时生成签名 URL（用于私有 OSS 的图片访问）
     */
    function signatureUrl(ossKey: string, expires?: number): string {
        try {
            console.log(`signatureUrl ossKey:${ossKey}`)
            return getClient().signatureUrl(ossKey, {expires: expires || 3600});
        } catch (e) {
            console.log("signatureUrl error:", e);
            return '';
        }
    }

    function getClient(): OSS {
        const ossStore = useOssStore();
        return ossStore.getClient();
    }

    return {
        login, putFile, getFile,
        putBinaryFile, getBinaryFile,
        deleteOssFile, deleteMultiOssFiles,
        listOssFiles, signatureUrl
    };
}