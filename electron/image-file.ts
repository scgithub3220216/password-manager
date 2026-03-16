/**
 * 图片文件操作模块（主进程）
 * 负责图片的加密存储、解密读取、文件删除和数据迁移
 */
import {app} from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import CryptoJS from 'crypto-js';
import {aesKey, aesIv} from '../src/config/config.ts';

// 复用渲染进程相同的 AES 密钥和偏移量
const SECRET_KEY = CryptoJS.enc.Utf8.parse(aesKey);
const SECRET_IV = CryptoJS.enc.Utf8.parse(aesIv);

/**
 * 获取图片存储根目录，不存在时自动创建
 */
export function getImageDir(): string {
    const userDataPath = app.getPath('userData');
    const imageDir = path.join(userDataPath, 'images');
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, {recursive: true});
    }
    return imageDir;
}

/**
 * 生成唯一文件名: {timestamp}_{6位随机hex}.{ext}.enc
 */
export function generateFileName(originalName: string): string {
    const ext = path.extname(originalName) || '.bin';
    const timestamp = Date.now();
    const random = crypto.randomBytes(3).toString('hex');
    return `${timestamp}_${random}${ext}.enc`;
}

/**
 * 确保目录存在
 */
function ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true});
    }
}

/**
 * 加密字符串（与渲染进程 useCrypto.ts 完全一致）
 */
function encryptData(word: string): string {
    if (!word) return '';
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

/**
 * 解密字符串（与渲染进程 useCrypto.ts 完全一致）
 */
function decryptData(word: string): string {
    if (!word) return '';
    const base64 = CryptoJS.enc.Base64.parse(word);
    const srcs = CryptoJS.enc.Base64.stringify(base64);
    const decrypt = CryptoJS.AES.decrypt(srcs, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return decrypt.toString(CryptoJS.enc.Utf8);
}

/**
 * 保存图片文件到本地（加密后写入）
 * @param pwdId 密码条目ID
 * @param base64Data 原始图片 Base64 数据（不含 data:xxx;base64, 前缀）
 * @param originalName 原始文件名
 * @returns 相对路径，如 "123/1710000000000_a1b2c3.jpg.enc"
 */
export function saveImageFile(pwdId: number, base64Data: string, originalName: string): string {
    const imageDir = getImageDir();
    const pwdDir = path.join(imageDir, String(pwdId));
    ensureDir(pwdDir);

    const fileName = generateFileName(originalName);
    const filePath = path.join(pwdDir, fileName);

    // 使用 CryptoJS 加密 Base64 数据
    const encryptedData = encryptData(base64Data);
    fs.writeFileSync(filePath, encryptedData, 'utf-8');

    // 返回相对路径
    return `${pwdId}/${fileName}`;
}

/**
 * 从本地读取图片文件并解密
 * @param relativePath 相对路径
 * @returns 解密后的 Base64 字符串
 */
export function readImageFile(relativePath: string): string {
    const imageDir = getImageDir();
    const filePath = path.join(imageDir, relativePath);

    if (!fs.existsSync(filePath)) {
        console.error(`readImageFile: file not found: ${filePath}`);
        return '';
    }

    const encryptedData = fs.readFileSync(filePath, 'utf-8');
    return decryptData(encryptedData);
}

/**
 * 删除指定图片文件
 */
export function deleteImageFile(relativePath: string): void {
    const imageDir = getImageDir();
    const filePath = path.join(imageDir, relativePath);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`deleteImageFile: deleted ${filePath}`);

        // 如果目录为空则删除目录
        const dirPath = path.dirname(filePath);
        try {
            const files = fs.readdirSync(dirPath);
            if (files.length === 0) {
                fs.rmdirSync(dirPath);
                console.log(`deleteImageFile: removed empty dir ${dirPath}`);
            }
        } catch (e) {
            // 忽略目录读取错误
        }
    }
}

/**
 * 删除整个 images/{pwdId}/ 目录
 */
export function deleteImageDir(pwdId: number): void {
    const imageDir = getImageDir();
    const pwdDir = path.join(imageDir, String(pwdId));

    if (fs.existsSync(pwdDir)) {
        fs.rmSync(pwdDir, {recursive: true, force: true});
        console.log(`deleteImageDir: removed ${pwdDir}`);
    }
}

/**
 * 删除所有图片文件（删除整个 images/ 目录下的所有子目录）
 */
export function deleteAllImageFiles(): void {
    const imageDir = getImageDir();
    if (fs.existsSync(imageDir)) {
        const entries = fs.readdirSync(imageDir);
        for (const entry of entries) {
            const entryPath = path.join(imageDir, entry);
            const stat = fs.statSync(entryPath);
            if (stat.isDirectory()) {
                fs.rmSync(entryPath, {recursive: true, force: true});
            } else {
                fs.unlinkSync(entryPath);
            }
        }
        console.log(`deleteAllImageFiles: cleaned ${imageDir}`);
    }
}

/**
 * 获取加密文件的原始内容（不解密，用于 OSS 上传）
 */
export function getEncryptedFileContent(relativePath: string): string {
    const imageDir = getImageDir();
    const filePath = path.join(imageDir, relativePath);

    if (!fs.existsSync(filePath)) {
        console.error(`getEncryptedFileContent: file not found: ${filePath}`);
        return '';
    }

    return fs.readFileSync(filePath, 'utf-8');
}

/**
 * 直接写入加密内容到文件（OSS 下载后写入，不需要重新加密）
 */
export function saveEncryptedFileContent(relativePath: string, content: string): void {
    const imageDir = getImageDir();
    const filePath = path.join(imageDir, relativePath);

    // 确保目录存在
    ensureDir(path.dirname(filePath));

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`saveEncryptedFileContent: saved ${filePath}`);
}

/**
 * 数据迁移：将旧的加密 Base64 数据转换为文件存储
 * @param pwdId 密码条目ID
 * @param encryptedBase64 旧的加密后的 Base64 字符串（存储在 DB data 字段中的）
 * @param originalName 原始文件名
 * @returns 新的相对路径
 */
export function migrateBase64ToFile(pwdId: number, encryptedBase64: string, originalName: string): string {
    // 1. 使用 CryptoJS 解密旧数据，得到原始 Base64 图片数据
    const rawBase64 = decryptData(encryptedBase64);
    if (!rawBase64) {
        console.error(`migrateBase64ToFile: failed to decrypt data for pwdId=${pwdId}, fileName=${originalName}`);
        return '';
    }

    // 2. 重新加密并写入文件
    return saveImageFile(pwdId, rawBase64, originalName);
}
