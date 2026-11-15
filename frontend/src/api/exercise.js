import http from "./http"
import { USE_MOCK } from "./config"
import {
  mockCreateExerciseRecord,
  mockDeleteExerciseRecord,
  mockListExerciseRecords
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