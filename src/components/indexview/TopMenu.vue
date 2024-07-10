<script setup lang="ts">

import {Download, Menu, Tools, Upload} from '@element-plus/icons-vue'
import useExcel from "../../hooks/useExcel.ts";
import {ref} from "vue";
import Import from "../setview/Import.vue";
import {DEV_TOOLS} from "../../../electron/constant.ts";

const {exportExcel} = useExcel();
const importRef = ref();

function openDevTools() {
  window.ipcRenderer.invoke(DEV_TOOLS);
}

</script>

<template>

  <el-dropdown>
    <el-button class="btn">
      <el-icon>
        <Menu/>
      </el-icon>
    </el-button>
    <template #dropdown>

      <el-dropdown-menu>
        <el-dropdown-item>帮助</el-dropdown-item>

        <el-dropdown-item @click="importRef.importDialogVisible=true">
          <el-icon class="el-icon--left">
            <Upload/>
          </el-icon>
          导入数据
        </el-dropdown-item>

        <el-dropdown-item @click="exportExcel">
          <el-icon class="el-icon--left">
            <Download/>
          </el-icon>
          导出数据
        </el-dropdown-item>

        <el-dropdown-item>关于</el-dropdown-item>

        <el-dropdown-item>支持/捐赠</el-dropdown-item>

        <el-dropdown-item @click="openDevTools">
          <el-icon>
            <Tools/>
          </el-icon>
          开发调试
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <Import ref="importRef"/>

</template>

<style scoped>
.btn {
  height: 100%;
  margin: 0;
  border: none;
  background: none;
}

</style>