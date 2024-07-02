<script setup lang="ts">

import {Search} from "@element-plus/icons-vue";
import {toggleDark} from "../../styles/dark/dark.ts";
import {onUnmounted, reactive, ref} from "vue";
import useLoginAction from "../../hooks/useLoginAction.ts";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import SettingDialog from "../SettingDialog.vue";
import {PwdInfo} from "../type.ts";
import emitter from "../../utils/emitter.ts";
import {emitterLockTopic} from "../../config/config.ts";
import {storeToRefs} from "pinia";

const userInfoStore = useUserDataInfoStore();
const {shortCutKeyCombs} = storeToRefs(userInfoStore)

const themeSwitch = ref(userInfoStore.userInfo.darkSwitch)
const {logout} = useLoginAction();
const search = ref('');
const searchResultList = reactive<PwdInfo[]>([]);
const searchInputRef = ref(null);
let props = defineProps(['updateSearchViewValue', 'updateSearchResultData'])
let settingDialogRef = ref();

function clickDarkSwitch() {
  console.log('clickDarkSwitch themeSwitch.value:', themeSwitch.value)
  userInfoStore.setDarkSwitch(themeSwitch.value);
  toggleDark();
}

function searchAction() {
  console.log('searchAction')
  // 根据输入的内容 筛选 pwdGroupList 和 pwdInfoList
  let searchValue = search.value;
  if (!searchValue.trim()) {
    props.updateSearchViewValue(false)
    searchResultList.splice(0, searchResultList.length);
    return;
  }

  // 如果有值
  props.updateSearchViewValue(true)

  // 将 pwdGroupList 全部转为 pwdInfoList
  let pwdInfoListTemp = userInfoStore.pwdGroupList.map(pwdGroup => pwdGroup.pwdList).flat();
  // 在 pwdInfoList 中查找
  let searchResultListTemp = pwdInfoListTemp.filter(pwdInfo => pwdInfo?.groupTitle?.includes(searchValue) || pwdInfo?.title?.includes(searchValue) || pwdInfo?.username?.includes(searchValue));
  props.updateSearchResultData(searchResultListTemp);
}


function openSettingDialog() {
  console.log('openSettingDialog')
  settingDialogRef.value.openSettingDialog();
}


// 绑定事件
emitter.on(emitterLockTopic, (value) => {
  console.log(emitterLockTopic, ' 事件被触发 value:', value)
  clickLock()
})

onUnmounted(() => {
  // 解绑事件
  emitter.off(emitterLockTopic)
})

function clickLock() {
  logout();
}

// 暴露方法给父组件
defineExpose({
  searchResultList, searchInputRef
});
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
            style="--el-switch-on-color: rgba(0,0,0,0.5); --el-switch-off-color: rgba(255,255,255,0.72); margin-left: 10px"
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
        autofocus
    />
    <div>
      <el-tooltip
          class="box-item"
          effect="dark"
          :content="'锁定,快捷键'+shortCutKeyCombs[1].desc"
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
  height: 45px;
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
  background: #79797BFF;
  box-shadow: #888888 0px 0px 5px 0px;
  cursor: pointer;

}
</style>