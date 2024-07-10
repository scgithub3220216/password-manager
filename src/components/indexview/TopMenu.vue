<script setup lang="ts">

import {Menu} from "@element-plus/icons-vue";

function clickMenu() {
  console.log('clickMenu')
}
</script>

<template>
  <!--菜单-->
  <el-button class="btn" @click="clickMenu">
    <el-icon>
      <Menu/>
    </el-icon>
  </el-button>
</template>

<style scoped>

</style>