import './assets/style.css'

import { createApp } from 'vue'
import App from './components/App.vue'
import router from './router'
import apiClient from './http-common'
import Oruga, { Switch } from '@oruga-ui/oruga-next';
import { bulmaConfig } from '@oruga-ui/theme-bulma';
import '@oruga-ui/theme-bulma/style.css';
import { createPinia } from 'pinia'

const app = createApp(App)

app.config.globalProperties.$http = apiClient

app.use(router)
app.use(Oruga, bulmaConfig)
app.use(Switch)
app.use(createPinia())
app.mount('#app')

