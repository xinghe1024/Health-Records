import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.css'

const app = createApp(App)

app.use(createPinia())
// 路由表目前为空，配置页面路由和 RouterView 后再引入并安装 router。

Object.entries(ElementPlusIconsVue).forEach(([key, component]) => app.component(key, component))

app.use(ElementPlus)
app.mount('#app')
