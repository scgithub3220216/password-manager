<script setup lang="ts">

// 把数据放到 pinia 中
import {userDataInfoStore} from "../store/userDataInfo.ts";
import {PwdGroup, PwdInfo} from "../store/type.ts";
import {onMounted, reactive, ref} from "vue";
import {Delete, Edit, Plus, Search} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import "element-plus/theme-chalk/el-message.css";

const userInfoStore = userDataInfoStore();
let pwdGroupList = reactive<PwdGroup[]>([]);
const search = ref('');
const searchResultShowFlag = ref(false);
const groupInputShowFlag = ref(0);
const groupInputValue = ref('');
let curGroup = reactive<PwdGroup>({})
let curPwdInfo = reactive<PwdInfo>({})
const pwdInfoList = reactive<PwdInfo[]>([]);
const searchResultList = reactive<PwdInfo[]>([]);
const pwdInfoDetail = reactive<PwdInfo>({});

function logout() {
  console.log('logout')
  window.location.hash = '/login'
}


onMounted(() => {

  Object.assign(pwdGroupList, userInfoStore.pwdGroupList);
  if (!(pwdGroupList && pwdGroupList.length > 0)) {
    console.log('pwdGroupList 为空')
    return;
  }
  let pwdList = pwdGroupList[0].pwdList;
  Object.assign(curGroup, pwdGroupList[0]);
  Object.assign(curPwdInfo, pwdList[0]);
  Object.assign(pwdInfoList, pwdList);
  Object.assign(pwdInfoDetail, pwdList[0]);

  dongtaicss();

  console.log('挂载完毕')
})


/**
 * group
 */
function clickGroup(group: PwdGroup) {
  console.log('showPwdList')
  console.log('group.editFlag', group.editFlag)
  pwdInfoList.length = 0
  Object.assign(curGroup, group);
  // curGroup = group;
  Object.assign(pwdInfoList, group.pwdList);
}

function triggerGroupsInsert() {
  console.log('triggerGroupsInsert')
  groupInputShowFlag.value = 1;
}

function groupInputChange() {
  console.log('groupInputChange')
  if (!(groupInputValue.value && groupInputValue.value.trim())) {
    groupInputShowFlag.value = 0;
    return;
  }
  console.log('groupInputChange2')

  let pwdGroup = new PwdGroup(userInfoStore.getGroupId(), groupInputValue.value, []);
  pwdGroupList.push(pwdGroup)
  userInfoStore.insertGroup(pwdGroup)
  groupInputShowFlag.value = 0;
  groupInputValue.value = '';
}

function triggerGroupEdit() {
  console.log('triggerGroupEdit')
  userInfoStore.editGroupFlag(curGroup.id, true);
}

function editGroups() {
  console.log('editGroups')
  userInfoStore.editGroupFlag(curGroup.id, false);
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
}

/**
 * pwdInfo
 */
function clickPwdInfo(pwdInfo: PwdInfo) {
  console.log('showDetail')
  Object.assign(pwdInfoDetail, pwdInfo);
  Object.assign(curPwdInfo, pwdInfo);
}

function insertPwdInfo() {
  console.log('insertPwdInfo')
  let pwdInfo = new PwdInfo(userInfoStore.getPwdInfoId(), curGroup.id, curGroup.title, '', '', '', '', '');
  pwdInfoList.push(pwdInfo)
  userInfoStore.insertPwdInfo(pwdInfo)
  Object.assign(pwdInfoDetail, pwdInfo);
}

function deletePwdInfo() {
  console.log('deletePwdInfo')
  userInfoStore.deletePwdInfo(pwdInfoDetail.id);
  //  删除 pwdGroupList 中的数据
  pwdInfoList.splice(0, pwdInfoList.length, ...userInfoStore.getPwdInfoListByGroupId(curGroup.id));
}


/**
 * detail
 */
function pwdInfoChange() {
  console.log('pwdInfoChange')
  userInfoStore.updatePwdInfo(pwdInfoDetail)
}


/**
 * 动态 样式
 */
function dongtaicss() {
  document.getElementById('group-ul').addEventListener('click', function (e) {
    // 移除之前所有li的高亮
    var items = this.getElementsByTagName('li');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove('selected');
    }
    // 给当前点击的li添加高亮
    e.target.classList.add('selected');
  });
  document.getElementById('pwd-ul').addEventListener('click', function (e) {
    // 移除之前所有li的高亮
    var items = this.getElementsByTagName('li');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove('selected');
    }
    // 给当前点击的li添加高亮
    e.target.classList.add('selected');
  });
}

function searchTableClick(row: PwdInfo, column: any, event: Event) {
  console.log('searchTableClick,row:', row)
  if (!row) {
    return;
  }
  Object.assign(pwdInfoDetail, row);
}

