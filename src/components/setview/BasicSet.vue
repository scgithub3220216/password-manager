<script setup lang="ts">
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
          :min="1"
          :max="60"
          @change="lockTimeChange"
          style="width: 100px"
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
    </el-form-item>
  </div>
</template>

<style scoped>
</style>