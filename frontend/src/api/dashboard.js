import http from './http'
import { USE_MOCK } from './config'
import { mockResponse } from './mock/utils'
import { mockDashboard } from './mock/dashboard'

export function getDashboard() {
  if (USE_MOCK) return mockResponse(mockDashboard)
  return http.get('/dashboard')
}