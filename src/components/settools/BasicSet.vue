<script setup lang="ts">
import {ref} from 'vue';
import {userDataInfoStore} from "../../store/userDataInfo.ts";
import useUserInfo from "../../hooks/useUserInfo.ts";

const {setLockTime} = useUserInfo()

const userInfoStore = userDataInfoStore();
const autoStart = ref(userInfoStore.userInfo.autoStart)
const lockTime = ref(userInfoStore.userInfo.autoLock.autoLockTime)
const timeUnit = ref(userInfoStore.userInfo.autoLock.autoLockTimeUnit);
const timeUnits = [{
  label: '秒',
  value: 1000
}, {
  label: '分钟',
  value: 60000
}, {
  label: '小时',
  value: 3600000
}]

const lockTimeChange = () => {
  console.log('lockTimeChange')
  setLockTime(lockTime.value, timeUnit.value);
}

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
  <div class="setting-item">
    <el-form-item label="自动锁定时间" prop="delivery">
      <el-input-number v-model="lockTime" :min="1" :max="999" @change="lockTimeChange" style="width: 130px"/>
      <el-select
          v-model="timeUnit"
          placeholder="Select"
          style="width: 80px;margin-left: 1px"
          @change="lockTimeChange"
      >
        <el-option
            v-for="item in timeUnits"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<style scoped>

</style>