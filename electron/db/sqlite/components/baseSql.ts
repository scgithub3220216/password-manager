import {getDB} from "./db.ts";

// @link https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#transactionfunction---function
/**
 * 基础 sql
 * @param sql
 * @param params
 */
export const baseListSql = async (sql: string, ...params: any[]) => {
    if (!sql) return;

    try {
        const db = await getDB();
        const select = db.prepare(sql);
        return select.all(...params);
    } catch (e) {
        console.error('查询 操作 失败:', e)
        return null;
    }
}
export const baseGetSql = async (sql: string, ...params: any[]) => {
    if (!sql) return;

    try {
        const db = await getDB();
        const select = db.prepare(sql);
        return await select.get(...params);
    } catch (e) {
        console.error('查询 操作 失败:', e)
        return null;
    }
}


export const baseInsertSql = async (sql: string, ...params: any[]) => {
    if (!sql) return;
    console.log(`sql:${sql}`)
    try {
        const db = await getDB();
        const stmt = db.prepare(sql);
        const result = await stmt.run(...params);
        // 获取并打印最后插入的行ID
        return result.lastInsertRowid;
    } catch (e) {
        console.error('新增 操作 失败:', e)
        return 0;
    }

}


/**
 * transaction 用法
 * const insert = db.prepare('INSERT INTO cats (name, age) VALUES (@name, @age)');
 *
 * const insertMany = db.transaction((cats) => {
 *   for (const cat of cats) insert.run(cat);
 * });
 *
 * insertMany([
 *   { name: 'Joey', age: 2 },
 *   { name: 'Sally', age: 4 },
 *   { name: 'Junior', age: 1 },
 * ]);
 */

export const baseUpdateSql = async (sql: string, ...params: any[]) => {
    console.log(`baseUpdateSql sql: ${sql}, params:${params}`,)
    if (!sql) return;

    try {
        const db = await getDB();
        const stmt = db.prepare(sql);
        await stmt.run(...params);

    } catch (e) {
        console.error('修改 操作 失败:', e)
        return 0;
    }
    return 1;
}

export const initFlag = async () => {
    const db = await getDB();
    const stmt = db.prepare("SELECT COUNT(*) as 'count' FROM sqlite_master WHERE type = 'table' AND name = 'config'");
    return await stmt.get().count
}