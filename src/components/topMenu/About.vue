<script setup lang="ts">
import {ref} from "vue";

const aboutDialogVisible = ref(false);
defineExpose({aboutDialogVisible})

const version = ref('1.1.0')
</script>

<template>
  <el-dialog v-model="aboutDialogVisible" title="" width="600">

    <img src="/assets/icon.png" alt="icon" width="200px">
    <hr>
    <p>密码管理器 <span></span> </p>
    <p>作者：sc夫妻</p>
    <p>版本 {{ version }} (简体中文)</p>
    <p>永久免费使用，无广告，无插件，无后门，无数据上传</p>
  </el-dialog>
</template>

<style scoped>

</style>