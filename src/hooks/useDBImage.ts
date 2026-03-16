import {
    IPC_IMAGE_DELETE_ALL_LOCAL,
    IPC_IMAGE_DELETE_LOCAL_DIR,
    IPC_IMAGE_DELETE_LOCAL_FILE,
    IPC_IMAGE_GET_ENCRYPTED_CONTENT,
    IPC_IMAGE_READ_FROM_LOCAL,
    IPC_IMAGE_SAVE_ENCRYPTED_CONTENT,
    IPC_IMAGE_SAVE_TO_LOCAL,
    IPC_SQLITE_DELETE_ALL_IMAGE_DATA,
    IPC_SQLITE_DELETE_IMAGE_DATA,
    IPC_SQLITE_DELETE_IMAGES_BY_PWD_ID,
    IPC_SQLITE_INSERT_IMAGE_BY_IMPORT_DATA,
    IPC_SQLITE_INSERT_IMAGE_DATA,
    IPC_SQLITE_SELECT_ALL_IMAGE_DATA,
    IPC_SQLITE_SELECT_COUNT_IMAGE_DATA,
    IPC_SQLITE_SELECT_GET_IMAGE_DATA,
    IPC_SQLITE_SELECT_IMAGE_FILE_PATH,
    IPC_SQLITE_SELECT_LIST_IMAGE_META,
    IPC_SQLITE_UPDATE_IMAGE_OSS_UPLOADED,
} from "../../electron/constant.ts";
import {PwdImage, PwdImageMeta} from "../components/type.ts";

export default function () {

    /**
     * 读取 File 对象，转为 Base64，通过主进程加密写入本地文件，数据库存储文件路径
     */
    async function insertImage(pwdId: number, file: File): Promise<number> {
        console.log(`useDBImage.ts insertImage pwdId:${pwdId}, fileName:${file.name}`)
        // 读取文件为 Base64（不含前缀）
        const base64Str = await fileToBase64(file)
        // 通过 IPC 发送到主进程，加密后写入本地文件，返回相对路径
        const relativePath = await window.ipcRenderer.invoke(
            IPC_IMAGE_SAVE_TO_LOCAL,
            pwdId,
            base64Str,
            file.name
        );
        // 数据库中存储相对路径，oss_uploaded=0
        const res = await window.ipcRenderer.invoke(
            IPC_SQLITE_INSERT_IMAGE_DATA,
            pwdId,
            file.name,
            file.size,
            file.type,
            relativePath,
            0,  // sort_order
            0   // oss_uploaded
        );
        return res;
    }

    /**
     * 删除单张图片（先删本地文件，再删数据库记录）
     */
    async function deleteImage(id: number) {
        console.log(`useDBImage.ts deleteImage id:${id}`)
        // 先获取文件路径
        const pathResult = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_IMAGE_FILE_PATH, id);
        if (pathResult && pathResult.data) {
            // 删除本地文件
            await window.ipcRenderer.invoke(IPC_IMAGE_DELETE_LOCAL_FILE, pathResult.data);
        }
        // 删除数据库记录
        return await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_IMAGE_DATA, id);
    }

    /**
     * 删除某条目所有图片（先删本地文件目录，再删数据库记录）
     */
    async function deleteImagesByPwdId(pwdId: number) {
        console.log(`useDBImage.ts deleteImagesByPwdId pwdId:${pwdId}`)
        // 删除本地文件目录
        await window.ipcRenderer.invoke(IPC_IMAGE_DELETE_LOCAL_DIR, pwdId);
        // 删除数据库记录
        return await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_IMAGES_BY_PWD_ID, pwdId);
    }

    /**
     * 删除所有图片（OSS 同步下载前调用）
     */
    async function deleteAllImages() {
        console.log(`useDBImage.ts deleteAllImages`)
        // 删除所有本地图片文件
        await window.ipcRenderer.invoke(IPC_IMAGE_DELETE_ALL_LOCAL);
        // 删除数据库记录
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
        // 从数据库获取文件相对路径
        const result = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_GET_IMAGE_DATA, id);
        if (!result || !result.data) return '';
        // 通过主进程读取并解密本地文件，返回 Base64 字符串
        const base64Str = await window.ipcRenderer.invoke(IPC_IMAGE_READ_FROM_LOCAL, result.data);
        if (!base64Str) return '';
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
     * OSS 上传时获取全部图片元数据（data 字段现在是文件路径，体积很小）
     */
    async function listAllImages(): Promise<PwdImage[]> {
        console.log(`useDBImage.ts listAllImages`)
        const list = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_ALL_IMAGE_DATA);
        return list || [];
    }

    /**
     * OSS 下载后导入单张图片（先将加密内容写入本地文件，再插入数据库）
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
            image.created_at,
            image.oss_uploaded
        );
    }

    /**
     * 更新图片的 OSS 上传状态
     */
    async function updateOssUploaded(id: number, uploaded: number) {
        console.log(`useDBImage.ts updateOssUploaded id:${id}, uploaded:${uploaded}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_UPDATE_IMAGE_OSS_UPLOADED, id, uploaded);
    }

    /**
     * 获取本地加密文件内容（不解密，用于 OSS 上传）
     */
    async function getEncryptedContent(relativePath: string): Promise<string> {
        console.log(`useDBImage.ts getEncryptedContent relativePath:${relativePath}`)
        return await window.ipcRenderer.invoke(IPC_IMAGE_GET_ENCRYPTED_CONTENT, relativePath);
    }

    /**
     * 保存加密文件内容到本地（OSS 下载后直接写入，不需要重新加密）
     */
    async function saveEncryptedContent(relativePath: string, content: string) {
        console.log(`useDBImage.ts saveEncryptedContent relativePath:${relativePath}`)
        return await window.ipcRenderer.invoke(IPC_IMAGE_SAVE_ENCRYPTED_CONTENT, relativePath, content);
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
        updateOssUploaded,
        getEncryptedContent,
        saveEncryptedContent,
    };
}
