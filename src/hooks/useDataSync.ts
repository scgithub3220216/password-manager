import useDBOss from "./useDBOss.ts";
import {onMounted, reactive, ref} from "vue";
import {Oss, OssSyncObj, PwdInfo} from "../components/type.ts";
import {ElMessage, ElNotification} from "element-plus";
import {login, putFile} from "../oss";
import {ossTypeAliYun} from "../config/config.ts";
import useDBGroup from "./useDBGroup.ts";
import useDBPwdInfo from "./useDBPwdInfo.ts";

export default function () {
    const key = "password"

    // database 配置
    const databaseForm = reactive<Oss>({})
    const {updateOss, getOss} = useDBOss()
    const {listGroup} = useDBGroup()
    const {listPwdInfo} = useDBPwdInfo()

    onMounted(async () => {
        // todo 获取到配置 用哪个
        const ossAliYun = await getOss(ossTypeAliYun);
        Object.assign(databaseForm, ossAliYun);
        console.log('useDataSync.ts 挂载完毕')
    })

    // 把数据库的数据同步到 oss
    async function syncToOss() {
        // 1. 读取配置文件

        // 1. 修改操作就上传
        // 2. 定时上传
        //      判断 lastUpdateTime 和 lastUploadTime 相差是否超过 5s以内
        //          在: 跳过
        //          不在:上传
        const groupList = await listGroup();
        const pwdInfoList: PwdInfo[] = [];
        if (!groupList) return;
        for (const group of groupList) {
            pwdInfoList.concat(await listPwdInfo(group.id));
        }
        let syncOjb: OssSyncObj = {
            groupList: groupList,
            pwdInfoList: pwdInfoList,
        }
        putFile(key, JSON.stringify(syncOjb)).then(() => {
            ElMessage.success('同步成功')
        }).catch((err: any) => {
            ElMessage.error('同步失败')
            console.error(err)
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


    return {ruleFormRef, formRules, databaseForm, syncToOss,save, testCli};
}