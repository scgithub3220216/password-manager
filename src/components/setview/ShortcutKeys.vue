<script setup lang="ts">
import useSetShortcutKey from "../../hooks/useSetShortcutKey.ts";

const {
  mainShortcuts,
  handleOpenMainKeydown,
  handleOpenMainKeyup,
  clearOpenMainKeys,

  lockShortcuts,
  handleLockKeydown,
  handleLockKeyup,
  clearLockKeys,

  cpUsernames,
  handleCpUNameKeydown,
  handleCpUNameKeyup,
  clearCpUNameKeys,

  cpPwds,
  handleCpPwdsKeydown,
  handleCpPwdsKeyup,
  clearCpPwdsKeys,

  cpLinks,
  handleCpLinksKeydown,
  handleCpLinksKeyup,
  clearCpLinksKeys,

  insertGroups,
  handleInsertGroupsKeydown,
  handleInsertGroupsKeyup,
  clearInsertGroupsKeys,

  insertPwdInfos,
  handleInsertPwdInfosKeydown,
  handleInsertPwdInfosKeyup,
  clearInsertPwdInfosKeys,

  saveAll,
  reset
} = useSetShortcutKey()
</script>

<template>
  <div>
    <el-scrollbar height="250px">
      <div class="setting-item">
        <span style="display: block">打开主面板:</span>
        <el-input
            type="text"
            id="shortcuts"
            class="ipt"
            clearable
            placeholder="无"
            v-model="mainShortcuts"
            @keydown="handleOpenMainKeydown"
            @keyup="handleOpenMainKeyup"
            @keydown.delete="clearOpenMainKeys"
        />
      </div>

      <div class="setting-item">
        <span style="display: block">锁定屏幕:</span>
        <el-input
            type="text"
            id="shortcuts"
            class="ipt"
            clearable
            placeholder="无"
            v-model="lockShortcuts"
            @keydown="handleLockKeydown"
            @keyup="handleLockKeyup"
            @keydown.delete="clearLockKeys"
        />
      </div>

      <div class="setting-item">
        <span style="display: block">复制账号:</span>
        <el-input
            type="text"
            id="shortcuts"
            class="ipt"
            clearable
            placeholder="无"
            v-model="cpUsernames"
            @keydown="handleCpUNameKeydown"
            @keyup="handleCpUNameKeyup"
            @keydown.delete="clearCpUNameKeys"
        />
      </div>

      <div class="setting-item">
        <span style="display: block">复制密码:</span>
        <el-input
            type="text"
            id="shortcuts"
            class="ipt"
            clearable
            placeholder="无"
            v-model="cpPwds"
            @keydown="handleCpPwdsKeydown"
            @keyup="handleCpPwdsKeyup"
            @keydown.delete="clearCpPwdsKeys"
        />
      </div>

      <div class="setting-item">
        <span style="display: block">复制链接:</span>
        <el-input
            type="text"
            id="shortcuts"
            class="ipt"
            clearable
            placeholder="无"
            v-model="cpLinks"
            @keydown="handleCpLinksKeydown"
            @keyup="handleCpLinksKeyup"
            @keydown.delete="clearCpLinksKeys"
        />
      </div>

      <div class="setting-item">
        <span style="display: block">新增分组:</span>
        <el-input
            type="text"
            id="shortcuts"
            class="ipt"
            clearable
            placeholder="无"
            v-model="insertGroups"
            @keydown="handleInsertGroupsKeydown"
            @keyup="handleInsertGroupsKeyup"
            @keydown.delete="clearInsertGroupsKeys"
        />
      </div>

      <div class="setting-item">
        <span style="display: block">新增密码:</span>
        <el-input
            type="text"
            id="shortcuts"
            class="ipt"
            clearable
            placeholder="无"
            v-model="insertPwdInfos"
            @keydown="handleInsertPwdInfosKeydown"
            @keyup="handleInsertPwdInfosKeyup"
            @keydown.delete="clearInsertPwdInfosKeys"
        />
      </div>


      <div class="bttn">
        <el-button class="btn" type="primary" @click="reset">
          重置
        </el-button>
        <el-button type="primary" @click="saveAll">
          保存
        </el-button>
      </div>
    </el-scrollbar>
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