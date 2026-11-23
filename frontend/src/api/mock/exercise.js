import dayjs from "dayjs"
import isoWeek from 'dayjs/plugin/isoWeek'
import { mockError, mockResponse } from "./utils"

dayjs.extend(isoWeek)

function fromWeekStart(minutes) {
  const weekStart = dayjs().startOf('isoWeek')
  return weekStart.add(minutes, 'minute').format()
}

function daysAgo(days, hour, minute = 0) {
  return dayjs().subtract(days, "day").hour(hour).minute(minute).second(0).format()
}

function hoursAgo(hour) {
  return dayjs().subtract(hour, 'hour').format()
}

const exerciseRecords = [
  { id: 1, exercise_type: "yoga", duration_min: 30, intensity: "medium", calories_burned: 150, performed_at: hoursAgo(2), note: "", custom_type_name: null },
  { id: 2, exercise_type: "running", duration_min: 45, intensity: "high", calories_burned: 400, performed_at: daysAgo(1, 15), note: "", custom_type_name: null },
  { id: 3, exercise_type: "cycling", duration_min: 60, intensity: "medium", calories_burned: 500, performed_at: daysAgo(2, 9), note: "", custom_type_name: null },
  { id: 4, exercise_type: "swimming", duration_min: 45, intensity: "low", calories_burned: null, performed_at: daysAgo(3, 14), note: "", custom_type_name: null },
  { id: 5, exercise_type: "walking", duration_min: 30, intensity: "low", calories_burned: null, performed_at: daysAgo(4, 16), note: "", custom_type_name: null },
  { id: 6, exercise_type: "strength_training", duration_min: 45, intensity: "high", calories_burned: 350, performed_at: daysAgo(5, 11), note: "", custom_type_name: null },
  { id: 7, exercise_type: "tai_chi", duration_min: 60, intensity: "medium", calories_burned: 200, performed_at: daysAgo(8, 17), note: "", custom_type_name: null },
  { id: 8, exercise_type: "other", duration_min: 30, intensity: "low", calories_burned: null, performed_at: daysAgo(10, 13, 30), note: "", custom_type_name: "跳绳" },
  // 边界测试：本周一 00:30，应该算进本周
  { id: 9, exercise_type: "walking", duration_min: 20, intensity: "low", calories_burned: 80, performed_at: fromWeekStart(30), note: "", custom_type_name: null },
  // 边界测试：上周日 23:30，不应该算进本周
  { id: 10, exercise_type: "swimming", duration_min: 90, intensity: "low", calories_burned: null, performed_at: fromWeekStart(-30), note: "", custom_type_name: null },
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

export function mockGetExerciseSummary() {
  const weekStart = dayjs().startOf('isoWeek')
  const weekRecords = exerciseRecords.filter(record => !dayjs(record.performed_at).isBefore(weekStart))
  const count = weekRecords.length

  if (count === 0) {
    return mockResponse({
      week_start: weekStart.format(),
      count: 0,
      total_duration_min: 0,
      avg_duration_min: null,
      total_calories_burned: null,
    })
  }

  const totalDuration = weekRecords.reduce((sum, record) => sum + record.duration_min, 0)
  
  const knownCalories = weekRecords
    .map(record => record.calories_burned)
    .filter(calories => calories != null)

  return mockResponse({
      week_start: weekStart.format(),
      count,
      total_duration_min: totalDuration,
      avg_duration_min:  Math.round(totalDuration / count),
      total_calories_burned: knownCalories.length === 0
        ? null
        : knownCalories.reduce((sum, calories) => sum + calories, 0),
  })
}