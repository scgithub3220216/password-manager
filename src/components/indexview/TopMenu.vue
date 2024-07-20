<script lang="ts" setup>

import {CoffeeCup, Document, Download, Help, Menu, Tools, Upload} from '@element-plus/icons-vue'
import useExcel from "../../hooks/useExcel.ts";
import {ref} from "vue";
import Import from "../topMenu/Import.vue";
import {IPC_DEV_TOOLS} from "../../../electron/constant.ts";
import Support from "../topMenu/Support.vue";
import useBrowser from "../../hooks/useBrowser.ts";
import {helpLink} from "../../config/config.ts";
import About from "../topMenu/About.vue";
import useDBConfig from "../../hooks/useDBConfig.ts";
import {localVersionField} from "../../../electron/db/sqlite/components/configConstants.ts";
import {ElMessage} from "element-plus";

const {openBrowser} = useBrowser();

const {exportExcel} = useExcel();
const {setConfigValue} = useDBConfig()
const importRef = ref();
const supportRrf = ref();
const aboutRrf = ref();

function openDevTools() {
  window.ipcRenderer.invoke(IPC_DEV_TOOLS);
}

function resetLocalVersion() {
  setConfigValue('1', localVersionField).then(()=>ElMessage.success('重置成功'))
}

</script>

<template>

  <el-dropdown trigger="click">
    <el-button class="btn">
      <el-icon>
        <Menu/>
      </el-icon>
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>

        <el-dropdown-item @click="openBrowser(helpLink)">
          <el-icon>
            <Help/>
          </el-icon>
          帮助文档
        </el-dropdown-item>

        <el-dropdown-item @click="importRef.importDialogVisible=true">
          <el-icon class="el-icon--left">
            <Upload/>
          </el-icon>
          导入数据
        </el-dropdown-item>

        <el-dropdown-item @click="exportExcel">
          <el-icon class="el-icon--left">
            <Download/>
          </el-icon>
          导出数据
        </el-dropdown-item>

        <el-dropdown-item @click="supportRrf.supportDialogVisible=true">
          <el-icon>
            <CoffeeCup/>
          </el-icon>
          支持/捐赠
        </el-dropdown-item>

        <el-dropdown-item @click="aboutRrf.aboutDialogVisible=true">
          <el-icon>
            <Document/>
          </el-icon>
          关于软件
        </el-dropdown-item>

        <!--        <el-dropdown-item @click="openDevTools">-->
        <!--          <el-icon>-->
        <!--            <Tools/>-->
        <!--          </el-icon>-->
        <!--          开发调试-->
        <!--        </el-dropdown-item>-->
        <el-dropdown-item>
          <el-icon>
            <Menu/>
          </el-icon>
          隐藏功能
          <el-dropdown>
            <span>&emsp;</span>

            <template #dropdown>
              <el-dropdown-menu>

                <el-dropdown-item @click="openDevTools">
                  <el-icon>
                    <Tools/>
                  </el-icon>
                  开发调试
                </el-dropdown-item>
                <el-dropdown-item @click="resetLocalVersion">
                  <el-icon>
                    <Tools/>
                  </el-icon>
                  本地版本重置
                </el-dropdown-item>

              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-dropdown-item>

      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <Import ref="importRef"/>
  <Support ref="supportRrf"/>
  <About ref="aboutRrf"/>
</template>

<style scoped>
.btn {
  height: calc(5vh - 3px);
  margin: 0;
  border: none;
  background: none;
}

</style>