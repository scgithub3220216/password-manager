<script setup lang="ts">

import {CoffeeCup, Document, Download, Help, Menu, Tools, Upload} from '@element-plus/icons-vue'
import useExcel from "../../hooks/useExcel.ts";
import {ref} from "vue";
import Import from "../setview/Import.vue";
import {DEV_TOOLS} from "../../../electron/constant.ts";
import Support from "../setview/Support.vue";
import useBrowser from "../../hooks/useBrowser.ts";
import {helpLink} from "../../config/config.ts";

const {openBrowser} = useBrowser();

const {exportExcel} = useExcel();
const importRef = ref();
const supportRrf = ref();

function openDevTools() {
  window.ipcRenderer.invoke(DEV_TOOLS);
}


</script>

<template>

  <el-dropdown trigger="click">
    <el-button class="btn">
      <el-icon>
        <Menu/>
      </el-icon>
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>

        <el-dropdown-item @click="openBrowser(helpLink)">
          <el-icon>
            <Help/>
          </el-icon>
          帮助
        </el-dropdown-item>

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

        <el-dropdown-item @click="supportRrf.supportDialogVisible=true">
          <el-icon>
            <CoffeeCup/>
          </el-icon>
          支持/捐赠
        </el-dropdown-item>

        <el-dropdown-item>
          <el-icon>
            <Document/>
          </el-icon>
          关于
        </el-dropdown-item>

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
  <Support ref="supportRrf"/>
</template>

<style scoped>
.btn {
  height: calc(5vh - 3px);
  margin: 0;
  border: none;
  background: none;
}

</style>