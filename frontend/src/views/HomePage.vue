<script setup>

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHealthStore } from '../stores/health'


import MetricCard from '../components/MetricCard.vue'
import EChart from '../components/EChart.vue'

const router = useRouter()

const store = useHealthStore()
const data = computed(() => store.dashboardData)

const greeting = new Date().getHours() < 12 ? '早上好' : new Date().getHours() < 18 ? '下午好' : '晚上好'

//定义图标展示数据
const chartOption = computed(() => ({
    tooltip: { trigger: 'axis', backgroundColor: '#123c37', borderWidth: 0, textStyle: { color: '#fff' } },
    grid: { left: 36, right: 20, top: 36, bottom: 32 },
    xAxis: { type: 'category', boundaryGap: false, data: data.value?.glucose.map(x => x.measured_at.slice(5, 10)) || [], axisLine: { lineStyle: { color: '#dbe5e2' } }, axisLabel: { color: '#83918e' } },
    yAxis: { type: 'value', min: 4, max: 12, splitLine: { lineStyle: { color: '#eef2f1', type: 'dashed' } }, axisLabel: { color: '#83918e' } },
    series: [{ type: 'line', smooth: true, data: data.value?.glucose.map(x => x.value) || [], symbolSize: 8, lineStyle: { color: '#13a884', width: 3 }, itemStyle: { color: '#13a884', borderColor: '#fff', borderWidth: 2 }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(19,168,132,.28)' }, { offset: 1, color: 'rgba(19,168,132,0)' }] } }, markArea: { silent: true, itemStyle: { color: 'rgba(19,168,132,.055)' }, data: [[{ yAxis: 4.4 }, { yAxis: 7.8 }]] } }]
}))


</script>

<template>
    <section v-if="data" class="page home-page">
        <div class="welcome-banner">
            <div class="welcome-copy">
                <span class="eyebrow">PERSONAL HEALTH OVERVIEW</span>
                <h1>{{ greeting }}，{{ data.patient.name }} <span>👋</span></h1>
                <p>今天也要好好照顾自己。您的血糖状态整体平稳，继续保持。</p>
                <div class="banner-status">
                    <span>
                        <i></i> 今日风险等级：<b>低风险</b>
                    </span>
                    <span>连续记录 <b>{{ data.metrics.streak }}天</b>
                    </span>
                </div>
            </div>
            <div class="banner-orbit">
                <div class="orbit-ring">
                    <div class="health-score">
                        <strong>86</strong>
                        <small>健康指数</small>
                    </div>
                </div>
                <span class="orbit-tag one">血糖稳定</span>
                <span class="orbit-tag two">按时服药</span>
            </div>
        </div>
        <div class="metric-grid">
            <MetricCard label="平均血糖" :value="data.avg" unit="mmol/L" trend="较上周 ↓ 0.4" icon="Odometer" />
            <MetricCard label="糖化血红蛋白" :value="data.metrics.hba1c" unit="%" trend="目标 < 7.0%" icon="DataLine"
                tone="blue" />
            <MetricCard label="血糖达标率" :value="data.metrics.targetRate" unit="%" trend="较上周 ↑ 6%" icon="CircleCheck"
                tone="amber" />
            <MetricCard label="身体质量指数" :value="data.metrics.bmi" unit="BMI" trend="轻度超重" icon="ScaleToOriginal"
                tone="purple" />
        </div>

        <!-- 图表区域 -->
        <div class="content-grid main-grid">
            <div class="panel trend-panel">
                <div class="panel-head">
                    <div>
                        <span class="panel-kicker">GLUCOSE TREND</span>
                        <h3>今日血糖趋势</h3>
                    </div>
                    <button class="text-btn" @click="router.push({ name: 'glucose' })">查看详情
                        <el-icon>
                            <ArrowRight />
                        </el-icon>
                    </button>
                </div>
                <div class="chart-legend">
                    <span><i class="legend-dot green"></i>血糖值</span>
                    <span class="target-pill">目标范围4.4-7.8</span>
                </div>
                <EChart :option="chartOption" height="280px" />
            </div>
            <div class="panel tasks-panel">
                <div class="panel-head">
                    <div>
                        <span class="panel-kicker">TODAY'S PLAN</span>
                        <h3>今日健康任务</h3>
                    </div>
                    <span class="progress-ring">2/4</span>
                </div>
                <div class="task-list">
                    <div v-for="task in data.todayTasks" :key="task.id" class="task-item" :class="{ done: task.done }">
                        <span class="task-check">
                            <el-icon>
                                <Check v-if="task.done" />
                            </el-icon>
                        </span>
                        <div>
                            <b>{{ task.title }}</b>
                            <small>{{ task.time }} · {{ task.type }}</small>
                        </div>
                        <span v-if="!task.done" class="task-arrow">›</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-grid lower-grid">
            <div class="ai-insight">
                <span class="ai-spark">
                    <el-icon>
                        <MagicStick />
                    </el-icon>
                </span>
                <div>
                    <span class="panel-kicker">AI HEALTH INSIGHT</span>
                    <h3>今日 AI 健康洞察</h3>
                    <p>{{ data.insight }}</p>
                    <button @click="router.push({ name: 'ai' })">继续咨询 AI
                        <el-icon>
                            <Right />
                        </el-icon>
                    </button>
                </div>
            </div>
            <div class="panel quick-panel">
                <div class="panel-head">
                    <h3>快捷操作</h3>
                </div>
                <div class="quick-actions">
                    <button @click="router.push({ name: 'glucose' })">
                        <span class="q-green">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </span>
                        <b>记录血糖</b>
                    </button>
                    <button @click="router.push({ name: 'diet' })">
                        <span class="q-amber">
                            <el-icon>
                                <Bowl />
                            </el-icon>
                        </span>
                        <b>记录饮食</b>
                    </button>
                    <button @click="router.push({ name: 'exercise' })">
                        <span class="q-blue">
                            <el-icon>
                                <Bicycle />
                            </el-icon>
                        </span>
                        <b>运动打卡</b>
                    </button>
                    <button @click="router.push({ name: 'report' })">
                        <span class="q-purple">
                            <el-icon>
                                <Document />
                            </el-icon>
                        </span>
                        <b>查看报告</b>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped></style>