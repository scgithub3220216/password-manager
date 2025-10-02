<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import usePwd from "../hooks/usePwd.ts";
import InitSetPwd from "./setview/InitSetPwd.vue";
import useLoginView from "../hooks/useLoginView.ts";
import {IPC_FIRST_LOGIN} from "../../electron/constant.ts";
import {firstLoginFlag} from "../../electron/db/sqlite/components/configConstants.ts";
import useDBConfig from "../hooks/useDBConfig.ts";
import Enter from "./svg/Enter.vue";
import useCurrentPath from "../hooks/useCurrentPath.ts";

const initSetPwdRef = ref()
const pwdInputRef = ref()
const {setPwdMsgTips} = usePwd()
const {getConfigValue} = useDBConfig()
const {currentView, checkCurrentPath} = useCurrentPath();

const {handleEnter, capsLockFlag, password} = useLoginView()

// 监听路由变化
watch(() => currentView, (newPath, oldPath) => {
      console.log(`路由从 ${oldPath} 变为 ${newPath}`)
      switchFocus()
    }
)
onMounted(() => {
  console.log("Login onMounted");
  switchFocus()
  firstLogin()
});
const switchFocus = () => {
  const flag = checkCurrentPath();
  if (flag) {
    pwdInputRef.value.focus();
  }
}


async function firstLogin() {
  console.log('firstLogin')
  // 判断用户是否第一次登录 , 如果是 设置登录密码
  let firstLoginFlagValue = await getConfigValue(firstLoginFlag);
  console.log("firstLoginFlagValue:", firstLoginFlagValue)
  if (firstLoginFlagValue !== '1') {
    console.log('不是第一次登录')
    return;
  }
  console.log('设置登录密码')
  initSetPwdRef.value.pwdDialogVisible = true
  setPwdMsgTips();
  await window.ipcRenderer.invoke(IPC_FIRST_LOGIN);
}

</script>

<template>
  <div id="myElement" class="pwd-outer">

    <InitSetPwd ref="initSetPwdRef"/>

    <el-input
        ref="pwdInputRef"
        v-model="password"
        autofocus
        class="input-pwd"
        placeholder="开门密码"
        type="password"
        @keyup.enter="handleEnter"
    >
      <template #suffix>
        <el-tooltip
            class="box-item"
            content="登录"
            effect="dark"
            placement="top"
        >
          <Enter class="enter" @click="handleEnter"/>
        </el-tooltip>
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
  height: 95vh;
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
