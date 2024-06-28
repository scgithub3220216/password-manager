<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";

const form = ref({});
const selectedTypes = ref(['uppercase', 'lowercase', 'numbers', 'special']);
const length = ref(8);
const password = ref('');

const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const specialChars = ref('!@#$%^&*()_+,.<>|[]{}:;~"\'');
const userDataInfoStore = useUserDataInfoStore();

const dialogVisible = ref(false)
defineExpose({dialogVisible})
let props = defineProps(['updatePwdInfo'])

onMounted(() => {
  generatePassword();
})


function generatePassword() {
  if (!selectedTypes.value.length) return;

  let charPool = '';
  if (selectedTypes.value.includes('uppercase')) charPool += uppercase;
  if (selectedTypes.value.includes('lowercase')) charPool += lowercase;
  if (selectedTypes.value.includes('numbers')) charPool += numbers;
  if (selectedTypes.value.includes('special')) charPool += specialChars;

  let result = '';
  for (let i = 0; i < length.value; i++) {
    result += charPool.charAt(Math.floor(Math.random() * charPool.length));
  }

  password.value = result;
}

function updatePwd() {
  console.log('updatePwd')
  userDataInfoStore.setCurPwdInfoPwd(password.value)
  props.updatePwdInfo()
  dialogVisible.value = false
}
</script>

<template>
  <el-dialog
      v-model="dialogVisible"
      title=""
      width="500"
      height="400"
  >
    <div class="password-generator">
      <el-form label-position="top" :model="form">
        <el-form-item label="包含字符">
          <el-checkbox-group v-model="selectedTypes">
            <el-checkbox label="uppercase" @change="generatePassword">大写字母</el-checkbox>
            <el-checkbox label="lowercase" @change="generatePassword">小写字母</el-checkbox>
            <el-checkbox label="numbers" @change="generatePassword">数字</el-checkbox>
            <el-checkbox label="special" @change="generatePassword">
              <el-input v-model="specialChars" :disabled="!selectedTypes.includes('special')" style="width: 240px"  />
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="密码长度">
          <el-slider @change="generatePassword" v-model="length" :min="4" :max="32" show-input></el-slider>
        </el-form-item>
      </el-form>
      <div class="result">
        <h2>生成的随机密码:</h2>
        <p>{{ password }}</p>
      </div>
      <div>
        <el-button type="primary" @click="updatePwd">使用该密码</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.password-generator {
  max-width: 400px;
  margin: 100px auto;
}

.result {
  margin-top: 20px;
  text-align: center;
}
</style>