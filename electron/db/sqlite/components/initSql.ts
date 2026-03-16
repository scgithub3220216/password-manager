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
    localVersionField,
    ossSyncAutoDownloadSwitch,
    ossSyncAutoUploadSwitch,
    ossSyncSwitch,
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
    // 检查 版本表是否存在,不存在创建
    createVersionTable()
    // 检查 图片表是否存在,不存在创建
    createImageTable()
    if (flag) {
        return;
    }


    createTable();
}

function createTable()
{
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
            "type"       TEXT    NOT NULL,
            "region"     TEXT,
            "keyId"      TEXT,
            "key_secret" TEXT,
            "bucket"     TEXT
        );
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS "pwd_image"
        (
            "id"         INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "pwd_id"     INTEGER NOT NULL,
            "file_name"  TEXT    NOT NULL,
            "file_size"  INTEGER NOT NULL,
            "mime_type"  TEXT    NOT NULL,
            "data"       TEXT    NOT NULL,
            "sort_order" INTEGER DEFAULT 0,
            "created_at" TEXT    DEFAULT (datetime('now','localtime'))
        );
    `);
    db.exec(`CREATE INDEX IF NOT EXISTS "idx_pwd_image_pwd_id" ON "pwd_image" ("pwd_id");`);

    console.log('表创建成功');

    insertData();
}

async function createVersionTable() {
// 判断表是否存在

    const stmt = db.prepare("SELECT COUNT(*) as 'count' FROM sqlite_master WHERE type = 'table' AND name = 'update_version'");
    const count = await stmt.get().count;
    if(count>0){
        return;
    }
    console.log(`count:${count},create update_version and insert data`)

    db.exec(`
        CREATE TABLE IF NOT EXISTS "update_version"
        (
            "id"                INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "skip_version"      TEXT    NOT NULL,
            "auto_check_switch" TEXT,
            "auto_switch"       TEXT,
            "remark"            TEXT
        );
    `);
    insertUpdateVersion()
    console.log('createVersionTable 表创建成功');
}

async function createImageTable() {
    const stmt = db.prepare("SELECT COUNT(*) as 'count' FROM sqlite_master WHERE type = 'table' AND name = 'pwd_image'");
    const count = await stmt.get().count;
    if (count > 0) {
        return;
    }
    console.log(`count:${count},create pwd_image table`)

    db.exec(`
        CREATE TABLE IF NOT EXISTS "pwd_image"
        (
            "id"         INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "pwd_id"     INTEGER NOT NULL,
            "file_name"  TEXT    NOT NULL,
            "file_size"  INTEGER NOT NULL,
            "mime_type"  TEXT    NOT NULL,
            "data"       TEXT    NOT NULL,
            "sort_order" INTEGER DEFAULT 0,
            "created_at" TEXT    DEFAULT (datetime('now','localtime'))
        );
    `);
    db.exec(`CREATE INDEX IF NOT EXISTS "idx_pwd_image_pwd_id" ON "pwd_image" ("pwd_id");`);
    console.log('createImageTable 表创建成功');
}

function insertData() {
    try {
        insertConfigData()
        insertShortcutKeyData()
        insertGroupData()
        insertPwdInfoData()
        insertOssData();
        insertUpdateVersion();
        console.log('批量插入成功');
    } catch (err) {
        console.error('批量插入时出错:', err);
    }
}
function insertUpdateVersion() {
    const updateVersionArr: string[] = [
        `INSERT INTO "update_version" ("id", "skip_version", "auto_check_switch", "auto_switch", "remark")
         VALUES (1, '', '0', '0',  '');`
    ]
    updateVersionArr.forEach(obj => db.exec(obj));
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
        {code: localVersionField, value: 1},
        {code: ossSyncSwitch, value: 0},
        {code: ossSyncAutoUploadSwitch, value: 1},
        {code: ossSyncAutoDownloadSwitch, value: 1},
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
         VALUES (7, 'insertPwdInfo', 'Ctrl + N');`,
        `INSERT INTO "shortcut_key" ("id", "action_name", "desc")
         VALUES (8, 'syncLocalToOss', 'Ctrl + Shift + K');`,
        `INSERT INTO "shortcut_key" ("id", "action_name", "desc")
         VALUES (9, 'syncOssToLocal', 'F5');`]
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