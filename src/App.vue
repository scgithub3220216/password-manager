<script setup lang="js">
import HelloWorld from './components/HelloWorld.vue'
// 获取 用户数据
// import {ipcRenderer} from 'electron';
// import {useDataInfoStore} from "./store/useDataInfo";
// import {storeToRefs} from "pinia";
function sendMessageToMain() {
  window.ipcRenderer.send('channel-name', 'Hello from Renderer');
}

sendMessageToMain();
// const getData = async () => {
//
//   const userInfoData = await ipcRenderer.invoke('get-data');
//   // let userInfoStr
//   let userInfo;
//   if (!userInfoData) {
//     const userInfoStore = useDataInfoStore();
//     userInfo = storeToRefs(userInfoStore);
//     // userInfoStr = JSON.stringify(userInfo);
//     await ipcRenderer.invoke('save-data', JSON.stringify(userInfo));
//   }
//   console.log('userInfo', userInfo)
//
// };

</script>

<template>
  <HelloWorld msg="Hello World !"/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
