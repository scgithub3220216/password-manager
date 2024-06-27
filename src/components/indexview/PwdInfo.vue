<script setup lang="ts">
import {ref} from "vue";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
const pwdInfoTitleInput = ref(null);
const passwordVisible = ref(false);
const userInfoStore = useUserDataInfoStore();

let props = defineProps(['pwdInfo'])

defineExpose({keydown, pwdInfoTitleInput})

/**
 * pwdInfo
 */
function pwdInfoChange() {
  console.log('pwdInfoChange')
  userInfoStore.updatePwdInfo(props.pwdInfo)
}

function copyValue(value: string) {
  console.log('copyValue')
  navigator.clipboard.writeText(value).then(() => {
    console.log('复制成功')
  }, () => {
    console.log('复制失败')
  })
}

function keydown(e: KeyboardEvent) {
  // console.log('keydown', e)
  if (e.ctrlKey && e.key === 'p') {
    copyValue(props.pwdInfo.password);
  } else if (e.ctrlKey && e.key === 'u') {
    copyValue(props.pwdInfo.username);
  }
}

function clickRandomImg() {
  console.log('clickRandomImg')
  // 生成随机密码
  let password = '';
  for (let i = 0; i < 15; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  props.pwdInfo.password = password;
}

function clickPwdImg() {
  console.log('clickPwdImg')
  passwordVisible.value = !passwordVisible.value;
}
</script>

<template>
  <div class="pwdInfo">
    <div class="pwdInfo-item">
      <span>标题</span>
      <el-input ref="pwdInfoTitleInput" v-model="pwdInfo.title" @change="pwdInfoChange()"/>
    </div>

    <div class="pwdInfo-item">
      <span>用户名</span>
      <el-input v-model="pwdInfo.username" @change="pwdInfoChange()">
        <template #suffix>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="复制用户名,快捷键 Ctrl+U"
              placement="top"
          >
            <img src="/copy.svg" alt="enter" @click="copyValue(pwdInfo.username)" class="copy">
          </el-tooltip>
        </template>
      </el-input>
    </div>

    <div class="pwdInfo-item">
      <span>密码</span>
      <el-input v-model="pwdInfo.password" @change="pwdInfoChange()" :type="passwordVisible ? 'text' : 'password'" class="input-pwd">
        <template #suffix>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="明文展示"
              placement="top"
          >
            <img src="/ic_view.svg" alt="enter" @click="clickPwdImg" class="copy">
          </el-tooltip>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="生成随机密码"
              placement="top"
          >
            <img src="/random.svg" alt="enter" @click="clickRandomImg" class="copy">
          </el-tooltip>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="复制密码,快捷键 Ctrl+P"
              placement="top"
          >
            <img src="/copy.svg" alt="enter" @click="copyValue(pwdInfo.password)" class="copy">
          </el-tooltip>
        </template>
      </el-input>
    </div>

    <div class="pwdInfo-item">
      <span> 链接</span>
      <el-input v-model="pwdInfo.link" @change="pwdInfoChange()">
        <template #suffix>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="复制链接"
              placement="top"
          >
            <img src="/copy.svg" alt="enter" @click="copyValue(pwdInfo.link)" class="copy">
          </el-tooltip>
        </template>
      </el-input>
    </div>

    <div class="pwdInfo-item">
      <span> 说明</span>
      <div>
        <el-input
            class="item-textarea"
            v-model="pwdInfo.remark"
            @change="pwdInfoChange()"
            :rows="5"
            type="textarea"
        />
      </div>
    </div>
  </div>

</template>

<style scoped>
.pwdInfo {
  width: 40%;
}

.pwdInfo-item {
  margin-top: 0px;
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #000000;
  flex-direction: column;
  align-items: start;
}

.item-input {
  color: white;
  font-size: 16px;
  border: 0 none;
  background: transparent;

}

.item-textarea {
  width: 292px;
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
  background: #79797BFF;
  box-shadow: #888888 0px 0px 5px 0px;
  cursor: pointer;

}
</style>