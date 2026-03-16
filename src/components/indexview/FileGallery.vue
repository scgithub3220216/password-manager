<script lang="ts" setup>
import {ref, watch, onMounted, onUnmounted} from "vue";
import {useUserDataInfoStore} from "../../store/userDataInfo.ts";
import {storeToRefs} from "pinia";
import useDBFile from "../../hooks/useDBFile.ts";
import useDBConfig from "../../hooks/useDBConfig.ts";
import useDataSync from "../../hooks/useDataSync.ts";
import {PwdFileMeta} from "../type.ts";
import {ElMessage} from "element-plus";
import {CopyDocument, Delete, Download, Plus, ZoomIn, Document} from "@element-plus/icons-vue";
import {
    IPC_SHOW_SAVE_DIALOG,
    IPC_SAVE_FILE_TO_PATH,
    IPC_GET_DESKTOP_PATH,
} from "../../../electron/constant.ts";
import {
    defaultDownloadPathSwitch,
    defaultDownloadPath,
} from "../../../electron/db/sqlite/components/configConstants.ts";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_MIME_TYPES = [
  // 图片
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
  // 文档
  'application/pdf',
  'text/plain',
  'text/markdown',
  // Office
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // .xlsx
  'application/msword',      // .doc
  'application/vnd.ms-excel', // .xls
];

const ACCEPT_EXTENSIONS = '.jpg,.jpeg,.png,.gif,.webp,.bmp,.pdf,.md,.txt,.docx,.xlsx,.doc,.xls';

function isImageType(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

function getFileTypeLabel(mimeType: string): string {
  const map: Record<string, string> = {
    'application/pdf': 'PDF',
    'text/plain': 'TXT',
    'text/markdown': 'MD',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'application/msword': 'DOC',
    'application/vnd.ms-excel': 'XLS',
  };
  return map[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'FILE';
}

const userDataInfoStore = useUserDataInfoStore();
const {curPwdInfo} = storeToRefs(userDataInfoStore);
const {insertFile, deleteFile, listFileMeta, getFileDataUrl} = useDBFile();
const {getConfigValue} = useDBConfig();
const {syncToOss} = useDataSync();

const fileMetaList = ref<PwdFileMeta[]>([]);
const fileDataUrls = ref<Map<number, string>>(new Map());
const uploading = ref(false);
const previewVisible = ref(false);
const previewIndex = ref(0);
const previewUrls = ref<string[]>([]);
const isDragging = ref(false);

// 监听当前密码条目变化，刷新文件列表
watch(() => curPwdInfo.value.id, async (newId) => {
  // 清空旧数据，释放内存
  fileDataUrls.value = new Map();
  fileMetaList.value = [];
  if (newId) {
    await refreshFileList();
  }
}, {immediate: true});

// 粘贴上传监听（仅处理图片）
function handlePaste(e: ClipboardEvent) {
  if (!curPwdInfo.value.id) return;
  const items = e.clipboardData?.items;
  if (!items) return;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) {
      const file = items[i].getAsFile();
      if (file) {
        // 生成文件名
        const ext = file.type.split('/')[1] || 'png';
        const newFile = new File([file], `paste-${Date.now()}.${ext}`, {type: file.type});
        processFile(newFile);
      }
      e.preventDefault();
      break;
    }
  }
}

onMounted(() => {
  document.addEventListener('paste', handlePaste);
});

onUnmounted(() => {
  document.removeEventListener('paste', handlePaste);
  fileDataUrls.value = new Map();
  fileMetaList.value = [];
});

async function refreshFileList() {
  if (!curPwdInfo.value.id) return;
  fileMetaList.value = await listFileMeta(curPwdInfo.value.id);
  // 逐个加载图片类型的数据（非图片不需要加载 dataUrl）
  for (const meta of fileMetaList.value) {
    if (isImageType(meta.mime_type) && !fileDataUrls.value.has(meta.id)) {
      const dataUrl = await getFileDataUrl(meta.id, meta.mime_type);
      fileDataUrls.value.set(meta.id, dataUrl);
    }
  }
}

function getFileUrl(id: number): string {
  return fileDataUrls.value.get(id) || '';
}

