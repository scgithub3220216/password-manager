<script lang="ts" setup>
import useSetShortcutKey from "../../hooks/useSetShortcutKey.ts";

const {
  mainShortcuts,
  handleOpenMainKeydown,
  handleOpenMainKeyup,
  clearOpenMainKeys,

  logouts,
  handleLogoutKeydown,
  handleLogoutKeyup,
  clearLogoutKeys,

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
            id="shortcuts"
            v-model="mainShortcuts"
            class="ipt"
            clearable
            placeholder="无"
            type="text"
            @keydown="handleOpenMainKeydown"
            @keyup="handleOpenMainKeyup"
            @keydown.delete="clearOpenMainKeys"
        />
      </div>

      <div class="setting-item">
        <span style="display: block">退出登录:</span>
        <el-input
            id="shortcuts"
            v-model="logouts"
            class="ipt"
            clearable
            placeholder="无"
            type="text"
            @keydown="handleLogoutKeydown"
            @keyup="handleLogoutKeyup"
            @keydown.delete="clearLogoutKeys"
        />
      </div>

      <div class="setting-item">
        <span style="display: block">复制账号:</span>
        <el-input
            id="shortcuts"
            v-model="cpUsernames"
            class="ipt"
            clearable
            placeholder="无"
            type="text"
            @keydown="handleCpUNameKeydown"
            @keyup="handleCpUNameKeyup"
            @keydown.delete="clearCpUNameKeys"
        />
      </div>

      <div class="setting-item">
        <span style="display: block">复制密码:</span>
        <el-input
            id="shortcuts"
            v-model="cpPwds"
            class="ipt"
            clearable
            placeholder="无"
            type="text"
            @keydown="handleCpPwdsKeydown"
            @keyup="handleCpPwdsKeyup"
            @keydown.delete="clearCpPwdsKeys"
        />
      </div>

      <div class="setting-item">
        <span style="display: block">复制链接:</span>
        <el-input
            id="shortcuts"
            v-model="cpLinks"
            class="ipt"
            clearable
            placeholder="无"
            type="text"
            @keydown="handleCpLinksKeydown"
            @keyup="handleCpLinksKeyup"
            @keydown.delete="clearCpLinksKeys"
        />
      </div>

      <div class="setting-item">
        <span style="display: block">新增分组:</span>
        <el-input
            id="shortcuts"
            v-model="insertGroups"
            class="ipt"
            clearable
            placeholder="无"
            type="text"
            @keydown="handleInsertGroupsKeydown"
            @keyup="handleInsertGroupsKeyup"
            @keydown.delete="clearInsertGroupsKeys"
        />
      </div>

      <div class="setting-item">
        <span style="display: block;">新增密码:</span>
        <el-input
            id="shortcuts"
            v-model="insertPwdInfos"
            class="ipt"
            clearable
            placeholder="无"
            type="text"
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
.setting-item {
  margin-top: 10px;
}

.bttn {
  margin: 20px 20px 20px 0;
  display: flex;
  justify-content: flex-end;
}

.btn {
  margin-left: auto;
}

.ipt {
  width: 400px;
  margin-top: 5px;
}
</style>