function searchAction() {
  console.log('search')
  // 根据输入的内容 筛选 pwdGroupList 和 pwdInfoList
  let searchValue = search.value;
  if (!searchValue.trim()) {
    searchResultShowFlag.value = false;
    searchResultList.splice(0, searchResultList.length);
    return;
  }
  // 如果有值
  searchResultShowFlag.value = true;

  // 将 pwdGroupList 全部转为 pwdInfoList
  let pwdInfoListTemp = pwdGroupList.map(pwdGroup => pwdGroup.pwdList).flat();
  console.log('pwdInfoListTemp', pwdInfoListTemp.length)
  // 在 pwdInfoList 中查找
  let searchResultListTemp = pwdInfoListTemp.filter(pwdInfo => pwdInfo?.groupTitle?.includes(searchValue) || pwdInfo?.title?.includes(searchValue) || pwdInfo?.username?.includes(searchValue));
  console.log('searchResultListTemp', searchResultListTemp.length)
  if (searchResultListTemp.length === 0) {
    return;
  }
  searchResultList.splice(0, searchResultList.length, ...searchResultListTemp);
  Object.assign(pwdInfoDetail, searchResultListTemp[0]);
}

</script>

<template>
  <div class="outer">
    <div class="search">
      <el-input
          v-model="search"
          style="width: 500px"
          placeholder="标题/用户名搜索"
          :prefix-icon="Search"
          type="search"
          @search="searchAction()"
          autofocus
      />
    </div>
    <div class="content">
      <div v-if="!searchResultShowFlag" class="group">
        <div class="group-data">
          <ul id="group-ul">
            <li v-for="group in pwdGroupList" :key="group.id" @click="clickGroup(group)">
              <span v-if="!group.editFlag"> {{ group.title }}</span>
              <el-input v-else v-model="group.title" @blur="editGroups()"></el-input>
            </li>
          </ul>
          <el-input v-model="groupInputValue" v-if="groupInputShowFlag" id="group-input" @change="groupInputChange()"/>
        </div>

        <div class="group-tools">
          <span @click="triggerGroupsInsert()"> <Plus style="width: 20px; height: 20px; margin-right: 8px"/></span>
          <span @click="triggerGroupEdit()"> <Edit style="width: 20px; height: 20px; margin-right: 8px"/></span>
          <span @click="deleteGroup()"> <Delete style="width: 20px; height: 20px;"/></span>

        </div>
      </div>
      <div v-if="!searchResultShowFlag" class="pwd">
        <div class="pwd-item">
          <ul id="pwd-ul">
            <li v-for="pwdInfo in pwdInfoList" :key="pwdInfo.id" @click="clickPwdInfo(pwdInfo)">{{ pwdInfo.title }}</li>
          </ul>
        </div>
        <div class="pwd-tools">
          <span @click="insertPwdInfo()"> <Plus style="width: 20px; height: 20px; margin-right: 8px"/></span>
          <span @click="deletePwdInfo()"> <Delete style="width: 20px; height: 20px;"/></span>
        </div>

      </div>
      <div v-if="searchResultShowFlag" class="search-result">
        <el-table :data="searchResultList" @row-click="searchTableClick" style="width: 100%;height: calc(100vh - 50px)">
          <el-table-column prop="groupTitle" label="分组" :min-width="100"/>
          <el-table-column prop="title" label="标题" show-overflow-tooltip :min-width="100"/>
          <el-table-column prop="username" label="用户名" show-overflow-tooltip :min-width="100"/>
        </el-table>
      </div>
      <div class="detail">
        <div class="detail-item">
          <span>标题</span>
          <el-input v-model="pwdInfoDetail.title" @change="pwdInfoChange()"/>
        </div>

        <div class="detail-item">
          <span>用户名</span>
          <el-input v-model="pwdInfoDetail.username" @change="pwdInfoChange()"/>
        </div>

        <div class="detail-item">
          <span>密码</span>
          <el-input v-model="pwdInfoDetail.password" @change="pwdInfoChange()" type="password" show-password class="input-pwd"/>
        </div>

        <div class="detail-item">
          <span> 链接</span>
          <el-input v-model="pwdInfoDetail.link" @change="pwdInfoChange()"/>
        </div>

        <div class="detail-item">
          <span> 说明</span>
          <div>
            <el-input
                class="item-textarea"
                v-model="pwdInfoDetail.remark"
                @change="pwdInfoChange()"
                :rows="5"
                type="textarea"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

.outer {
  background: rgba(40, 44, 52, 0.93);
  width: 100vw;
  height: 100vh;
  flex: 1 1 auto;
  color: rgba(255, 255, 255, 0.66);
}

.search {
  height: 50px;
  width: 100vw;
}

.content {
  display: flex;
  width: 100vw;
  height: calc(100vh - 50px);
}

.search-result {
  width: 60%;
  border-right: 1px #cab8b8 solid;
}

.group {
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.group-tools span {
  padding: 8px 8px 0 8px;
  margin-left: 10px;
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

.detail {
  width: 40%;
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

.detail {


}

.detail-item {
  margin-top: 0px;
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #000000;
  flex-direction: column;
  align-items: start;
}

.item-input {
  color: white;
  font-size: 16px;
  border: 0 none;
  background: transparent;

}

.item-textarea {
  width: 292px;
  color: white;
  font-size: 16px;
  border: 0 none;
  background: transparent;
}
</style>
