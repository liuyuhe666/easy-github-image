<script setup lang="ts">
import type { ImageItem } from '../lib/github.ts'
import { useClipboard } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { getImageList } from '../lib/github.ts'
import { useSettingStore } from '../stores/setting.ts'

const imageList = ref<ImageItem[]>()
const srcList = ref<string[]>()
const store = useSettingStore()
const { copy } = useClipboard()
onMounted(async () => {
  const data = await getImageList(store.repo, store.token)
  if (data && data.length) {
    const urlList: string[] = []
    data.forEach((item: ImageItem) => {
      urlList.push(item.rawURL)
    })
    imageList.value = data
    srcList.value = urlList
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
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
    <div v-for="(image, index) in imageList" :key="image.sha" class="flex flex-col items-center justify-between shadow-md rounded-lg">
      <div class="text-center w-sm">
        <el-image
          :src="image.rawURL"
          :hide-on-click-modal="true"
          :preview-src-list="srcList"
          :initial-index="index"
          fit="scale-down"
          :alt="image.sha"
        />
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
</template>

<style scoped>

</style>
