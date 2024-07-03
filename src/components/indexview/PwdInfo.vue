<script setup lang="ts">
import {ref} from "vue";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import useBrowser from "../../hooks/useBrowser.ts";
import RandomPwdGenerate from "./RandomPwdGenerate.vue";

import {ChromeFilled, Compass, CopyDocument, EditPen, Hide, Switch, UserFilled, View,} from "@element-plus/icons-vue";
import {storeToRefs} from "pinia";

const pwdInfoTitleInput = ref(null);
const passwordVisible = ref(false);
const userDataInfoStore = useUserDataInfoStore();
const {openBrowser} = useBrowser();
const {shortCutKeyCombs} = storeToRefs(userDataInfoStore)

defineExpose({keydown, pwdInfoTitleInput});
// const curPwdInfo = reactive(userDataInfoStore.curPwdInfo);
const {curPwdInfo} = storeToRefs(userDataInfoStore)

function pwdInfoChange() {
  console.log("pwdInfoChange");
  userDataInfoStore.updatePwdInfo(curPwdInfo.value);
}

function copyValue(value: string) {
  console.log("copyValue");
  navigator.clipboard.writeText(value).then(
      () => {
        console.log("复制成功");
      },
      () => {
        console.log("复制失败");
      }
  );
}

function keydown(e: KeyboardEvent) {
  // console.log('keydown', e)
  if (e.ctrlKey && e.key === "p") {
    copyValue(curPwdInfo.value.password);
  } else if (e.ctrlKey && e.key === "u") {
    copyValue(curPwdInfo.value.username);
  }
}

const randomPwdGenerateRef = ref();


function clickPwdImg() {
  console.log("clickPwdImg");
  passwordVisible.value = !passwordVisible.value;
}
</script>

<template>
  <div class="pwdInfo">
    <span class="pwdInfo-item">标题</span>
    <!--    <el-text class="mx-1" style="text-align: left">标题</el-text>-->
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
          <el-icon @click="copyValue(curPwdInfo.username)" class="copy"
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
          <el-icon @click="clickPwdImg" class="copy">
            <View/>
          </el-icon>
        </el-tooltip>
        <el-tooltip
            class="box-item"
            effect="dark"
            content="生成随机密码"
            placement="top"
        >
          <el-icon @click="randomPwdGenerateRef.dialogVisible = true" class="copy">
            <Switch/>
          </el-icon>
        </el-tooltip>
        <el-tooltip
            class="box-item"
            effect="dark"
            :content="'复制密码,快捷键'+shortCutKeyCombs[3].desc"
            placement="top"
        >
          <el-icon @click="copyValue(curPwdInfo.password)" class="copy">
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
          <el-icon @click="openBrowser(curPwdInfo.link)" class="copy">
            <ChromeFilled/>
          </el-icon>

        </el-tooltip>
        <el-tooltip
            class="box-item"
            effect="dark"
            :content="'复制链接,快捷键'+shortCutKeyCombs[3].desc"
            placement="top"
        >
          <el-icon @click="copyValue(curPwdInfo.link)" class="copy">
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
          :rows="5"
          type="textarea"
      />
    </div>
  </div>

  <RandomPwdGenerate
      ref="randomPwdGenerateRef"
      :updatePwdInfo="pwdInfoChange"
  />
</template>

<style scoped>
.pwdInfo {
  width: 40%;
}

.pwdInfo-item {
  margin-top: 0px;
  display: flex;
  padding: 10px;
  /* border-bottom: 1px solid #000000; */
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
  background: #79797bff;
  box-shadow: #888888 0px 0px 5px 0px;
  cursor: pointer;
}
</style>