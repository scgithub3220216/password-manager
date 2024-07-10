<script setup lang="ts">
import {Delete, Plus} from "@element-plus/icons-vue";
import {ElMessageBox} from "element-plus";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {PwdInfo} from "../type.ts";
import emitter from "../../utils/emitter.ts";
import {emitterInsertPwdInfoTopic} from "../../config/config.ts";
import {storeToRefs} from "pinia";
import {useCssSwitchStore} from "../../store/cssSwitch.ts";
import useDBPwdInfo from "../../hooks/useDBPwdInfo.ts";
import {useShortcutKeyStore} from "../../store/shortcutKey.ts";

const userDataInfoStore = useUserDataInfoStore();
const {darkSwitch, curGroup, changePwdInfoFlag, curPwdInfo} = storeToRefs(userDataInfoStore)
const shortcutKeyStore = useShortcutKeyStore();
const {shortCutKeyCombs} = storeToRefs(shortcutKeyStore);
const isHover = ref(false);
const cssSwitchStore = useCssSwitchStore();
const {curPwdListIndex} = storeToRefs(cssSwitchStore)
const {insertPwdInfo, delPwdInfo, listPwdInfo} = useDBPwdInfo();

const pwdInfoList = ref<PwdInfo[]>();
let props = defineProps(['transferInputFocus'])


onMounted(() => {
  console.log("PwdInfoList onMounted");
  queryAndRefreshIndex(curGroup.value.id)
});
watch(curGroup.value, (newVal) => {
  console.log('watch curGroup:', newVal)
  queryPwdInfo(newVal.id)
  queryAndRefreshIndex(newVal.id)
})

function queryAndRefreshIndex(groupId: number) {
  if (!groupId) return;

  queryPwdInfo(groupId).then(() => {
    if (!pwdInfoList.value) return;
    userDataInfoStore.setCurPwdInfo(pwdInfoList.value[0])
    cssSwitchStore.setPwdListIndex(0)
  })

}

watch(changePwdInfoFlag, (newVal) => {
  console.log('changePwdInfoFlag: newVal', newVal)
  if (newVal) {
    queryPwdInfo(curGroup.value.id)
    userDataInfoStore.setChangePwdInfoFlag(false)
  }
})

async function queryPwdInfo(groupId: number) {
  pwdInfoList.value = await listPwdInfo(groupId);
}

// 绑定事件
emitter.on(emitterInsertPwdInfoTopic, (value) => {
  console.log(emitterInsertPwdInfoTopic, ' 事件被触发 value:', value)
  addPwdInfo()
})

onUnmounted(() => {
  // 解绑事件
  emitter.off(emitterInsertPwdInfoTopic)
})

function addPwdInfo() {
  // PwdInfo input 输入框的光标
  props.transferInputFocus();

  insertPwdInfo(curGroup.value.id, curGroup.value.title)
      .then(async () => {
        console.log('新增 PwdInfo 结束')
        // 重新查询
        pwdInfoList.value = await listPwdInfo(curGroup.value.id);
        console.log(pwdInfoList.value)
        userDataInfoStore.setCurPwdInfo(pwdInfoList.value[pwdInfoList.value.length - 1])
        console.log(userDataInfoStore.curPwdInfo)

        // css
        cssSwitchStore.setPwdListIndex(pwdInfoList.value.length - 1)
      })
}

function clickDelete() {
  // 判断当前是否还有账号
  if (curPwdInfo.value && curPwdInfo.value.id) {
    openDelPwdInfoMsgBox();
  }
}

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

function clickPwdInfo(value: PwdInfo, index: number) {
  console.log("clickPwdInfo");
  userDataInfoStore.setCurPwdInfo(value);
  cssSwitchStore.setPwdListIndex(index)
}


function deletePwdInfo() {
  console.log("deletePwdInfo");
  delPwdInfo(curPwdInfo.value.id).then(() => queryAndRefreshIndex(curGroup.value.id))
}
</script>

<template>
  <div class="pwdInfo-list">
    <div class="pwd-item">
      <el-scrollbar>
        <ul id="pwd-ul">
          <li
              v-for="(pwdInfo,index) in pwdInfoList"
              :key="index"
              @click="clickPwdInfo(pwdInfo,index)"
              :class="{
                  'selected-dark-pwdList': curPwdListIndex === index && darkSwitch,
                  'selected-light-pwdList': curPwdListIndex === index && !darkSwitch,
                  'hover-effect-dark-pwdList': isHover && darkSwitch,
                  'hover-effect-light-pwdList': isHover && !darkSwitch
              }"
              @mouseover="isHover = true" @mouseout="isHover = false"
          >
            {{ pwdInfo.title }}
          </li>
        </ul>
      </el-scrollbar>
    </div>
    <div class="pwd-tools">
      <el-tooltip class="box-item" effect="dark" :content="'新增,快捷键'+shortCutKeyCombs[6].desc" placement="top">
        <span class="tool" @click="addPwdInfo">
          <Plus style="width: 20px; height: 20px"/>
        </span>
      </el-tooltip>
      <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
        <el-button style="border: 0;background: none;color: initial;" :disabled="!curPwdInfo || !curPwdInfo.id" class="tool" @click="clickDelete">
          <Delete style="width: 20px; height: 20px"/>
        </el-button>
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
  height: 27px;
}

.pwd-item {
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 32px;
}

.pwd-tools {
  display: flex;
  justify-content: space-around;
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