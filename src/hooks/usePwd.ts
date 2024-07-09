import {reactive, ref} from 'vue'
import {ElMessage, ElMessageBox, FormInstance, FormRules} from 'element-plus'
import {setPwdMsgTipsStr} from "../config/config.ts";
import {InternalRuleItem} from "async-validator/dist-types/interface";
import useConfig from "./useDBConfig.ts";
import {firstLoginFlag, pwd} from "../../electron/db/sqlite/components/configConstants.ts";
import useCrypto from "./useCrypto.ts";

export default function () {

    const {sha512HexHash} = useCrypto()
    const pwdDialogVisible = ref(false)
    const {getConfigValue, setConfigValue} = useConfig()
    const ruleFormRef = ref<FormInstance>()
    const passForm = reactive({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    })


    const loginSubmitForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.validate((valid) => {
            if (valid) {
                console.log('submit!')
                setConfigValue(sha512HexHash((passForm.confirmPassword)), pwd)
                setConfigValue('0', firstLoginFlag)

                pwdDialogVisible.value = false
            } else {
                console.log('error submit!')
            }
        })
    }
    // @ts-ignore
    const validatePass = (rule: InternalRuleItem, value: string, callback: any) => {
        if (value === '') {
            callback(new Error('请输入密码'))
        } else {
            if (value.length < 6) {
                callback(new Error('密码长度不能小于6位'))
            }
            if (passForm.confirmPassword !== '') {
                if (!ruleFormRef.value) return
                ruleFormRef.value.validateField('confirmPassword', () => {
                })

            }
            callback()
        }
    }
    // @ts-ignore
    const validatePass2 = (rule: InternalRuleItem, value: string, callback: any) => {
        if (value === '') {
            callback(new Error('请再次输入密码'))
        } else if (value.length < 6) {
            callback(new Error('密码长度不能小于6位'))
        } else if (value !== passForm.newPassword) {
            callback(new Error("两次输入不一致!"))
        } else {
            callback()
        }
    }


    const rules = reactive<FormRules<typeof passForm>>({
        // oldPassword: [{validator: validatePass, trigger: 'blur'}],
        newPassword: [{validator: validatePass, trigger: 'blur'}],
        confirmPassword: [{validator: validatePass2, trigger: 'blur'}],
    })

    const submitForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return

        formEl.validate(async (valid) => {
            if (valid) {
                console.log('submit!')
                let oldValue = await getConfigValue(pwd);
                if (oldValue !== sha512HexHash((passForm.oldPassword))) {
                    ElMessage.error('旧密码错误');
                    return;
                }
                setConfigValue(sha512HexHash((passForm.confirmPassword)), pwd)
                ElMessage.success('密码修改成功');
                resetForm(formEl)
            } else {
                console.log('error submit!')
                // return false
            }
        })
    }


    const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.resetFields()
    }


    function pwdError() {
        let element = document.getElementById('myElement');
        if (!element) {
            return;
        }
        // 存储原始背景颜色
        let originalColor = element.style.backgroundColor;

        // 设置新的背景色触发过渡效果
        element.style.backgroundColor = '#ea918b';

        // 过渡完成后恢复原背景色
        setTimeout(function () {
            element.style.backgroundColor = originalColor;
        }, 1000);
    }

    const handleClose = (done: () => void) => {
        ElMessageBox.confirm('你确定要离开设置初始密码吗?',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                draggable: true,
                customStyle: {
                    width: '350px'
                }
            })
            .then(() => {
                // 修改 firstLogin
                setConfigValue('0', firstLoginFlag)

                done()
                ElMessageBox.alert('初始密码为 123456', {
                    confirmButtonText: '确认'
                })
            })
            .catch(() => {
                // catch error
            })
    }

    const setPwdMsgTips = () => {
        ElMessageBox.alert(setPwdMsgTipsStr, {
            confirmButtonText: '确认',
            dangerouslyUseHTMLString: true,
            draggable: true,
            customClass: 'msg-tips',
        })
    }

    return {
        setPwdMsgTips,
        handleClose,
        pwdError,
        loginSubmitForm,
        pwdDialogVisible,
        passForm,
        ruleFormRef,
        validatePass,
        validatePass2,
        rules,
        submitForm,
        resetForm
    }
}