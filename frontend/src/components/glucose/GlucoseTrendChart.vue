<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import {
    TARGET_GROUPS,
    findPeriod,
    findTargetGroup,
} from '@/constants/glucose'
import EChart from '@/components/EChart.vue'

const props = defineProps({
    records: { type: Array, required: true },
})

// 趋势图当前显示的目标分组
const activeGroup = ref(TARGET_GROUPS[0].value)
const currentGroup = computed(() => findTargetGroup(activeGroup.value))

// 当前分组的记录，按时间从旧到新排列（图表从左到右是时间顺序）
const chartRecords = computed(() =>
    props.records
        .filter(record => findPeriod(record.period)?.group === activeGroup.value)
        .reverse(),
)

const chartOption = computed(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: {
        type: 'category',
        data: chartRecords.value.map(record => dayjs(record.measured_at).format('MM-DD HH:mm')),
    },
    yAxis: { type: 'value', min: 2, max: 14 },
    series: [
        {
            type: 'line',
            smooth: true,
            data: chartRecords.value.map(record => record.value),
            lineStyle: { color: '#13a884', width: 3 },
            itemStyle: { color: '#13a884' },
            // 背景色块标出当前分组的目标范围
            markArea: {
                silent: true,
                itemStyle: { color: 'rgba(19,168,132,.08)' },
                data: [[{ yAxis: currentGroup.value.min }, { yAxis: currentGroup.value.max }]],
            },
        },
    ],
}))

</script>

<template>
    <div class="panel large-panel">
        <div class="panel-head">
            <div>
                <span class="panel-kicker">GLUCOSE TREND</span>
                <h3>血糖趋势</h3>
            </div>
            <div class="chart-tabs">
                <button v-for="group in TARGET_GROUPS" :key="group.value"
                    :class="{ active: activeGroup === group.value }" @click="activeGroup = group.value">
                    {{ group.label }}
                </button>
            </div>
        </div>
        <p class="subtle">目标范围 {{ currentGroup.min }}–{{ currentGroup.max }} mmol/L</p>
        <EChart :option="chartOption" height="280px" />
    </div>
</template>

<style scoped></style>