<script setup lang="ts">
import {ref} from 'vue';
import {userDataInfoStore} from "../../store/userDataInfo.ts";

const userInfoStore = userDataInfoStore();
const autoStart = ref(userInfoStore.userInfo.autoStart)

function autoStartChange() {
  console.log(`autoStartChange:${autoStart.value}`)
  // 调用方法 通知主进程
  window.ipcRenderer.invoke('auto-start', autoStart.value);

  // 修改 数据


  userInfoStore.userInfo.autoStart = autoStart.value;
}

</script>

<template>
  <h2 class="setting-h2title">启动</h2>
  <div class="setting-item">
    <el-form-item label="开机启动" prop="delivery">
      <el-switch v-model="autoStart" @change="autoStartChange"/>
    </el-form-item>
  </div>
</template>

<style scoped>

</style>