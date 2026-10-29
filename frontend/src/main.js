import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import './style.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'


const app = createApp(App)

app.use(createPinia())
app.use(router)

Object.entries(ElementPlusIconsVue).forEach(([key, component]) => app.component(key, component))

app.use(ElementPlus)
app.mount('#app')
