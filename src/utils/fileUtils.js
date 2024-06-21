// 读取文件
import {app} from 'electron'
import path from "node:path";
import {useDataInfoStore} from "../store/useDataInfo.ts";
import {storeToRefs} from "pinia";
import * as fs from "fs";

// function readFile(filePath) {
//     fs.readFile(filePath, 'utf-8', (err, data) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log(data);
//     });
// }
//
// // 写入文件
// function writeFile(filePath, content) {
//     fs.writeFile(filePath, content, 'utf-8', (err) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log('文件写入成功');
//     });
// }


export function readFileDataToPinia() {
    const userDataPath = app.getPath('userData');
    console.log('path:', userDataPath);
    const filePath = path.join(userDataPath, 'example.txt');

    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        console.log("文件存在！");
        // 读取示例
        readFile(filePath);
    } catch (err) {
        console.error("文件不存在！");

        // 写入示例
        writeFile(filePath, getUserInfoStr());
    }
}

function getUserInfoStr() {
    const userInfoStore = useDataInfoStore();
    const {userInfo} = storeToRefs(userInfoStore)
    return JSON.stringify(userInfo);
}

module.exports = {
    readFileDataToPinia,
    writeFile
};
