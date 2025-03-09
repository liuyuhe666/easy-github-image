<script setup lang="ts">
import { Moon, Setting, Sunny } from '@element-plus/icons-vue'
import { useDark, useToggle, useWindowScroll } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { siteInfo } from '../constants/site.ts'
import { useImageStore } from '../stores/image.ts'
import { useSettingStore } from '../stores/setting.ts'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const dialogFormVisible = ref(false)
const token = ref<string>('')
const repo = ref<string>('')
const settingStore = useSettingStore()
const imageStore = useImageStore()
const { y } = useWindowScroll()

onMounted(() => {
  token.value = settingStore.token
  repo.value = settingStore.repo
})

async function save() {
  settingStore.setToken(token.value)
  settingStore.setRepo(repo.value)
  dialogFormVisible.value = false
  await imageStore.update(repo.value, token.value)
  ElMessage({
    message: '保存成功',
    type: 'success',
    plain: true,
  })
}
</script>

<template>
  <header class="fixed top-0 z-30 flex flex-col md:flex-row items-center justify-between w-full py-4 gap-2" :class="[y > 50 ? 'border-b border-gray-200 bg-white/50 dark:bg-white/0 backdrop-blur-xl' : 'bg-white/0']">
    <span class="px-24 text-2xl font-semibold hover:drop-shadow-[0_0_2em_#b0d9f7]">Easy GitHub Image</span>
    <div class="px-24 flex items-center justify-center gap-4">
      <el-button type="primary" :icon="Setting" @click="dialogFormVisible = true">
        配置
      </el-button>
      <el-button circle :icon="isDark ? Sunny : Moon" @click="toggleDark()" />
      <a target="_blank" :href="siteInfo.repoLink" rel="noopener noreferrer">
        <svg :fill="isDark ? '#e5eaf3' : '#303133'" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" /></svg>
      </a>
    </div>
  </header>
  <el-dialog v-model="dialogFormVisible" title="配置" width="500">
    <div class="flex flex-col justify-center items-start gap-4">
      <label class="flex flex-col gap-2">
        <span class="font-medium">GitHub Token: </span>
        <input v-model="token" type="password" class="p-2 min-w-64"></label>
      <label class="flex flex-col gap-2">
        <span class="font-medium">Repository: </span>
        <input v-model="repo" type="text" class="p-2 min-w-64" placeholder="用户名/仓库名"></label>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="save">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
