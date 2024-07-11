<script lang="ts" setup>
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {PwdInfo} from "../type.ts";
import {useSearchResultStore} from "../../store/searchResult.ts";
import {storeToRefs} from "pinia";

const userDataInfoStore = useUserDataInfoStore();
const searchResultStore = useSearchResultStore();
const {searchResultList} = storeToRefs(searchResultStore)

// @ts-ignore
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
    <el-table :data="searchResultList" style="width: 100%;height: calc(100vh - 50px)" @row-click="searchTableClick">
      <el-table-column :min-width="100" label="分组" prop="group_title"/>
      <el-table-column :min-width="100" label="标题" prop="title" show-overflow-tooltip/>
      <el-table-column :min-width="100" label="用户名" prop="username" show-overflow-tooltip/>
    </el-table>
  </div>
</template>

<style scoped>
.search-result {
  width: 60%;
  border-right: 1px #cab8b8 solid;
}
</style>