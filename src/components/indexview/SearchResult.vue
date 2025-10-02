<script lang="ts" setup>
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {PwdInfo} from "../type.ts";
import {useSearchResultStore} from "../../store/searchResult.ts";
import {storeToRefs} from "pinia";
import {nextTick, onUnmounted, ref} from "vue";
import emitter from "../../utils/emitter.ts";
import {searchResultData} from "../../config/config.ts";
import {Delete} from "@element-plus/icons-vue";
import useDBPwdInfo from "../../hooks/useDBPwdInfo.ts";

const tableRef = ref(null)
const userDataInfoStore = useUserDataInfoStore();
const {curPwdInfo} = storeToRefs(userDataInfoStore)
const searchResultStore = useSearchResultStore();
const {searchResultList} = storeToRefs(searchResultStore)
let currentIndex = ref(0)
const {darkSwitch} = storeToRefs(userDataInfoStore)
const {delPwdInfo} = useDBPwdInfo();

emitter.on(searchResultData, (value) => {
  console.log(searchResultData, ' 事件被触发 value:', value)
  currentIndex.value = -1
  focusTable(2)
})

onUnmounted(() => {
  // 解绑事件
  emitter.off(searchResultData)
})

// @ts-ignore
function handleRowClick(row: PwdInfo, column: any, event: Event, rowIndex: number) {
  console.log(`handleRowClick,rowIndex:${rowIndex} , row:${row}`)
  if (!row) {
    return;
  }
  userDataInfoStore.setCurPwdInfo(row)
  if (rowIndex === -1) {
    return
  }
  rowIndex = searchResultList.value.findIndex(item => item.id === row.id)
  manualFocus(rowIndex)
}

const removeClass = (cssName: string) => {
  console.log(`removeClass cssName:${cssName}`)
  if (!tableRef.value) {
    return;
  }
  // @ts-ignore
  const rows: NodeListOf<Element> = tableRef.value.$el.querySelectorAll('.el-table__row')
  rows.forEach(row => {
    row.classList.remove(cssName)
  })
}

const manualFocus = (addIndex: number) => {
  console.log(`manualFocus index:${addIndex}`)
  if (!tableRef.value) {
    return;
  }
  // @ts-ignore
  const rows = tableRef.value.$el.querySelectorAll('.el-table__row')

  if (rows.length <= 0) {
    console.log('rows.length  <= 0 ')
    return;
  }

  const addRow = rows[addIndex]

  let cssName;
  console.log(`darkSwitch:${darkSwitch}`)
  if (darkSwitch.value) {
    cssName = 'list-dark';
  } else {
    cssName = 'list-light';
  }
  removeClass(cssName)
  addRow?.classList.add(cssName);
}

// 焦点移动到表格 type : 1 ⬆️ 2:⬇️
const focusTable = (type: number) => {
  console.log(`forceTABLE type:${type}`)
  if (searchResultList.value.length === 0) {
    return;
  }
  if (type === 1) {
    if (currentIndex.value <= 0) {
      currentIndex.value = searchResultList.value.length - 1
    } else {
      currentIndex.value--
    }
  } else if (type === 2) {
    if (currentIndex.value >= searchResultList.value.length - 1) {
      currentIndex.value = 0
    } else {
      currentIndex.value++
    }
  }
  console.log(`index;${currentIndex.value}`)

  nextTick(() => {
    if (!tableRef.value) {
      return;
    }
    // @ts-ignore 设置表格为可聚焦状态并聚焦
    tableRef.value.$el.focus()
    if (searchResultList.value.length === 0) {
      return;
    }
    manualFocus(currentIndex.value)
    // @ts-ignore
    handleRowClick(searchResultList.value[currentIndex.value], null, null, null)
  })
}
const handleDelete = () => {
  console.log(`handleDelete`)
  //  删除行
  let row = curPwdInfo.value;
  console.log(`${JSON.stringify(row)}`);
  const indexOf = searchResultList.value.findIndex(item => item.id === row.id)
  console.log(`index:${indexOf}`);
  if (indexOf == -1) {
    console.log(`当前数据不存在`)
    return;
  }
  searchResultList.value.splice(indexOf, 1);
  // 删除数据
  delPwdInfo(row.id)
  // 重新设置当前行
  if (searchResultList.value.length <= 0) return
  let index = indexOf - 1
  handleRowClick(searchResultList.value[index], null, null, index)

}

defineExpose({focusTable,});


</script>

<template>
  <div class="search-result">
    <el-table :data="searchResultList" style="width: 100%;height: calc(100vh - 50px)"
              ref="tableRef"
              @row-click="handleRowClick"
    >
      <el-table-column :min-width="100" label="分组" prop="group_title"/>
      <el-table-column :min-width="100" label="标题" prop="title" show-overflow-tooltip/>
      <el-table-column :min-width="100" label="用户名" prop="username" show-overflow-tooltip/>
      <el-table-column label="操作" :min-width="40">
        <template #default="scope">
          <el-popconfirm title="是否删除此账号?" @confirm="handleDelete" confirm-button-text="是" cancel-button-text="否">
            <template #reference>
              <el-button :icon="Delete" circle/>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<style scoped>
.search-result {
  width: 60%;
  border-right: 1px #cab8b8 solid;
}

:deep(.list-light) {
  background: var(--base-list-background-color-light);
  cursor: pointer;
}

:deep(.list-dark) {
  background: var(--base-list-background-color-dark);
  cursor: pointer;
}


</style>