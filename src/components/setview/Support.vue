<script setup lang="ts">
import {defineExpose, onMounted, ref} from 'vue'

const supportDialogVisible = ref(false);

defineExpose({supportDialogVisible})

function openVxImg() {

}
onMounted(()=>{
  console.log('supportDialogVisible 挂载完毕')
})

</script>

<template>
  <el-dialog v-model="supportDialogVisible" title="" width="600">
    <p>您可以通过执行以下任意操作来贡献和支持次项目:</p>
    <ol>
      <li><a href="https://gitee.com/star-sc/password-manager">在Gitee上将此项目标星</a></li>
      <li><a href="https://gitee.com/star-sc/password-manager/issues">报告错误</a></li>
      <li><a href="https://gitee.com/star-sc/password-manager/issues">告诉我你的想法</a></li>
      <li><a href="https://gitee.com/star-sc/password-manager">提交拉取请求</a></li>
      <li><a href="#" @click="openVxImg">关注公众号获取最新咨询</a></li>
      <li>将此软件分享给好友</li>
      <li>如果您喜欢这个插件,请考虑给我捐赠,这将极大地激励我继续开发此项目:</li>

    </ol>
    <img src="/assets/money.png" alt="" style="height: 200px">

    <span>捐赠说明</span>

  </el-dialog>
</template>

<style scoped>
span {
  color: rgb(139, 185, 100);
  cursor: pointer;
  text-decoration: underline;
  font-weight: bold;
  font-size: 15px;
}
</style>