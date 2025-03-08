import type { ImageItem } from '../lib/github.ts'
import { defineStore } from 'pinia'
import { getImageList } from '../lib/github.ts'

export const useImageStore = defineStore('image-store', {
  state: () => ({
    images: [] as ImageItem[],
    srcList: [] as string[],
  }),
  getters: {
    getImages: state => state.images,
    getSrcList: state => state.srcList,
  },
  actions: {
    async update(repo: string, token: string) {
      const result = await getImageList(repo, token)
      if (result && result.length > 0) {
        this.images = result
        const urlList: string[] = []
        result.forEach((image: ImageItem) => {
          urlList.push(image.rawURL)
        })
        this.srcList = urlList
      }
    },
  },
})
