export const OTHER_EXERCISE_TYPE = 'other'
// 每周中等强度运动的通用参考目标（分钟），并非个人医疗建议
export const WEEKLY_EXERCISE_GOAL_MIN = 150

export const EXERCISE_TYPES = [
  { value: 'yoga', label: '瑜伽' },
  { value: 'tai_chi', label: '太极' },  
  { value: 'running', label: '跑步' },
  { value: 'walking', label: '步行' },
  { value: 'cycling', label: '骑行' },
  { value: 'swimming', label: '游泳' },
  { value: 'strength_training', label: '力量训练' },
  { value: OTHER_EXERCISE_TYPE, label: '其他' },
]

export function getExerciseTypeLabel(typeValue) {
    return EXERCISE_TYPES.find(type => type.value === typeValue)?.label ?? '未知'
}

//通用参考，不是个人医疗建议
export const EXERCISE_INTENSITY = [
    { value: 'low', label: '低强度', description: '运动时可以轻松唱歌' },
    { value: 'medium', label: '中等强度', description: '可以说话但唱不了歌' },
    { value: 'high', label: '高强度', description: '只能说几个字就要喘气' },
]

export function getIntensityLabel(intensityValue) {
    return EXERCISE_INTENSITY.find(intensity => intensity.value === intensityValue)?.label ?? '未知'
}

export function getExerciseDisplayName(record) {
    const label = getExerciseTypeLabel(record.exercise_type)
    if (record.exercise_type !== OTHER_EXERCISE_TYPE) return label
    return record.custom_type_name || label
}