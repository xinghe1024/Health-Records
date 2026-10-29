import http from './http'
import { mockDashboard } from './mock/dashboard'

export const mockDashboard = {
    patient: { id: 1, name: '张三' },
    avh: 7.2,
    glucose: [{ vlaue: 6.8, measured_at: '2026-04-01 07:00:00' }],
    metrics: { hbalc: 6.7, targetRate: 82, bmi: 26.4, streak: 12 },
    todayTasks: [],
    insight: '示范文字',
}

const USE_MOCK = true   // 后端接口完成后改成 false

export async function getDashboard() {
  if (USE_MOCK) return structuredClone(mockDashboard)
  const response = await http.get('/dashboard')
  return response.data
}

