<script setup lang="ts">

// 把数据放到 pinia 中
import {userDataInfoStore} from "../store/userDataInfo.ts";
import {PwdGroup, PwdInfo} from "../store/type.ts";
import {onMounted, reactive, ref} from "vue";
import {Delete, Edit, Plus, Search} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import SettingDialog from "./SettingDialog.vue";
import "element-plus/theme-chalk/el-loading.css";

import "element-plus/theme-chalk/el-notification.css";

import "element-plus/theme-chalk/el-message-box.css";

import "element-plus/theme-chalk/el-drawer.css";
import useLoginAction from "../hooks/useLoginAction.ts";

const {logout} = useLoginAction();
const themeSwitch = ref(true)
const userInfoStore = userDataInfoStore();
let pwdGroupList = reactive<PwdGroup[]>([]);
const search = ref('');
const searchResultShowFlag = ref(false);
const groupInputShowFlag = ref(false);
const groupInputValue = ref('');
let curGroup = reactive<PwdGroup>({})
let curPwdInfo = reactive<PwdInfo>({})
const pwdInfoList = reactive<PwdInfo[]>([]);
const searchResultList = reactive<PwdInfo[]>([]);
const pwdInfoDetail = reactive<PwdInfo>({});
const searchInputRef = ref(null);
const groupInputRef = ref(null);
const groupInput2Ref = ref(null);
const detailInputRef = ref(null);
const passwordVisible = ref(false);
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

