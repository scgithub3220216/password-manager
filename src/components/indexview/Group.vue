<script lang="ts" setup>
import {Delete, Edit, Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {PwdGroup} from "../type.ts";
import emitter from "../../utils/emitter.ts";
import {emitterInsertGroupTopic, emitterRefreshGroupData} from "../../config/config.ts";
import {storeToRefs} from "pinia";
import {useCssSwitchStore} from "../../store/cssSwitch.ts";
import useDBGroup from "../../hooks/useDBGroup.ts";
import useDBPwdInfo from "../../hooks/useDBPwdInfo.ts";
import {useShortcutKeyStore} from "../../store/shortcutKey.ts";
import useDataSync from "../../hooks/useDataSync.ts";

const userDataInfoStore = useUserDataInfoStore();
const {curGroup, darkSwitch, importFlag} = storeToRefs(userDataInfoStore)
const shortcutKeyStore = useShortcutKeyStore();
const {shortCutKeyCombs} = storeToRefs(shortcutKeyStore);

const groupInputRef = ref();
const groupInputShowFlag = ref(false);
const groupInputValue = ref("");
const isHover = ref(false);
const cssSwitchStore = useCssSwitchStore();
const {curGroupIndex} = storeToRefs(cssSwitchStore)
const curEditGroupIndex = ref(-1)
const {insertGroup, delGroup, updateGroup, listGroup} = useDBGroup();
const {countPwdInfo} = useDBPwdInfo()
const groupList = ref<PwdGroup[]>()
const {syncToOss} = useDataSync()

onMounted(() => {
  console.log("Index onMounted");
  initData();
});

// 绑定事件
emitter.on(emitterInsertGroupTopic, (value) => {
  console.log(emitterInsertGroupTopic, ' 事件被触发 value:', value)
  triggerGroupsInsert()
})
emitter.on(emitterRefreshGroupData, (value) => {
  console.log(emitterRefreshGroupData, ' 事件被触发 value:', value)
  initData()
})

onUnmounted(() => {
  // 解绑事件
  emitter.off(emitterInsertGroupTopic)
  emitter.off(emitterRefreshGroupData)
})

watch((importFlag), async (newVal) => {
  if (!newVal) return;
  groupList.value = await listGroup();
  if (!(groupList.value && groupList.value.length > 0)) {
    return;
  }
  userDataInfoStore.setCurGroup(groupList.value[0]);
  userDataInfoStore.importFlag = false;
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
        syncToOss()
      })

}


function triggerGroupEdit() {
  console.log("triggerGroupEdit1");
  curEditGroupIndex.value = curGroupIndex.value;
}

function editGroups(title: string) {
  console.log("editGroups");
  curEditGroupIndex.value = -1;
  updateGroup(title, curGroup.value.id)
      .then(() => syncToOss())
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
              :class="{
                  'selected-dark-group': curGroupIndex === index && darkSwitch,
                  'selected-light-group': curGroupIndex === index && !darkSwitch,
                  'hover-effect-dark-group': isHover && darkSwitch,
                  'hover-effect-light-group': isHover && !darkSwitch
              }"
              @click="clickGroup(group,index)"
              @mouseout="isHover = false" @mouseover="isHover = true"
          >
            <span v-show="index !== curEditGroupIndex"> {{ group.title }}</span>
            <el-input
                v-show="index === curEditGroupIndex"
                v-model="group.title"
                @blur="editGroups(group.title)"
                @change="editGroups(group.title)"
            ></el-input>
          </li>
        </ul>
        <el-input
            v-show="groupInputShowFlag"
            ref="groupInputRef"
            v-model="groupInputValue"
            @blur="groupInputChange()"
            @change="groupInputChange()"
        />
      </el-scrollbar>
    </div>

    <div class="group-tools">
      <el-tooltip :content="'新增'+(shortCutKeyCombs[5].desc?',快捷键'+shortCutKeyCombs[5].desc:'')" class="box-item" effect="dark" placement="top">
        <span class="tool" @click="triggerGroupsInsert()">
          <Plus style="width: 20px; height: 20px"/>
        </span>
      </el-tooltip>
      <el-tooltip class="box-item" content="修改" effect="dark" placement="top">
        <span class="tool" @click="triggerGroupEdit()">
          <Edit style="width: 20px; height: 20px"/>
        </span>
      </el-tooltip>

      <el-tooltip class="box-item" content="删除" effect="dark" placement="top">
        <!--        <el-button style="border: 0;background: none;color: initial;" :disabled="deleteFlag" class="tool" @click="deleteGroup()">-->
        <el-button class="tool" style="border: 0;background: none;color: initial;" @click="deleteGroup()">
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
  overflow-x: hidden;
  white-space: nowrap; /* 不换行 */

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