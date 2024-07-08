/**
 * 密码
 */
import {baseGetSql, baseInsertSql, baseListSql, baseUpdateSql} from "../components/baseSql.ts";

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
    if (groupId) {
        return await baseListSql(`SELECT *
                                  FROM "pwd_info"
                                  WHERE group_id = ?;`, groupId);
    } else {
        return await baseListSql(`SELECT *
                                  FROM "pwd_info"`);
    }
}
export const getPwdInfo = async (id: number) => {
    console.log(`getPwdInfo id:${id}`)
    return await baseGetSql(`SELECT *
                             FROM "pwd_info"
                             WHERE id = ?;`, id);
}
