import { defineStore } from 'pinia'

export const useSettingStore = defineStore('easy-github-image-setting-store', {
  state: () => ({ token: '', repo: '' }),
  getters: {
    getUserName: (state) => {
      if (state.repo) {
        return state.repo.trim().split('/')[0]
      }
      return null
    },
    getRepoName: (state) => {
      if (state.repo) {
        return state.repo.trim().split('/')[1]
      }
      return null
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setRepo(repo: string) {
      this.repo = repo
    },
  },
  persist: true,
})