function formatFileSize(size: number): string {
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  return (size / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * 公共上传处理函数，供按钮上传、粘贴上传、拖拽上传复用
 */
async function processFile(file: File) {
  // MIME 类型校验
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    ElMessage.error('不支持的文件格式，仅支持 JPG/PNG/GIF/WEBP/BMP/PDF/MD/DOCX/TXT/XLSX');
    return;
  }

  // 大小校验
  if (file.size > MAX_FILE_SIZE) {
    ElMessage.error(`文件大小不能超过 ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    return;
  }

  // 检查是否已选择条目
  if (!curPwdInfo.value.id) {
    ElMessage.error('请先选择一个密码条目');
    return;
  }

  uploading.value = true;
  try {
    await insertFile(curPwdInfo.value.id, file);
    await refreshFileList();
    syncToOss();
    ElMessage.success('文件上传成功');
  } catch (e) {
    console.error('文件上传失败:', e);
    ElMessage.error('文件上传失败');
  } finally {
    uploading.value = false;
  }
}

async function handleUpload(options: any) {
  const file = options.file as File;
  await processFile(file);
}

// 拖拽上传处理
function handleDragEnter(e: DragEvent) {
  if (e.dataTransfer?.types.includes('Files')) {
    isDragging.value = true;
  }
}

function handleDragLeave(e: DragEvent) {
  // 确保离开的是gallery容器本身
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  if (e.clientX <= rect.left || e.clientX >= rect.right ||
      e.clientY <= rect.top || e.clientY >= rect.bottom) {
    isDragging.value = false;
  }
}

async function handleDrop(e: DragEvent) {
  isDragging.value = false;
  if (!e.dataTransfer?.types.includes('Files')) return;
  const files = e.dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    if (ALLOWED_MIME_TYPES.includes(files[i].type)) {
      await processFile(files[i]);
    }
  }
}

async function handleDelete(id: number) {
  try {
    await deleteFile(id);
    fileDataUrls.value.delete(id);
    await refreshFileList();
    syncToOss();
    ElMessage.success('文件已删除');
  } catch (e) {
    console.error('文件删除失败:', e);
    ElMessage.error('文件删除失败');
  }
}

function handlePreview(index: number) {
  // 仅预览图片类型文件
  const imageItems = fileMetaList.value.filter(meta => isImageType(meta.mime_type));
  previewUrls.value = imageItems
      .map(meta => fileDataUrls.value.get(meta.id) || '')
      .filter(url => url !== '');
  // 计算当前图片在仅图片列表中的索引
  const clickedMeta = fileMetaList.value[index];
  const imageIndex = imageItems.findIndex(m => m.id === clickedMeta.id);
  previewIndex.value = Math.max(0, imageIndex);
  previewVisible.value = true;
}

function closePreview() {
  previewVisible.value = false;
}

/**
 * 复制图片到剪贴板（仅图片类型可用）
 */
async function handleCopyImage(id: number, mimeType: string) {
  try {
    const dataUrl = getFileUrl(id) || await getFileDataUrl(id, mimeType);
    if (!dataUrl) {
      ElMessage.error('文件数据加载失败');
      return;
    }
    const img = new Image();
    img.src = dataUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('图片加载失败'));
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error('转换失败'));
      }, 'image/png');
    });
    await navigator.clipboard.write([
      new ClipboardItem({'image/png': blob})
    ]);
    ElMessage.success('图片已复制到剪贴板');
  } catch (e) {
    console.error('图片复制失败:', e);
    ElMessage.error('图片复制失败');
  }
}

/**
 * 下载文件（根据配置决定保存方式）
 */
async function handleDownloadFile(id: number, mimeType: string, fileName: string) {
  try {
    // 获取文件数据
    const dataUrl = getFileUrl(id) || await getFileDataUrl(id, mimeType);
    if (!dataUrl) {
      ElMessage.error('文件数据加载失败');
      return;
    }
    const base64Data = dataUrl.split(',')[1];

    // 读取下载路径配置
    const switchValue = await getConfigValue(defaultDownloadPathSwitch);
    if (switchValue === '1') {
      // 启用默认下载路径：自动保存到配置路径
      let downloadDir = await getConfigValue(defaultDownloadPath);
      if (!downloadDir) {
        downloadDir = await window.ipcRenderer.invoke(IPC_GET_DESKTOP_PATH);
      }
      const savedPath = await window.ipcRenderer.invoke(IPC_SAVE_FILE_TO_PATH, base64Data, downloadDir, fileName);
      ElMessage.success(`文件已保存到: ${savedPath}`);
    } else {
      // 未启用默认路径：弹出保存对话框
      const selectedPath = await window.ipcRenderer.invoke(IPC_SHOW_SAVE_DIALOG, fileName);
      if (selectedPath) {
        await window.ipcRenderer.invoke(IPC_SAVE_FILE_TO_PATH, base64Data, selectedPath, '');
        ElMessage.success(`文件已保存到: ${selectedPath}`);
      }
    }
  } catch (e) {
    console.error('文件下载失败:', e);
    ElMessage.error('文件下载失败');
  }
}
</script>

<template>
  <div
      class="file-gallery"
      v-if="curPwdInfo.id"
      @dragover.prevent
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
  >
    <div class="gallery-header">
      <span class="gallery-title">文件附件</span>
      <span class="gallery-count">{{ fileMetaList.length }} 个文件</span>
    </div>

    <!-- 拖拽上传遮罩 -->
    <div class="drag-overlay" v-if="isDragging">
      <span class="drag-overlay-text">拖放文件到此处上传</span>
    </div>

    <div class="gallery-grid">
      <!-- 文件缩略图/图标 -->
      <div
          v-for="(meta, index) in fileMetaList"
          :key="meta.id"
          class="gallery-item"
      >
        <!-- 图片类型：显示缩略图 -->
        <template v-if="isImageType(meta.mime_type)">
          <el-image
              :src="getFileUrl(meta.id)"
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
            <el-icon class="overlay-icon" @click="handleCopyImage(meta.id, meta.mime_type)"><CopyDocument/></el-icon>
            <el-icon class="overlay-icon" @click="handleDownloadFile(meta.id, meta.mime_type, meta.file_name)"><Download/></el-icon>
            <el-popconfirm
                title="确定删除此文件？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="handleDelete(meta.id)"
                width="160px"
            >
              <template #reference>
                <el-icon class="overlay-icon overlay-delete"><Delete/></el-icon>
              </template>
            </el-popconfirm>
          </div>
        </template>

        <!-- 非图片类型：显示文件图标 -->
        <template v-else>
          <div class="file-icon-placeholder">
            <el-icon class="file-type-icon"><Document/></el-icon>
            <span class="file-type-label">{{ getFileTypeLabel(meta.mime_type) }}</span>
          </div>

          <div class="gallery-item-overlay">
            <el-icon class="overlay-icon" @click="handleDownloadFile(meta.id, meta.mime_type, meta.file_name)"><Download/></el-icon>
            <el-popconfirm
                title="确定删除此文件？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="handleDelete(meta.id)"
                width="160px"
            >
              <template #reference>
                <el-icon class="overlay-icon overlay-delete"><Delete/></el-icon>
              </template>
            </el-popconfirm>
          </div>
        </template>

        <div class="gallery-item-info">
          <span class="item-name" :title="meta.file_name">{{ meta.file_name }}</span>
          <span class="item-size">{{ formatFileSize(meta.file_size) }}</span>
        </div>
      </div>

      <!-- 上传按钮 -->
      <div class="gallery-item gallery-upload">
        <el-upload
            :show-file-list="false"
            :http-request="handleUpload"
            :accept="ACCEPT_EXTENSIONS"
            :disabled="uploading"
        >
          <div class="upload-trigger" v-loading="uploading">
            <el-icon class="upload-icon"><Plus/></el-icon>
            <span class="upload-text">上传文件</span>
          </div>
        </el-upload>
      </div>
    </div>

    <!-- 全屏预览（仅图片） -->
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
.file-gallery {
  margin-top: 10px;
  width: 98%;
  position: relative;
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

.file-icon-placeholder {
  width: 100px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: var(--el-fill-color-lighter);
  cursor: default;
}

.file-type-icon {
  font-size: 28px;
  opacity: 0.5;
}

.file-type-label {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.6;
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
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;
}

.gallery-item:hover .gallery-item-overlay {
  opacity: 1;
}

.overlay-icon {
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  padding: 3px;
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

/* 拖拽遮罩 */
.drag-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(64, 158, 255, 0.1);
  border: 2px dashed var(--el-color-primary);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
}

.drag-overlay-text {
  font-size: 14px;
  color: var(--el-color-primary);
  font-weight: 500;
}
</style>
