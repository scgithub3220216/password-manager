<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {Promotion, RefreshLeft} from "@element-plus/icons-vue";

const form = ref({});
const selectedTypes = ref(["uppercase", "lowercase", "numbers", "special"]);
const length = ref(8);
const password = ref("");

const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const specialChars = ref("!@#$%^&*()_+,.<>|[]{}:;~\"'");
const userDataInfoStore = useUserDataInfoStore();

const dialogVisible = ref(false);
defineExpose({dialogVisible});
let props = defineProps(["updatePwdInfo"]);

onMounted(() => {
  generatePassword();
});

function generatePassword() {
  if (!selectedTypes.value.length) return;

  let charPool = "";
  if (selectedTypes.value.includes("uppercase")) charPool += uppercase;
  if (selectedTypes.value.includes("lowercase")) charPool += lowercase;
  if (selectedTypes.value.includes("numbers")) charPool += numbers;
  if (selectedTypes.value.includes("special")) charPool += specialChars;

  let result = "";
  for (let i = 0; i < length.value; i++) {
    result += charPool.charAt(Math.floor(Math.random() * charPool.length));
  }

  password.value = result;
}

function updatePwd() {
  console.log("updatePwd");
  userDataInfoStore.setCurPwdInfoPwd(password.value);
  props.updatePwdInfo();
  dialogVisible.value = false;
}

//刷新密码事件
function refreshPsd() {
  generatePassword();
}
</script>

<template>
  <el-dialog v-model="dialogVisible" title="" width="70%">
    <el-form label-position="top" :model="form">
      <el-form-item label="包含字符">
        <el-checkbox-group v-model="selectedTypes">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-checkbox value="uppercase" @change="generatePassword">
                A-Z
              </el-checkbox>
            </el-col>
            <el-col :span="4">
              <el-checkbox value="lowercase" @change="generatePassword">
                a-z
              </el-checkbox>
            </el-col>
            <el-col :span="4">
              <el-checkbox value="numbers" @change="generatePassword">
                0-9
              </el-checkbox>
            </el-col>
            <el-col :span="8">
              <el-checkbox value="special" @change="generatePassword">
                <el-input
                    v-model="specialChars"
                    :disabled="!selectedTypes.includes('special')"
                    style="width: 240px"
                />
              </el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="密码长度">
        <el-slider
            @change="generatePassword"
            v-model="length"
            :min="4"
            :max="32"
            show-input
        ></el-slider>
      </el-form-item>
      <el-form-item label="生成的随机密码">
        <el-input v-model="password">
          <template v-slot:append>
            <el-tooltip
                class="box-item"
                effect="dark"
                content="刷新密码"
                placement="top"
            >
              <el-icon @click="refreshPsd">
                <RefreshLeft/>
              </el-icon>
            </el-tooltip>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="bttn">
      <el-button type="primary" @click="updatePwd" class="btn">
        <span class="spa" style=""> 使用该密码 </span>
        <el-icon style="vertical-align: middle">
          <Promotion/>
        </el-icon>
      </el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
.bttn {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
}

.btn {
  margin-left: auto;
}

.result {
  margin-top: 20px;
  text-align: center;
}

.spa {
  vertical-align: middle;
  margin-right: 4px;
}
</style>