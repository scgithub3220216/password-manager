<script lang="ts" setup>
import {Delete, Edit, Plus} from "@element-plus/icons-vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {PwdGroup, PwdInfo} from "../type.ts";
import emitter from "../../utils/emitter.ts";
import {emitterGroupShortcutKeyTopic, emitterInsertGroupTopic, emitterRefreshGroupData, emitterPwdInfoDragToGroup} from "../../config/config.ts";
import {storeToRefs} from "pinia";
import {useCssSwitchStore} from "../../store/cssSwitch.ts";
import useDBGroup from "../../hooks/useDBGroup.ts";
import useDBPwdInfo from "../../hooks/useDBPwdInfo.ts";
import {useShortcutKeyStore} from "../../store/shortcutKey.ts";
import useDataSync from "../../hooks/useDataSync.ts";
import useGroupShortcutKey from "../../hooks/useGroupShortcutKey.ts";

useGroupShortcutKey()
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
const {countPwdInfo, delPwdInfoByGroupId, updatePwdInfo} = useDBPwdInfo()
const groupList = ref<PwdGroup[]>()
const {syncToOss} = useDataSync()
const dragOverGroupIndex = ref(-1) // 追踪拖拽悬停的分组索引

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
emitter.on(emitterGroupShortcutKeyTopic, (value) => {
  console.log(emitterGroupShortcutKeyTopic, ' 事件被触发 value:', value)
  const index = value as number;
  clickGroupShortcut(index)
})
onUnmounted(() => {
  // 解绑事件
  emitter.off(emitterInsertGroupTopic)
  emitter.off(emitterRefreshGroupData)
  emitter.off(emitterGroupShortcutKeyTopic)
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

function clickGroupShortcut(index: number) {
  console.log(`clickGroupShortcut index:${index}`);
  if (!groupList.value) return;
  if (index < 0 || index >= groupList.value.length) return;

  clickGroup(groupList.value[index], index)
}

function clickGroup(group: PwdGroup, index: number) {
  console.log(`clickGroup index:${index}, groupId:${group.id}' groupTitle:${group.title}`);
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
    // 如果还有账号则二次确认
    if (!confirm("该分组下还有账号,是否确认删除?")) {
      console.log("取消删除");
      return;
    }
    // 删除 groupId = curGroup.value.id 的 pwdList
    await delPwdInfoByGroupId(curGroup.value.id)
  }

  delGroup(curGroup.value.id).then(async () => {
    groupList.value = await listGroup();
    cssSwitchStore.setGroupIndex(-1)
    userDataInfoStore.setCurGroup(null);
  })
}

// 拖拽放置处理函数
function handleDragOver(event: DragEvent) {
  event.preventDefault(); // 允许放置
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}

function handleDragEnter(index: number) {
  console.log("handleDragEnter", index);
  dragOverGroupIndex.value = index;
}

function handleDragLeave() {
  console.log("handleDragLeave");
  dragOverGroupIndex.value = -1;
}

async function handleDrop(group: PwdGroup, index: number, event: DragEvent) {
  console.log("handleDrop", group, index);
  event.preventDefault();
  dragOverGroupIndex.value = -1; // 清除拖拽悬停状态

  if (!event.dataTransfer) return;

  try {
    const pwdInfoData = event.dataTransfer.getData('pwdInfoData');
    if (!pwdInfoData) return;

    const pwdInfo: PwdInfo = JSON.parse(pwdInfoData);

    // 如果拖拽到当前所属分组，则不采取任何动作
    if (pwdInfo.group_id === group.id) {
      console.log("拖拽到当前所属分组，不执行操作");
      return;
    }

    // 更新密码条目的分组信息
    pwdInfo.group_id = group.id;
    pwdInfo.group_title = group.title;

    await updatePwdInfo(pwdInfo);
    console.log("密码条目分组更新成功");

    // 通知密码列表刷新
    emitter.emit(emitterPwdInfoDragToGroup, true);

    // 同步到 OSS
    syncToOss();
  } catch (error) {
    console.error("拖拽处理失败", error);
  }
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
                  'hover-effect-light-group': isHover && !darkSwitch,
                  'drag-over-target': dragOverGroupIndex === index
              }"
              @click="clickGroup(group,index)"
              @dragover="handleDragOver($event)"
              @dragenter="handleDragEnter(index)"
              @dragleave="handleDragLeave()"
              @drop="handleDrop(group, index, $event)"
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

/* 拖拽目标高亮样式 */
.drag-over-target {
  background-color: #409eff !important;
  color: white !important;
  border-left: 3px solid #67c23a;
  transition: all 0.3s ease;
}

</style>