// 读取文件
import * as fs from "fs";
import * as util from "util";

const readFileAsync = util.promisify(fs.readFile);

async function readFile(filePath: string): Promise<string> {
    try {
        return await readFileAsync(filePath, 'utf-8');
    } catch (err) {
        console.error(err);
        // throw err; // 重新抛出错误或自定义处理
        return ''
    }
}


// 写入文件
function writeFile(filePath: string, content: string) {
    fs.writeFile(filePath, content, 'utf-8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('文件写入成功');
    });
}

export {readFile, writeFile};
