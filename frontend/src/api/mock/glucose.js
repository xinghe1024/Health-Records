import { mockResponse, mockError } from './utils'
import { getGlucoseStatus } from '@/constants/glucose'

// 模拟数据库中的血糖记录表（模块只执行一次，刷新页面前数据会一直保留）
const glucoseRecords = [
  { id: 1, value: 6.2, period: 'fasting', measured_at: '2026-10-25T07:00:00+08:00', note: '' },
  { id: 2, value: 8.9, period: 'after_breakfast', measured_at: '2026-10-25T09:30:00+08:00', note: '' },
  { id: 3, value: 5.8, period: 'before_lunch', measured_at: '2026-10-26T11:30:00+08:00', note: '' },
  { id: 4, value: 11.2, period: 'after_lunch', measured_at: '2026-10-26T13:30:00+08:00', note: '米饭吃多了' },
  { id: 5, value: 7.4, period: 'fasting', measured_at: '2026-10-27T07:00:00+08:00', note: '昨晚睡得晚' },
  { id: 6, value: 6.5, period: 'before_dinner', measured_at: '2026-10-27T17:30:00+08:00', note: '' },
  { id: 7, value: 9.6, period: 'after_dinner', measured_at: '2026-10-28T20:00:00+08:00', note: '' },
  { id: 8, value: 4.1, period: 'bedtime', measured_at: '2026-10-28T22:30:00+08:00', note: '有点心慌' },
  { id: 9, value: 6.8, period: 'fasting', measured_at: '2026-10-29T07:05:00+08:00', note: '' },
  { id: 10, value: 7.9, period: 'random', measured_at: '2026-10-29T15:30:00+08:00', note: '下午茶后' },
]

let nextId = glucoseRecords.length + 1

export function mockListGlucoseRecords() {
    const sortedRecords = [...glucoseRecords].sort(
    (a, b) => new Date(b.measured_at) - new Date(a.measured_at)
    )
    return mockResponse(sortedRecords)
}

export function mockCreateGlucoseRecord(payload) {
    const record = { ...payload, id: nextId++ }
    glucoseRecords.push(record)
    return mockResponse(record)
}

export function mockDeleteGlucoseRecord(recordId) {
    const index = glucoseRecords.findIndex(record => record.id === recordId)
    if (index === -1) return mockError(404, '血糖记录不存在')

    glucoseRecords.splice(index, 1) 
    return mockResponse(null)
}

// 统计：记录数、平均值、最高、最低、达标率
export function mockGetGlucoseSummary() {
  const count = glucoseRecords.length

  // 没有记录时用 null 表示“无数据”，避免出现 NaN 和 -Infinity
  if (count === 0) {
    return mockResponse({
      count: 0,
      avg_glucose: null,
      max_glucose: null,
      min_glucose: null,
      target_rate: null,
    })
  }

  const values = glucoseRecords.map(record => record.value)
  const total = values.reduce((sum, value) => sum + value, 0)
  const normalCount = glucoseRecords.filter(
    record => getGlucoseStatus(record.value, record.period) === 'normal'
  ).length

  return mockResponse({
    count,
    avg_glucose: Math.round((total / count) * 10) / 10,
    max_glucose: Math.max(...values),
    min_glucose: Math.min(...values),
    target_rate: Math.round((normalCount / count) * 100),
  })
}