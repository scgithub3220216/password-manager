import {baseGetSql, baseUpdateSql} from "../components/baseSql.ts";
import {Config} from "../../../../src/components/type.ts";


/**
 * config
 */
export const updateConfig = (...params: any[]) => {
    console.log(`updateConfig params:${params}`)
    baseUpdateSql(`UPDATE "config"
                   SET value = ?
                   WHERE code = ?;`, ...params);
}

export const getConfig = async (code: string): Promise<Config> => {
    console.log(`getConfig code:${code}`)
    return await baseGetSql(`SELECT value
                             FROM "config"
                             WHERE code = ?;`, code);
}






