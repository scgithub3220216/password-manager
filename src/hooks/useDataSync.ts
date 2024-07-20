import useDBOss from "./useDBOss.ts";
import {onMounted, reactive, ref} from "vue";
import {OssForm, OssSyncObj, PwdInfo} from "../components/type.ts";
import {ElMessage, ElNotification} from "element-plus";
import {ossTypeAliYun} from "../config/config.ts";
import useDBGroup from "./useDBGroup.ts";
import useDBPwdInfo from "./useDBPwdInfo.ts";
import useDBConfig from "./useDBConfig.ts";
import {ossSyncSwitch, ossVersion} from "../../electron/db/sqlite/components/configConstants.ts";
import {useOssStore} from "../store/oss.ts";
import useOss from "./useOss.ts";

export default function () {
    const pwdListKey = "password"
    const ossVersionKey = "ossVersion";
    const ossStore = useOssStore()
    const {delAllGroup, insertGroup} = useDBGroup()
    const {delAllPwdInfo, insertPwdInfoByImport} = useDBPwdInfo()

    // @ts-ignore database 配置
    const databaseForm = reactive<OssForm>({})
    const {updateOss, getOss} = useDBOss()
    const {listGroup} = useDBGroup()
    const {listPwdInfo} = useDBPwdInfo()
    const {getConfigValue, setConfigValue} = useDBConfig()
    const {login, getFile, putFile} = useOss()

    onMounted(async () => {
        const ossAliYun = await getOss(ossTypeAliYun);
        Object.assign(databaseForm, ossAliYun);
        console.log('useDataSync.ts 挂载完毕')
    })

    async function getSyncSwitch() {
        let ossSyncSwitchValue = await getConfigValue(ossSyncSwitch);
        if (!parseInt(ossSyncSwitchValue)) {
            console.log('同步开关 关闭,退出')
            return true;
        }
        return false
    }

    async function judgeOssLoginFlag() {
        let client = ossStore.getClient()
        if (client) return true;

        const ossFrom: OssForm = await getOss(ossTypeAliYun)
        if (!ossFrom || !ossFrom.key_secret) return false;
        // @ts-ignore
        return await login(ossFrom).then((client) => {
            console.log('登录成功！');
            return true;
            // 这里可以使用client进行后续操作
        }).catch((error) => {
            console.error('登录失败:', error);
            return false;
        });
    }


    async function syncToLocal() {
        console.log('syncToLocal')
        if (await getSyncSwitch()) return;
        if (!await judgeOssLoginFlag()) return;

        //  先获取 oss 的 version , 查看和本地是否一致
        if (!await syncToLocalJudge()) {
            console.log('syncToLocal 版本一致, 无序更新 ')
            return;
        }

        // 不一致, 获取 oss 数据
        getFile(pwdListKey).then((json) => {
            console.log('syncToLocal json', json)
            // 如果没值, 忽略
            if (!json) {
                return;
            }
            // 先进行解析
            const ossSyncObj: OssSyncObj = JSON.parse(json);

            // 判断是否有值
            if (ossSyncObj.groupList && ossSyncObj.groupList.length > 0) {
                // 插入  先删除 再新增
                delAllGroup().then(() => {
                    ossSyncObj.groupList.forEach((group) => {
                        insertGroup(group.title, group.father_id)
                    })
                })
            }

            if (ossSyncObj.pwdInfoList && ossSyncObj.pwdInfoList.length > 0) {
                // 插入  先删除 再新增
                delAllPwdInfo().then(() => {
                    ossSyncObj.pwdInfoList.forEach((pwdInfo) => {
                        insertPwdInfoByImport(pwdInfo)
                    })
                })
            }

        })
    }

    // 把数据库的数据同步到 oss
    async function syncToOss() {
        let localVersion = await getConfigValue(ossVersion);
        await setConfigValue(String(parseInt(localVersion) + 1), ossVersion)

        if (!await judgeOssLoginFlag()) return;

        if (await getSyncSwitch()) return;

        upload()
    }

    async function syncToLocalJudge() {
        let remoteVersion = await getFile(ossVersionKey);
        let localVersion = await getConfigValue(String(ossVersion));
        console.log(`remoteVersion:${remoteVersion} ,  localVersion:${localVersion} `)
        if (remoteVersion && parseInt(localVersion) < parseInt(remoteVersion)) {
            console.log(`remoteVersion:${remoteVersion} ,  localVersion:${localVersion} :需同步`)
            return true;
        }
        return false;
    }

    async function upload() {
        console.log('useDataSync.ts  upload')
        const groupList = await listGroup();
        let pwdInfoList: PwdInfo[] = [];
        if (!groupList) return;
        for (const group of groupList) {
            let items = await listPwdInfo(group.id);
            pwdInfoList = pwdInfoList.concat(items);
        }
        let syncOjb: OssSyncObj = {
            groupList: groupList,
            pwdInfoList: pwdInfoList,
        }
        putFile(pwdListKey, JSON.stringify(syncOjb)).then(async () => {
            // ElMessage.success('同步成功')
            let localVersion = await getConfigValue(ossVersion);
            putFile(ossVersionKey, localVersion)
                .then()
                .catch((err: any) => {
                    ElMessage.error('上传失败')
                    console.error('上传版本号失败:', err)
                })
        }).catch((err: any) => {
            ElMessage.error('上传失败')
            console.error('上传数据失败:', err)
        })
    }


// 登录表单规则校验
    const ruleFormRef = ref()

// 表单校验规则
    const formRules = reactive({
        region: [
            {required: true, message: '请输入region', trigger: 'blur'}
        ],
        keyId: [
            {required: true, message: '请输入accessKeyId', trigger: 'blur'}
        ],
        key_secret: [
            {required: true, message: '请输入accessKeySecret', trigger: 'blur'}
        ],
        bucket: [
            {required: true, message: '请输入bucket', trigger: 'blur'}
        ]
    })

    async function save() {
        console.log('save');
        await updateOss(databaseForm).then(() => {
            ElMessage.success('保存成功')
        }).catch(e => {
            console.error(`保存失败:${e}`)
            ElMessage.success('保存失败:')
        })
    }

// 测试连接
    const testCli = async (ruleFormRef: any) => {
        console.log('testCli')
        await ruleFormRef.validate((valid: any) => {
            if (!valid) {
                return
            }

            // 登录数据库
            login(databaseForm).then(() => {
                ElMessage.success('连接成功')
            }).catch((err: any) => {
                loginFail(err)
            })
        })
    }

    const loginFail = (err: any) => {
        console.error(err)
        let message;
        if (err.code === 'RequestError') {
            message = '请检查：桶名称、跨域设置、region配置'
        } else if (err.code === 'InvalidAccessKeyId') {
            message = 'keyId错误'
        } else if (err.code === 'SignatureDoesNotMatch') {
            message = 'keySecret错误'
        } else if (err.code === 'AccessDenied') {
            message = '用户没有访问存储桶权限'
        } else {
            message = err.code
        }
        // 提示失败原因
        ElNotification({
            type: 'error',
            title: '连接失败',
            message: message,
        })
    }


    return {ruleFormRef, formRules, databaseForm, syncToOss, upload, syncToLocal, save, testCli};
}