import http from './http'
import { USE_MOCK } from './config'
import { mockResponse } from './mock/utils'
import { mockProfile } from './mock/user'

export function getProfile() {
  if (USE_MOCK) return mockResponse(mockProfile)
  return http.get('/users/me')
}