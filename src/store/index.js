import { defineStore } from "pinia"
import { computed, ref } from "vue"
export const useCounterStore = defineStore("data", () => {
  const count = ref(0)
  const strr = ref('strr')
  const arr = ref([1, '字符2', { obj: '对象' }])
  const increment = () => {
    count.value++
  }
  const decrement = () => {
    count.value -= 1
  }

  const doubleCount = computed(() => {
    return count.value * 2
  })

  return {
    count,
    strr,
    arr,
    increment,
    decrement,
    doubleCount
  }
},
  // TODO: 持久化
  {
    // 网页端的配置
    // persist: true,
    // 小程序端的配置
    persist: {
      storage: {
        // h5: localStorage.getItem(key)
        // mp: wx.getStorageSync(key),
        getItem: (key) => uni.getStorageSync(key),
        setItem: (key, value) => uni.setStorageSync(key, value)
        // 内部处理了序列化和反序列化
      },
    },
  })