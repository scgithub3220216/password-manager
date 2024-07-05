<script setup lang="ts">

import useBrowser from "../../hooks/useBrowser.ts";
import {supportLink} from "../../config/config.ts";

const {openBrowser} = useBrowser();
</script>

<template>
  <p><b>郑重声明: 所有收入全部用于
    <el-tooltip
        class="box-item"
        effect="dark"
        content="孤寡老人、残疾人、贫困家庭等群体的帮助。"
        placement="top-start"
    >
      <span style="color: #4b63ba">
      公益
      </span>
    </el-tooltip>
  </b></p>
  <p>详细收支清单:
    <span @click="openBrowser(supportLink)">网页链接</span>
  </p>
  <img src="/assets/money.png" alt="" style="height: 200px">
</template>

<style scoped>
span {
  color: rgb(139, 185, 100);
  cursor: pointer;
  text-decoration: underline;
  font-weight: bold;
  font-size: 15px;
}
</style>