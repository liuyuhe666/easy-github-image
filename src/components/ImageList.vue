<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { computed, onMounted } from 'vue'
import { useImageStore } from '../stores/image.ts'
import { useSettingStore } from '../stores/setting.ts'

const imageStore = useImageStore()
const imageList = computed(() => imageStore.getImages)
const srcList = computed(() => imageStore.getSrcList)
const settingStore = useSettingStore()
const { copy } = useClipboard()

onMounted(async () => {
  const repo = settingStore.repo
  const token = settingStore.token
  if (!repo || !token) {
    ElMessage({
      message: '请先完成 GitHub 配置',
      type: 'error',
      plain: true,
    })
  }
  else {
    await imageStore.update(repo, token)
  }
})

function handleMarkdownCopy(url: string) {
  const text = `![](${url})`
  copy(text)
  ElMessage({
    message: '复制成功',
    type: 'success',
    plain: true,
  })
}

function handleHTMLCopy(url: string) {
  const text = `<a href="${url}" target="_blank"></a>`
  copy(text)
  ElMessage({
    message: '复制成功',
    type: 'success',
    plain: true,
  })
}

function handleURLCopy(url: string) {
  copy(url)
  ElMessage({
    message: '复制成功',
    type: 'success',
    plain: true,
  })
}
</script>

<template>
  <div v-if="imageList && imageList.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
    <div v-for="(image, index) in imageList" :key="image.sha" class="flex flex-col items-center justify-between shadow-md rounded-lg dark:bg-white">
      <div class="flex flex-col items-center justify-between">
        <el-image
          class="w-80 h-64"
          :src="image.rawURL"
          :hide-on-click-modal="true"
          :preview-src-list="srcList"
          :initial-index="index"
          fit="cover"
          :alt="image.sha"
        >
          <template #placeholder>
            <div class="flex flex-col items-center justify-between gap-2">
              <img src="/loading.png" alt="loading" class="animate-spin">
              <span>加载中...</span>
            </div>
          </template>
        </el-image>
      </div>
      <div class="flex items-center gap-2 py-2">
        <el-tag type="primary" class="cursor-pointer" @click="handleMarkdownCopy(image.rawURL)">
          Markdown
        </el-tag>
        <el-tag type="primary" class="cursor-pointer" @click="handleHTMLCopy(image.rawURL)">
          HTML
        </el-tag>
        <el-tag type="primary" class="cursor-pointer" @click="handleURLCopy(image.rawURL)">
          URL
        </el-tag>
      </div>
    </div>
  </div>
  <el-empty v-else description="空空如也~" />
</template>

<style scoped>

</style>
