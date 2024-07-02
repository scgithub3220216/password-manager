<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {defaultOpenMainWinShortcutKey} from "../../config/config.ts";

const saveButtonDisabled = ref(true);
const resetDisabled = ref(false);
const currentOpenMainKeys = ref<string[]>([]);
const mainShortcuts = ref("");
const userInfoStore = useUserDataInfoStore();

onMounted(() => {
  console.log("shorCutKeys onMounted");
  currentOpenMainKeys.value =
    userInfoStore.userInfo.shortcutKey?.openMainWindows?.split("+");
  mainShortcuts.value = userInfoStore.userInfo.shortcutKey.openMainWindows;
});

watch(mainShortcuts, (newValue, oldValue) => {
  console.log("mainShortcuts newValue: ", newValue, ", oldValue:", oldValue);
  saveButtonDisabled.value = false;
  if (!newValue) {
    mainShortcuts.value = "无";
  }
});

function handleOpenMainKeydown(event: any) {
  event.preventDefault();

  let key = event.key;
  console.log("event", key);
  if (key === "Control") {
    key = "Ctrl";
  }
  if (currentOpenMainKeys.value.includes(key)) {
    return;
  }
  currentOpenMainKeys.value.push(key);
  mainShortcuts.value = currentOpenMainKeys.value.join(" + ");
}

function handleOpenMainKeyup() {
  // 在键盘抬起时清空 currentKeys 数组
  currentOpenMainKeys.value = [];
}

function saveShortcuts() {
  console.log("保存快捷键", mainShortcuts.value);

  // 发送事件给主进程
  window.ipcRenderer.invoke("save-shortcuts", mainShortcuts.value);
  userInfoStore.userInfo.shortcutKey.openMainWindows = mainShortcuts.value;
  saveButtonDisabled.value = true;
}

function reset() {
  console.log("reset");
  mainShortcuts.value = defaultOpenMainWinShortcutKey;
  currentOpenMainKeys.value = defaultOpenMainWinShortcutKey.split("+");
}
</script>

<template>
  <div>
    <!-- <h2 class="setting-h2title">快捷键</h2> -->

    <div class="setting-item">
      <span style="display: block">打开主面板:</span>
      <el-input
        type="text"
        id="shortcuts"
        class="ipt"
        clearable
        v-model="mainShortcuts"
        @keydown="handleOpenMainKeydown"
        @keyup="handleOpenMainKeyup"
      />
      <!--      <p>当前快捷键: {{ mainShortcuts }}</p>-->
    </div>




    <div class="bttn">
      <el-button
        class="btn"
        type="primary"
        :disabled="resetDisabled"
        @click="reset"
        >重置</el-button
      >
      <el-button
        type="primary"
        :disabled="saveButtonDisabled"
        @click="saveShortcuts"
        >保存</el-button
      >
    </div>
    <!--    <el-button type="primary" @click="saveShortcuts" style="position: relative;left: 100px;top: 20px;">保存</el-button>-->
  </div>
</template>

<style scoped>
.bttn {
  margin-top: 50px;
  display: flex;
  justify-content: flex-end;
}
.btn {
  margin-left: auto;
}
.ipt {
  width: 400px;
  margin-top: 15px;
}
</style>