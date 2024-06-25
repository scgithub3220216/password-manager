<script setup lang="ts">
import {ref} from "vue";
import Support from "./settools/Support.vue";
import BasicSet from "./settools/BasicSet.vue";
import UpdatePwd from "./settools/UpdatePwd.vue";
import ShortcutKeys from "./settools/ShortcutKeys.vue";

const settingDialogVisible = ref(false);

function openSettingDialog() {
  settingDialogVisible.value = true;
}

// 暴露方法给父组件
defineExpose({
  openSettingDialog
})

</script>

<template>
  <el-dialog v-model="settingDialogVisible" title="" width="500" style="height: 400px">
    <el-tabs tab-position="left" style="height: 100%" class="demo-tabs">
      <el-tab-pane label="通用">
        <BasicSet/>
      </el-tab-pane>
      <el-tab-pane label="快捷键">
        <ShortcutKeys/>
      </el-tab-pane>
      <el-tab-pane label="修改密码">
        <UpdatePwd/>
      </el-tab-pane>
      <el-tab-pane label="支持/捐赠">
        <Support/>
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