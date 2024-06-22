<script setup lang="ts">

// 把数据放到 pinia 中
import {useDataInfoStore} from "../store/useDataInfo.ts";
import {PwdInfo} from "../store/type.ts";
import {onMounted, reactive, ref} from "vue";
import {Search} from '@element-plus/icons-vue'

const search = ref('');

const userInfoStore = useDataInfoStore();
let pwdGroupList = userInfoStore.pwdGroupList;
const pwdInfoList = reactive<PwdInfo[]>([]);
const pwdInfoDetail = reactive<PwdInfo>({});
onMounted(() => {
  console.log('挂载完毕')
  if (!(pwdGroupList && pwdGroupList.length > 0)) {
    console.log('pwdGroupList 为空')
    return;
  }
  let pwdList = pwdGroupList[0].pwdList;
  Object.assign(pwdInfoList, pwdList);
  Object.assign(pwdInfoDetail, pwdList[0]);
})

function logout() {
  console.log('logout')
  window.location.hash = '/login'
}

function transData(pwdList: PwdInfo[]) {
  console.log('transData')
  console.log(pwdList)
  Object.assign(pwdInfoList, pwdList);
}

function showDetail(pwdInfo: PwdInfo) {
  console.log('showDetail')
  console.log(pwdInfo)
  Object.assign(pwdInfoDetail, pwdInfo);
}

function pwdInfoChange() {
  userInfoStore.updatePwdInfo(pwdInfoDetail)
}


</script>

<template>
  <div class="outer">
    <div class="search">
      <el-input
          v-model="search"
          style="width: 500px"
          placeholder="标题/用户名搜索"
          :prefix-icon="Search"
      />
    </div>
    <div class="content">
      <div class="group">
        <div class="group-data">
          <ul>
            <li v-for="group in pwdGroupList" :key="group.id" @click="transData(group.pwdList)">{{ group.title }}</li>
          </ul>

        </div>
        <div class="group-tools"></div>
      </div>
      <div class="pwd">
        <ul>
          <li v-for="pwdInfo in pwdInfoList" :key="pwdInfo.id" @click="showDetail(pwdInfo)">{{ pwdInfo.title }}</li>
        </ul>
      </div>
      <div class="detail">

        <div class="detail-item">
          <span>标题</span>
          <el-input v-model="pwdInfoDetail.title" @change="pwdInfoChange()" autofocus/>
        </div>

        <div class="detail-item">
          <span>用户名</span>
          <el-input v-model="pwdInfoDetail.username" @change="pwdInfoChange()"/>
        </div>

        <div class="detail-item">
          <span>密码</span>
          <el-input v-model="pwdInfoDetail.password" @change="pwdInfoChange()" type="password" show-password class="input-pwd"/>
        </div>

        <div class="detail-item">
          <span> 链接</span>
          <el-input v-model="pwdInfoDetail.link" @change="pwdInfoChange()"/>
        </div>

        <div class="detail-item">
          <span> 说明</span>
          <div>
            <el-input
                class="item-textarea"
                v-model="pwdInfoDetail.remark"
                @change="pwdInfoChange()"
                :rows="10"
                type="textarea"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

.outer {
  width: 100vw;
  height: 100vh;
  flex: 1 1 auto;
}

.search {
  height: 50px;
  width: 100vw;
}

.content {
  display: flex;
  width: 100vw;
  height: calc(100vh - 50px);
}

.group {
  background: rgba(85, 168, 204, 0.59);
  width: 25%;
}

.pwd {
  background: rgba(234, 238, 134, 0.57);
  width: 35%;
}

.detail {
  background: rgba(103, 194, 58, 0.48);
  width: 40%;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

li {
  text-align: left;
  padding: 5px 0 5px 20px;
}

li:first-child {
  margin-top: 20px;
}

li:hover {
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.detail {


}

.detail-item {
  margin-top: 15px;
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
  width: 375px;
  color: white;
  font-size: 16px;
  border: 0 none;
  background: transparent;
}
</style>
