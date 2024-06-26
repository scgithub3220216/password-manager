<script setup lang="ts">
import Index from './components/Index.vue'
import {userDataInfoStore} from "./store/userDataInfo.ts";
import {FileDataObj} from "./store/type";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import Login from './components/Login.vue'
import {saveTime} from "./config/config.ts";
import useCrypto from "./hooks/useCrypto.ts";
import useLogin from "./hooks/useLogin.ts";
import useUserInfo from "./hooks/useUserInfo.ts";

const userInfoStore = userDataInfoStore();
const {encryptData} = useCrypto();
const {logout} = useLogin();
const {getLockTime}=useUserInfo()

// 简单的路由
const routes = {
  '/login': Login,
  '/index': Index,
}

onBeforeUnmount(() => {
  console.log('卸载之前')
  saveData()
})

onMounted(() => {
  const intervalId = setInterval(() => saveData(), saveTime);
  // 可以考虑将 intervalId 返回以便在 onUnmounted 中清除定时器
  return () => clearInterval(intervalId);
});


function saveData() {
  if (!userInfoStore.userInfo.saveFlag) {
    return;
  }
  console.log('saveData 改动')

  let fileDataObj = new FileDataObj(userInfoStore.userInfo, userInfoStore.pwdGroupList);
  // save-data
  const fileDataObjJson = JSON.stringify(fileDataObj);

  let encryptData1 = encryptData(fileDataObjJson);
  console.log('encryptData1:', encryptData1)
  window.ipcRenderer.invoke('save-data', encryptData1);
  userInfoStore.userInfo.saveFlag = false;
}

// 监听路由哈希
const currentPath = ref(window.location.hash)
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})
const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || Login
})

// 规定时间中不操作, 默认退出 (自动回登录页面)
let timeoutId;

function resetTimer() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    logout();
  }, getLockTime());
}

document.addEventListener('mousemove', resetTimer);
document.addEventListener('keydown', resetTimer);
document.addEventListener('scroll', resetTimer);

resetTimer(); // 初始化定时器


</script>

<template>
  <component :is="currentView"/>
</template>

<style scoped>


</style>
