<script lang="ts" setup>
import {UploadFilled} from '@element-plus/icons-vue'
import useExcel from "../../hooks/useExcel.ts";
import {defineExpose, ref} from 'vue'

import {ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile, UploadUserFile} from 'element-plus'

const {importExcel} = useExcel()
const fileList = ref<UploadUserFile[]>([])

const importDialogVisible = ref(false)
defineExpose({importDialogVisible})

const upload = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const beforeUpload = (file: any) => {
  // 检查文件大小，单位为字节
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过50MB');
    return false; // 阻止文件上传
  }
  return true; // 允许上传
};

function downExcelTemplate() {
  console.log('downExcelTemplate')
}

const fileUrl = ref('/excel/template/excelImportTemplate.xlsx'); // 注意这里使用的是文件的公共URL路径，不需要带public

</script>

<template>
  <el-dialog v-model="importDialogVisible" title="" width="500">
    <el-upload
        ref="upload"
        v-model:file-list="fileList"
        :auto-upload="false"
        :before-upload="beforeUpload"
        :limit="1"
        :on-exceed="handleExceed"
        accept=".xls,.xlsx"
        class="upload-demo"
        drag
    >
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        拖拽 文件 到此处 或者 <em>点击 上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          xls/xlsx 文件 并且 大小 小于 50M
        </div>
      </template>

    </el-upload>
    <div>
      <el-button type="primary" @click="downExcelTemplate"><a :href="fileUrl" download="密码管理器导入模板.xlsx">下载导入模板</a></el-button>
      <el-button :disabled="fileList.length<1" type="primary" @click="importExcel(fileList[0])">确定导入</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
a {
  color: inherit;
  font-size: inherit;
}

</style>