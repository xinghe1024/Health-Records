import dayjs from "dayjs"
import { mockError, mockResponse } from "./utils"

function daysAgo(days, hour, minute = 0) {
  return dayjs().subtract(days, "day").hour(hour).minute(minute).second(0).format()
}

const exerciseRecords = [
  { id: 1, exercise_type: "yoga", duration_min: 30, intensity: "medium", calories_burned: 150, performed_at: daysAgo(0, 7), note: "", custom_type_name: null },
  { id: 2, exercise_type: "running", duration_min: 45, intensity: "high", calories_burned: 400, performed_at: daysAgo(1, 15), note: "", custom_type_name: null },
  { id: 3, exercise_type: "cycling", duration_min: 60, intensity: "medium", calories_burned: 500, performed_at: daysAgo(2, 9), note: "", custom_type_name: null },
  { id: 4, exercise_type: "swimming", duration_min: 45, intensity: "low", calories_burned: null, performed_at: daysAgo(3, 14), note: "", custom_type_name: null },
  { id: 5, exercise_type: "walking", duration_min: 30, intensity: "low", calories_burned: null, performed_at: daysAgo(4, 16), note: "", custom_type_name: null },
  { id: 6, exercise_type: "strength_training", duration_min: 45, intensity: "high", calories_burned: 350, performed_at: daysAgo(5, 11), note: "", custom_type_name: null },
  { id: 7, exercise_type: "tai_chi", duration_min: 60, intensity: "medium", calories_burned: 200, performed_at: daysAgo(8, 17), note: "", custom_type_name: null },
  { id: 8, exercise_type: "other", duration_min: 30, intensity: "low", calories_burned: null, performed_at: daysAgo(10, 13, 30), note: "", custom_type_name: "跳绳" },
]

let nextId = exerciseRecords.length + 1

export function mockListExerciseRecords() {
  const sortedRecords = [...exerciseRecords].sort(
    (a, b) => new Date(b.performed_at) - new Date(a.performed_at)
  )
  return mockResponse(sortedRecords)
}

export function mockCreateExerciseRecord(payload) {
  const record = { ...payload, id: nextId++ }
  exerciseRecords.push(record)
  return mockResponse(record)
}

export function mockDeleteExerciseRecord(recordId) {
  const index = exerciseRecords.findIndex(record => record.id === recordId)
  if (index === -1) return mockError(404, '运动记录不存在')
  exerciseRecords.splice(index, 1)
  return mockResponse({ message: '运动记录删除成功' })
}