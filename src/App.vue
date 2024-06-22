<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import {useDataInfoStore} from "./store/useDataInfo";
import {FileDataObj} from "./store/type";
import {onBeforeUnmount} from "vue";


async function sendMessageToMain() {

  const userDataJson = await window.ipcRenderer.invoke('init-data');
  console.log('fileDataStr:', userDataJson)
  if (!userDataJson) {
    return;
  }
  const fileDataObj = JSON.parse(userDataJson);
  console.log('fileDataObj:', fileDataObj)
  // 把数据放到 pinia 中
  const userInfoStore = useDataInfoStore();
  userInfoStore.setUserInfo(fileDataObj);
}

sendMessageToMain();


onBeforeUnmount(() => {
  console.log('卸载之前')
  console.log('userInfoData')
  const userDataInfoStore = useDataInfoStore();
  let fileDataObj = new FileDataObj(userDataInfoStore.userInfo, userDataInfoStore.pwdInfoList, userDataInfoStore.pwdGroupList);
  // save-data
  const fileDataObjJson = JSON.stringify(fileDataObj);

  window.ipcRenderer.invoke('save-data', fileDataObjJson);
})

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
