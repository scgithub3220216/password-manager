import {reactive, ref} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus'
import {userDataInfoStore} from "../store/userDataInfo.ts";

export default function () {

    const userInfoStore = userDataInfoStore();
    const pwdDialogVisible = ref(false)

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
                userInfoStore.setInitPwd(passForm.newPassword)
                pwdDialogVisible.value = false
            } else {
                console.log('error submit!')
            }
        })
    }

    const validatePass = (rule: any, value: string, callback: any) => {
        if (value === '') {
            callback(new Error('请输入密码'))
        } else {
            if (value.length < 6) {
                callback(new Error('密码长度不能小于6位'))
            }
            if (passForm.confirmPassword !== '') {
                if (!ruleFormRef.value) return
                ruleFormRef.value.validateField('confirmPassword', () => null)
            }
            callback()
        }
    }
    const validatePass2 = (rule: any, value: string, callback: any) => {
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
        formEl.validate((valid) => {
            if (valid) {
                console.log('submit!')
                if (!userInfoStore.setPwd(passForm.oldPassword, passForm.confirmPassword)) {
                    ElMessage.error('密码修改失败');
                } else {
                    ElMessage.success('密码修改成功');
                    resetForm(formEl)
                }
            } else {
                console.log('error submit!')
                return false
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

    return {pwdError, loginSubmitForm, pwdDialogVisible, passForm, ruleFormRef, validatePass, validatePass2, rules, submitForm, resetForm}
}