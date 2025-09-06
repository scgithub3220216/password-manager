import {baseGetSql, baseUpdateSql} from "../components/baseSql.ts";
import {UpdateVersion} from "../../../../src/components/type.ts";


/**
 * update_version
 */

export const getSkipVersion = async (): Promise<UpdateVersion> => {
    console.log(`getSkipVersion `)
    return await baseGetSql(`SELECT skip_version
                             FROM "update_version";`);
}

export const updateSkipVersion = (skip_version: string) => {
    console.log(`updateSkipVersion skip_version:${skip_version}`)
    baseUpdateSql(`UPDATE "update_version"
                   SET skip_version = ?;`, skip_version);
}

export const getAutoCheckUpateSwitch = async (): Promise<UpdateVersion> => {
    console.log(`getAutoCheckUpateSwitch `)
    return await baseGetSql(`SELECT auto_check_switch
                             FROM "update_version";`);
}

export const updateAutoCheckSwitch = (auto_check_switch: string) => {
    console.log(`updateAutoSwitch auto_check_switch:${auto_check_switch}`)
    baseUpdateSql(`UPDATE "update_version"
                   SET auto_check_switch = ?;`, auto_check_switch);
}






