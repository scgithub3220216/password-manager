<script setup lang="ts">
import {ElMessage} from "element-plus";

const linkValue = 'https://blog.csdn.net/OnMyWaySc/article/details/139989454?csdn_share_tail=%7B%22type%22%3A%22blog%22%2C%22rType%22%3A%22article%22%2C%22rId%22%3A%22139989454%22%2C%22source%22%3A%22OnMyWaySc%22%7D';

function copyLink() {
  navigator.clipboard.writeText(linkValue).then(() => {
    console.log('复制成功')
    ElMessage.success('复制成功')
  }, () => {
    console.log('复制失败')
  })
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
span{
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
</style>