<script setup lang="ts">
import Index from './components/Index.vue'
import {useUserDataInfoStore} from "./store/userDataInfo.ts";
import {FileDataObj} from "./store/type";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import Login from './components/Login.vue'
import {saveTime} from "./config/config.ts";
import useCrypto from "./hooks/useCrypto.ts";
import useLoginAction from "./hooks/useLoginAction.ts";
import useUserInfo from "./hooks/useUserInfo.ts";

const userInfoStore = useUserDataInfoStore();
const {encryptData} = useCrypto();
const {logout} = useLoginAction();
const {getLockTime} = useUserInfo()

// 简单的路由
const routes = {
  '/login': Login,
  '/index': Index,
}

onMounted(() => {
  console.log(`App onMounted `)
  const intervalId = setInterval(() => saveData(), saveTime);
  // 可以考虑将 intervalId 返回以便在 onUnmounted 中清除定时器
  return () => clearInterval(intervalId);
});

onBeforeUnmount(() => {
  console.log(`App onBeforeUnmount`)
  saveData()
})

function saveData() {
  if (!userInfoStore.userInfo.saveFlag) {
    return;
  }
  userInfoStore.saveOver();
  console.log('saveData 改动 userInfoStore.userInfo.saveFlag')
  try {

    let fileDataObj = new FileDataObj(userInfoStore.userInfo, userInfoStore.pwdGroupList);
    // save-data
    const fileDataObjJson = JSON.stringify(fileDataObj);
    // console.log('fileDataObjJson:', fileDataObjJson)
    let encryptData1 = encryptData(fileDataObjJson);
    // console.log('encryptData1:', encryptData1)
    window.ipcRenderer.invoke('save-data', encryptData1);
  } catch (e) {
    console.error('saveData error:', e)
    userInfoStore.editAction();
  }

}

// 监听路由哈希
const currentPath = ref(window.location.hash)
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})
const currentView = computed(() => {
  let slice = currentPath.value.slice(1);
  // @ts-ignore
  return routes[slice || '/'] || Login
})

// 规定时间中不操作, 默认退出 (自动回登录页面)
let timeoutId: NodeJS.Timeout;

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
