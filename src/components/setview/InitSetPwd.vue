<script lang="ts" setup>
import usePwd from "../../hooks/usePwd.ts";

const {handleClose, loginSubmitForm, pwdDialogVisible, passForm, ruleFormRef, rules} = usePwd()
// 暴露方法给父组件
defineExpose({
  pwdDialogVisible
})

</script>

<template>
  <el-dialog
      v-model="pwdDialogVisible"
      :before-close="handleClose"
      title="设置登录密码"
      width="400"
  >
    <el-form
        ref="ruleFormRef"
        :model="passForm"
        :rules="rules"
        class="demo-ruleForm"
        label-width="auto"
        status-icon
    >
      <el-form-item label="密码" prop="newPassword">
        <el-input v-model="passForm.newPassword" autocomplete="off" show-password type="password"/>
      </el-form-item>
      <el-form-item label="再次确认" prop="confirmPassword">
        <el-input v-model="passForm.confirmPassword" autocomplete="off" show-password type="password" @keyup.enter="loginSubmitForm(ruleFormRef)"/>
      </el-form-item>
      <el-form-item>
        <div style="width:100%;display: flex;justify-content:flex-end">
          <el-button type="primary" @click="loginSubmitForm(ruleFormRef)">
            确认
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>

</style>