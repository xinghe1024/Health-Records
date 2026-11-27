import http from "./http"
import { USE_MOCK } from "./config"
import {
  mockCreateExerciseRecord,
  mockDeleteExerciseRecord,
  mockListExerciseRecords,
  mockGetExerciseSummary,
} from "./mock/exercise"

export function listExerciseRecords() {
  if (USE_MOCK) return mockListExerciseRecords()
  return http.get("/exercise-records")
}

export function createExerciseRecord(payload) {
  if (USE_MOCK) return mockCreateExerciseRecord(payload)
  return http.post("/exercise-records", payload)
}

export function deleteExerciseRecord(recordId) {
  if (USE_MOCK) return mockDeleteExerciseRecord(recordId)
  return http.delete(`/exercise-records/${recordId}`)
}

export function getExerciseSummary() {
  if (USE_MOCK) return mockGetExerciseSummary()
  return http.get('/exercise-records/summary')
}