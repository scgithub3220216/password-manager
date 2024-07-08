import {baseGetSql, baseListSql, baseUpdateSql} from "../components/baseSql.ts";
import {ShortCutKeyComb} from "../../../../src/components/type.ts";


/**
 * shortcutKey
 */
export const updateShortcutKey = async (...params: any[]) => {
    console.log(`updateShortcutKey params:${params}`)
    return await baseUpdateSql(`UPDATE "shortcut_key"
                                SET "desc" = ?
                                WHERE action_name = ?;`, ...params);
}

export const getShortcutKey = async (actionName: string): Promise<ShortCutKeyComb> => {
    console.log(`getShortcutKey actionName:${actionName}`)
    return await baseGetSql(`SELECT "desc"
                             FROM "shortcut_key"
                             WHERE action_name = ?;`, actionName);
}
export const listShortcutKey = async (): Promise<ShortCutKeyComb[]> => {
    console.log(`listShortcutKey `)
    return await baseListSql(`SELECT *
                              FROM "shortcut_key";`);
}






