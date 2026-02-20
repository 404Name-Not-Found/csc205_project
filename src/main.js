import { createApp } from 'vue';
import App from './components/App.js';
import router from './router.js';

const app = createApp(App);

app.use(router);
app.mount('#app');
