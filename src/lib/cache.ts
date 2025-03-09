export class Cache {
  capacity: number
  cache: Map<string, string>
  constructor(capacity: number) {
    this.capacity = capacity
    this.cache = new Map<string, string>()
    this.loadCache()
  }

  get(key: string): string | null {
    if (!this.cache.has(key))
      return null
    const value = this.cache.get(key) as string
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  put(key: string, value: string) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value as string
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }

  saveCache() {
    const cacheData = Array.from(this.cache.entries())
    try {
      localStorage.setItem('easy-github-image-cache', JSON.stringify(cacheData))
    }
    catch (e) {
      console.error(e)
    }
  }

  loadCache() {
    try {
      const cacheData = localStorage.getItem('easy-github-image-cache')
      if (cacheData) {
        const entries = JSON.parse(cacheData) as [string, string][]
        entries.forEach(([key, value]) => {
          this.cache.set(key, value)
        })
      }
    }
    catch (e) {
      console.error(e)
    }
  }
}
