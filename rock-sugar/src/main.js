import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routers';
import Haruluya from './utils/webgl-learn-utils'
const app = createApp(App);

app.use(router);


app.mount('#app');

