<script setup>
import { reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { createGlucoseRecord } from '@/api/glucose'
import { MEASURE_PERIODS } from '@/constants/glucose'

// 弹窗显示状态，由父组件通过 v-model 控制
const visible = defineModel({ type: Boolean, default: false })
// 新增成功后通知父组件
const emit = defineEmits(['created'])

const formRef = ref()
const submitting = ref(false)

// 生成一份全新的表单数据，默认测量时间为当前时间
function createEmptyForm() {
    return {
        value: null,
        period: '',
        measured_at: dayjs().format(),
        note: '',
    }
}

const form = reactive(createEmptyForm())

const rules = {
    value: [{ required: true, message: '请输入血糖值', trigger: 'blur' }],
    period: [{ required: true, message: '请选择测量时段', trigger: 'change' }],
    measured_at: [{ required: true, message: '请选择测量时间', trigger: 'change' }],
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
        await createGlucoseRecord({ ...form })
        ElMessage.success('已新增血糖记录')
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
    <el-dialog v-model="visible" title="新增血糖记录" width="460px" @open="handleOpen">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
            <el-form-item label="血糖值" prop="value">
                <el-input-number v-model="form.value" :min="1" :max="33.3" :step="0.1" :precision="1" />
                <span class="subtle" style="margin-left: 8px">mmol/L</span>
            </el-form-item>
            <el-form-item label="测量时段" prop="period">
                <el-select v-model="form.period" placeholder="请选择">
                    <el-option v-for="period in MEASURE_PERIODS" :key="period.value" :label="period.label"
                        :value="period.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="测量时间" prop="measured_at">
                <el-date-picker v-model="form.measured_at" type="datetime" value-format="YYYY-MM-DD[T]HH:mm:ssZ"
                    :disabled-date="isFutureDate" />
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

<style scoped></style>