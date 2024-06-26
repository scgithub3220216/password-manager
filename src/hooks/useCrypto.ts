// @ts-ignore 
import CryptoJS from 'crypto-js';
import {aesIv, aesKey} from "../config/config.ts";

export default function () {

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

    return {encryptData, decryptData};
}