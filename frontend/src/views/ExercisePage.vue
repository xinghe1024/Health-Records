<script setup>
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'

import { ElMessage, ElMessageBox } from 'element-plus'

import {
    getIntensityLabel,
    getExerciseDisplayName,
    WEEKLY_EXERCISE_GOAL_MIN,
} from '@/constants/exercise'
import { listExerciseRecords, deleteExerciseRecord, getExerciseSummary } from '@/api/exercise'
import ExerciseRecordDialog from '@/components/exercise/ExerciseRecordDialog.vue'

const records = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const summary = ref(null)

// 将 ISO 时间转换为用户所在时区的显示格式
function formatPerformedAt(performedAt) {
    return dayjs(performedAt).format('YYYY-MM-DD HH:mm')
}

const tableRows = computed(() => {
    return records.value.map(record => ({
        ...record,
        performedAtText: formatPerformedAt(record.performed_at),
        typeLabel: getExerciseDisplayName(record),
        intensityLabel: getIntensityLabel(record.intensity),
        caloriesText: record.calories_burned ?? '—',
    }))
})

// 统计条的显示项，summary 为 null 时各项取值都是 undefined
const summaryItems = computed(() => [
    { label: '本周运动', value: summary.value?.count, unit: '次' },
    { label: '本周总时长', value: summary.value?.total_duration_min, unit: `/ ${WEEKLY_EXERCISE_GOAL_MIN} 分钟` },
    { label: '平均每次', value: summary.value?.avg_duration_min, unit: '分钟' },
    { label: '本周消耗', value: summary.value?.total_calories_burned, unit: 'kcal' },
])

async function loadExerciseData() {
    loading.value = true
    try {
        const [recordList, summaryData] = await Promise.all([
            listExerciseRecords(),
            getExerciseSummary(),
        ])
        records.value = recordList
        summary.value = summaryData
    } catch (error) {
        ElMessage.error('获取运动记录失败，请稍后重试')
        console.error('获取运动记录失败', error)
    } finally {
        loading.value = false
    }
}

async function handleDelete(row) {
    const confirmed = await ElMessageBox.confirm(
        `确定删除 ${row.performedAtText} 的「${row.typeLabel}」记录（${row.duration_min} 分钟）吗？删除后无法恢复。`,
        '删除确认',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    )
        .then(() => true)
        .catch(() => false)
    if (!confirmed) return

    try {
        await deleteExerciseRecord(row.id)
        ElMessage.success('已删除运动记录')
        await loadExerciseData()
    } catch (error) {
        if (error.response?.status === 404) {
            ElMessage.warning('运动记录不存在，可能已被删除')
            await loadExerciseData()
        } else {
            console.error(error)
            ElMessage.error('删除运动记录失败，请稍后再试')
        }
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
            <el-button type="primary" size="large" icon="Plus" @click="dialogVisible = true">新增记录</el-button>
        </div>
        <div class="summary-strip">
            <template v-for="(item, index) in summaryItems" :key="item.label">
                <i v-if="index > 0"></i>
                <div>
                    <span>{{ item.label }}</span>
                    <strong>{{ item.value ?? '—' }}</strong>
                    <small>{{ item.unit }}</small>
                </div>
            </template>
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
                <el-table-column label="操作" width="80" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <ExerciseRecordDialog v-model="dialogVisible" @created="loadExerciseData" />
    </section>
</template>

<style scoped></style>