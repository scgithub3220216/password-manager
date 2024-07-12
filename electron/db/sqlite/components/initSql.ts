// 链接数据库
import {getDB} from "./db.ts";
import {initFlag} from "./baseSql.ts";
import {
    autoLockTime,
    autoLockTimeUnit,
    autoLockTimeUnitValue,
    autoLockTimeValue,
    autoStart,
    autoStartValue,
    darkSwitch,
    darkSwitchValue,
    defaultPwdValue,
    firstLoginFlag,
    firstLoginFlagValue,
    pwd
} from "./configConstants.ts";

let db: any;
// 初始化表结构

export const initTable = async () => {

    // 连接到SQLite数据库
    db = getDB()

    //  判断 config 表是否存在  如果存在, 不做任何操作  如果不存在, 创建表并且添加默认数据
    let flag = false;
    await initFlag().then((res) => {
        console.log('initTable initFlag:', res)
        flag = res;
    })
    console.log('initTable flag:', flag)
    if (flag) {
        return;
    }

    createTable();
}

function createTable() {
    // 创建  表
    db.exec(`
        CREATE TABLE IF NOT EXISTS "group"
        (
            "id"        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "title"     TEXT    NOT NULL,
            "father_id" INTEGER
        );
    `);
    db.exec(`
        CREATE TABLE IF NOT EXISTS "pwd_info"
        (
            "id"          integer NOT NULL PRIMARY KEY AUTOINCREMENT,
            "group_id"    integer NOT NULL,
            "group_title" TEXT,
            "title"       TEXT,
            "username"    TEXT,
            "password"    TEXT,
            "link"        TEXT,
            "remark"      TEXT
        );
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS "config"
        (
            "id"    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "code"  TEXT    NOT NULL,
            "value" TEXT,
            CONSTRAINT "uni_code" UNIQUE ("code")
        );
    `);
    db.exec(`
        CREATE TABLE IF NOT EXISTS "shortcut_key"
        (
            "id"          integer NOT NULL PRIMARY KEY AUTOINCREMENT,
            "action_name" TEXT    NOT NULL,
            "desc"        TEXT
        );
    `);
    db.exec(`
        CREATE TABLE IF NOT EXISTS "oss"
        (
            "id"         INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "type"       TEXT NOT NULL,
            "region"     TEXT,
            "keyId"      TEXT,
            "key_secret" TEXT,
            "bucket"     TEXT
        );
    `);

    console.log('表创建成功');

    insertData();
}

function insertData() {
    try {
        insertConfigData()
        insertShortcutKeyData()
        insertGroupData()
        insertPwdInfoData()
        insertOssData();
        console.log('批量插入成功');
    } catch (err) {
        console.error('批量插入时出错:', err);
    }
}

function insertOssData() {
    const ossArr: string[] = [
        `INSERT INTO "oss" ("id", "type", "region", "keyId", "key_secret", "bucket")
         VALUES (1, 'oss', NULL, NULL, NULL, NULL);`,
        `INSERT INTO "oss" ("id", "type", "region", "keyId", "key_secret", "bucket")
         VALUES (2, 'cos', NULL, NULL, NULL, NULL);`
    ]
    ossArr.forEach(oss => db.exec(oss));
}

function insertConfigData() {
    // config
    const configInserts = [
        {code: autoStart, value: autoStartValue},
        {code: pwd, value: defaultPwdValue},
        {code: firstLoginFlag, value: firstLoginFlagValue},
        {code: darkSwitch, value: darkSwitchValue},
        {code: autoLockTime, value: autoLockTimeValue},
        {code: autoLockTimeUnit, value: autoLockTimeUnitValue},
    ];

    const configValues = configInserts.map(({code, value}) => `('${code}', '${value}')`).join(',');
    const configInsertSql = `INSERT INTO "config" ("code", "value")
                             VALUES ${configValues};`;
    db.exec(configInsertSql);
}

function insertShortcutKeyData() {
    // shortcutKey
    const shortcutKeyArr: string[] = [
        `INSERT INTO "shortcut_key" ("id", "action_name", "desc")
         VALUES (1, 'openMainWindows', 'Ctrl + Alt + E');`,
        `INSERT INTO "shortcut_key" ("id", "action_name", "desc")
         VALUES (2, 'logout', 'Escape');`,
        `INSERT INTO "shortcut_key" ("id", "action_name", "desc")
         VALUES (3, 'copyUsername', 'Ctrl + U');`,
        `INSERT INTO "shortcut_key" ("id", "action_name", "desc")
         VALUES (4, 'copyPwd', 'Ctrl + P');`,
        `INSERT INTO "shortcut_key" ("id", "action_name", "desc")
         VALUES (5, 'copyLink', 'Ctrl + L');`,
        `INSERT INTO "shortcut_key" ("id", "action_name", "desc")
         VALUES (6, 'insertGroup', 'Ctrl + G');`,
        `INSERT INTO "shortcut_key" ("id", "action_name", "desc")
         VALUES (7, 'insertPwdInfo', 'Ctrl + N');`]
    shortcutKeyArr.forEach(shortcutKey => db.exec(shortcutKey));
}

function insertGroupData() {
    // group
    const groupInsertSql = `INSERT INTO "group" ("id", "title", "father_id")
                            VALUES (1, '默认分组', 0);`;
    db.exec(groupInsertSql);

}

function insertPwdInfoData() {
    // pwdInfo
    const pwdInfoInsertSq = `INSERT INTO "pwd_info"
                                 ("id", "group_id", "group_title", "title", "username", "password", "link", "remark")
                             VALUES (1, 1, '默认分组', '默认百度账号标题', 'admin', 'pRJdfNVvRY39WLCxte2Auw==', 'https://www.baidu.com',
                                     '默认备注');`;
    db.exec(pwdInfoInsertSq);
}