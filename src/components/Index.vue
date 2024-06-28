<script setup lang="ts">

// 把数据放到 pinia 中
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import {PwdInfo} from "../store/type.ts";
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

const userDataInfoStore = useUserDataInfoStore();

const headerRef = ref(null);
const pwdInfoViewRef = ref(null);
const searchViewShowFlag = ref(false)
const searchResultList = reactive<PwdInfo[]>([]);
const groupRef = ref(null)

onMounted(() => {
  console.log('Index onMounted')
  transferInputFocus(1);
  dynamicClickCss();
  // 启动键盘事件
  document.addEventListener('keydown', pwdInfoViewRef.value.keydown);
  console.log('Index 挂载完毕')
})


/**
 * 切换 input 的光标位置
 * @param type 1: searchInputRef 2:groupInputRef  3: pwdInfoTitleInput
 */
function transferInputFocus(type: number) {
  console.log('transferInputFocus')
// @ts-ignore
  if (type === 1 && headerRef.value.searchInputRef) {
// @ts-ignore
    headerRef.value.searchInputRef.focus();
  }  else if (type === 3 && pwdInfoViewRef.value.pwdInfoTitleInput) {
// @ts-ignore
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
    userDataInfoStore.setCurPwdInfo(null)
    return;
  }
  Object.assign(searchResultList, pwdInfoList)
  userDataInfoStore.setCurPwdInfo(pwdInfoList[0])
}


/**
 * 动态 样式
 */
function dynamicClickCss() {
  document.getElementById('group-ul')?.addEventListener('click', function (e) {
    // 移除之前所有li的高亮
    var items = this.getElementsByTagName('li');
    addLiCss(items, e);
  });
  document.getElementById('pwd-ul')?.addEventListener('click', function (e) {
    // 移除之前所有li的高亮
    var items = this.getElementsByTagName('li');
    addLiCss(items, e);
  });
}

function addLiCss(items: HTMLCollectionOf<HTMLElementTagNameMap[string]>, e: MouseEvent) {
  for (var i = 0; i < items.length; i++) {
    items[i].classList.remove('selected');
  }
  // 给当前点击的li添加高亮
  e.target?.classList.add('selected');
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
