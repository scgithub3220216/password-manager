<script setup lang="ts">

// 把数据放到 pinia 中
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import {onMounted, reactive, ref} from "vue";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-notification.css";
import "element-plus/theme-chalk/el-message-box.css";
import "element-plus/theme-chalk/el-drawer.css";

import Header from "./indexview/Header.vue";
import SearchResult from "./indexview/SearchResult.vue";
import PwdInfoView from "./indexview/PwdInfo.vue";
import PwdInfoListView from "./indexview/PwdInfoList.vue";
import GroupView from "./indexview/Group.vue";
import useShortcutKey from "../hooks/useShortcutKey.ts";
import {PwdInfo} from "./type.ts";

const userDataInfoStore = useUserDataInfoStore();
useShortcutKey()

const headerRef = ref();
const pwdInfoViewRef = ref();
const searchViewShowFlag = ref(false)
const searchResultList = reactive<PwdInfo[]>([]);
const groupRef = ref(null)

onMounted(() => {
  console.log('Index onMounted')
  transferInputFocus(1);
  console.log('Index 挂载完毕')
})


/**
 * 切换 input 的光标位置
 * @param type 1: searchInputRef 2:groupInputRef  3: pwdInfoTitleInput
 */
function transferInputFocus(type: number) {
  console.log('transferInputFocus')
  if (type === 1 && headerRef.value.searchInputRef) {
    headerRef.value.searchInputRef.focus();
  } else if (type === 3 && pwdInfoViewRef.value.pwdInfoTitleInput) {
    pwdInfoViewRef.value.pwdInfoTitleInput.focus();
  }
}


/**
 * search
 */

function showSearchView(value: boolean) {
  searchViewShowFlag.value = value;
}

function setSearchResultData(pwdInfoList: PwdInfo[]) {
  console.log('setSearchResultData')
  if (!pwdInfoList || pwdInfoList.length === 0) {
    console.log('setSearchResultData pwdInfoList 为空')
    searchResultList.splice(0, searchResultList.length)
    // @ts-ignore
    userDataInfoStore.setCurPwdInfo(null)
    return;
  }
  Object.assign(searchResultList, pwdInfoList)
  userDataInfoStore.setCurPwdInfo(pwdInfoList[0])
}


</script>

<template>
  <div class="outer">
    <Header ref="headerRef" :updateSearchViewValue="showSearchView" :updateSearchResultData="setSearchResultData"/>
    <div class="content">
      <GroupView v-if="!searchViewShowFlag" ref="groupRef"/>

      <PwdInfoListView v-if="!searchViewShowFlag" :transferInputFocus="transferInputFocus"/>

      <SearchResult v-if="searchViewShowFlag" :searchResultList="searchResultList"/>

      <PwdInfoView ref="pwdInfoViewRef"/>

    </div>
  </div>

</template>

<style scoped>


.outer {
  width: 100vw;
  height: 100vh;
  flex: 1 1 auto;
  overflow: hidden;
}

.content {
  display: flex;
  width: 100vw;
  height: calc(100vh - 50px);
}


</style>
