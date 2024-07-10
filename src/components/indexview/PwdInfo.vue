<script setup lang="ts">
import {ref} from "vue";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import useBrowser from "../../hooks/useBrowser.ts";
import RandomPwdGenerate from "./RandomPwdGenerate.vue";

import {ChromeFilled, Compass, CopyDocument, EditPen, Hide, Switch, UserFilled, View,} from "@element-plus/icons-vue";
import {storeToRefs} from "pinia";
import useDBPwdInfo from "../../hooks/useDBPwdInfo.ts";
import {useShortcutKeyStore} from "../../store/shortcutKey.ts";

const pwdInfoTitleInput = ref(null);
const passwordVisible = ref(false);
const userDataInfoStore = useUserDataInfoStore();
const {curPwdInfo} = storeToRefs(userDataInfoStore)

const {openBrowser} = useBrowser();
const shortcutKeyStore = useShortcutKeyStore();
const {shortCutKeyCombs} = storeToRefs(shortcutKeyStore);

const randomPwdGenerateRef = ref();
defineExpose({keydown, pwdInfoTitleInput});
const {updatePwdInfo} = useDBPwdInfo();

function pwdInfoChange() {
  console.log("pwdInfoChange");
  updatePwdInfo(curPwdInfo.value).then(() => userDataInfoStore.setChangePwdInfoFlag(true))
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
</script>

<template>
  <div class="pwdInfo">
    <span class="pwdInfo-item">标题</span>
    <el-input
        ref="pwdInfoTitleInput"
        v-model="curPwdInfo.title"
        @change="pwdInfoChange()"
        class="input-pwd"
        :prefix-icon="EditPen"
    />

    <span class="pwdInfo-item">用户名</span>
    <el-input
        v-model="curPwdInfo.username"
        @change="pwdInfoChange()"
        class="input-pwd"
        :prefix-icon="UserFilled"
    >
      >
      <template #suffix>
        <el-tooltip
            class="box-item"
            effect="dark"
            :content="'复制用户名,快捷键'+shortCutKeyCombs[2].desc"
            placement="top"
        >
          <el-icon @click="copyValue(curPwdInfo.username)" class="img-item"
          >
            <CopyDocument/>
          </el-icon>
        </el-tooltip>
      </template>
    </el-input>

    <span class="pwdInfo-item">密码</span>
    <el-input
        v-model="curPwdInfo.password"
        @change="pwdInfoChange()"
        :type="passwordVisible ? 'text' : 'password'"
        class="input-pwd"
        :prefix-icon="Hide"
    >
      <template #suffix>
        <el-tooltip
            class="box-item"
            effect="dark"
            content="明文展示"
            placement="top"
        >
          <el-icon @click="clickPwdImg" class="img-item">
            <View/>
          </el-icon>
        </el-tooltip>
        <el-tooltip
            class="box-item"
            effect="dark"
            content="生成随机密码"
            placement="top"
        >
          <el-icon @click="randomPwdGenerateRef.dialogVisible = true" class="img-item">
            <Switch/>
          </el-icon>
        </el-tooltip>
        <el-tooltip
            class="box-item"
            effect="dark"
            :content="'复制密码,快捷键'+shortCutKeyCombs[3].desc"
            placement="top"
        >
          <el-icon @click="copyValue(curPwdInfo.password)" class="img-item">
            <CopyDocument/>
          </el-icon>

        </el-tooltip>
      </template>
    </el-input>

    <span class="pwdInfo-item"> 链接</span>
    <el-input
        v-model="curPwdInfo.link"
        @change="pwdInfoChange()"
        class="input-pwd"
        :prefix-icon="Compass"
    >
      <template #suffix>
        <el-tooltip
            class="box-item"
            effect="dark"
            content="在浏览器中打开"
            placement="top"
        >
          <el-icon @click="openBrowser(curPwdInfo.link)" class="img-item">
            <ChromeFilled/>
          </el-icon>
        </el-tooltip>

        <el-tooltip
            class="box-item"
            effect="dark"
            :content="'复制链接,快捷键'+shortCutKeyCombs[4].desc"
            placement="top"
        >
          <el-icon @click="copyValue(curPwdInfo.link)" class="img-item">
            <CopyDocument/>
          </el-icon>
        </el-tooltip>

      </template>
    </el-input>

    <span class="pwdInfo-item"> 说明</span>
    <div>
      <el-input
          class="item-textarea input-pwd"
          v-model="curPwdInfo.remark"
          @change="pwdInfoChange()"
          :rows="9"
          type="textarea"
      />
    </div>
  </div>

  <RandomPwdGenerate ref="randomPwdGenerateRef" :updatePwdInfo="pwdInfoChange"/>
</template>

<style scoped>
.pwdInfo {
  width: 40%;
  margin-top: 2%;
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