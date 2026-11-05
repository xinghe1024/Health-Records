import http from "./http"

import { USE_MOCK } from "./config"
import {
  mockCreateGlucoseRecord,
  mockListGlucoseRecords,
  mockDeleteGlucoseRecord,
  mockGetGlucoseSummary,
} from './mock/glucose'

export function createGlucoseRecord(payload) {
    if (USE_MOCK) return mockCreateGlucoseRecord(payload)
    return http.post('/glucose-records', payload)
}

export function listGlucoseRecords() {
    if (USE_MOCK) return mockListGlucoseRecords()
    return http.get('/glucose-records')
}

export function deleteGlucoseRecord(recordId) {
    if (USE_MOCK) return mockDeleteGlucoseRecord(recordId)
    return http.delete(`/glucose-records/${recordId}`)
}

export function getGlucoseSummary() {
  if (USE_MOCK) return mockGetGlucoseSummary()
  return http.get('/glucose-records/summary')
}