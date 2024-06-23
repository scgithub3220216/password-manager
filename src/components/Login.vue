<script setup lang="ts">
import {ref} from 'vue'
import {userDataInfoStore} from "../store/userDataInfo.ts";

const pwd = ref('')
const userInfoStore = userDataInfoStore();

function login() {
  console.log('login')
  window.location.hash = '/index'
}

function handleEnter() {
  console.log('handleEnter')
  // todo dev 暂时关闭
  // userInfoStore.userInfo.pwd == pwd.value ? login() : pwdError()
  login()
}

function pwdError() {
  let element = document.getElementById('myElement');

  // 存储原始背景颜色
  let originalColor = element.style.backgroundColor;

// 设置新的背景色触发过渡效果
  element.style.backgroundColor = '#ea918b';

  // 过渡完成后恢复原背景色
  setTimeout(function () {
    element.style.backgroundColor = originalColor;
  }, 1000);
}

</script>

<template>

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
    <!--    <div>-->
    <!--      <button @click="login">跳转到首页</button>-->
    <!--    </div>-->

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
