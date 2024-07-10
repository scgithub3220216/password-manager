import {baseGetSql, baseInsertSql, baseListSql, baseUpdateSql} from "../components/baseSql.ts";

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
    console.log(`listGroup`)
    return await baseListSql(`SELECT *
                              FROM "group";`);
}

export const getIdByTitle = async (title: string) => {
    console.log(`listGroup`)
    return await baseGetSql(`SELECT id
                             FROM "group"
                             WHERE title = ?;`, title);
}
