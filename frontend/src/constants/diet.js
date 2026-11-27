export const MEAL_TYPES = [
    { value: 'breakfast', label:'早餐' },
    { value: 'lunch', label:'午餐' },
    { value: 'dinner', label:'晚餐' },
    { value: 'snack', label:'加餐' },
    { value: 'late_night', label:'夜宵' },
]

export function getMealTypeLabel(mealTypeValue) {
    return MEAL_TYPES.find(mealType => mealType.value === mealTypeValue)?.label ?? '未知'
}