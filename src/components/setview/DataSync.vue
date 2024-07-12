<script lang="ts" setup>
import useBrowser from "../../hooks/useBrowser.ts";
import {ossHelpLink} from "../../config/config.ts";
import useDataSync from "../../hooks/useDataSync.ts";

const {ruleFormRef, databaseForm, formRules, save, testCli} = useDataSync()
const {openBrowser} = useBrowser()


</script>

<template>
  <div class="content-input">
    <el-form ref="ruleFormRef" :model="databaseForm" :rules="formRules">
      <el-form-item prop="type">
        <el-radio-group v-model="databaseForm.type" style="margin: 0 auto">
          <el-radio-button label="oss">阿里OSS</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="region">
        <el-input v-model="databaseForm.region" clearable placeholder="region"></el-input>
      </el-form-item>
      <el-form-item prop="keyId">
        <el-input v-model="databaseForm.keyId" clearable placeholder="keyId"></el-input>
      </el-form-item>
      <el-form-item prop="key_secret">
        <el-input v-model="databaseForm.key_secret" clearable show-password placeholder="keySecret"></el-input>
      </el-form-item>
      <el-form-item prop="bucket">
        <el-input v-model="databaseForm.bucket" clearable placeholder="bucket"></el-input>
      </el-form-item>
    </el-form>

    <div class="content-button">
      <el-button type="primary" @click="testCli(ruleFormRef)">测试连接</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    <div class="oss-register-doc">
      <el-link type="primary" @click="openBrowser(ossHelpLink)">阿里云OSS注册指引</el-link>
    </div>
  </div>
</template>

<style scoped>


.content-button {
  margin-top: 10px;
}


.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
  padding-top: 0;
  margin-top: 0;
  font-weight: bold;
  color: #606266;
}


.oss-register-doc {
  text-align: center;
  color: #999;
}
</style>