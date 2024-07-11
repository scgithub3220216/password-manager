<script lang="ts" setup>
import useBasicSet from "../../hooks/useBasicSet.ts";

const {autoStartChange, autoStartValue, lockTime, timeUnit, timeUnits, lockTimeChange} = useBasicSet();


</script>

<template>
  <div class="setting-item">
    <el-form-item label="开机启动" prop="delivery">
      <el-switch v-model="autoStartValue" @change="autoStartChange"/>
    </el-form-item>
  </div>
  <div class="setting-item">
    <el-form-item label="自动退出登录时间" prop="delivery">
      <el-input-number
          v-model="lockTime"
          :max="100"
          :min="1"
          style="width: 130px"
          @change="lockTimeChange"
      />
      <el-select
          v-model="timeUnit"
          placeholder="Select"
          style="width: 90px; margin-left: 1px"
          @change="lockTimeChange"
      >
        <el-option
            v-for="item in timeUnits"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<style scoped>
</style>