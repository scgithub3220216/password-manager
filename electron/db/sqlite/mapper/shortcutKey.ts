import {baseListSql, baseUpdateSql} from "../components/baseSql.ts";


/**
 * shortcutKey
 */
export const updateShortcutKey = async (...params: any[]) => {
    console.log(`updateShortcutKey params:${params}`)
    return await baseUpdateSql(`UPDATE "shortcut_key"
                                SET "desc" = ?
                                WHERE action_name = ?;`, ...params);
}

export const getShortcutKey = async (actionName: string) => {
    console.log(`getShortcutKey actionName:${actionName}`)
    return await baseListSql(`SELECT "desc"
                              FROM "shortcut_key"
                              WHERE action_name = ?;`, actionName);
}






