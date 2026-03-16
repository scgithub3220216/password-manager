/**
 * 密码
 */
import {baseGetSql, baseInsertSql, baseListSql, baseUpdateSql} from "../components/baseSql.ts";

export const insertPwdInfo = async (...params: any[]) => {
    console.log(`insertPwdInfo params:${params}`)
    return await baseInsertSql(`INSERT INTO "pwd_info" (group_id, group_title, type)
                                VALUES (?, ?, ?);`, ...params);
}

export const insertPwdInfoByImport = async (...params: any[]) => {
    console.log(`insertPwdInfo params:${params}`)
    return await baseInsertSql(`INSERT INTO "pwd_info" (id, group_id, group_title, title, username, password, link, remark, type)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`, ...params);
}

export const delPwdInfo = async (id: number) => {
    console.log(`delPwdInfo id:${id}`)
    return await baseUpdateSql(`DELETE
                                FROM "pwd_info"
                                WHERE id = ?;`, id);
}
export const delPwdInfoByGroupId = async (groupId: number) => {
    console.log(`delPwdInfoByGroupId id:${groupId}`)
    return await baseUpdateSql(`DELETE
                                FROM "pwd_info"
                                WHERE group_id = ?;`, groupId);
}

export const delAllPwdInfo = async () => {
    console.log(`delAllPwdInfo`)
    return await baseUpdateSql(`DELETE
                                FROM "pwd_info";`);
}

export const updatePwdInfo = async (...params: any[]) => {
    console.log(`updatePwdInfo params:${params}`)
    return await baseUpdateSql(`UPDATE "pwd_info"
                                SET group_id    = ?,
                                    group_title = ?,
                                    title       = ?,
                                    username    = ?,
                                    password    = ?,
                                    link        = ?,
                                    remark      = ?,
                                    type        = ?
                                WHERE id = ?;`, ...params);
}

export const listPwdInfo = async (groupId: number) => {
    console.log(`listPwdInfo groupId:${groupId}`)
    if (groupId) {
        return await baseListSql(`SELECT *
                                  FROM "pwd_info"
                                  WHERE group_id = ?;`, groupId);
    } else {
        return await baseListSql(`SELECT *
                                  FROM "pwd_info"`);
    }
}

export const listPwdInfoBySearch = async (searchValue: string) => {
    console.log(`listPwdInfo queryValue:${searchValue}`)
    if (!searchValue) return [];
    return await baseListSql(`SELECT *
                              FROM "pwd_info"
                              WHERE title like '%' || ? || '%'
                                        or username like '%' || ? || '%';`, searchValue, searchValue);
}

export const listPwdInfoByIds = async (ids: number[]) => {
    console.log(`listPwdInfo listPwdInfoByIds:${ids}`)
    if (ids.length <=0) return [];
    // 过滤无效的ID值
    const validIds = ids.filter(id => typeof id === 'number' && !isNaN(id) && id > 0);
    if (validIds.length === 0) return [];

    // 构建参数化查询
    const placeholders = validIds.map(() => '?').join(',');
    const sql = `SELECT * FROM "pwd_info" WHERE id IN (${placeholders})`;

    return await baseListSql(sql, ...validIds);
}

export const countPwdInfo = async (groupId: string) => {
    console.log(`listPwdInfo countPwdInfo:${groupId}`)
    if (!groupId) return 0;
    return await baseGetSql(`SELECT count(*) as count
                              FROM "pwd_info"
                              WHERE group_id = ?;`, groupId);
}


export const getPwdInfo = async (id: number) => {
    console.log(`getPwdInfo id:${id}`)
    return await baseGetSql(`SELECT *
                             FROM "pwd_info"
                             WHERE id = ?;`, id);
}
