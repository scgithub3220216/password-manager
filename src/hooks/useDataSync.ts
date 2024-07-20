import useDBOss from "./useDBOss.ts";
import {onMounted, reactive, ref} from "vue";
import {OssForm, OssSyncObj, PwdInfo} from "../components/type.ts";
import {ElMessage, ElNotification} from "element-plus";
import {ossTypeAliYun} from "../config/config.ts";
import useDBGroup from "./useDBGroup.ts";
import useDBPwdInfo from "./useDBPwdInfo.ts";
import useDBConfig from "./useDBConfig.ts";
import {
    localVersionField,
    ossSyncAutoDownloadSwitch,
    ossSyncAutoUploadSwitch,
    ossSyncSwitch
} from "../../electron/db/sqlite/components/configConstants.ts";
import {useOssStore} from "../store/oss.ts";
import useOss from "./useOss.ts";

export default function () {
    const pwdListKey = "password"
    const ossVersionKey = "ossVersion";
    const ossStore = useOssStore()
    const {delAllGroup, insertOssGroup} = useDBGroup()
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

    async function syncToLocal() {
        if (await getSyncSwitch()) {
            return;
        }
        getConfigValue(ossSyncAutoDownloadSwitch).then(async (value) => {
            if (value && value === '1') {
                await downLoadOss()
            }
        })
    }

    async function manualSyncToLocal() {
        if (await getSyncSwitch()) {
            ElMessage.error('同步开关已关闭,请打开同步开关后重试');
            return;
        }
        if (await JudgeOssConfig()) {
            ElMessage.error('远程数据同步配置的参数不正确,请正确填写');
            return;
        }
        // 数据同步太快, 没必要用加载
        // const loadingInstance = ElLoading.service({ fullscreen: true })
        await downLoadOss().then(() => {
            ElMessage.success('数据拉取成功');
        })
        // .finally(()=>loadingInstance.close());
    }

    async function JudgeOssConfig() {
        const ossFrom: OssForm = await getOss(ossTypeAliYun)
        return judgeOssFromNotExists(ossFrom);
    }

    function judgeOssFromNotExists(ossFrom: OssForm) {
        return !ossFrom || !ossFrom.keyId || !ossFrom.key_secret || !ossFrom.bucket || !ossFrom.region;
    }


    async function downLoadOss() {
        if (!await judgeOssLoginFlag()) return;

        //  先获取 oss 的 version , 查看和本地是否一致
        let remoteVersion = await getRemoteVersion();
        let localVersion = await getConfigValue(String(localVersionField));
        console.log(`remoteVersion:${remoteVersion} ,  localVersion:${localVersion} `)
        if (!(remoteVersion && parseInt(localVersion) < remoteVersion)) {
            console.log(`remoteVersion:${remoteVersion} ,  localVersion:${localVersion} 版本一致, 无需更新 `)
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
                        insertOssGroup(group.id, group.title, group.father_id)
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
        setConfigValue(String(remoteVersion), localVersionField)
    }

    async function syncToOss() {
        let localVersion = parseInt(await getConfigValue(localVersionField));
        localVersion++;
        setConfigValue(String(localVersion), localVersionField)

        if (await getSyncSwitch()) {
            return;
        }
        let autoValue = await getConfigValue(ossSyncAutoUploadSwitch)
        if (!autoValue || autoValue !== '1') {
            return;
        }
        // 对比远程的版本号
        let remoteVersion = await getRemoteVersion();
        if (remoteVersion >= localVersion) {
            console.log(`远程版本:${remoteVersion} >= 本地版本:${localVersion}, 无需同步`)
            ElMessage.error('远程数据版本 >= 本地数据版本, 请先拉取远程数据再进行上传');
            return;
        }
        upload()
    }

    async function upload() {
        console.log('useDataSync.ts  upload')

        if (!await judgeOssLoginFlag()) return;

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
            let localVersion = await getConfigValue(localVersionField);
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

    async function manualSyncToOss() {

        updateLocalVersion().then(async () => {
            if (await getSyncSwitch()) {
                ElMessage.error('同步开关已关闭,请打开同步开关后重试');
                return;
            }
            if (await JudgeOssConfig()) {
                ElMessage.error('远程数据同步配置的参数不正确,请正确填写');
                return;
            }
            await upload().then(() => {
                ElMessage.success('数据同步成功');
            });
        })

    }

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
        if (judgeOssFromNotExists(ossFrom)) {
            // 应用进来时, 如果开启了自动配置, 报错只会显示在控制台
            console.error('远程数据同步配置的参数不正确,请正确填写')
            return false;
        }
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

    async function updateLocalVersion() {
        let localVersion = await getConfigValue(localVersionField);
        await setConfigValue(String(parseInt(localVersion) + 1), localVersionField)
    }

    async function getRemoteVersion() {
        let remoteVersion;
        try {
            let version = await getFile(ossVersionKey);
            if (!version) {
                version = '0';
            }
            remoteVersion = parseInt(version);
        } catch (e) {
            console.log('获取OSS远程版本失败 返回 0 ')
            remoteVersion = 0;
        }
        return remoteVersion;
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


    return {ruleFormRef, formRules, databaseForm, syncToOss, upload, manualSyncToOss, syncToLocal, manualSyncToLocal, getSyncSwitch, save, testCli};
}