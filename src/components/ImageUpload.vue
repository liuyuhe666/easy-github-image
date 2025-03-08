<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { uploadImage } from '../lib/github.ts'
import { useSettingStore } from '../stores/setting.ts'
import { getFileExtension } from '../utils'

const store = useSettingStore()
const token = store.token
const repo = store.repo

async function uploadFile(uploadRequestOptions: UploadRequestOptions) {
  const date = new Date()
  const timestamp = date.getTime()
  const year = date.getFullYear()
  const file = uploadRequestOptions.file
  const suffix = getFileExtension(file.name)
  const path = `images/${year}/${timestamp}.${suffix}`
  try {
    await uploadImage(file, path, repo, token)
    ElMessage({
      message: '上传成功',
      type: 'success',
      plain: true,
    })
    window.location.reload()
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
</script>

<template>
  <el-upload
    class="md:w-xl"
    drag
    :show-file-list="false"
    :http-request="uploadFile"
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
