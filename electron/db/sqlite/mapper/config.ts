import {baseListSql, baseUpdateSql} from "../components/baseSql.ts";


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






