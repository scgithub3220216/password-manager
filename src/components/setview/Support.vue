<script setup lang="ts">
import {defineExpose, ref} from 'vue'
import useBrowser from "../../hooks/useBrowser.ts";
import {giteeCodeLink, giteeIssueLink, supportDesc} from "../../config/config.ts";

const {openBrowser} = useBrowser();

const supportDialogVisible = ref(false);

defineExpose({supportDialogVisible})

function openVxImg() {

}


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
        <li><a href="#" @click="openVxImg">关注公众号获取最新咨询</a></li>
        <li>将此软件分享给好友</li>
        <li>如果您喜欢这个插件,请考虑给我捐赠,这将极大地激励我继续开发此项目:</li>

      </ol>
      <div class="img">
        <div class="img-left">
          <img src="/assets/vx-money.png" alt="" style="height: 200px">
          <span>微信支付</span>
        </div>
        <div class="img-right">
          <img src="/assets/zfb-money.png" alt="" style="height: 200px">
          <span>支付宝</span>
        </div>
      </div>
      <div class="bottom">
        <el-popover
            placement="top-start"
            title=""
            :width="400"
            trigger="click"
        >
          <div v-html="supportDesc"></div>
          <template #reference>
            <span>捐赠说明</span>
          </template>
        </el-popover>
      </div>
    </div>
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

.img-left, .img-right {
  display: flex;
  flex-direction: column;
}


.bottom {
  margin-top: 30px;
}

.bottom span {
  color: rgb(139, 185, 100);
  cursor: pointer;
  text-decoration: underline;
  font-weight: bold;
  font-size: 15px;
}
</style>