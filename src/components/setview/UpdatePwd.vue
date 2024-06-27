<template>
  <el-form
      ref="ruleFormRef"
      :model="passForm"
      status-icon
      :rules="rules"
      label-width="auto"
      label-position="left"
      class="demo-ruleForm"
  >
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="passForm.oldPassword" type="password" autocomplete="off" show-password/>
    </el-form-item>

    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="passForm.newPassword" type="password" autocomplete="off" show-password/>
    </el-form-item>
    <el-form-item label="再次确认" prop="confirmPassword">
      <el-input v-model="passForm.confirmPassword" type="password" autocomplete="off" @keyup.enter="submitForm(ruleFormRef)" show-password/>
    </el-form-item>
    <div style="padding-top: 50px">
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          保存
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import usePwd from "../../hooks/usePwd.ts";

const {passForm, ruleFormRef, rules, submitForm, resetForm} = usePwd()
</script>
