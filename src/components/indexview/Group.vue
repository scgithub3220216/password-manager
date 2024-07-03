<script setup lang="ts">
import {Delete, Download, Edit, Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import useExcel from "../../hooks/useExcel.ts";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {PwdGroup} from "../type.ts";
import emitter from "../../utils/emitter.ts";
import {emitterInsertGroupTopic} from "../../config/config.ts";
import {storeToRefs} from "pinia";
import {useCssSwitchStore} from "../../store/cssSwitch.ts";

const userDataInfoStore = useUserDataInfoStore();
const groupInputRef = ref();
const {shortCutKeyCombs} = storeToRefs(userDataInfoStore)

const groupInputShowFlag = ref(false);
const groupInputValue = ref("");
const {exportExcel} = useExcel();
const groupInput2Ref = ref(null);
const curGroup = reactive<PwdGroup>({});
const pwdGroupList = reactive<PwdGroup[]>([]);
const cssSwitchStore = useCssSwitchStore();

const {curGroupIndex} = storeToRefs(cssSwitchStore)
onMounted(() => {
  console.log("Index onMounted");
  initData();
});

// 绑定事件
emitter.on(emitterInsertGroupTopic, (value) => {
  console.log(emitterInsertGroupTopic, ' 事件被触发 value:', value)
  triggerGroupsInsert()
})

onUnmounted(() => {
  // 解绑事件
  emitter.off(emitterInsertGroupTopic)
})

function initData() {
  Object.assign(pwdGroupList, userDataInfoStore.pwdGroupList);
  if (!(pwdGroupList && pwdGroupList.length > 0)) {
    console.log("pwdGroupList 为空");
    return;
  }
  let pwdList = pwdGroupList[0].pwdList;
  userDataInfoStore.setCurGroup(pwdGroupList[0]);
  userDataInfoStore.setCurPwdInfo(pwdList[0]);
}


function clickGroup(group: PwdGroup, index: number) {
  console.log(`clickGroup groupId:${group.id}' groupTitle:${group.title}`);
  userDataInfoStore.setCurGroup(group);
  userDataInfoStore.setCurPwdInfo(group.pwdList[0]);
  Object.assign(curGroup, group);
  // 单击样式
  cssSwitchStore.setGroupIndex(index)
  cssSwitchStore.setPwdListIndex(0)
}


function triggerGroupsInsert() {
  console.log("triggerGroupsInsert");
  groupInputShowFlag.value = true;
  groupInputRef.value.focus();
}

function groupInputChange() {
  console.log("groupInputChange");
  if (!(groupInputValue.value && groupInputValue.value.trim())) {
    groupInputShowFlag.value = false;
    return;
  }
  console.log("groupInputChange2");
  let pwdGroup = new PwdGroup(
      userDataInfoStore.generateGroupId(),
      groupInputValue.value,
      []
  );
  pwdGroupList.push(pwdGroup);
  userDataInfoStore.insertGroup(pwdGroup);
  groupInputShowFlag.value = false;
  groupInputValue.value = "";

  cssSwitchStore.addGroupSwitch()
}


async function triggerGroupEdit() {
  console.log("triggerGroupEdit1");
  userDataInfoStore.editGroupFlag(curGroup.id, true);
}

function editGroups() {
  console.log("editGroups");
  userDataInfoStore.editGroupFlag(curGroup.id, false);
  userDataInfoStore.editAction();
}

function deleteGroup() {
  console.log("deleteGroup");
  let flag = false;
  pwdGroupList.forEach((pwdGroup) => {
    if (flag) {
      return;
    }
    if (pwdGroup.id === curGroup.id) {
      if (pwdGroup.pwdList.length > 0) {
        flag = true;
      }
    }
  });
  if (flag) {
    ElMessage.error("删除失败, 该分组下还有数据");
    return false;
  }
  userDataInfoStore.deleteGroup(curGroup.id);
  //  删除 pwdGroupList 中的数据
  pwdGroupList.splice(
      0,
      pwdGroupList.length,
      ...userDataInfoStore.pwdGroupList
  );
  ElMessage.success("删除成功");
}
</script>

<template>
  <div class="group">
    <div class="group-data">
      <el-scrollbar>

        <ul id="group-ul">
          <li
              v-for="(group,index) in pwdGroupList"
              :key="index"
              @click="clickGroup(group,index)"
              :class="{ selected: curGroupIndex === index }"
          >
            <span v-show="!group.editFlag"> {{ group.title }}</span>
            <el-input
                v-show="group.editFlag"
                ref="groupInput2Ref"
                v-model="group.title"
                @change="editGroups()"
                @blur="editGroups()"
            ></el-input>
          </li>
        </ul>
        <el-input
            ref="groupInputRef"
            v-model="groupInputValue"
            v-show="groupInputShowFlag"
            @change="groupInputChange()"
            @blur="groupInputChange()"
        />
      </el-scrollbar>
    </div>

    <div class="group-tools">
      <el-tooltip class="box-item" effect="dark" :content="'新增,快捷键'+shortCutKeyCombs[5].desc" placement="top">
        <span @click="triggerGroupsInsert()">
          <Plus style="width: 20px; height: 20px; margin-right: 8px"
          /></span>
      </el-tooltip>
      <el-tooltip class="box-item" effect="dark" content="修改" placement="top">
        <span @blur="triggerGroupEdit" @click="triggerGroupEdit()">
          <Edit style="width: 20px; height: 20px; margin-right: 8px"
          /></span>
      </el-tooltip>

      <el-tooltip class="box-item" effect="dark" content="导出" placement="top">
        <span @click="exportExcel">
          <Download style="width: 20px; height: 20px"
          /></span>
      </el-tooltip>

      <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
        <span @click="deleteGroup()">
          <Delete style="width: 20px; height: 20px"
          /></span>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped>
.group {
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.group-data {
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 32px;

}

.group-tools span {
  padding: 4px 4px 0 4px;
  margin-left: 5px;
  /* border: 1px solid rgba(0, 0, 0, 0.15); */
}

.group-tools span:hover {
  box-shadow: #213547;
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

.selected {
  background: rgba(255, 255, 255, 0.08);
}
</style>