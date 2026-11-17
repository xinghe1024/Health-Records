<script setup>
import { reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { createExerciseRecord } from '@/api/exercise'
import {
    EXERCISE_TYPES,
    EXERCISE_INTENSITY
} from '@/constants/exercise'

// 弹窗显示状态，由父组件通过 v-model 控制
const visible = defineModel({ type: Boolean, default: false })
// 新增成功后通知父组件
const emit = defineEmits(['created'])

const formRef = ref()
const submitting = ref(false)

// 生成一份全新的表单数据，默认运动时间为当前时间
function createEmptyForm() {
    return {
        exercise_type: null,
        performed_at: dayjs().format('YYYY-MM-DD[T]HH:mm:ssZ'),
        duration_min: null,
        intensity: null,
        calories_burned: null,
        note: '',
    }
}

const form = reactive(createEmptyForm())

const rules = {
    exercise_type: [{ required: true, message: '请选择运动类型', trigger: 'change' }],
    performed_at: [{ required: true, message: '请选择运动时间', trigger: 'change' }],
    duration_min: [{ required: true, message: '请输入运动时长', trigger: 'blur' }],
    intensity: [{ required: true, message: '请选择运动强度', trigger: 'change' }],
}

// 每次打开弹窗时重置表单，避免残留上一次的输入
function handleOpen() {
    Object.assign(form, createEmptyForm())
    formRef.value?.clearValidate()
}

// 日期选择器中禁用今天之后的日期（只限制日期，不限制时间）
function isFutureDate(date) {
    return date > new Date()
}

async function handleSubmit() {
    // 校验不通过时 validate 会 reject，这里统一转换成 false
    const isValid = await formRef.value.validate().catch(() => false)
    if (!isValid) return

    submitting.value = true
    try {
        await createExerciseRecord({ ...form })
        ElMessage.success('已新增运动记录')
        visible.value = false
        emit('created')
    } catch (error) {
        console.error(error)
        ElMessage.error('新增失败，请稍后再试')
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <el-dialog v-model="visible" title="新增运动记录" width="460px" @open="handleOpen">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
            <el-form-item label="运动类型" prop="exercise_type">
                <el-select v-model="form.exercise_type" placeholder="请选择">
                    <el-option v-for="type in EXERCISE_TYPES" :key="type.value" :label="type.label"
                        :value="type.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="运动时间" prop="performed_at">
                <el-date-picker v-model="form.performed_at" type="datetime" value-format="YYYY-MM-DD[T]HH:mm:ssZ"
                    :disabled-date="isFutureDate" />
            </el-form-item>
            <el-form-item label="时长" prop="duration_min">
                <el-input-number v-model="form.duration_min" :min="1" :max="600" :precision="0" placeholder="请输入运动时长" />
                <span class="subtle" style="margin-left: 8px">分钟</span>
            </el-form-item>
            <el-form-item label="运动强度" prop="intensity">
                <el-select v-model="form.intensity" placeholder="请选择运动强度">
                    <el-option v-for="item in EXERCISE_INTENSITY" :key="item.value" :label="item.label"
                        :value="item.value">
                        <span>{{ item.label }}</span>
                        <span class="option-hint">{{ item.description }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消耗热量" prop="calories_burned">
                <el-input-number v-model="form.calories_burned" :min="0" :max="10000" :precision="0"
                    placeholder="请输入消耗热量" />
                <span class="subtle" style="margin-left: 8px">kcal</span>
            </el-form-item>
            <el-form-item label="备注" prop="note">
                <el-input v-model="form.note" type="textarea" maxlength="100" show-word-limit />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>
.option-hint {
    float: right;
    margin-left: 12px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
}
</style>