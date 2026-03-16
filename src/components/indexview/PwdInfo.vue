<script lang="ts" setup>
import {ref} from "vue";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import useBrowser from "../../hooks/useBrowser.ts";
import RandomPwdGenerate from "./RandomPwdGenerate.vue";
import ImageGallery from "./ImageGallery.vue";

import {ChromeFilled, Compass, CopyDocument, EditPen, Hide, Picture, Switch, UserFilled, View,} from "@element-plus/icons-vue";
import {storeToRefs} from "pinia";
import useDBPwdInfo from "../../hooks/useDBPwdInfo.ts";
import {useShortcutKeyStore} from "../../store/shortcutKey.ts";
import useDataSync from "../../hooks/useDataSync.ts";
import {useSearchResultStore} from "../../store/searchResult.ts";
import emitter from "../../utils/emitter.ts";
import {updatePwdInfoTitle} from "../../config/config.ts";

const pwdInfoTitleInput = ref(null);
const passwordVisible = ref(false);
const userDataInfoStore = useUserDataInfoStore();
const {curPwdInfo, curGroup} = storeToRefs(userDataInfoStore)
const searchResultStore = useSearchResultStore();
// const {updateRowTitle} = storeToRefs(searchResultStore)
const {openBrowser} = useBrowser();
const shortcutKeyStore = useShortcutKeyStore();
const {shortCutKeyCombs} = storeToRefs(shortcutKeyStore);

const randomPwdGenerateRef = ref();
defineExpose({keydown, pwdInfoTitleInput});
const {updatePwdInfo} = useDBPwdInfo();
const {insertPwdInfo} = useDBPwdInfo();
const {syncToOss} = useDataSync()

async function pwdInfoChange() {
  console.log("pwdInfoChange");
  if (!curPwdInfo.value.group_id) {
    // 新增
    const id = await insertPwdInfo(curGroup.value.id, curGroup.value.title, curPwdInfo.value.type ?? 0);
    console.log('id:', id)
    if (id) {
      curPwdInfo.value.id = id;
      curPwdInfo.value.group_id = curGroup.value.id;
      curPwdInfo.value.group_title = curGroup.value.title;
    }
  } else {
    console.log(`PwdInfo.vue updateRowTitle`)
    searchResultStore.updateRowTitle(curPwdInfo.value.id, curPwdInfo.value.title)
    emitter.emit(updatePwdInfoTitle,[curPwdInfo.value.id, curPwdInfo.value.title])
  }
  updatePwdInfo(curPwdInfo.value)
      .then(() => {
        userDataInfoStore.setChangePwdInfoFlag(true)
        syncToOss()
      })
}


function keydown(e: KeyboardEvent) {
  // console.log('keydown', e)
  if (e.ctrlKey && e.key === "p") {
    copyValue(curPwdInfo.value.password);
  } else if (e.ctrlKey && e.key === "u") {
    copyValue(curPwdInfo.value.username);
  }
}

function copyValue(value: string | undefined) {
  console.log("copyValue");
  if (!value) {
    return;
  }
  navigator.clipboard.writeText(value).then(
      () => {
        console.log("复制成功");
      },
      () => {
        console.log("复制失败");
      }
  );
}

function clickPwdImg() {
  console.log("clickPwdImg");
  passwordVisible.value = !passwordVisible.value;
}

function switchMode(mode: number) {
  curPwdInfo.value.type = mode;
  pwdInfoChange();
}
</script>

