<script setup>
import { ref, onMounted, computed } from 'vue'


import AiPage from './views/AiPage.vue'
import CollaborationPage from './views/CollaborationPage.vue'
import DietPage from './views/DiePage.vue'
import ExercisePage from './views/ExercisePage.vue'
import GlucosePage from './views/GlucosePage.vue'
import HomePage from './views/HomePage.vue'
import MedicationPage from './views/MedicationPage.vue'
import ReportPage from './views/ReportPage.vue'
import VisualizationPage from './views/VisualizationPage.vue'


const active = ref('home')
const collapsed = ref(false)
const mobileOpen = ref(false)


const menus = [
  { key:'home', label: '健康首页', icon: 'House' },
  { key: 'glucose', label: '血糖监测', icon: 'Odometer' },
  { key: 'diet', label: '饮食管理', icon: 'Bowl' },
  { key: 'medication', label: '用药管理', icon: 'FirstAidKit' },
  { key: 'exercise', label: '运动指导', icon: 'Bicycle' },
  { key: 'report', label: '健康报告', icon: 'Document' },
  { key: 'ai', label: 'AI 智能问诊', icon: 'ChatDotRound', badge: 'AI' },
  { key: 'visualization', label: '数据中心', icon: 'DataAnalysis' },
  { key: 'collaboration', label: '医患协作', icon: 'Connection' }
]

const title = computed(() => menus.find(m => m.key === active.value)?.label)
const currentView = computed(() => pages[active.value])

// 切换映射关系
const pages = {
  home: HomePage,
  glucose: GlucosePage,
  diet: DietPage,
  medication: MedicationPage,
  exercise: ExercisePage,
  report: ReportPage,
  ai: AiPage,
  visualization: VisualizationPage,
  collaboration: CollaborationPage
}

// 监听点击事件实现页面切换
function navigate(key){
  active.value = key
  mobileOpen.value = false
  //切换页面滚动到顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

</script>


<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ collapsed, 'mobile-open': mobileOpen }">
      <div class="brand">
        <div class="brand-mark"><span>+</span></div>
        <div v-if="!collapsed" class="brand-copy"><b>糖护智伴</b><small>AI HEALTH CARE</small></div>
      </div>
      <div  class="side-section">{{ collapsed ? '.' : '健康管理' }}</div>
      <nav>
        <button v-for="item in menus" :key="item.key" :class="{active: active === item.key}" @click="navigate(item.key)">
          <el-icon><component :is="item.icon" /></el-icon>
          <span v-if="!collapsed">{{ item.label }}</span>
          <em v-if=" item.badge && !collapsed ">{{ item.badge }}</em>
        </button>
      </nav>
      <div v-if="!collapsed" class="care-card">
        <el-icon><Service /></el-icon>
        <div><b>需要帮助？</b><small>健康专员在线服务</small></div>
        <button>联系专员</button>
      </div>
        <button class="collapse-btn" @click="collapsed = !collapsed">
        <el-icon><DArrowLeft v-if="!collapsed"/><DArrowRight v-else/></el-icon>
      </button>
    </aside>

    <main class="main" :class="{ wide:collapsed }">
      <header class="topbar">
        <div class="breadcrumb">
          <span>健康中心</span><i></i><b>{{ title }}</b>
        </div>
        <div class="top-actions">
           <div class="sync"><i></i><span>设备已同步</span></div>
           <button class="icon-btn"><el-icon><Bell /></el-icon><i class="dot"></i></button>
           <el-dropdown>
            <div class="profile">
              <span class="avatar">{{'张' }}</span>
              <span class="profile-copy"><b>张伟</b><small>糖尿病 · 23岁</small></span>
              <el-icon><ArrowDown /></el-icon>
            </div>
           </el-dropdown>
        </div>
      </header>
      <div class="page-wrap">
        <component :is="currentView" @navigate="navigate"></component>
      </div>
    </main>
  </div>
</template>


<style scoped>

</style>
