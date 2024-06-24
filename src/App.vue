<script setup lang="ts">
import Index from './components/Index.vue'
import {userDataInfoStore} from "./store/userDataInfo.ts";
import {FileDataObj} from "./store/type";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import Login from './components/Login.vue'

const userInfoStore = userDataInfoStore();



function saveData() {
  console.log('saveData')
  let fileDataObj = new FileDataObj(userInfoStore.userInfo, userInfoStore.pwdGroupList);
  // save-data
  const fileDataObjJson = JSON.stringify(fileDataObj);

  window.ipcRenderer.invoke('save-data', fileDataObjJson);
}

onBeforeUnmount(() => {
  console.log('卸载之前')
  saveData()
})

onMounted(() => {
  const intervalId = setInterval(() => saveData(), 2000);
  // 可以考虑将 intervalId 返回以便在 onUnmounted 中清除定时器
  return () => clearInterval(intervalId);
});

// 简单的路由
const routes = {
  '/login': Login,
  '/index': Index
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

</script>

<template>
  <!--  <a href="#/login">Login</a> |-->
  <!--  <a href="#/index">Index</a> |-->
  <component :is="currentView"/>
</template>

<style scoped>


</style>
