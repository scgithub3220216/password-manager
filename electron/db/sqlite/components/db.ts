import {createRequire} from "node:module";
import {app} from "electron";
import path from "node:path";

const require = createRequire(import.meta.url)

const Database = require('better-sqlite3')


const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'myDatabase.db');
console.log(`dbPath:${dbPath}`)

let db: Database.Database | null = null;

export const getDB = (): Database.Database => {
    if (db) {
        return db;
    }
    // { verbose: console.log }  这意味着当数据库执行查询或其他操作时，所有的SQL日志和警告信息都将通过console.log打印出来
    db = new Database(dbPath, {verbose: console.log});
    return db;
}

export const closeDB = () => {
    if (db) {
        db.close();
    }
    db = null;
}