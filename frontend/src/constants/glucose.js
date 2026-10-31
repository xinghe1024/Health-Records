// 血糖目标范围（mmol/L），通用参考值，并非个人医疗建议
const FASTING_TARGET = { min: 4.4, max: 7.0 }
const NON_FASTING_TARGET = { min: 4.4, max: 10.0 }

// 测量时段：value 存入数据库，label 用于显示
export const MEASURE_PERIODS = [
  { value: 'fasting', label: '空腹', target: FASTING_TARGET },
  { value: 'after_breakfast', label: '早餐后', target: NON_FASTING_TARGET },
  { value: 'before_lunch', label: '午餐前', target: FASTING_TARGET },
  { value: 'after_lunch', label: '午餐后', target: NON_FASTING_TARGET },
  { value: 'before_dinner', label: '晚餐前', target: FASTING_TARGET },
  { value: 'after_dinner', label: '晚餐后', target: NON_FASTING_TARGET },
  { value: 'bedtime', label: '睡前', target: NON_FASTING_TARGET },
  { value: 'random', label: '随机', target: NON_FASTING_TARGET },
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

  const { min, max } = period.target
  
  if(value < min) return 'low'
  if(value > max) return 'high'
  return 'normal'
}