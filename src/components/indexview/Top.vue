<script lang="ts" setup>
import {Close, FullScreen, Minus} from "@element-plus/icons-vue";
import {ref} from 'vue'
import WinRestore from "../svg/WinRestore.vue";
import TopMenu from "./TopMenu.vue";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {storeToRefs} from "pinia";
import {IPC_CLOSE_WIN, IPC_MAXIMIZE, IPC_MINIMIZE} from "../../../electron/constant.ts";

const {loginFlag} = storeToRefs(useUserDataInfoStore())

function minimize() {
  window.ipcRenderer.invoke(IPC_MINIMIZE);
}

function maximize() {
  window.ipcRenderer.invoke(IPC_MAXIMIZE);
  isMaximized.value = !isMaximized.value
}

function close() {
  window.ipcRenderer.invoke(IPC_CLOSE_WIN);
}

const isMaximized = ref(false)
</script>

<template>

  <div class="top title-bar">
    <div class="left">
      <img alt="logo" class="logo" src="/assets/icon-top.ico"/>
      <el-text class="mx-1 title">密码管理器</el-text>
    </div>
    <div class="right">
      <TopMenu v-if="loginFlag"/>
      <!--最小化-->
      <el-button class="btn" @click="minimize">
        <el-icon>
          <Minus/>
        </el-icon>
      </el-button>

      <!--最大化/还原-->
      <el-button class="btn" @click="maximize">
        <el-icon v-if="isMaximized">
          <WinRestore/>
        </el-icon>
        <el-icon v-else>
          <FullScreen/>
        </el-icon>
      </el-button>

      <!--关闭-->
      <el-button class="btn" @click="close">
        <el-icon>
          <Close/>
        </el-icon>
      </el-button>
    </div>
  </div>

</template>

<style scoped>
.top {
  height: calc(5vh - 3px);
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.05);
}

/*可拖动*/
.title-bar {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}

.left {
  display: flex;
  align-items: center;
  margin-left: 5px;
}

.title {
  margin-left: 8px;
  font-weight: 480;
}

.right {
  -webkit-app-region: no-drag;
}

.btn {
  height: 100%;
  margin: 0;
  border: none;
  background: none;
}

.btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>