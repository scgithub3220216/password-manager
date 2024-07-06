// 链接数据库
import {getDB} from "./db.ts";
import {initFlag} from "./base-sql.ts";
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


// 初始化表结构

export const initTable = async () => {

// 连接到SQLite数据库
    const db = getDB()


    //  判断 config 表是否存在  如果存在, 不做任何操作  如果不存在, 创建表并且添加默认数据
    let flag = false;
    await initFlag().then((res) => {
        console.log('initFlag:', res)
        flag = res;
    })
    console.log('flag:', flag)
    if (flag) {
        return;
    }

    createTable(db);

}

function createTable(db: any) {
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

    console.log('表创建成功');
    insertData(db);
}

function insertData(db: any) {
    // config
    const configInserts = [
        {code: autoStart, value: autoStartValue},
        {code: pwd, value: defaultPwdValue},
        {code: firstLoginFlag, value: firstLoginFlagValue},
        {code: darkSwitch, value: darkSwitchValue},
        {code: autoLockTime, value: autoLockTimeValue},
        {code: autoLockTimeUnit, value: autoLockTimeUnitValue},
        // 更多数据...
    ];

    const configValues = configInserts.map(({code, value}) => `('${code}', '${value}')`).join(',');
    const configInsertSql = `INSERT INTO "config" ("code", "value")
                             VALUES ${configValues};`;
    // group

    const groupInsertSql = `INSERT INTO "group" ("id", "title", "father_id")
                            VALUES (1, '默认分组', 0);`;

    // pwdInfo
    const pwdInfoInsertSq = `INSERT INTO "pwd_info"
                                 ("id", "group_id", "group_title", "title", "username", "password", "link", "remark")
                             VALUES (1, 1, '默认分组', '默认百度账号标题', 'admin', '123456', 'https://www.baidu.com', '默认备注');`;

    try {
        db.exec(configInsertSql);
        db.exec(groupInsertSql);
        db.exec(pwdInfoInsertSq);
        console.log('批量插入成功');
    } catch (err) {
        console.error('批量插入时出错:', err);
    }
}