<script setup lang="ts">

// 把数据放到 pinia 中
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import {PwdGroup, PwdInfo} from "../store/type.ts";
import {onMounted, reactive, ref} from "vue";
import {Delete, Download, Edit, Plus} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-loading.css";

import "element-plus/theme-chalk/el-notification.css";

import "element-plus/theme-chalk/el-message-box.css";

import "element-plus/theme-chalk/el-drawer.css";
import useExcel from "../hooks/useExcel.ts";
import Header from "./indexview/Header.vue";
import SearchResult from "./indexview/SearchResult.vue";
import PwdInfoView from "./indexview/PwdInfo.vue";

const userInfoStore = useUserDataInfoStore();
let pwdGroupList = reactive<PwdGroup[]>([]);
const groupInputShowFlag = ref(false);
const groupInputValue = ref('');
let curGroup = reactive<PwdGroup>({})
let curPwdInfo = reactive<PwdInfo>({})
const pwdInfoList = reactive<PwdInfo[]>([]);
const pwdInfo = reactive<PwdInfo>({});
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
  Object.assign(pwdGroupList, userInfoStore.pwdGroupList);
  if (!(pwdGroupList && pwdGroupList.length > 0)) {
    console.log('pwdGroupList 为空')
    return;
  }
  let pwdList = pwdGroupList[0].pwdList;
  Object.assign(curGroup, pwdGroupList[0]);
  Object.assign(curPwdInfo, pwdList[0]);
  Object.assign(pwdInfoList, pwdList);
  Object.assign(pwdInfo, pwdList[0]);
}

/**
 * 切换input 的光标位置
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
    Object.assign(pwdInfo, {});
    return;
  }
  Object.assign(searchResultList, pwdInfoList)
  Object.assign(pwdInfo, pwdInfoList[0]);
}

/**
 * group
 */
const {exportExcel} = useExcel();

function clickGroup(group: PwdGroup) {
  console.log(`clickGroup groupId:${group.id}' groupTitle:${group.title}`)
  pwdInfoList.length = 0
  Object.assign(curGroup, group);
  // curGroup = group;
  Object.assign(pwdInfoList, group.pwdList);

  Object.assign(curPwdInfo, group.pwdList[0]);
  Object.assign(pwdInfo, group.pwdList[0]);

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
  let pwdGroup = new PwdGroup(userInfoStore.generateGroupId(), groupInputValue.value, []);
  pwdGroupList.push(pwdGroup)
  userInfoStore.insertGroup(pwdGroup)
  groupInputShowFlag.value = false;
  groupInputValue.value = '';
  userInfoStore.editAction()
}

async function triggerGroupEdit() {
  console.log('triggerGroupEdit1')
  userInfoStore.editGroupFlag(curGroup.id, true);
}

function editGroups() {
  console.log('editGroups')
  userInfoStore.editGroupFlag(curGroup.id, false);
  userInfoStore.editAction()
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
  userInfoStore.deleteGroup(curGroup.id);
  //  删除 pwdGroupList 中的数据
  pwdGroupList.splice(0, pwdGroupList.length, ...userInfoStore.pwdGroupList);
  // ElMessage.success('删除成功')
  userInfoStore.editAction()

}

/**
 * pwdInfo
 */
function clickPwdInfo(value: PwdInfo) {
  console.log('clickPwdInfo')
  Object.assign(pwdInfo, value);
  Object.assign(curPwdInfo, value);
}

function insertPwdInfo() {
  console.log(`insertPwdInfo curGroup.id:${curGroup.id}`)
  console.log('userInfoStore.getPwdInfoListByGroupId(curGroup.id)1:', userInfoStore.getPwdInfoListByGroupId(curGroup.id))
  let newPwdInfo = new PwdInfo(userInfoStore.generatePwdInfoId(), curGroup.id, curGroup.title, '', '', '', '', '');
  console.log('newPwdInfo:', newPwdInfo)

  userInfoStore.insertPwdInfo(newPwdInfo)
  console.log('新增 pinia 完成')
  console.log('userInfoStore.getPwdInfoListByGroupId(curGroup.id)2:', userInfoStore.getPwdInfoListByGroupId(curGroup.id))

  pwdInfoList.splice(0, pwdInfoList.length, ...userInfoStore.getPwdInfoListByGroupId(curGroup.id));
  console.log('新增 pwdInfoList 完成')
  console.log('pwdInfoList:', pwdInfoList)


  console.log('newPwdInfo:', newPwdInfo)
  Object.assign(pwdInfo, newPwdInfo);

  console.log('赋值 pwdInfo 完成')
  console.log('newPwdInfo:', newPwdInfo)
  console.log('pwdInfo:', pwdInfo)

  transferInputFocus(3);
}

function deletePwdInfo() {
  console.log('deletePwdInfo')
  userInfoStore.deletePwdInfo(pwdInfo.id);
  //  删除 pwdGroupList 中的数据
  pwdInfoList.splice(0, pwdInfoList.length, ...userInfoStore.getPwdInfoListByGroupId(curGroup.id));

}

const openDelPwdInfoMsgBox = () => {
  ElMessageBox.confirm(
      '确认删除此帐号?',

      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
        customStyle: {
          width: '250px'
        }
      }
  )
      .then(() => {
        deletePwdInfo()
      })
      .catch(() => {
      })
}

/**
 * searchResult
 */
function initPwdInfo(pwdInfo: PwdInfo) {
  console.log('initPwdInfo')
  Object.assign(pwdInfo, pwdInfo);
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

/**
 * 快捷键 Ctrl + P 复制密码 Ctrl + U 复制用户名
 */


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
      <div v-if="!searchViewShowFlag" class="pwd">
        <div class="pwd-item">
          <ul id="pwd-ul">
            <li v-for="pwdInfo in pwdInfoList" :key="pwdInfo.id" @click="clickPwdInfo(pwdInfo)">{{ pwdInfo.title }}</li>
          </ul>
        </div>
        <div class="pwd-tools">
          <el-tooltip
              class="box-item"
              effect="dark"
              content="新增"
              placement="top"
          >
            <span @click="insertPwdInfo()"> <Plus style="width: 20px; height: 20px; margin-right: 8px"/></span>
          </el-tooltip>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="删除"
              placement="top"
          >
            <span @click="openDelPwdInfoMsgBox()"> <Delete style="width: 20px; height: 20px;"/></span>
          </el-tooltip>
        </div>

      </div>

      <SearchResult v-if="searchViewShowFlag" :searchResultList="searchResultList" :updatePwdInfo="initPwdInfo"/>


      <PwdInfoView  ref="pwdInfoViewRef" :pwdInfo="pwdInfo"/>

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

.pwd {
  width: 35%;
  border-left: 1px #cab8b8 solid;
  border-right: 1px #cab8b8 solid;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.pwd-item {
  overflow-y: auto;
  overflow-x: hidden;
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

#pwd-ul li {
  height: 35px;
}




</style>
