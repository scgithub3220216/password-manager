<script lang="ts" setup>
import {ref, watch, onUnmounted} from "vue";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {storeToRefs} from "pinia";
import useDBImage from "../../hooks/useDBImage.ts";
import useDataSync from "../../hooks/useDataSync.ts";
import {PwdImageMeta} from "../type.ts";
import {ElMessage} from "element-plus";
import {Delete, Plus, ZoomIn} from "@element-plus/icons-vue";

const MAX_IMAGE_COUNT = 20;
const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

const userDataInfoStore = useUserDataInfoStore();
const {curPwdInfo} = storeToRefs(userDataInfoStore);
const {insertImage, deleteImage, listImageMeta, getImageDataUrl, countImages} = useDBImage();
const {syncToOss} = useDataSync();

const imageMetaList = ref<PwdImageMeta[]>([]);
const imageDataUrls = ref<Map<number, string>>(new Map());
const uploading = ref(false);
const previewVisible = ref(false);
const previewIndex = ref(0);
const previewUrls = ref<string[]>([]);

// 监听当前密码条目变化，刷新图片列表
watch(() => curPwdInfo.value.id, async (newId) => {
  // 清空旧数据，释放内存
  imageDataUrls.value = new Map();
  imageMetaList.value = [];
  if (newId) {
    await refreshImageList();
  }
}, {immediate: true});

onUnmounted(() => {
  imageDataUrls.value = new Map();
  imageMetaList.value = [];
});

async function refreshImageList() {
  if (!curPwdInfo.value.id) return;
  imageMetaList.value = await listImageMeta(curPwdInfo.value.id);
  // 逐张加载图片数据
  for (const meta of imageMetaList.value) {
    if (!imageDataUrls.value.has(meta.id)) {
      const dataUrl = await getImageDataUrl(meta.id, meta.mime_type);
      imageDataUrls.value.set(meta.id, dataUrl);
    }
  }
}

function getImageUrl(id: number): string {
  return imageDataUrls.value.get(id) || '';
}

function formatFileSize(size: number): string {
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  return (size / (1024 * 1024)).toFixed(1) + ' MB';
}

async function handleUpload(options: any) {
  const file = options.file as File;

  // MIME 类型校验
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    ElMessage.error('不支持的图片格式，仅支持 JPG/PNG/GIF/WEBP/BMP');
    return;
  }

  // 大小校验
  if (file.size > MAX_IMAGE_SIZE) {
    ElMessage.error(`图片大小不能超过 ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
    return;
  }

  // 数量校验
  const currentCount = await countImages(curPwdInfo.value.id);
  if (currentCount >= MAX_IMAGE_COUNT) {
    ElMessage.error(`每个条目最多存储 ${MAX_IMAGE_COUNT} 张图片`);
    return;
  }

  // 检查是否已选择条目
  if (!curPwdInfo.value.id) {
    ElMessage.error('请先选择一个密码条目');
    return;
  }

  uploading.value = true;
  try {
    await insertImage(curPwdInfo.value.id, file);
    await refreshImageList();
    syncToOss();
    ElMessage.success('图片上传成功');
  } catch (e) {
    console.error('图片上传失败:', e);
    ElMessage.error('图片上传失败');
  } finally {
    uploading.value = false;
  }
}

async function handleDelete(id: number) {
  try {
    await deleteImage(id);
    imageDataUrls.value.delete(id);
    await refreshImageList();
    syncToOss();
    ElMessage.success('图片已删除');
  } catch (e) {
    console.error('图片删除失败:', e);
    ElMessage.error('图片删除失败');
  }
}

function handlePreview(index: number) {
  previewUrls.value = imageMetaList.value
      .map(meta => imageDataUrls.value.get(meta.id) || '')
      .filter(url => url !== '');
  previewIndex.value = index;
  previewVisible.value = true;
}

function closePreview() {
  previewVisible.value = false;
}
</script>

<template>
  <div class="image-gallery" v-if="curPwdInfo.id">
    <div class="gallery-header">
      <span class="gallery-title">图片附件</span>
      <span class="gallery-count">{{ imageMetaList.length }}/{{ MAX_IMAGE_COUNT }}</span>
    </div>

    <div class="gallery-grid">
      <!-- 图片缩略图 -->
      <div
          v-for="(meta, index) in imageMetaList"
          :key="meta.id"
          class="gallery-item"
      >
        <el-image
            :src="getImageUrl(meta.id)"
            fit="cover"
            class="gallery-image"
            :preview-src-list="[]"
            @click="handlePreview(index)"
        >
          <template #placeholder>
            <div class="image-loading">加载中...</div>
          </template>
          <template #error>
            <div class="image-error">{{ meta.file_name }}</div>
          </template>
        </el-image>

        <div class="gallery-item-overlay">
          <el-icon class="overlay-icon" @click="handlePreview(index)"><ZoomIn/></el-icon>
          <el-popconfirm
              title="确定删除此图片？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(meta.id)"
          >
            <template #reference>
              <el-icon class="overlay-icon overlay-delete"><Delete/></el-icon>
            </template>
          </el-popconfirm>
        </div>

        <div class="gallery-item-info">
          <span class="item-name" :title="meta.file_name">{{ meta.file_name }}</span>
          <span class="item-size">{{ formatFileSize(meta.file_size) }}</span>
        </div>
      </div>

      <!-- 上传按钮 -->
      <div class="gallery-item gallery-upload" v-if="imageMetaList.length < MAX_IMAGE_COUNT">
        <el-upload
            :show-file-list="false"
            :http-request="handleUpload"
            accept="image/*"
            :disabled="uploading"
        >
          <div class="upload-trigger" v-loading="uploading">
            <el-icon class="upload-icon"><Plus/></el-icon>
            <span class="upload-text">上传图片</span>
          </div>
        </el-upload>
      </div>
    </div>

    <!-- 全屏预览 -->
    <el-image-viewer
        v-if="previewVisible"
        :url-list="previewUrls"
        :initial-index="previewIndex"
        @close="closePreview"
        teleported
    />
  </div>
</template>

<style scoped>
.image-gallery {
  margin-top: 10px;
  width: 98%;
}

.gallery-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 5px 10px;
}

.gallery-title {
  font-size: 14px;
}

.gallery-count {
  font-size: 12px;
  opacity: 0.6;
}

.gallery-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 5px 10px;
}

.gallery-item {
  width: 100px;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
}

.gallery-image {
  width: 100px;
  height: 80px;
  display: block;
  cursor: pointer;
}

.gallery-item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.gallery-item:hover .gallery-item-overlay {
  opacity: 1;
}

.overlay-icon {
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: transform 0.2s;
}

.overlay-icon:hover {
  transform: scale(1.3);
}

.overlay-delete:hover {
  color: #f56c6c;
}

.gallery-item-info {
  padding: 4px 6px;
  font-size: 11px;
  line-height: 1.3;
  overflow: hidden;
}

.item-name {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-size {
  display: block;
  opacity: 0.5;
}

.gallery-upload {
  border: 1px dashed var(--el-border-color);
  cursor: pointer;
  transition: border-color 0.2s;
}

.gallery-upload:hover {
  border-color: var(--el-color-primary);
}

.upload-trigger {
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.upload-icon {
  font-size: 24px;
  opacity: 0.5;
}

.upload-text {
  font-size: 12px;
  opacity: 0.5;
}

.image-loading,
.image-error {
  width: 100px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  opacity: 0.5;
  text-align: center;
  padding: 4px;
  word-break: break-all;
}
</style>
