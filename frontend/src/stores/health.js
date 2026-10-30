import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getDashboard } from '@/api/dashboard'

export const useHealthStore = defineStore('health', () => {
  const dashboard = ref(null)
  const loading = ref(false)

  async function loadDashboard() {
    loading.value = true
    try {
      dashboard.value = await getDashboard()
    } finally {
      // 无论成功还是失败都要关闭 loading，否则页面会一直转圈
      loading.value = false
    }
  }

  return { dashboard, loading, loadDashboard }
})