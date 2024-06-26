import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
/* 引入createPinia，用于创建pinia */
import {createPinia} from 'pinia'
import 'element-plus/theme-chalk/dark/css-vars.css'
/* 创建pinia */
const app = createApp(App);
const pinia = createPinia()
/* 使用插件 */
app.use(pinia)

app.mount('#app').$nextTick(() => {
    // Use contextBridge
    window.ipcRenderer.on('main-process-message', (_event, message) => {
        console.log(message)
    })
})
