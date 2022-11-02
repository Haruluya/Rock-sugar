import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routers';
import Haruluya from '_utils/webgl-learn-utils';



import {nano_install} from '@/components/packages'


const app = createApp(App);

// install must before use!!!

nano_install(app);


app.use(router);
app.mount('#app');





