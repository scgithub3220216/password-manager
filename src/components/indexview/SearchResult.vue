<script setup lang="ts">
import {PwdInfo} from "../../store/type.ts";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";

defineProps(['searchResultList'])
const userDataInfoStore = useUserDataInfoStore();

function searchTableClick(row: PwdInfo, column: any, event: Event) {
  console.log('searchTableClick,row:', row)
  if (!row) {
    return;
  }
  userDataInfoStore.setCurPwdInfo(row)
}

</script>

<template>
  <div class="search-result">
    <el-table :data="searchResultList" @row-click="searchTableClick" style="width: 100%;height: calc(100vh - 50px)">
      <el-table-column prop="groupTitle" label="分组" :min-width="100"/>
      <el-table-column prop="title" label="标题" show-overflow-tooltip :min-width="100"/>
      <el-table-column prop="username" label="用户名" show-overflow-tooltip :min-width="100"/>
    </el-table>
  </div>
</template>

<style scoped>
.search-result {
  width: 60%;
  border-right: 1px #cab8b8 solid;
}
</style>