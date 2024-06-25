<script setup lang="ts">
import Index from './components/Index.vue'
import {userDataInfoStore} from "./store/userDataInfo.ts";
import {FileDataObj} from "./store/type";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import Login from './components/Login.vue'
import {saveTime} from "./config/config.ts";

const userInfoStore = userDataInfoStore();

// 简单的路由
const routes = {
  '/login': Login,
  '/index': Index,
}


// window.ipcRenderer.on('to-setting-view', () => {
//   console.log('to-setting-view')
//   toSettingView()
// })
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

  window.ipcRenderer.invoke('save-data', fileDataObjJson);
  userInfoStore.userInfo.saveFlag = false;
}

// 监听路由哈希
const currentPath = ref(window.location.hash)
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})
const currentView = computed(() => {
  // return '/login';
  return routes[currentPath.value.slice(1) || '/'] || Login
})

// function toSettingView() {
//   console.log('toSettingView')
//   // 判断是否登录, 未登录跳转到登录页面
//   if (userInfoStore.userInfo.curLoginStatus !== 1) {
//     window.location.hash = '/login'
//     return
//   }
//
//   window.location.hash = '/setting'
// }

</script>

<template>
  <!--  <a href="#/login">Login</a> |-->
  <!--  <a href="#/index">Index</a> |-->
  <component :is="currentView"/>
</template>

<style scoped>


</style>
