<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import usePwd from "../hooks/usePwd.ts";
import InitSetPwd from "./setview/InitSetPwd.vue";
import useLoginView from "../hooks/useLoginView.ts";
import {toggleDark} from "../styles/dark/dark.ts";
import {useDark} from "@vueuse/core";

const initSetPwdRef = ref()
const userInfoStore = useUserDataInfoStore();
const {setPwdMsgTips} = usePwd()


const {handleEnter, sendMessageToMain, capsLockFlag, pwd} = useLoginView()

onMounted(() => {
  sendMessageToMain()
      .then(() => {
        // 设置主题
        console.log('darkSwitch:', userInfoStore.userInfo.darkSwitch)
        // darkFlag 当前值  : false 白色  ; true 黑色
        let darkFlag = useDark();
        console.log('darkFlag:', darkFlag.value)
        if (userInfoStore.userInfo.darkSwitch && !darkFlag.value) {
          console.log('darkSwitch')
          toggleDark();
        }
      })
      .then(() => {
        // console.log('userInfoStore.userInfo.pwd:', userInfoStore.userInfo.pwd)
        // 判断用户是否第一次登录 , 如果是 设置登录密码
        if (userInfoStore.userInfo.firstLoginFlag != 0) {
          console.log('设置登录密码')
          initSetPwdRef.value.pwdDialogVisible = true
          setPwdMsgTips();
        }
      })
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
