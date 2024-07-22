<script lang="ts" setup>
import useBasicSet from "../../hooks/useBasicSet.ts";
import {QuestionFilled} from "@element-plus/icons-vue";

const {
  autoStartChange, ossSwitchChange, ossSwitchValue, autoStartValue, lockTime, timeUnit, timeUnits,
  ossAutoUploadSwitchValue,
  ossAutoDownloadSwitchValue,
  ossAutoUploadSwitchValueChange,
  ossAutoDownloadSwitchValueChange,
  lockTimeChange
} = useBasicSet();


</script>

<template>
  <div class="setting-item item">
    <div class="left">
      <el-text class="mx-1">开机启动</el-text>
    </div>
    <div class="right">
      <el-switch v-model="autoStartValue" @change="autoStartChange"/>
    </div>

  </div>
  <div class="setting-item item">
    <div class="left">
      <el-text class="mx-1">
        自动退出登录时间
        <el-tooltip
            class="box-item"
            content="在指定时间中没有操作,自动退出登录"
            effect="dark"
            placement="top"
        >
          <el-icon>
            <QuestionFilled/>
          </el-icon>
        </el-tooltip>
      </el-text>
    </div>
    <div class="right">

      <el-input-number
          v-model="lockTime"
          :max="100"
          :min="1"
          style="width: 120px"
          @change="lockTimeChange"
      />
      <el-select
          v-model="timeUnit"
          placeholder="Select"
          style="width: 80px; margin-left: 1px"
          @change="lockTimeChange"
      >
        <el-option
            v-for="item in timeUnits"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </div>
  </div>

  <div class="setting-item item">
    <div class="left">
      <el-text class="mx-1">
        数据同步
        <el-tooltip
            class="box-item"
            content="与 阿里云OSS 的数据进行同步"
            effect="dark"
            placement="top"
        >
          <el-icon>
            <QuestionFilled/>
          </el-icon>
        </el-tooltip>
      </el-text>
    </div>
    <div class="right">
      <el-switch v-model="ossSwitchValue" @change="ossSwitchChange"/>
    </div>
  </div>

  <div class="setting-item item" v-if="ossSwitchValue">
    <div class="left">
      <el-text class="mx-1">
        自动上传
        <el-tooltip
            class="box-item"
            content="任意修改分组以及密码的操作都会触发自动上传"
            effect="dark"
            placement="top"
        >
          <el-icon>
            <QuestionFilled/>
          </el-icon>
        </el-tooltip>
      </el-text>
    </div>
    <div class="right">
      <el-switch v-model="ossAutoUploadSwitchValue" @change="ossAutoUploadSwitchValueChange"/>
    </div>
  </div>
  <div class="setting-item item" v-if="ossSwitchValue">
    <div class="left">
      <el-text class="mx-1">
        自动拉取
        <el-tooltip
            class="box-item"
            content="软件启动与登录成功时触发"
            effect="dark"
            placement="top"
        >
          <el-icon>
            <QuestionFilled/>
          </el-icon>
        </el-tooltip>
      </el-text>
    </div>
    <div class="right">
      <el-switch v-model="ossAutoDownloadSwitchValue" @change="ossAutoDownloadSwitchValueChange"/>
    </div>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.right {
  margin-left: 10px;
}


</style>