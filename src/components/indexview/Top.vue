<script setup lang="ts">
// import {Close, Minus} from "@element-plus/icons-vue";

function minimize() {
  window.ipcRenderer.invoke('minimize');
}

function maximize() {
  window.ipcRenderer.invoke('maximize');
}

function close() {
  window.ipcRenderer.invoke('close-win');
}
</script>

<template>

  <div class="top titlebar">
    <div class="left">left</div>
    <div class="right">
      <!--      <el-icon>-->
      <!--        <Minus/>-->
      <!--      </el-icon>-->
      <!--      <el-icon>-->
      <!--        <Close/>-->
      <!--      </el-icon>-->
      <el-button @click="minimize">最小化</el-button>
      <el-button id="maximize-btn" @click="maximize">最大化/还原</el-button>
      <el-button id="close-btn" @click="close">关闭</el-button>
    </div>
  </div>

</template>

<style scoped>
.top {
  height: 5vh;
  background-color: black;
  display: flex;
  justify-content: space-between;
}

.titlebar {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}

.right {
  -webkit-app-region: no-drag;
}
</style>