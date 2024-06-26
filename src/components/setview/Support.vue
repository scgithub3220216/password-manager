<script setup lang="ts">

function copyLink() {
// Jump-support-doc
  window.ipcRenderer.invoke('Jump-support-doc');

}
</script>

<template>
  <p><b>郑重声明: 所有收入全部用于公益</b></p>
  <p>详细收支清单:
    <span @click="copyLink">网页链接</span>
  </p>
  <img src="/money.png" alt="" style="height: 200px">
</template>

<style scoped>
span {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
</style>