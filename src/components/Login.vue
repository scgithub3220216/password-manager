<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {userDataInfoStore} from "../store/userDataInfo.ts";
import usePwd from "../hooks/usePwd.ts";
import {FileDataObj} from "../store/type.ts";
import InitSetPwd from "./settools/InitSetPwd.vue";
import useCrypto from "../hooks/useCrypto.ts";

const pwd = ref('')
const initSetPwd = ref()
const userInfoStore = userDataInfoStore();
const {pwdError,setPwdMsgTips} = usePwd()
const {decryptData} = useCrypto();

onMounted(() => {
  sendMessageToMain().then(() => {
    console.log('userInfoStore.userInfo.firstLoginFlag:', userInfoStore.userInfo.firstLoginFlag)
    // 判断用户是否第一次登录 , 如果是 设置登录密码
    if (userInfoStore.userInfo.firstLoginFlag != 0) {
      console.log('设置登录密码')
      initSetPwd.value.pwdDialogVisible = true
      setPwdMsgTips();
    }
  })
})



async function sendMessageToMain() {

  const userDataJson = await window.ipcRenderer.invoke('init-data');
  if (!userDataJson) {
    return;
  }
  // 解密
  let decryptData1 = decryptData(userDataJson);
  console.log('decryptData1:', decryptData1)
  const fileDataObj: FileDataObj = JSON.parse(decryptData1);
  // 把数据放到 pinia 中
  userInfoStore.setUserInfo(fileDataObj);
}

function login() {
  console.log('login success')
  userInfoStore.login();
  window.location.hash = '/index'
}

function handleEnter() {
  userInfoStore.userInfo.pwd == pwd.value ? login() : pwdError()
}


</script>

<template>
  <InitSetPwd ref="initSetPwd"/>

  <div id="myElement" class="pwd-outer">
    <el-input
        class="input-pwd"
        v-model="pwd"
        type="password"
        placeholder="开门密码"
        show-password
        @keyup.enter="handleEnter"
        autofocus
    >
      <template #suffix>
        <img src="../../public/enter.png" alt="enter" @click="handleEnter" class="enter">
      </template>
    </el-input>
  </div>

</template>

<style scoped>

.pwd-outer {
  background: #282c34;
  transition: background-color 1s;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

}

.input-pwd {
  width: 240px;
  height: 50px;
  opacity: 0.4;
  color: white;
  font-size: 15px;
  --el-input-border-radius: 20px;

}

.enter {
  width: 22px;
  height: 22px;
  border: 1px solid rgba(204, 204, 204, 0);
  border-radius: 50%;
  padding: 10px;

}

.enter:hover {
  opacity: 0.4;
  background: #79797BFF;
  box-shadow: #888888 0px 0px 5px 0px;
  cursor: pointer;

}

</style>
