<script lang="ts" setup>

// 把数据放到 pinia 中
import {ref} from "vue";
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
import {useSearchResultStore} from "../store/searchResult.ts";
import {storeToRefs} from "pinia";

useShortcutKey()
const searchResultStore = useSearchResultStore();
const {searchViewShowFlag} = storeToRefs(searchResultStore)
const headerRef = ref();
const groupRef = ref()
const pwdInfoViewRef = ref();


/**
 * 切换 pwdInfoInput 的光标位置
 */
function transferInputFocus() {
  console.log('transferInputFocus')
  pwdInfoViewRef.value.pwdInfoTitleInput.focus();
}


</script>

<template>
  <div class="outer">
    <Header ref="headerRef"/>
    <div class="content">
      <GroupView v-if="!searchViewShowFlag" ref="groupRef"/>

      <PwdInfoListView v-if="!searchViewShowFlag" :transferInputFocus="transferInputFocus"/>

      <SearchResult v-if="searchViewShowFlag"/>

      <PwdInfoView ref="pwdInfoViewRef"/>

    </div>
  </div>

</template>

<style scoped>


.outer {
  width: 100vw;
  height: 95vh;
  flex: 1 1 auto;
  overflow: hidden;
}

.content {
  display: flex;
  width: 100vw;
  height: calc(100vh - 7vh - 5vh);
}


</style>
