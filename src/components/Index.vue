<script setup lang="ts">

// 把数据放到 pinia 中
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import {PwdGroup, PwdInfo} from "../store/type.ts";
import {onMounted, reactive, ref} from "vue";
import {Delete, Download, Edit, Plus} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-notification.css";
import "element-plus/theme-chalk/el-message-box.css";
import "element-plus/theme-chalk/el-drawer.css";

import useExcel from "../hooks/useExcel.ts";
import Header from "./indexview/Header.vue";
import SearchResult from "./indexview/SearchResult.vue";
import PwdInfoView from "./indexview/PwdInfo.vue";
import PwdInfoListView from "./indexview/PwdInfoList.vue";

const {exportExcel} = useExcel();
const userDataInfoStore = useUserDataInfoStore();
let pwdGroupList = reactive<PwdGroup[]>([]);
const groupInputShowFlag = ref(false);
const groupInputValue = ref('');
let curGroup = reactive<PwdGroup>({})
const groupInputRef = ref(null);
const groupInput2Ref = ref(null);
const headerRef = ref(null);
const pwdInfoViewRef = ref(null);
const searchViewShowFlag = ref(false)
const searchResultList = reactive<PwdInfo[]>([]);

onMounted(() => {
  console.log('Index onMounted')
  initData();
  transferInputFocus(1);
  dynamicClickCss();
  // 启动键盘事件
  document.addEventListener('keydown', pwdInfoViewRef.value.keydown);
  console.log('Index 挂载完毕')
})

function initData() {
  Object.assign(pwdGroupList, userDataInfoStore.pwdGroupList);
  if (!(pwdGroupList && pwdGroupList.length > 0)) {
    console.log('pwdGroupList 为空')
    return;
  }
  let pwdList = pwdGroupList[0].pwdList;
  userDataInfoStore.setCurGroup(pwdGroupList[0])
  userDataInfoStore.setCurPwdInfo(pwdList[0])
}

/**
 * 切换 input 的光标位置
 * @param type 1: searchInputRef 2:groupInputRef  3: pwdInfoTitleInput
 */
function transferInputFocus(type: number) {
// @ts-ignore
  if (type === 1 && headerRef.value.searchInputRef) {
// @ts-ignore
    headerRef.value.searchInputRef.focus();
  } else if (type === 2 && groupInputRef.value) {
// @ts-ignore
    groupInputRef.value.focus();
  } else if (type === 3 && pwdInfoViewRef.value.pwdInfoTitleInput.value) {
// @ts-ignore
    pwdInfoViewRef.value.pwdInfoTitleInput.value.focus();
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


function clickGroup(group: PwdGroup) {
  console.log(`clickGroup groupId:${group.id}' groupTitle:${group.title}`)
  userDataInfoStore.setCurGroup(group)
  userDataInfoStore.setCurPwdInfo(group.pwdList[0])
  Object.assign(curGroup, group);
  // 单击样式
  setTimeout(() => {
    clickGroupCss();
  }, 100)

}

function clickGroupCss() {
  let items = document.getElementById('pwd-ul')?.getElementsByTagName('li');
  if (!items) {
    return;
  }
  console.log('items:', items.length)
  for (var i = 0; i < items.length; i++) {
    if (i === 0) {
      console.log('selected')
      items[i].classList.add('selected');
      continue;
    }
    items[i].classList.remove('selected');
  }
}

function triggerGroupsInsert() {
  console.log('triggerGroupsInsert')
  groupInputShowFlag.value = true;
  transferInputFocus(2);
}

function groupInputChange() {
  console.log('groupInputChange')
  if (!(groupInputValue.value && groupInputValue.value.trim())) {
    groupInputShowFlag.value = false;
    return;
  }
  console.log('groupInputChange2')
  let pwdGroup = new PwdGroup(userDataInfoStore.generateGroupId(), groupInputValue.value, []);
  pwdGroupList.push(pwdGroup)
  userDataInfoStore.insertGroup(pwdGroup)
  groupInputShowFlag.value = false;
  groupInputValue.value = '';
}

async function triggerGroupEdit() {
  console.log('triggerGroupEdit1')
  userDataInfoStore.editGroupFlag(curGroup.id, true);
}

function editGroups() {
  console.log('editGroups')
  userDataInfoStore.editGroupFlag(curGroup.id, false);
  userDataInfoStore.editAction()
}

function deleteGroup() {
  console.log('deleteGroup')
  let flag = false;
  pwdGroupList.forEach(pwdGroup => {
    if (flag) {
      return;
    }
    if (pwdGroup.id === curGroup.id) {
      if (pwdGroup.pwdList.length > 0) {
        flag = true;
      }
    }
  })
  if (flag) {
    ElMessage.error('删除失败, 该分组下还有数据')
    return false;
  }
  userDataInfoStore.deleteGroup(curGroup.id);
  //  删除 pwdGroupList 中的数据
  pwdGroupList.splice(0, pwdGroupList.length, ...userDataInfoStore.pwdGroupList);
  ElMessage.success('删除成功')
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
      <div v-if="!searchViewShowFlag" class="group">
        <div class="group-data">
          <ul id="group-ul">
            <li v-for="group in pwdGroupList" :key="group.id" @click="clickGroup(group)">
              <span v-show="!group.editFlag"> {{ group.title }}</span>
              <el-input v-show="group.editFlag" ref="groupInput2Ref" v-model="group.title" @change="editGroups()" @blur="editGroups()"></el-input>
            </li>
          </ul>
          <el-input ref="groupInputRef" v-model="groupInputValue" v-show="groupInputShowFlag" @change="groupInputChange()"
                    @blur="groupInputChange()"/>
        </div>

        <div class="group-tools">
          <el-tooltip
              class="box-item"
              effect="dark"
              content="新增"
              placement="top"
          >
            <span @blur="triggerGroupsInsert" @click="triggerGroupsInsert()"> <Plus style="width: 20px; height: 20px; margin-right: 8px"/></span>
          </el-tooltip>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="修改"
              placement="top"
          >
            <span @blur="triggerGroupEdit" @click="triggerGroupEdit()"> <Edit style="width: 20px; height: 20px; margin-right: 8px"/></span>
          </el-tooltip>

          <el-tooltip
              class="box-item"
              effect="dark"
              content="导出"
              placement="top"
          >
            <span @click="exportExcel"> <Download style="width: 20px; height: 20px;"/></span>
          </el-tooltip>

          <el-tooltip
              class="box-item"
              effect="dark"
              content="删除"
              placement="top"
          >
            <span @click="deleteGroup()"> <Delete style="width: 20px; height: 20px;"/></span>
          </el-tooltip>

        </div>
      </div>
      <PwdInfoListView v-if="!searchViewShowFlag" :curGroup="curGroup"/>

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


.group {
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.group-tools span {
  padding: 4px 4px 0 4px;
  margin-left: 5px;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.group-tools span:hover {
  box-shadow: #213547;
}


.pwd-tools span {
  padding: 8px 8px 0 8px;
  margin-left: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
}


ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

li {
  margin-left: 15px;
  margin-right: 15px;
  text-align: left;
  padding: 5px 0 5px 20px;
  border-bottom: 1px #45484c solid;
}

li:first-child {
  margin-top: 0px;
}

li:last-child {
  border-bottom: 0 #cab8b8 solid;

}


li:hover {
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

li.selected {
  background: rgba(255, 255, 255, 0.08);
}


</style>
