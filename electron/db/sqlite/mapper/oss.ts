import {baseGetSql, baseUpdateSql} from "../components/baseSql.ts";
import {OssForm} from "../../../../src/components/type.ts";


/**
 * config
 */
export const updateOss = (...params: any[]) => {
    console.log(`updateOss params:${params}`)
    baseUpdateSql(`UPDATE "oss"
                   SET region     = ?,
                       keyId      = ?,
                       key_secret = ?,
                       bucket     = ?
                   WHERE type = ?;`, ...params);
}

export const getOss = async (type: string): Promise<OssForm> => {
    console.log(`getOss type:${type}`)
    return await baseGetSql(`SELECT *
                             FROM "oss"
                             WHERE type = ?;`, type);
}






