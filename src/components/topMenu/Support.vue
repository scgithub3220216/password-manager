<script lang="ts" setup>
import {ref} from 'vue'
import useBrowser from "../../hooks/useBrowser.ts";
import {giteeCodeLink, giteeIssueLink, supportDesc} from "../../config/config.ts";

const {openBrowser} = useBrowser();

const officialAccountDialogVisible = ref(false);
const supportDialogVisible = ref(false);

defineExpose({supportDialogVisible})

</script>

<template>
  <el-dialog v-model="supportDialogVisible" title="" width="600">
    <div class="container">
      <p>您可以通过执行以下任意操作来贡献和支持此项目:</p>
      <ol>
        <li><a href="#" @click="openBrowser(giteeCodeLink)">在Gitee上将此项目标星</a></li>
        <li><a href="#" @click="openBrowser(giteeIssueLink)">报告错误</a></li>
        <li><a href="#" @click="openBrowser(giteeIssueLink)">告诉我你的想法</a></li>
        <li><a href="#" @click="openBrowser(giteeCodeLink)">提交拉取请求</a></li>
        <li><a href="#" @click="officialAccountDialogVisible=true">关注微信公众号获取最新咨询</a></li>
        <li>将此软件分享给好友</li>
        <li>如果您喜欢这个插件,请考虑给我捐赠,这将极大地激励我继续开发此项目:</li>

      </ol>
      <div class="img">
        <div class="img-left">
          <img alt="" src="/assets/vx-money.png" style="height: 200px">
          <span>微信支付</span>
        </div>
        <div class="img-right">
          <img alt="" src="/assets/zfb-money.png" style="height: 200px">
          <span>支付宝</span>
        </div>
      </div>
      <div class="bottom">
        <el-popover
            :width="400"
            placement="top-start"
            title=""
            trigger="click"
        >
          <div v-html="supportDesc"></div>
          <template #reference>
            <a>捐赠说明</a>
          </template>
        </el-popover>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary">感谢您的支持!</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="officialAccountDialogVisible" title="" width="400">
    <span>关注下方微信公众号获取最新咨询</span>
    <img alt="officialAccount" src="/assets/officialAccount.jpg">
  </el-dialog>
</template>

<style scoped>
.container {
  text-align: left;
}

.img {
  display: flex;
  text-align: center;
  justify-content: center;
}

.img-left {
  margin-right: 20px;
}

a {
  font-size: 14px;
}

.img-left, .img-right {
  display: flex;
  flex-direction: column;
}


.bottom {
  margin-top: 30px;
}

.bottom a {
  cursor: pointer;
  font-weight: bold;
}
</style>