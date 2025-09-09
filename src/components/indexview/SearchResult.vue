<script lang="ts" setup>
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {PwdInfo} from "../type.ts";
import {useSearchResultStore} from "../../store/searchResult.ts";
import {storeToRefs} from "pinia";
import {nextTick, ref} from "vue";

const tableRef = ref(null)
const userDataInfoStore = useUserDataInfoStore();
const searchResultStore = useSearchResultStore();
const {searchResultList} = storeToRefs(searchResultStore)
let currentIndex = ref(0)

// @ts-ignore
function searchTableClick(row: PwdInfo, column: any, event: Event) {
  console.log('searchTableClick,row:', row)
  if (!row) {
    return;
  }
  userDataInfoStore.setCurPwdInfo(row)
}

// 焦点移动到表格 type : 1 ⬆️ 2:⬇️
const focusTable = (type:number) => {
  console.log(`forceTABLE type:${type}` )
  if (searchResultList.value.length === 0) {
    return;
  }
  if (type ===1){
    if (currentIndex.value  <= 0) {
      currentIndex.value = searchResultList.value.length - 1
    }else{
      currentIndex.value--
    }
  }else if (type ===2){
    if (currentIndex.value >= searchResultList.value.length - 1) {
      currentIndex.value = 0
    }else{
      currentIndex.value++
    }
  }
  console.log(`forceTABLE currentIndex:${currentIndex.value}`)

  nextTick(() => {
    if (!tableRef.value) {
      return;
    }
    console.log('into talbe ')
    // 设置表格为可聚焦状态并聚焦
    tableRef.value.$el.focus()
    // 如果有数据，将焦点设置到第一行
    if (searchResultList.value.length === 0) {
      return;
    }
    searchTableClick(searchResultList.value[currentIndex.value], null, null)
  })
}
defineExpose({focusTable,});


</script>

<template>
  <div class="search-result">
    <el-table :data="searchResultList" style="width: 100%;height: calc(100vh - 50px)"
              ref="tableRef"
              @row-click="searchTableClick">
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