<script setup>
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { getGlucoseSummary, listGlucoseRecords } from '@/api/glucose'
import { GLUCOSE_STATUS_DISPLAY, getGlucoseStatus, getPeriodLabel } from '@/constants/glucose'
import GlucoseRecordDialog from '@/components/glucose/GlucoseRecordDialog.vue'

const records = ref([])
const summary = ref(null)
const loading = ref(false)

// 统计条的显示项，summary 为 null 时各项取值都是 undefined
const summaryItems = computed(() => [
    { label: '平均血糖', value: summary.value?.avg_glucose, unit: 'mmol/L' },
    { label: '达标率', value: summary.value?.target_rate, unit: '%' },
    { label: '最高血糖', value: summary.value?.max_glucose, unit: 'mmol/L' },
    { label: '最低血糖', value: summary.value?.min_glucose, unit: 'mmol/L' },
    { label: '记录次数', value: summary.value?.count, unit: '次' },
])

const dialogVisible = ref(false)


// 将 ISO 时间转换为用户所在时区的显示格式
function formatMeasuredAt(measuredAt) {
    return dayjs(measuredAt).format('YYYY-MM-DD HH:mm')
}

// 取得一条记录的状态显示配置
function getStatusDisplay(record) {
    return GLUCOSE_STATUS_DISPLAY[getGlucoseStatus(record.value, record.period)]
}

// 表格行：预先算好显示用的字段，模板只负责读取
const tableRows = computed(() =>
    records.value.map(record => ({
        ...record,
        measuredAtText: formatMeasuredAt(record.measured_at),
        periodLabel: getPeriodLabel(record.period),
        statusDisplay: getStatusDisplay(record),
    })),
)

// 同时请求列表和统计，之后新增、删除成功时也会复用
async function loadGlucoseData() {
    loading.value = true
    try {
        const [recordList, summaryData] = await Promise.all([
            listGlucoseRecords(),
            getGlucoseSummary(),
        ])
        records.value = recordList
        summary.value = summaryData
    } finally {
        loading.value = false
    }
}

onMounted(loadGlucoseData)

</script>

<template>
    <section class="page">
        <div class="page-title">
            <div>
                <span class="eyebrow dark">BLOOD GLUCOSE</span>
                <h1>血糖监测</h1>
                <p>记录并追踪每日血糖变化</p>
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
                <h3>血糖记录</h3>
            </div>
            <el-table :data="tableRows" v-loading="loading" empty-text="还没有血糖记录">
                <el-table-column label="测量时间" prop="measuredAtText" width="170" />
                <el-table-column label="时段" prop="periodLabel" width="100" />
                <el-table-column label="血糖值 (mmol/L)" prop="value" width="140" />
                <el-table-column label="状态" width="90">
                    <template #default="{ row }">
                        <el-tag :type="row.statusDisplay?.tagType">{{ row.statusDisplay?.label }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="note" />
            </el-table>
        </div>
        <GlucoseRecordDialog v-model="dialogVisible" @created="loadGlucoseData" />
    </section>
</template>

<style scoped></style>