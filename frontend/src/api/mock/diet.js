import dayjs from "dayjs"
import { mockError, mockResponse } from "./utils"

function fromDayStart(minutes) {
  const dayStart = dayjs().startOf('day')
  return dayStart.add(minutes, 'minute').format()
}

function daysAgo(days, hour, minute = 0) {
  return dayjs().subtract(days, "day").hour(hour).minute(minute).second(0).format()
}

function hoursAgo(hours) {
  return dayjs().subtract(hours, 'hour').format()
}

// 加总有填写的数值，跳过 null；全部都没填写时回传 null（表示「不知道」，不是 0）
function sumKnownValues(values) {
  const knownValues = values.filter(value => value != null)

  return knownValues.length === 0
    ? null
    : knownValues.reduce((sum, value) => sum + value, 0)
}

const dietRecords = [
  // ===== 今天 =====
  // 边界测试：今天 00:30，应该算进今天
  { id: 1, meal_type: 'late_night', foods: '牛奶、苏打饼干', eaten_at: fromDayStart(30), calories: 180, carbs_g: 25, note: '' },
  { id: 2, meal_type: 'snack', foods: '苹果', eaten_at: hoursAgo(3), calories: 95, carbs_g: null, note: '' },
  { id: 3, meal_type: 'snack', foods: '原味坚果一小把', eaten_at: hoursAgo(2), calories: null, carbs_g: null, note: '' },
  { id: 4, meal_type: 'snack', foods: '黑咖啡', eaten_at: hoursAgo(1), calories: 5, carbs_g: 0, note: '无糖' },

  // ===== 昨天及更早 =====
  // 边界测试：昨天 23:30，不应该算进今天
  { id: 5, meal_type: 'late_night', foods: '泡面', eaten_at: fromDayStart(-30), calories: 450, carbs_g: 60, note: '' },
  { id: 6, meal_type: 'breakfast', foods: '全麦面包、水煮蛋、牛奶', eaten_at: daysAgo(1, 7, 30), calories: 320, carbs_g: 40, note: '' },
  { id: 7, meal_type: 'lunch', foods: '糙米饭、清蒸鱼、青菜', eaten_at: daysAgo(1, 12, 30), calories: null, carbs_g: 75, note: '' },
  { id: 8, meal_type: 'dinner', foods: '荞麦面、鸡胸肉', eaten_at: daysAgo(1, 18, 30), calories: 520, carbs_g: null, note: '' },
  { id: 9, meal_type: 'lunch', foods: '米饭、红烧肉、青菜', eaten_at: daysAgo(2, 12, 0), calories: 750, carbs_g: 110, note: '米饭较多' },
  { id: 10, meal_type: 'dinner', foods: '小米粥、炒青菜', eaten_at: daysAgo(3, 19, 0), calories: null, carbs_g: null, note: '' },
]

let nextId = dietRecords.length + 1

export function mockListDietRecords(){
  const sortedRecords = [...dietRecords].sort(
    (a, b) => new Date(b.eaten_at) - new Date(a.eaten_at)
  )
  return mockResponse(sortedRecords)
}

export function mockCreateDietRecord(payload) {
  const record = { ...payload, id: nextId++ }
  dietRecords.push(record)
  return mockResponse(record)
}

export function mockDeleteDietRecord(recordId) {
  const index = dietRecords.findIndex(record => record.id === recordId)
  if (index === -1) return mockError(404, '饮食记录不存在')
  dietRecords.splice(index, 1)
  return mockResponse({ message: '饮食记录删除成功' })
}

export function mockGetDietSummary() {
  const dayStart = dayjs().startOf('day')
  const todayRecords = dietRecords.filter(record => !dayjs(record.eaten_at).isBefore(dayStart))
  const mealCount = todayRecords.length

  if(mealCount === 0) {
    return mockResponse({
      day_start: dayStart.format(),
      meal_count: 0,
      total_calories: null,
      total_carbs_g: null,
      missing_nutrition_count: 0,
    })
  }

  const totalCalories = sumKnownValues(todayRecords.map(record => record.calories))
  const totalCarbs = sumKnownValues(todayRecords.map(record => record.carbs_g))

  const missingCount = todayRecords.filter(
    record => record.calories == null || record.carbs_g == null
    ).length

  return mockResponse({
    day_start: dayStart.format(),
    meal_count: mealCount,
    total_calories: totalCalories,
    total_carbs_g: totalCarbs,
    missing_nutrition_count: missingCount,
  })
}