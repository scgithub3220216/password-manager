import {
    IPC_SQLITE_DELETE_ALL_IMAGE_DATA,
    IPC_SQLITE_DELETE_IMAGE_DATA,
    IPC_SQLITE_DELETE_IMAGES_BY_PWD_ID,
    IPC_SQLITE_INSERT_IMAGE_BY_IMPORT_DATA,
    IPC_SQLITE_INSERT_IMAGE_DATA,
    IPC_SQLITE_SELECT_ALL_IMAGE_DATA,
    IPC_SQLITE_SELECT_COUNT_IMAGE_DATA,
    IPC_SQLITE_SELECT_GET_IMAGE_DATA,
    IPC_SQLITE_SELECT_LIST_IMAGE_META,
} from "../../electron/constant.ts";
import {PwdImage, PwdImageMeta} from "../components/type.ts";
import useCrypto from "./useCrypto.ts";

export default function () {
    const {encryptData, decryptData} = useCrypto()

    /**
     * 读取 File 对象，转为 Base64，加密后存入数据库
     */
    async function insertImage(pwdId: number, file: File): Promise<number> {
        console.log(`useDBImage.ts insertImage pwdId:${pwdId}, fileName:${file.name}`)
        const base64Str = await fileToBase64(file)
        const encryptedData = encryptData(base64Str)
        const res = await window.ipcRenderer.invoke(
            IPC_SQLITE_INSERT_IMAGE_DATA,
            pwdId,
            file.name,
            file.size,
            file.type,
            encryptedData,
            0
        );
        return res;
    }

    /**
     * 删除单张图片
     */
    async function deleteImage(id: number) {
        console.log(`useDBImage.ts deleteImage id:${id}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_IMAGE_DATA, id);
    }

    /**
     * 删除某条目所有图片
     */
    async function deleteImagesByPwdId(pwdId: number) {
        console.log(`useDBImage.ts deleteImagesByPwdId pwdId:${pwdId}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_IMAGES_BY_PWD_ID, pwdId);
    }

    /**
     * 删除所有图片（OSS 同步下载前调用）
     */
    async function deleteAllImages() {
        console.log(`useDBImage.ts deleteAllImages`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_ALL_IMAGE_DATA);
    }

    /**
     * 获取元数据列表（不含 data 字段）
     */
    async function listImageMeta(pwdId: number): Promise<PwdImageMeta[]> {
        console.log(`useDBImage.ts listImageMeta pwdId:${pwdId}`)
        const list = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_LIST_IMAGE_META, pwdId);
        return list || [];
    }

    /**
     * 按需获取并解密单张图片，返回 data:image/xxx;base64,... 格式的 dataUrl
     */
    async function getImageDataUrl(id: number, mimeType: string): Promise<string> {
        console.log(`useDBImage.ts getImageDataUrl id:${id}`)
        const result = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_GET_IMAGE_DATA, id);
        if (!result || !result.data) return '';
        const base64Str = decryptData(result.data)
        return `data:${mimeType};base64,${base64Str}`;
    }

    /**
     * 获取图片数量
     */
    async function countImages(pwdId: number): Promise<number> {
        console.log(`useDBImage.ts countImages pwdId:${pwdId}`)
        const data = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_COUNT_IMAGE_DATA, pwdId);
        return data?.count || 0;
    }

    /**
     * OSS 上传时获取全部图片（已加密，不解密）
     */
    async function listAllImages(): Promise<PwdImage[]> {
        console.log(`useDBImage.ts listAllImages`)
        const list = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_ALL_IMAGE_DATA);
        return list || [];
    }

    /**
     * OSS 下载后导入单张图片（数据已加密，直接存入）
     */
    async function insertImageByImport(image: PwdImage): Promise<number> {
        console.log(`useDBImage.ts insertImageByImport id:${image.id}`)
        return await window.ipcRenderer.invoke(
            IPC_SQLITE_INSERT_IMAGE_BY_IMPORT_DATA,
            image.id,
            image.pwd_id,
            image.file_name,
            image.file_size,
            image.mime_type,
            image.data,
            image.sort_order,
            image.created_at
        );
    }

    /**
     * File 转 Base64 字符串（不含 data:xxx;base64, 前缀）
     */
    function fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const result = reader.result as string
                // 移除 data:xxx;base64, 前缀
                const base64 = result.split(',')[1]
                resolve(base64)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    return {
        insertImage,
        deleteImage,
        deleteImagesByPwdId,
        deleteAllImages,
        listImageMeta,
        getImageDataUrl,
        countImages,
        listAllImages,
        insertImageByImport,
    };
}
