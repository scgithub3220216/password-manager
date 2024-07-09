<script setup lang="ts">
import {Delete, Download, Edit, Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {onMounted, onUnmounted, ref} from "vue";
import useExcel from "../../hooks/useExcel.ts";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {PwdGroup} from "../type.ts";
import emitter from "../../utils/emitter.ts";
import {emitterInsertGroupTopic} from "../../config/config.ts";
import {storeToRefs} from "pinia";
import {useCssSwitchStore} from "../../store/cssSwitch.ts";
import useDBGroup from "../../hooks/useDBGroup.ts";
import useDBPwdInfo from "../../hooks/useDBPwdInfo.ts";

const userDataInfoStore = useUserDataInfoStore();
const groupInputRef = ref();
const {shortCutKeyCombs} = storeToRefs(userDataInfoStore)

const groupInputShowFlag = ref(false);
const groupInputValue = ref("");
const {exportExcel} = useExcel();
const groupInput2Ref = ref(null);
const {curGroup} = storeToRefs(userDataInfoStore)
const {userInfo} = storeToRefs(userDataInfoStore)
const isHover = ref(false);
const cssSwitchStore = useCssSwitchStore();
const {curGroupIndex} = storeToRefs(cssSwitchStore)
const curEditGroupIndex = ref(-1)
const {insertGroup, delGroup, updateGroup, listGroup} = useDBGroup();
const {countPwdInfo} = useDBPwdInfo()
const groupList = ref<PwdGroup[]>()

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



async function initData() {
  groupList.value = await listGroup();
  if (!(groupList.value && groupList.value.length > 0)) {
    userDataInfoStore.setCurGroup(null);
    cssSwitchStore.setGroupIndex(-1)
    return;
  }
  userDataInfoStore.setCurGroup(groupList.value[0]);
  cssSwitchStore.setGroupIndex(0)
}


function clickGroup(group: PwdGroup, index: number) {
  console.log(`clickGroup groupId:${group.id}' groupTitle:${group.title}`);
  userDataInfoStore.setCurGroup(group);
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
  insertGroup(groupInputValue.value, 0)
      .then(async () => {
        console.log("新增成功");
        groupInputShowFlag.value = false;
        groupInputValue.value = "";

        groupList.value = await listGroup();
        userDataInfoStore.setCurGroup(groupList.value[groupList.value?.length - 1]);
        cssSwitchStore.setGroupIndex(groupList.value?.length - 1)
      })

}


function triggerGroupEdit() {
  console.log("triggerGroupEdit1");
  curEditGroupIndex.value = curGroupIndex.value;
}

function editGroups() {
  console.log("editGroups");
  curEditGroupIndex.value = -1;
  updateGroup(curGroup.value.title, curGroup.value.id);
}

async function deleteGroup() {
  console.log("deleteGroup");
  // 判断下面是否还有数据
  let count = await countPwdInfo(curGroup.value.id);
  if (count > 0) {
    ElMessage.error("该分组下还有账号,不能删除");
    return;
  }

  delGroup(curGroup.value.id).then(async () => {
    ElMessage.success("删除成功");
    groupList.value = await listGroup();
    cssSwitchStore.setGroupIndex(-1)
    userDataInfoStore.setCurGroup(null);
  })
}
</script>

<template>
  <div class="group">
    <div class="group-data">
      <el-scrollbar>

        <ul id="group-ul">
          <li
              v-for="(group,index) in groupList"
              :key="index"
              @click="clickGroup(group,index)"
              :class="{
                  'selected-dark': curGroupIndex === index && userInfo.darkSwitch,
                  'selected-light': curGroupIndex === index && !userInfo.darkSwitch,
                  'hover-effect-dark': isHover && userInfo.darkSwitch,
                  'hover-effect-light': isHover && !userInfo.darkSwitch
              }"
              @mouseover="isHover = true" @mouseout="isHover = false"
          >
            <span v-show="index !== curEditGroupIndex"> {{ group.title }}</span>
            <el-input
                v-show="index === curEditGroupIndex"
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
        <span class="tool" @click="triggerGroupsInsert()">
          <Plus style="width: 20px; height: 20px"/>
        </span>
      </el-tooltip>
      <el-tooltip class="box-item" effect="dark" content="修改" placement="top">
        <span class="tool" @click="triggerGroupEdit()">
          <Edit style="width: 20px; height: 20px"/>
        </span>
      </el-tooltip>

      <el-tooltip class="box-item" effect="dark" content="导出" placement="top">
        <span class="tool" @click="exportExcel">
          <Download style="width: 20px; height: 20px"/>
        </span>
      </el-tooltip>

      <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
        <!--        <el-button style="border: 0;background: none;color: initial;" :disabled="deleteFlag" class="tool" @click="deleteGroup()">-->
        <el-button style="border: 0;background: none;color: initial;" class="tool" @click="deleteGroup()">
          <Delete style="width: 20px; height: 20px"/>
        </el-button>
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

.group-tools {
  display: flex;
  justify-content: space-evenly;
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

</style>