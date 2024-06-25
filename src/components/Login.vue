<script setup lang="ts">
import {onBeforeMount, onMounted, reactive, ref} from 'vue'
import {userDataInfoStore} from "../store/userDataInfo.ts";
import type {FormInstance, FormRules} from 'element-plus'
import {FileDataObj} from "../store/type.ts";

const ruleFormRef = ref<FormInstance>()
const pwd = ref('')
const pwdDialogVisible = ref(false)
const userInfoStore = userDataInfoStore();
onBeforeMount(() => {
  console.log('挂载之前')

})

onMounted(() => {
  sendMessageToMain().then(() => {
    console.log('userInfoStore.userInfo.firstLoginFlag:', userInfoStore.userInfo.firstLoginFlag)
    // 判断用户是否第一次登录 , 如果是 设置登录密码
    if (userInfoStore.userInfo.firstLoginFlag != 0) {
      pwdDialogVisible.value = true
    }
  })

})

async function sendMessageToMain() {

  const userDataJson = await window.ipcRenderer.invoke('init-data');
  if (!userDataJson) {
    return;
  }
  // console.log('userDataJson:', userDataJson)
  const fileDataObj: FileDataObj = JSON.parse(userDataJson);
  // 把数据放到 pinia 中
  console.log('fileDataObj.userInfo.firstLoginFlag:', fileDataObj.userInfo.firstLoginFlag)
  userInfoStore.setUserInfo(fileDataObj);
}


const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请重新输入密码'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("两次输入不匹配!"))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  pass: '',
  checkPass: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  pass: [{validator: validatePass, trigger: 'blur'}],
  checkPass: [{validator: validatePass2, trigger: 'blur'}],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      userInfoStore.setInitPwd(ruleForm.pass)
      pwdDialogVisible.value = false
    } else {
      console.log('error submit!')
    }
  })
}

function login() {
  console.log('login')
  window.location.hash = '/index'
}

function handleEnter() {
  console.log('handleEnter userInfo.pwd:', userInfoStore.userInfo.pwd, ', pwd.value:', pwd.value)
  userInfoStore.userInfo.curLoginStatus = 1;
  userInfoStore.userInfo.pwd == pwd.value ? login() : pwdError()
}



function pwdError() {
  let element = document.getElementById('myElement');

  // 存储原始背景颜色
  let originalColor = element.style.backgroundColor;

// 设置新的背景色触发过渡效果
  element.style.backgroundColor = '#ea918b';

  // 过渡完成后恢复原背景色
  setTimeout(function () {
    element.style.backgroundColor = originalColor;
  }, 1000);
}

</script>

<template>
  <el-dialog
      v-model="pwdDialogVisible"
      title="设置登录密码"
      width="400"
  >
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
    >
      <el-form-item label="密码" prop="pass">
        <el-input v-model="ruleForm.pass" type="password" show-password autocomplete="off"/>
      </el-form-item>
      <el-form-item label="再次输入" prop="checkPass">
        <el-input
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="off"
            show-password
        />
      </el-form-item>
      <el-form-item>
        <div style="width:100%;display: flex;justify-content:flex-end">
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确认
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
  <div id="myElement" class="pwd-outer">
    <el-input
        class="input-pwd"
        v-model="pwd"
        type="password"
        placeholder="开门密码"
        show-password
        @keyup.enter="handleEnter"
        autofocus
    >
      <template #suffix>
        <img src="../../public/enter.png" alt="enter" @click="handleEnter" class="enter">
      </template>
    </el-input>
    <!--    <div>-->
    <!--      <button @click="login">跳转到首页</button>-->
    <!--    </div>-->
  </div>

</template>

<style scoped>

.pwd-outer {
  background: #282c34;
  transition: background-color 1s;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

}

.input-pwd {
  width: 240px;
  height: 50px;
  opacity: 0.4;
  color: white;
  font-size: 15px;
  --el-input-border-radius: 20px;

}

.enter {
  width: 22px;
  height: 22px;
  border: 1px solid rgba(204, 204, 204, 0);
  border-radius: 50%;
  padding: 10px;

}

.enter:hover {
  opacity: 0.4;
  background: #79797BFF;
  box-shadow: #888888 0px 0px 5px 0px;
  cursor: pointer;

}

</style>
