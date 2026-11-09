// 目标范围分组（mmol/L），通用参考值，并非个人医疗建议
export const TARGET_GROUPS = [
  { value: 'fasting', label: '空腹/餐前', min: 4.4, max: 7.0 },
  { value: 'non_fasting', label: '餐后/其他', min: 4.4, max: 10.0 },
]

// 根据分组代码查找目标范围
export function findTargetGroup(groupValue) {
  return TARGET_GROUPS.find(group => group.value === groupValue)
}

// 测量时段：value 存入数据库，label 用于显示，group 决定使用哪一组目标范围
export const MEASURE_PERIODS = [
  { value: 'fasting', label: '空腹', group: 'fasting' },
  { value: 'after_breakfast', label: '早餐后', group: 'non_fasting' },
  { value: 'before_lunch', label: '午餐前', group: 'fasting' },
  { value: 'after_lunch', label: '午餐后', group: 'non_fasting' },
  { value: 'before_dinner', label: '晚餐前', group: 'fasting' },
  { value: 'after_dinner', label: '晚餐后', group: 'non_fasting' },
  { value: 'bedtime', label: '睡前', group: 'non_fasting' },
  { value: 'random', label: '随机', group: 'non_fasting' },
]

// 根据时段代码查找配置
export function findPeriod(periodValue) {
  return MEASURE_PERIODS.find(period => period.value === periodValue)
}

// 判断一次血糖是否在目标范围内，返回 'low' | 'normal' | 'high' | 'unknown'
export function getGlucoseStatus(value, periodValue) {
  const period = findPeriod(periodValue)

  if(!period) { 
    console.warn(`未知的测量时段：${periodValue}`)
    return 'unknown'
  }

  const { min, max } = findTargetGroup(period.group)
  
  if(value < min) return 'low'
  if(value > max) return 'high'
  return 'normal'
}

// 血糖状态的显示信息
export const GLUCOSE_STATUS_DISPLAY = {
  low: { label: '偏低', tagType: 'warning' },
  normal: { label: '正常', tagType: 'success' },
  high: { label: '偏高', tagType: 'danger' },
  unknown: { label: '未知', tagType: 'info' },
}

// 根据时段代码获取显示标签，如果找不到则返回 '未知'
export function getPeriodLabel(periodValue) {
  return findPeriod(periodValue)?.label ?? '未知'
}