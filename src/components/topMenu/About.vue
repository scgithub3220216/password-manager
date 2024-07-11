<script setup lang="ts">
import {ref} from "vue";

const aboutDialogVisible = ref(false);
defineExpose({aboutDialogVisible})
</script>

<template>
  <el-dialog v-model="aboutDialogVisible" title="" width="600">

    <h1>关于页面</h1>
  </el-dialog>
</template>

<style scoped>

</style>