let settingDialog = ref();
onMounted(() => {
  initData();
  transferInputFocus(1);
  dynamicClickCss();
  // 启动键盘事件
  document.addEventListener('keydown', keydown);
  console.log('挂载完毕')
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
  Object.assign(pwdInfoDetail, pwdList[0]);
}

/**
 * 切换input 的光标位置
 * @param type 1: searchInputRef 2:groupInputRef  3: detailInputRef
 */
function transferInputFocus(type: number) {
  if (type === 1 && searchInputRef.value) {
    searchInputRef.value.focus();
  } else if (type === 2 && groupInputRef.value) {
    groupInputRef.value.focus();
  } else if (type === 3 && detailInputRef.value) {
    detailInputRef.value.focus();
  }
}


/**
 * search
 */
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


function clickLock() {
  logout();
}


/**
 * group
 */
function clickGroup(group: PwdGroup) {
  console.log('showPwdList')
  pwdInfoList.length = 0
  Object.assign(curGroup, group);
  // curGroup = group;
  Object.assign(pwdInfoList, group.pwdList);

  Object.assign(curPwdInfo, group.pwdList[0]);
  Object.assign(pwdInfoDetail, group.pwdList[0]);

  // 单击样式
  setTimeout(() => {
    clickGroupCss();
  }, 100)

}

function clickGroupCss() {
  let items = document.getElementById('pwd-ul').getElementsByTagName('li');
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

  let pwdGroup = new PwdGroup(userInfoStore.getGroupId(), groupInputValue.value, []);
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
function clickPwdInfo(pwdInfo: PwdInfo) {
  console.log('showDetail')
  Object.assign(pwdInfoDetail, pwdInfo);
  Object.assign(curPwdInfo, pwdInfo);
}

function insertPwdInfo() {
  console.log('insertPwdInfo')
  let pwdInfo = new PwdInfo(userInfoStore.getPwdInfoId(), curGroup.id, curGroup.title, '', '', '', '', '');
  userInfoStore.insertPwdInfo(pwdInfo)
  // pwdInfoList.push(pwdInfo)
  pwdInfoList.splice(0, pwdInfoList.length, ...userInfoStore.getPwdInfoListByGroupId(curGroup.id));
  Object.assign(pwdInfoDetail, pwdInfo);
  transferInputFocus(3);

  userInfoStore.editAction()
}

function deletePwdInfo() {
  console.log('deletePwdInfo')
  userInfoStore.deletePwdInfo(pwdInfoDetail.id);
  //  删除 pwdGroupList 中的数据
  pwdInfoList.splice(0, pwdInfoList.length, ...userInfoStore.getPwdInfoListByGroupId(curGroup.id));

  userInfoStore.editAction()
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
 * detail
 */
function pwdInfoChange() {
  console.log('pwdInfoChange')
  userInfoStore.updatePwdInfo(pwdInfoDetail)
  userInfoStore.editAction()
}

function copyValue(value: string) {
  console.log('copyValue')
  navigator.clipboard.writeText(value).then(() => {
    console.log('复制成功')
  }, () => {
    console.log('复制失败')
  })
}

function clickPwdImg() {
  console.log('clickPwdImg')
  passwordVisible.value = !passwordVisible.value;
}


function clickRandomImg() {
  console.log('clickRandomImg')
  // 生成随机密码
  let password = '';
  for (let i = 0; i < 15; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  pwdInfoDetail.password = password;
}

/**
 * 动态 样式
 */
function dynamicClickCss() {
  document.getElementById('group-ul').addEventListener('click', function (e) {
    // 移除之前所有li的高亮
    var items = this.getElementsByTagName('li');
    addLiCss(items, e);
  });
  document.getElementById('pwd-ul').addEventListener('click', function (e) {
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
  e.target.classList.add('selected');
}

/**
 * 快捷键 Ctrl + P 复制密码 Ctrl + U 复制用户名
 */
function keydown(e: KeyboardEvent) {
  console.log('keydown', e)
  if (e.ctrlKey && e.key === 'p') {
    copyValue(pwdInfoDetail.password);
  } else if (e.ctrlKey && e.key === 'u') {
    copyValue(pwdInfoDetail.username);
  }
}

function openSettingDialog() {
  console.log('openSettingDialog')
  settingDialog.value.openSettingDialog();

}
</script>

<template>
  <SettingDialog ref="settingDialog"/>
  <div class="outer">
    <div class="search">
      <div>
        <!--        <img src="../../public/switch.svg" alt="switch" @click="clickSwitch" class="search-image">-->
        <el-tooltip
            class="box-item"
            effect="dark"
            content="切换主题"
            placement="right"
        >
          <el-switch
              v-model="themeSwitch"
              class="ml-2"
              style="--el-switch-on-color: rgba(255,255,255,0.72); --el-switch-off-color: rgba(0,0,0,0.5); margin-left: 10px"
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
        <img src="../../public/lock.svg" alt="switch" @click="clickLock" class="search-image">
        <img src="../../public/setting.svg" alt="setting" @click="openSettingDialog" class="search-image">
      </div>
    </div>
    <div class="content">
      <div v-if="!searchResultShowFlag" class="group">
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
            <span @click="triggerGroupsInsert()"> <Plus style="width: 20px; height: 20px; margin-right: 8px"/></span>
          </el-tooltip>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="修改"
              placement="top"
          >
            <span @click="triggerGroupEdit()"> <Edit style="width: 20px; height: 20px; margin-right: 8px"/></span>
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
      <div v-if="!searchResultShowFlag" class="pwd">
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
          <el-input ref="detailInputRef" v-model="pwdInfoDetail.title" @change="pwdInfoChange()"/>
        </div>

        <div class="detail-item">
          <span>用户名</span>
          <el-input v-model="pwdInfoDetail.username" @change="pwdInfoChange()">
            <template #suffix>
              <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="复制用户名,快捷键 Ctrl+U"
                  placement="top"
              >
                <img src="../../public/copy.svg" alt="enter" @click="copyValue(pwdInfoDetail.username)" class="copy">
              </el-tooltip>
            </template>
          </el-input>
        </div>

        <div class="detail-item">
          <span>密码</span>
          <el-input v-model="pwdInfoDetail.password" @change="pwdInfoChange()" :type="passwordVisible ? 'text' : 'password'" class="input-pwd">
            <template #suffix>
              <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="明文展示"
                  placement="top"
              >
                <img src="../../public/ic_view.svg" alt="enter" @click="clickPwdImg" class="copy">
              </el-tooltip>
              <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="生成随机密码"
                  placement="top"
              >
                <img src="../../public/random.svg" alt="enter" @click="clickRandomImg" class="copy">
              </el-tooltip>
              <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="复制密码,快捷键 Ctrl+P"
                  placement="top"
              >
                <img src="../../public/copy.svg" alt="enter" @click="copyValue(pwdInfoDetail.password)" class="copy">
              </el-tooltip>
            </template>
          </el-input>
        </div>

        <div class="detail-item">
          <span> 链接</span>
          <el-input v-model="pwdInfoDetail.link" @change="pwdInfoChange()">
            <template #suffix>
              <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="复制链接"
                  placement="top"
              >
                <img src="../../public/copy.svg" alt="enter" @click="copyValue(pwdInfoDetail.link)" class="copy">
              </el-tooltip>
            </template>
          </el-input>
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
  overflow: hidden;
}

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

.search-result {
  width: 60%;
  border-right: 1px #cab8b8 solid;
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

.copy {
  width: 22px;
  height: 22px;
  border: 1px solid rgba(204, 204, 204, 0);
  border-radius: 50%;
  padding: 1px;
  opacity: 0.4;

}

.copy:hover {
  opacity: 0.4;
  background: #79797BFF;
  box-shadow: #888888 0px 0px 5px 0px;
  cursor: pointer;

}


</style>
