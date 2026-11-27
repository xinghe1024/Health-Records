import http from "./http"
import { USE_MOCK } from "./config"
import {
  mockCreateDietRecord,
  mockDeleteDietRecord,
  mockListDietRecords,
  mockGetDietSummary,
} from "./mock/diet"

export function listDietRecords() {
  if(USE_MOCK) return mockListDietRecords()
  return http.get('/diet-records')
}

export function createDietRecord(payload) {
  if (USE_MOCK) return mockCreateDietRecord(payload)
  return http.post("/diet-records", payload)
}

export function deleteDietRecord(recordId) {
  if (USE_MOCK) return mockDeleteDietRecord(recordId)
  return http.delete(`/diet-records/${recordId}`)
}

export function getDietSummary() {
  if (USE_MOCK) return mockGetDietSummary()
  return http.get('/diet-records/summary')
}