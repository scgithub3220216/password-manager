<script setup lang="ts">

import useBrowser from "../../hooks/useBrowser.ts";
import {supportLink} from "../../config/config.ts";

const {openBrowser} = useBrowser();
</script>

<template>
  <p><b>郑重声明: 所有收入全部用于公益</b></p>
  <p>详细收支清单:
    <span @click="openBrowser(supportLink)">网页链接</span>
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