import {baseGetSql, baseInsertSql, baseListSql, baseUpdateSql} from "./base-sql.ts";


/**
 * config
 */
export const updateConfig = async (...params: any[]) => {
    console.log(`updateConfig params:${params}`)
    return await baseUpdateSql(`UPDATE "config"
                                SET value = ?
                                WHERE code = ?;`, ...params);
}

export const getConfig = async (code: string) => {
    console.log(`getConfig code:${code}`)
    return await baseListSql(`SELECT value
                              FROM "config"
                              WHERE code = ?;`, code);
}

/**
 * 分组
 */

export const insertGroup = async (...params: any[]) => {
    console.log(`insertGroup params:${params}`)
    return await baseInsertSql(`INSERT INTO "group" (title, father_id)
                                VALUES (?, ?);`, ...params);
}

export const delGroup = async (params: number) => {
    console.log(`delGroup params:${params}`)
    return await baseUpdateSql(`DELETE
                                FROM "group"
                                WHERE id = ?;`, params);

}

export const updateGroup = async (...params: any[]) => {
    console.log(`updateConfig params:${params}`)
    return await baseUpdateSql(`UPDATE "group"
                                SET title = ?
                                WHERE id = ?;`, ...params);
}

export const listGroup = async () => {
    console.log(`listGroup `)
    return await baseListSql(`SELECT *
                              FROM "group";`);
}


/**
 * 密码
 */

export const insertPwdInfo = async (...params: any[]) => {
    console.log(`insertPwdInfo params:${params}`)
    return await baseInsertSql(`INSERT INTO "pwd_info" (group_id, group_title)
                                VALUES (?, ?);`, ...params);
}

export const delPwdInfo = async (id: number) => {
    console.log(`delPwdInfo id:${id}`)
    return await baseUpdateSql(`DELETE
                                FROM "pwd_info"
                                WHERE id = ?;`, id);

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
                                    remark      = ?
                                WHERE id = ?;`, ...params);
}

export const listPwdInfo = async (groupId: number) => {
    console.log(`listPwdInfo groupId:${groupId}`)
    return await baseListSql(`SELECT *
                              FROM "pwd_info"
                              WHERE group_id = ?;`, groupId);
}
export const getPwdInfo = async (id: number) => {
    console.log(`getPwdInfo id:${id}`)
    return await baseGetSql(`SELECT *
                              FROM "pwd_info"
                              WHERE id = ?;`, id);
}


