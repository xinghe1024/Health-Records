<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHealthStore } from '../stores/health'
import { useUserStore } from '../stores/user'

import { useGlucoseData } from '@/composables/useGlucoseData'
import MetricCard from '@/components/MetricCard.vue'
import GlucoseTrendChart from '@/components/glucose/GlucoseTrendChart.vue'

const router = useRouter()

const healthStore = useHealthStore()
const userStore = useUserStore()
const data = computed(() => healthStore.dashboard)
const greeting = new Date().getHours() < 12 ? '早上好' : new Date().getHours() < 18 ? '下午好' : '晚上好'
const { records, summary, loadGlucoseData } = useGlucoseData()

onMounted(loadGlucoseData)

</script>

<template>
    <section v-if="data" class="page home-page">
        <div class="welcome-banner">
            <div class="welcome-copy">
                <span class="eyebrow">PERSONAL HEALTH OVERVIEW</span>
                <h1>{{ greeting }}，{{ userStore.profile?.name }} <span>👋</span></h1>
                <p>今天也要好好照顾自己。您的血糖状态整体平稳，继续保持。</p>
                <div class="banner-status">
                    <span>
                        <i></i> 今日风险等级：<b>低风险</b>
                    </span>
                    <span>连续记录 <b>{{ data.metrics.streak_days }}天</b>
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
            <MetricCard label="平均血糖" :value="summary?.avg_glucose ?? '—'" unit="mmol/L" trend="较上周 ↓ 0.4"
                icon="Odometer" />
            <MetricCard label="糖化血红蛋白" :value="data.metrics.hba1c" unit="%" trend="目标 < 7.0%" icon="DataLine"
                tone="blue" />
            <MetricCard label="血糖达标率" :value="summary?.target_rate ?? '—'" unit="%" trend="较上周 ↑ 6%" icon="CircleCheck"
                tone="amber" />
            <MetricCard label="身体质量指数" :value="data.metrics.bmi" unit="BMI" trend="轻度超重" icon="ScaleToOriginal"
                tone="purple" />
        </div>

        <!-- 图表区域 -->
        <div class="content-grid main-grid">
            <GlucoseTrendChart :records="records" />
            <div class="panel tasks-panel">
                <div class="panel-head">
                    <div>
                        <span class="panel-kicker">TODAY'S PLAN</span>
                        <h3>今日健康任务</h3>
                    </div>
                    <span class="progress-ring">2/4</span>
                </div>
                <div class="task-list">
                    <div v-for="task in data.today_tasks" :key="task.id" class="task-item" :class="{ done: task.done }">
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