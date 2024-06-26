<script setup lang="ts">
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
      title="设置登录密码"
      width="400"
      :before-close="handleClose"
  >
    <el-form
        ref="ruleFormRef"
        :model="passForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
    >
      <el-form-item label="密码" prop="newPassword">
        <el-input v-model="passForm.newPassword" type="password" autocomplete="off" show-password/>
      </el-form-item>
      <el-form-item label="再次确认" prop="confirmPassword">
        <el-input v-model="passForm.confirmPassword" type="password" autocomplete="off" show-password/>
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