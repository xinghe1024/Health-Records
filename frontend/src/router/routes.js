export const mainRoutes = [
  { path: '', name: 'home', component: () => import('@/views/HomePage.vue'), meta: {title:'健康首页', icon: 'House'} },
  { path: 'glucose', name: 'glucose', component: () => import('@/views/GlucosePage.vue'), meta: {title:'血糖监测', icon: 'Odometer'} },
  { path: 'diet', name: 'diet', component: () => import('@/views/DietPage.vue'), meta: {title:'饮食管理', icon: 'Bowl'} },
  { path: 'medication', name: 'medication', component: () => import('@/views/MedicationPage.vue'), meta: {title:'用药管理', icon: 'FirstAidKit'} },
  { path: 'exercise', name: 'exercise', component: () => import('@/views/ExercisePage.vue'), meta: {title:'运动指导', icon: 'Bicycle'} },
  { path: 'report', name: 'report', component: () => import('@/views/ReportPage.vue'), meta: {title:'健康报告', icon: 'Document'} },
  { path: 'ai', name: 'ai', component: () => import('@/views/AiPage.vue'), meta: {title:'AI 智能问诊', icon: 'ChatDotRound', badge: 'AI' } },
  { path: 'visualization', name: 'visualization', component: () => import('@/views/VisualizationPage.vue'), meta: {title:'数据中心', icon: 'DataAnalysis'} },
  { path: 'collaboration', name: 'collaboration', component: () => import('@/views/CollaborationPage.vue'), meta: {title:'医患协作', icon: 'Connection'} }
]