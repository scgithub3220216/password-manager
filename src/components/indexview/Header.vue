<script setup lang="ts">

import {Search} from "@element-plus/icons-vue";
import {toggleDark} from "../../styles/dark/dark.ts";
import {onMounted, onUnmounted, ref} from "vue";
import useLoginAction from "../../hooks/useLoginAction.ts";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import SettingDialog from "../SettingDialog.vue";
import emitter from "../../utils/emitter.ts";
import {emitterLockTopic} from "../../config/config.ts";
import {storeToRefs} from "pinia";
import {useSearchResultStore} from "../../store/searchResult.ts";
import useDBPwdInfo from "../../hooks/useDBPwdInfo.ts";
import useDBConfig from "../../hooks/useDBConfig.ts";
import {darkSwitch} from "../../../electron/db/sqlite/components/configConstants.ts";

const userInfoStore = useUserDataInfoStore();
const {shortCutKeyCombs} = storeToRefs(userInfoStore)
const searchResultStore = useSearchResultStore();
const themeSwitch = ref(false)
const {logout} = useLoginAction();
const {listPwdInfoBySearch} = useDBPwdInfo();
const search = ref('');
const searchInputRef = ref();
const {setConfigValue, getConfigValue} = useDBConfig()

let settingDialogRef = ref();
onMounted(async () => {
  console.log('Header.vue onMounted')
  searchInputRef.value.focus();
  themeSwitch.value = !!parseInt(await getConfigValue(darkSwitch));
  console.log('Header.vue 挂载完毕')
})

// 绑定事件
emitter.on(emitterLockTopic, (value) => {
  console.log(emitterLockTopic, ' 事件被触发 value:', value)
  clickLock()
})

onUnmounted(() => {
  // 解绑事件
  emitter.off(emitterLockTopic)
})

function clickDarkSwitch() {
  console.log('clickDarkSwitch themeSwitch.value:', themeSwitch.value)
  setConfigValue(themeSwitch.value ? '1' : '0', darkSwitch)
  toggleDark();
}

async function searchAction() {
  console.log('searchAction')

  let searchValue = search.value;
  if (!searchValue.trim()) {
    searchResultStore.closeSearchView();
    return;
  }
  let pwdInfoList = await listPwdInfoBySearch(searchValue);

  searchResultStore.setSearchResultData(pwdInfoList);
  searchResultStore.openSearchView()
}


function openSettingDialog() {
  console.log('openSettingDialog')
  settingDialogRef.value.openSettingDialog();
}


function clickLock() {
  logout();
}

</script>

<template>

  <div class="search">
    <div>
      <el-tooltip
          class="box-item"
          effect="dark"
          content="切换主题"
          placement="right"
      >
        <el-switch
            @click="clickDarkSwitch()"
            v-model="themeSwitch"
            class="ml-2"
            style="--el-switch-on-color: rgba(0,0,0,0.19); --el-switch-off-color: rgb(220,209,209); margin-left: 10px"
        />
      </el-tooltip>
    </div>
    <el-input
        ref="searchInputRef"
        v-model="search"
        style="margin-left: 40px; width: 500px;font-size: 16px; height: 40px"
        placeholder="标题/用户名搜索"
        :prefix-icon="Search"
        type="search"
        @search="searchAction()"
    />
    <div>
      <el-tooltip
          class="box-item"
          effect="dark"
          :content="'退出登录,快捷键'+shortCutKeyCombs[1].desc"
          placement="top"
      >
        <img src="/assets/lock.svg" alt="switch" @click="clickLock" class="search-image">
      </el-tooltip>
      <el-tooltip
          class="box-item"
          effect="dark"
          content="设置"
          placement="top"
      >
        <img src="/assets/setting.svg" alt="setting" @click="openSettingDialog" class="search-image">
      </el-tooltip>
    </div>
  </div>

  <SettingDialog ref="settingDialogRef"/>

</template>

<style scoped>
.search {
  height: 7vh;
  width: 100vw;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}

.search-image {
  width: 30px;
  border: 1px solid rgba(204, 204, 204, 0);
  border-radius: 50%;
  padding: 1px;
  opacity: 0.4;
  margin-right: 10px;

}

.search-image:hover {
  opacity: 0.4;
  cursor: pointer;
  transform: scale(1.1);
}
</style>