<template>
  <div class="pwdInfo">
    <div class="mode-switch-row">
      <span class="pwdInfo-item">标题</span>
      <div class="mode-switch">
        <el-tooltip content="普通模式" effect="dark" placement="top">
          <el-icon
              class="mode-icon"
              :class="{'mode-icon-active': curPwdInfo.type !== 1}"
              @click="switchMode(0)"
          >
            <EditPen/>
          </el-icon>
        </el-tooltip>
        <el-tooltip content="图片模式" effect="dark" placement="top">
          <el-icon
              class="mode-icon"
              :class="{'mode-icon-active': curPwdInfo.type === 1}"
              @click="switchMode(1)"
          >
            <Picture/>
          </el-icon>
        </el-tooltip>
      </div>
    </div>
    <el-input
        ref="pwdInfoTitleInput"
        v-model="curPwdInfo.title"
        :prefix-icon="EditPen"
        class="input-pwd"
        @change="pwdInfoChange()"
    />

    <template v-if="curPwdInfo.type !== 1">
      <span class="pwdInfo-item">用户名</span>
      <el-input
          v-model="curPwdInfo.username"
          :prefix-icon="UserFilled"
          class="input-pwd"
          @change="pwdInfoChange()"
      >
        >
        <template #suffix>
          <el-tooltip
              :content="'复制用户名'+(shortCutKeyCombs[2].desc?',快捷键'+shortCutKeyCombs[2].desc:'')"
              class="box-item"
              effect="dark"
              placement="top"
          >
            <el-icon class="img-item" @click="copyValue(curPwdInfo.username)"
            >
              <CopyDocument/>
            </el-icon>
          </el-tooltip>
        </template>
      </el-input>

      <span class="pwdInfo-item">密码</span>
      <el-input
          v-model="curPwdInfo.password"
          :prefix-icon="Hide"
          :type="passwordVisible ? 'text' : 'password'"
          class="input-pwd"
          @change="pwdInfoChange()"
      >
        <template #suffix>
          <el-tooltip
              class="box-item"
              content="明文展示"
              effect="dark"
              placement="top"
          >
            <el-icon class="img-item" @click="clickPwdImg">
              <View/>
            </el-icon>
          </el-tooltip>
          <el-tooltip
              class="box-item"
              content="生成随机密码"
              effect="dark"
              placement="top"
          >
            <el-icon class="img-item" @click="randomPwdGenerateRef.dialogVisible = true">
              <Switch/>
            </el-icon>
          </el-tooltip>
          <el-tooltip
              :content="'复制密码'+(shortCutKeyCombs[3].desc?',快捷键'+shortCutKeyCombs[3].desc:'')"
              class="box-item"
              effect="dark"
              placement="top"
          >
            <el-icon class="img-item" @click="copyValue(curPwdInfo.password)">
              <CopyDocument/>
            </el-icon>

          </el-tooltip>
        </template>
      </el-input>

      <span class="pwdInfo-item"> 链接</span>
      <el-input
          v-model="curPwdInfo.link"
          :prefix-icon="Compass"
          class="input-pwd"
          @change="pwdInfoChange()"
      >
        <template #suffix>
          <el-tooltip
              class="box-item"
              content="在浏览器中打开"
              effect="dark"
              placement="top"
          >
            <el-icon class="img-item" @click="openBrowser(curPwdInfo.link)">
              <ChromeFilled/>
            </el-icon>
          </el-tooltip>

          <el-tooltip
              :content="'复制链接'+(shortCutKeyCombs[4].desc?',快捷键'+shortCutKeyCombs[4].desc:'')"
              class="box-item"
              effect="dark"
              placement="top"
          >
            <el-icon class="img-item" @click="copyValue(curPwdInfo.link)">
              <CopyDocument/>
            </el-icon>
          </el-tooltip>

        </template>
      </el-input>

      <span class="pwdInfo-item"> 说明</span>
      <div>
        <el-input
            v-model="curPwdInfo.remark"
            :rows="9"
            class="item-textarea input-pwd"
            type="textarea"
            @change="pwdInfoChange()"
        />
      </div>
    </template>

    <ImageGallery v-if="curPwdInfo.type === 1"/>
  </div>

  <RandomPwdGenerate ref="randomPwdGenerateRef" :updatePwdInfo="pwdInfoChange"/>
</template>

<style scoped>
.pwdInfo {
  width: 40%;
  margin-top: 2%;
}

.mode-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mode-switch {
  display: flex;
  gap: 4px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  padding: 2px;
  margin-right: 2%;
}

.mode-icon {
  width: 28px;
  height: 28px;
  cursor: pointer;
  border-radius: 3px;
  opacity: 0.4;
  transition: all 0.2s;
}

.mode-icon:hover {
  opacity: 0.7;
}

.mode-icon-active {
  opacity: 1;
  background: var(--el-color-primary);
  color: #fff;
}

.pwdInfo-item {
  display: flex;
  padding: 10px;
  flex-direction: column;
  align-items: start;
  font-size: 14px;
}

.input-pwd {
  width: 98%;
}

.item-input {
  color: white;
  font-size: 16px;
  border: 0 none;
  background: transparent;
}

.item-textarea {
  color: white;
  font-size: 16px;
  border: 0 none;
  background: transparent;
}

.img-item {
  width: 22px;
  height: 22px;
  border: 1px solid rgba(204, 204, 204, 0);
  border-radius: 50%;
  padding: 1px;
  opacity: 0.4;
}

.img-item:hover {
  cursor: pointer;
  transform: scale(1.5);
}

</style>