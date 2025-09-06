<script setup lang="ts">
import {onMounted, ref} from "vue";
import {giteeCodeLink} from "../../config/config.ts";
import useBrowser from "../../hooks/useBrowser.ts";
import UseUpdate from "../../hooks/useUpdate.ts";
// @ts-ignore
import {version} from '/package.json'

const autoCheckUpdateValue = ref(false);

const aboutDialogVisible = ref(false);
defineExpose({aboutDialogVisible})
const {openBrowser} = useBrowser()
const {checkUpdate,setUpdateSwitch,getAutoCheckUpdateSwitch} = UseUpdate()

onMounted(() => {
  initAutoUpdateSwitch()
})
const initAutoUpdateSwitch =async () => {
  autoCheckUpdateValue.value = await getAutoCheckUpdateSwitch()
}
</script>

<template>
  <el-dialog v-model="aboutDialogVisible" title="" width="600">

    <img src="/assets/icon.png" alt="icon" width="200px">
    <hr>
    <p>密码管理器
      <el-tag type="success">{{ version }}</el-tag>
      <el-tag type="info" >简体中文</el-tag>
    </p>

    <p>作者：sc夫妻</p>

    <p>

    </p>
    <p>永久免费使用，无广告，无插件，无后门 <br/> 并承诺该软件永远不会以任何方式保留您的任何数据</p>
    <div class="update-line">
      <p>

        <el-button type="success" plain @click="checkUpdate()">检查更新</el-button>
        <span style="margin-left: 20px">
           <span>自动检查更新: </span> <el-switch v-model="autoCheckUpdateValue" @change="setUpdateSwitch"/>
        </span>
      </p>
      <p>

      </p>
    </div>
    <a href="#"><p @click="openBrowser(giteeCodeLink)">Gitee开源 GPL3.0开源协议</p></a>
  </el-dialog>
</template>

<style scoped>
.update-line{


}

</style>