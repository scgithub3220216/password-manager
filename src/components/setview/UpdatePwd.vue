<template>
  <el-form
      ref="ruleFormRef"
      :model="passForm"
      :rules="rules"
      class="demo-ruleForm"
      label-position="left"
      label-width="auto"
      status-icon
  >
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
          v-model="passForm.oldPassword"
          autocomplete="off"
          show-password
          style="width: 350px"
          type="password"
      />
    </el-form-item>

    <el-form-item label="新密码" prop="newPassword">
      <el-input
          v-model="passForm.newPassword"
          autocomplete="off"
          show-password
          style="width: 350px"
          type="password"
      />
    </el-form-item>
    <el-form-item label="再次确认" prop="confirmPassword">
      <el-input
          v-model="passForm.confirmPassword"
          autocomplete="off"
          show-password
          style="width: 350px"
          type="password"
          @keyup.enter="submitForm(ruleFormRef)"
      />
    </el-form-item>
    <div>
      <el-form-item class="itemButton">
        <el-button class="btn" type="primary" @click="submitForm(ruleFormRef)">
          保存
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import usePwd from "../../hooks/usePwd.ts";

const {passForm, ruleFormRef, rules, submitForm, resetForm} = usePwd();
</script>
<style scoped>
.itemButton {
  margin-top: 50px;
  display: flex;
  justify-content: flex-end;
}

.btn {
  margin-left: auto;
}
</style>