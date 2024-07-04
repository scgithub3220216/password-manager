<script setup lang="ts">
import {Close, CopyDocument, FullScreen, Minus} from "@element-plus/icons-vue";
import {ref} from 'vue'

function minimize() {
  window.ipcRenderer.invoke('minimize');
}

function maximize() {
  window.ipcRenderer.invoke('maximize');
  isMaximized.value = !isMaximized.value
}

function close() {
  window.ipcRenderer.invoke('close-win');
}

const isMaximized = ref(false)
</script>

<template>

  <div class="top titlebar">
    <div class="left">left</div>
    <div class="right">
      <!--最小化-->
      <el-button class="btn" @click="minimize">
        <el-icon>
          <Minus/>
        </el-icon>
      </el-button>

      <!--最大化/还原-->
      <el-button class="btn" @click="maximize">

        <el-icon v-if="isMaximized">
          <CopyDocument/>
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
  height: calc(5vh - 1px);
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.titlebar {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}

.right {
  -webkit-app-region: no-drag;
}

.btn {
  margin: 0;
  border: none;
}

.btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>