<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { uploadImage } from '../lib/github.ts'
import { useImageStore } from '../stores/image.ts'
import { useSettingStore } from '../stores/setting.ts'
import { getFileExtension } from '../utils'

const settingStore = useSettingStore()
const imageStore = useImageStore()

async function upload(file: File) {
  const date = new Date()
  const timestamp = date.getTime()
  const year = date.getFullYear()
  const suffix = getFileExtension(file.name)
  const path = `images/${year}/${timestamp}.${suffix}`
  try {
    const { token, repo } = settingStore
    await uploadImage(file, path, repo, token)
    await imageStore.update(repo, token)
    ElMessage({
      message: '上传成功',
      type: 'success',
      plain: true,
    })
  }
  catch (error) {
    console.error(error)
    ElMessage({
      message: '上传失败，请检查 GitHub 配置',
      type: 'error',
      plain: true,
    })
  }
}

async function uploadFile(uploadRequestOptions: UploadRequestOptions) {
  const file = uploadRequestOptions.file
  await upload(file)
}

async function handlePaste(event: ClipboardEvent) {
  const clipboardData = event.clipboardData
  if (clipboardData) {
    const items = clipboardData.items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.kind === 'file' && item.type.startsWith('image')) {
        const file = item.getAsFile()
        if (file) {
          await upload(file)
        }
      }
    }
  }
}
</script>

<template>
  <el-upload
    class="md:w-xl pt-24"
    drag
    :show-file-list="false"
    :http-request="uploadFile"
    @paste="handlePaste"
  >
    <el-icon class="el-icon--upload">
      <UploadFilled />
    </el-icon>
    <div class="el-upload__text">
      将图片拖拽到此处，或<em>点击上传</em>
    </div>
  </el-upload>
</template>

<style scoped>

</style>
