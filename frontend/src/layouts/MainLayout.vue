<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { mainRoutes } from '@/router/routes'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useHealthStore } from '@/stores/health'

const route = useRoute()      // 当前路由（响应式）
const router = useRouter()    // 路由实例（用来跳转）
const userStore = useUserStore()
const healthStore = useHealthStore()

const collapsed = ref(false)
const mobileOpen = ref(false)

// 从路由表生成菜单，不再手写第二份
const menus = mainRoutes.map(item => ({ name: item.name, ...item.meta }))
const title = computed(() => route.meta.title)

const profileSubtitle = computed(() => {
    const profile = userStore.profile
    if (!profile) return ''

    const conditionText = profile.conditions.join('、')
    const ageText = `${profile.age} 岁`

    return [ conditionText, ageText ].filter(Boolean).join('·')
})

// 路由变化时关闭手机端侧边栏
watch(() => route.name, () => { mobileOpen.value = false })

onMounted( () =>{
  userStore.loadProfile()
  healthStore.loadDashboard()
})

</script>

<template>
    <div class="app-shell">
        <div v-if="mobileOpen" class="mobile-mask" @click="mobileOpen = false"></div>
        <aside class="sidebar" :class="{ collapsed, 'mobile-open': mobileOpen }">
            <div class="brand">
                <div class="brand-mark"><span>+</span></div>
                <div v-if="!collapsed" class="brand-copy"><b>糖护智伴</b><small>AI HEALTH CARE</small></div>
            </div>
            <div class="side-section">{{ collapsed ? '.' : '健康管理' }}</div>
            <nav>
                <button v-for="item in menus" :key="item.name" :class="{ active: route.name === item.name }"
                    @click="router.push({ name: item.name })">
                    <el-icon>
                        <component :is="item.icon" />
                    </el-icon>
                    <span v-if="!collapsed">{{ item.title }}</span>
                    <em v-if="item.badge && !collapsed">{{ item.badge }}</em>
                </button>
            </nav>
            <div v-if="!collapsed" class="care-card">
                <el-icon>
                    <Service />
                </el-icon>
                <div><b>需要帮助？</b><small>健康专员在线服务</small></div>
                <button>联系专员</button>
            </div>
            <button class="collapse-btn" @click="collapsed = !collapsed">
                <el-icon>
                    <DArrowLeft v-if="!collapsed" />
                    <DArrowRight v-else />
                </el-icon>
            </button>
        </aside>

        <main class="main" :class="{ wide: collapsed }">
            <header class="topbar">
                <div class="breadcrumb">
                    <span>健康中心</span><i>/</i><b>{{ title }}</b>
                </div>
                <div class="top-actions">
                    <div class="sync"><i></i><span>设备已同步</span></div>
                    <button class="icon-btn"><el-icon>
                            <Bell />
                        </el-icon><i class="dot"></i></button>
                    <el-dropdown>
                        <div class="profile">
                            <span class="avatar">{{ userStore.profile?.name?.slice(0,1) || '张' }}</span>
                            <span class="profile-copy">
                                <b>{{ userStore.profile?.name }}</b>
                                <small>{{ profileSubtitle }}</small>
                            </span>
                            <el-icon>
                                <ArrowDown />
                            </el-icon>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item disabled>
                                    个人资料</el-dropdown-item> 
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </header>
            <div class="page-wrap">
             <RouterView />
            </div>
        </main>
    </div>
</template>

<style scoped>

</style>