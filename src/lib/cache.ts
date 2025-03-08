export class Cache {
  capacity: number
  cache: Map<string, string>
  constructor(capacity: number) {
    this.capacity = capacity
    this.cache = new Map<string, string>()
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
}
