<script setup lang="ts">
import {onUnmounted, ref} from 'vue'
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import usePwd from "../hooks/usePwd.ts";
import InitSetPwd from "./setview/InitSetPwd.vue";
import useLoginView from "../hooks/useLoginView.ts";
import emitter from "../utils/emitter.ts";

const initSetPwdRef = ref()
const userInfoStore = useUserDataInfoStore();
const {setPwdMsgTips} = usePwd()

const {handleEnter, capsLockFlag, pwd} = useLoginView()


// 绑定事件
emitter.on('initSuccess', () => {
  console.log('initSuccess 事件被触发')
  // 判断用户是否第一次登录 , 如果是 设置登录密码
  if (userInfoStore.userInfo.firstLoginFlag != 0) {
    console.log('设置登录密码')
    initSetPwdRef.value.pwdDialogVisible = true
    setPwdMsgTips();
  }
})

onUnmounted(() => {
  // 解绑事件
  emitter.off('initSuccess')
})

</script>

<template>
  <div id="myElement" class="pwd-outer">

    <InitSetPwd ref="initSetPwdRef"/>

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
        <img src="/assets/enter.png" alt="enter" @click="handleEnter" class="enter">
      </template>
    </el-input>
    <div :style="{ visibility: capsLockFlag ? 'visible' : 'hidden'}" style="font-size: 14px">
      键盘大写锁定已打开
    </div>

  </div>

</template>

<style scoped>

.pwd-outer {
  transition: background-color 1s;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: auto
}

.input-pwd {
  width: 240px;
  height: 50px;
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
  background: rgba(121, 121, 123, 0.18);
  box-shadow: rgba(136, 136, 136, 0.22) 0px 0px 5px 0px;
  cursor: pointer;

}

</style>
