import {
    IPC_FILE_DELETE_ALL_LOCAL,
    IPC_FILE_DELETE_LOCAL_DIR,
    IPC_FILE_DELETE_LOCAL_FILE,
    IPC_FILE_GET_ENCRYPTED_CONTENT,
    IPC_FILE_READ_FROM_LOCAL,
    IPC_FILE_SAVE_ENCRYPTED_CONTENT,
    IPC_FILE_SAVE_TO_LOCAL,
    IPC_SQLITE_DELETE_ALL_FILE_DATA,
    IPC_SQLITE_DELETE_FILE_DATA,
    IPC_SQLITE_DELETE_FILES_BY_PWD_ID,
    IPC_SQLITE_INSERT_FILE_BY_IMPORT_DATA,
    IPC_SQLITE_INSERT_FILE_DATA,
    IPC_SQLITE_SELECT_ALL_FILE_DATA,
    IPC_SQLITE_SELECT_COUNT_FILE_DATA,
    IPC_SQLITE_SELECT_GET_FILE_DATA,
    IPC_SQLITE_SELECT_FILE_PATH,
    IPC_SQLITE_SELECT_LIST_FILE_META,
    IPC_SQLITE_UPDATE_FILE_OSS_UPLOADED,
} from "../../electron/constant.ts";
import {PwdFile, PwdFileMeta} from "../components/type.ts";

export default function () {

    /**
     * 读取 File 对象，转为 Base64，通过主进程加密写入本地文件，数据库存储文件路径
     */
    async function insertFile(pwdId: number, file: File): Promise<number> {
        console.log(`useDBFile.ts insertFile pwdId:${pwdId}, fileName:${file.name}`)
        // 读取文件为 Base64（不含前缀）
        const base64Str = await fileToBase64(file)
        // 通过 IPC 发送到主进程，加密后写入本地文件，返回相对路径
        const relativePath = await window.ipcRenderer.invoke(
            IPC_FILE_SAVE_TO_LOCAL,
            pwdId,
            base64Str,
            file.name
        );
        // 数据库中存储相对路径，oss_uploaded=0
        const res = await window.ipcRenderer.invoke(
            IPC_SQLITE_INSERT_FILE_DATA,
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
     * 删除单个文件（先删本地文件，再删数据库记录）
     */
    async function deleteFile(id: number) {
        console.log(`useDBFile.ts deleteFile id:${id}`)
        // 先获取文件路径
        const pathResult = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_FILE_PATH, id);
        if (pathResult && pathResult.data) {
            // 删除本地文件
            await window.ipcRenderer.invoke(IPC_FILE_DELETE_LOCAL_FILE, pathResult.data);
        }
        // 删除数据库记录
        return await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_FILE_DATA, id);
    }

    /**
     * 删除某条目所有文件（先删本地文件目录，再删数据库记录）
     */
    async function deleteFilesByPwdId(pwdId: number) {
        console.log(`useDBFile.ts deleteFilesByPwdId pwdId:${pwdId}`)
        // 删除本地文件目录
        await window.ipcRenderer.invoke(IPC_FILE_DELETE_LOCAL_DIR, pwdId);
        // 删除数据库记录
        return await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_FILES_BY_PWD_ID, pwdId);
    }

    /**
     * 删除所有文件（OSS 同步下载前调用）
     */
    async function deleteAllFiles() {
        console.log(`useDBFile.ts deleteAllFiles`)
        // 删除所有本地文件
        await window.ipcRenderer.invoke(IPC_FILE_DELETE_ALL_LOCAL);
        // 删除数据库记录
        return await window.ipcRenderer.invoke(IPC_SQLITE_DELETE_ALL_FILE_DATA);
    }

    /**
     * 获取元数据列表（不含 data 字段）
     */
    async function listFileMeta(pwdId: number): Promise<PwdFileMeta[]> {
        console.log(`useDBFile.ts listFileMeta pwdId:${pwdId}`)
        const list = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_LIST_FILE_META, pwdId);
        return list || [];
    }

    /**
     * 按需获取并解密单个文件，返回 data:xxx;base64,... 格式的 dataUrl
     */
    async function getFileDataUrl(id: number, mimeType: string): Promise<string> {
        console.log(`useDBFile.ts getFileDataUrl id:${id}`)
        // 从数据库获取文件相对路径
        const result = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_GET_FILE_DATA, id);
        if (!result || !result.data) return '';
        // 通过主进程读取并解密本地文件，返回 Base64 字符串
        const base64Str = await window.ipcRenderer.invoke(IPC_FILE_READ_FROM_LOCAL, result.data);
        if (!base64Str) return '';
        return `data:${mimeType};base64,${base64Str}`;
    }

    /**
     * 获取文件数量
     */
    async function countFiles(pwdId: number): Promise<number> {
        console.log(`useDBFile.ts countFiles pwdId:${pwdId}`)
        const data = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_COUNT_FILE_DATA, pwdId);
        return data?.count || 0;
    }

    /**
     * OSS 上传时获取全部文件元数据（data 字段现在是文件路径，体积很小）
     */
    async function listAllFiles(): Promise<PwdFile[]> {
        console.log(`useDBFile.ts listAllFiles`)
        const list = await window.ipcRenderer.invoke(IPC_SQLITE_SELECT_ALL_FILE_DATA);
        return list || [];
    }

    /**
     * OSS 下载后导入单个文件（先将加密内容写入本地文件，再插入数据库）
     */
    async function insertFileByImport(file: PwdFile): Promise<number> {
        console.log(`useDBFile.ts insertFileByImport id:${file.id}`)
        return await window.ipcRenderer.invoke(
            IPC_SQLITE_INSERT_FILE_BY_IMPORT_DATA,
            file.id,
            file.pwd_id,
            file.file_name,
            file.file_size,
            file.mime_type,
            file.data,
            file.sort_order,
            file.created_at,
            file.oss_uploaded
        );
    }

    /**
     * 更新文件的 OSS 上传状态
     */
    async function updateOssUploaded(id: number, uploaded: number) {
        console.log(`useDBFile.ts updateOssUploaded id:${id}, uploaded:${uploaded}`)
        return await window.ipcRenderer.invoke(IPC_SQLITE_UPDATE_FILE_OSS_UPLOADED, id, uploaded);
    }

    /**
     * 获取本地加密文件内容（不解密，用于 OSS 上传）
     */
    async function getEncryptedContent(relativePath: string): Promise<string> {
        console.log(`useDBFile.ts getEncryptedContent relativePath:${relativePath}`)
        return await window.ipcRenderer.invoke(IPC_FILE_GET_ENCRYPTED_CONTENT, relativePath);
    }

    /**
     * 保存加密文件内容到本地（OSS 下载后直接写入，不需要重新加密）
     */
    async function saveEncryptedContent(relativePath: string, content: string) {
        console.log(`useDBFile.ts saveEncryptedContent relativePath:${relativePath}`)
        return await window.ipcRenderer.invoke(IPC_FILE_SAVE_ENCRYPTED_CONTENT, relativePath, content);
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
        insertFile,
        deleteFile,
        deleteFilesByPwdId,
        deleteAllFiles,
        listFileMeta,
        getFileDataUrl,
        countFiles,
        listAllFiles,
        insertFileByImport,
        updateOssUploaded,
        getEncryptedContent,
        saveEncryptedContent,
    };
}
