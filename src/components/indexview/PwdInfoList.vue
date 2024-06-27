<script setup lang="ts">

import {Delete, Plus} from "@element-plus/icons-vue";
import {ElMessageBox} from "element-plus";
import {PwdInfo} from "../../store/type.ts";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {reactive, watch} from "vue";

const userDataInfoStore = useUserDataInfoStore();
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
const pwdInfoList = reactive<PwdInfo[]>([]);
const curGroup = reactive(userDataInfoStore.curGroup);
watch(curGroup, (newVal) => {
  console.log('watch curGroup newVal:', newVal)
  pwdInfoList.splice(0, pwdInfoList.length, ...userDataInfoStore.getPwdInfoListByGroupId(newVal.id));
})

function clickPwdInfo(value: PwdInfo) {
  console.log('clickPwdInfo')
  userDataInfoStore.setCurPwdInfo(value)
}

function insertPwdInfo() {
  console.log(`insertPwdInfo curGroup.id:${curGroup.id}`)
  let newPwdInfo = new PwdInfo(userDataInfoStore.generatePwdInfoId(), curGroup.id, curGroup.title, '', '', '', '', '');

  userDataInfoStore.insertPwdInfo(newPwdInfo)

  pwdInfoList.splice(0, pwdInfoList.length, ...userDataInfoStore.getPwdInfoListByGroupId(curGroup.id));

  // todo
  // transferInputFocus(3);
}

function deletePwdInfo() {
  console.log('deletePwdInfo')
  userDataInfoStore.deletePwdInfo(userDataInfoStore.curPwdInfo.id);
  //  删除 pwdGroupList 中的数据
  pwdInfoList.splice(0, pwdInfoList.length, ...userDataInfoStore.getPwdInfoListByGroupId(curGroup.id));

}


</script>

<template>
  <div class="pwdInfo-list">
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
</template>

<style scoped>
.pwdInfo-list {
  width: 35%;
  border-left: 1px #cab8b8 solid;
  border-right: 1px #cab8b8 solid;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#pwd-ul li {
  height: 35px;
}

.pwd-item {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>