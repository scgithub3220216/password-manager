<script setup lang="ts">
import {Delete, Plus} from "@element-plus/icons-vue";
import {ElMessageBox} from "element-plus";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {onUnmounted, reactive, watch} from "vue";
import {PwdInfo} from "../type.ts";
import emitter from "../../utils/emitter.ts";
import {emitterInsertPwdInfoTopic} from "../../config/config.ts";
import {storeToRefs} from "pinia";

const userDataInfoStore = useUserDataInfoStore();
const {shortCutKeyCombs} = storeToRefs(userDataInfoStore)

let props = defineProps(['transferInputFocus'])
// 绑定事件
emitter.on(emitterInsertPwdInfoTopic, (value) => {
  console.log(emitterInsertPwdInfoTopic, ' 事件被触发 value:', value)
  insertPwdInfo()
})

onUnmounted(() => {
  // 解绑事件
  emitter.off(emitterInsertPwdInfoTopic)
})
const openDelPwdInfoMsgBox = () => {
  ElMessageBox.confirm("确认删除此帐号?", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
    customStyle: {
      width: "250px",
    },
  })
      .then(() => {
        deletePwdInfo();
      })
      .catch(() => {
      });
};
const pwdInfoList = reactive<PwdInfo[]>([]);
// const curGroup = reactive(userDataInfoStore.curGroup);
const {curGroup} = storeToRefs(userDataInfoStore)
watch(curGroup.value, (newVal) => {
  console.log("watch curGroup newVal:", newVal.id);
  pwdInfoList.splice(
      0,
      pwdInfoList.length,
      ...userDataInfoStore.getPwdInfoListByGroupId(newVal.id)
  );
});

function clickPwdInfo(value: PwdInfo) {
  console.log("clickPwdInfo");
  userDataInfoStore.setCurPwdInfo(value);
}


function insertPwdInfo() {
  // drawer.value = true;
  console.log(`insertPwdInfo curGroup.id:${curGroup.value.id}`);
  // PwdInfo input 输入框的光标
  props.transferInputFocus(3);

  let newPwdInfo = new PwdInfo(
      userDataInfoStore.generatePwdInfoId(),
      curGroup.value.id,
      curGroup.value.title,
      "",
      "",
      "",
      "",
      ""
  );

  userDataInfoStore.insertPwdInfo(newPwdInfo);

  pwdInfoList.splice(
      0,
      pwdInfoList.length,
      ...userDataInfoStore.getPwdInfoListByGroupId(curGroup.value.id)
  );
}

function deletePwdInfo() {
  console.log("deletePwdInfo");
  userDataInfoStore.deletePwdInfo(userDataInfoStore.curPwdInfo.id);
  //  删除 pwdGroupList 中的数据
  pwdInfoList.splice(
      0,
      pwdInfoList.length,
      ...userDataInfoStore.getPwdInfoListByGroupId(curGroup.value.id)
  );
}
</script>

<template>
  <div class="pwdInfo-list">
    <div class="pwd-item">
      <ul id="pwd-ul">
        <li
            v-for="pwdInfo in pwdInfoList"
            :key="pwdInfo.id"
            @click="clickPwdInfo(pwdInfo)"
        >
          {{ pwdInfo.title }}
        </li>
      </ul>
    </div>
    <div class="pwd-tools">
      <el-tooltip class="box-item" effect="dark" :content="'新增,快捷键'+shortCutKeyCombs[6].desc" placement="top">
        <span @click="insertPwdInfo()">
          <Plus style="width: 20px; height: 20px; margin-right: 8px"
          /></span>
      </el-tooltip>
      <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
        <span @click="openDelPwdInfoMsgBox()">
          <Delete style="width: 20px; height: 20px"
          /></span>
      </el-tooltip>
    </div>
    <!-- <el-drawer v-model="drawer" title="I am the title" :with-header="false">
      <span>Hi there!</span>
    </el-drawer> -->
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
  height: 27px;
}

.pwd-item {
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 32px;
}

.pwd-tools span {
  padding: 8px 8px 0 8px;
  margin-left: 10px;
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