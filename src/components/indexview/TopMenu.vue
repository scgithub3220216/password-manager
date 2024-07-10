<script setup lang="ts">

import {Menu} from '@element-plus/icons-vue'

function clickImport() {
  console.log('clickImport')
}

function clickExport() {
  console.log('clickExport')
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
        <el-dropdown-item @click="clickImport">导入</el-dropdown-item>
        <el-dropdown-item @click="clickExport">导出</el-dropdown-item>
        <el-dropdown-item>帮助</el-dropdown-item>
        <el-dropdown-item>关于</el-dropdown-item>
        <el-dropdown-item>开发</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

</template>

<style scoped>
.btn {
  height: 100%;
  margin: 0;
  border: none;
  background: none;
}

</style>