import CryptoJS from 'crypto-js';
import {aesIv, aesKey, salt} from "../config/config.ts";
import {PwdInfo} from "../components/type.ts";

export default function () {
    //  look 加密方法 参考 @link https://blog.csdn.net/lkp1603645756/article/details/137722801
    /**
     * md5HexHash
     * @param input
     */
    function md5HexHash(input: string) {
        // 计算 MD5
        const hash = CryptoJS.MD5(input);
        // 输出十六进制字符串
        return hash.toString(CryptoJS.enc.Hex);
    }

    function pwdAddSalt(pwd: string) {
        return pwd + salt
    }


    // 计算sha512-十六进制
    function sha512HexHash(pwd: string) {
        if (!pwd) pwd = '123456';
        let saltPwd = pwdAddSalt(pwd);
        const sha512 = CryptoJS.SHA512(saltPwd);
        return sha512.toString(CryptoJS.enc.Hex);
    }


    //设置秘钥和秘钥偏移量
    const SECRET_KEY = CryptoJS.enc.Utf8.parse(aesKey);
    const SECRET_IV = CryptoJS.enc.Utf8.parse(aesIv);

    /**
     * 加密方法
     * @param word
     * @returns {string}
     */
    function encryptData(word: string) {
        if (!word) {
            return '';
        }
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, SECRET_KEY, {
            iv: SECRET_IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        })
        return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    }

    function decryptData(word: string) {
        if (!word) {
            return '';
        }
        let base64 = CryptoJS.enc.Base64.parse(word);
        let srcs = CryptoJS.enc.Base64.stringify(base64);
        const decrypt = CryptoJS.AES.decrypt(srcs, SECRET_KEY, {
            iv: SECRET_IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });
        return decrypt.toString(CryptoJS.enc.Utf8);
    }

    function decryptList(pwdInfoList: PwdInfo[]) {
        if (!pwdInfoList) return pwdInfoList;
        pwdInfoList.forEach(pwdInfo => {
            pwdInfo.password = decryptData(pwdInfo.password)
        })
        return pwdInfoList;
    }

    return {encryptData, decryptData, md5HexHash, sha512HexHash, decryptList};
}