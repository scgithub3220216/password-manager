/**
 * 图片附件
 */
import {baseGetSql, baseInsertSql, baseListSql, baseUpdateSql} from "../components/baseSql.ts";

export const insertImage = async (...params: any[]) => {
    console.log(`insertImage params:${params}`)
    return await baseInsertSql(`INSERT INTO "pwd_image" (pwd_id, file_name, file_size, mime_type, data, sort_order)
                                VALUES (?, ?, ?, ?, ?, ?);`, ...params);
}

export const insertImageByImport = async (...params: any[]) => {
    console.log(`insertImageByImport params:${params}`)
    return await baseInsertSql(`INSERT INTO "pwd_image" (id, pwd_id, file_name, file_size, mime_type, data, sort_order, created_at)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, ...params);
}

export const deleteImage = async (id: number) => {
    console.log(`deleteImage id:${id}`)
    return await baseUpdateSql(`DELETE
                                FROM "pwd_image"
                                WHERE id = ?;`, id);
}

export const deleteImagesByPwdId = async (pwdId: number) => {
    console.log(`deleteImagesByPwdId pwdId:${pwdId}`)
    return await baseUpdateSql(`DELETE
                                FROM "pwd_image"
                                WHERE pwd_id = ?;`, pwdId);
}

export const deleteAllImages = async () => {
    console.log(`deleteAllImages`)
    return await baseUpdateSql(`DELETE
                                FROM "pwd_image";`);
}

export const listImageMeta = async (pwdId: number) => {
    console.log(`listImageMeta pwdId:${pwdId}`)
    if (!pwdId) return [];
    return await baseListSql(`SELECT id, pwd_id, file_name, file_size, mime_type, sort_order, created_at
                              FROM "pwd_image"
                              WHERE pwd_id = ?
                              ORDER BY sort_order, id;`, pwdId);
}

export const getImageData = async (id: number) => {
    console.log(`getImageData id:${id}`)
    return await baseGetSql(`SELECT data
                             FROM "pwd_image"
                             WHERE id = ?;`, id);
}

export const listAllImages = async () => {
    console.log(`listAllImages`)
    return await baseListSql(`SELECT *
                              FROM "pwd_image"
                              ORDER BY pwd_id, sort_order, id;`);
}

export const countImagesByPwdId = async (pwdId: number) => {
    console.log(`countImagesByPwdId pwdId:${pwdId}`)
    if (!pwdId) return 0;
    return await baseGetSql(`SELECT count(*) as count
                             FROM "pwd_image"
                             WHERE pwd_id = ?;`, pwdId);
}
