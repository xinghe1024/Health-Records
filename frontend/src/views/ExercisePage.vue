<script setup>
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'

import { ElMessage } from 'element-plus'

import {
    getExerciseTypeLabel,
    getIntensityLabel,
} from '@/constants/exercise'
import { listExerciseRecords } from '@/api/exercise'

const records = ref([])
const loading = ref(false)

// 将 ISO 时间转换为用户所在时区的显示格式
function formatPerformedAt(performedAt) {
    return dayjs(performedAt).format('YYYY-MM-DD HH:mm')
}

const tableRows = computed(() => {
    return records.value.map(record => ({
        ...record,
        performedAtText: formatPerformedAt(record.performed_at),
        typeLabel: getExerciseTypeLabel(record.exercise_type),
        intensityLabel: getIntensityLabel(record.intensity),
        caloriesText: record.calories_burned ?? '—',
    }))
})

async function loadExerciseData() {
    loading.value = true
    try {
        const recordList = await listExerciseRecords()
        records.value = recordList
    } catch (error) {
        ElMessage.error('获取运动记录失败，请稍后重试')
        console.error('获取运动记录失败', error)
    } finally {
        loading.value = false
    }
}

onMounted(loadExerciseData)

</script>

<template>
    <section class="page">
        <div class="page-title">
            <div>
                <span class="eyebrow dark">EXERCISE</span>
                <h1>运动记录</h1>
                <p>记录并追踪每日运动情况</p>
            </div>
        </div>
        <div class="panel table-panel">
            <div class="panel-head">
                <h3>运动记录</h3>
            </div>
            <el-table :data="tableRows" v-loading="loading" empty-text="还没有运动记录">
                <el-table-column label="运动时间" prop="performedAtText" width="170" />
                <el-table-column label="运动类型" prop="typeLabel" width="120" />
                <el-table-column label="时长 (分钟)" prop="duration_min" width="100" />
                <el-table-column label="运动强度" prop="intensityLabel" width="100" />
                <el-table-column label="消耗热量 (kcal)" prop="caloriesText" width="120" />
                <el-table-column label="备注" prop="note" />
            </el-table>
        </div>
    </section>
</template>

<style scoped></style>