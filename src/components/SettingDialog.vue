<script setup lang="ts">
import {ref} from "vue";
import BasicSet from "./setview/BasicSet.vue";
import UpdatePwd from "./setview/UpdatePwd.vue";
import ShortcutKeys from "./setview/ShortcutKeys.vue";
import DataSync from "./setview/DataSync.vue";

const settingDialogVisible = ref(false);

function openSettingDialog() {
  settingDialogVisible.value = true;
}

// 暴露方法给父组件
defineExpose({
  openSettingDialog,
});
</script>

<template>
  <el-dialog
      v-model="settingDialogVisible"
      title=""
      width="450"
      style="height: 400px"
  >
    <el-tabs type="card" class="demo-tabs">
      <el-tab-pane label="通用">
        <BasicSet/>
      </el-tab-pane>

      <el-tab-pane label="快捷键">
        <ShortcutKeys/>
      </el-tab-pane>

      <el-tab-pane label="修改密码">
        <UpdatePwd/>
      </el-tab-pane>

      <el-tab-pane label="多端数据同步">
        <DataSync/>
      </el-tab-pane>

    </el-tabs>
  </el-dialog>
</template>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>