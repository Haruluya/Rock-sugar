import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routers';
import Haruluya from '_utils/webgl-learn-utils';


// components.
import {nano_install} from '_components/packages'
import nano_cg_experiment_page from "_pages/CG/Experiment/nano_cg_experiment_page"

const app = createApp(App);

// install must before use.

nano_install(app);

app.component(nano_cg_experiment_page.name,nano_cg_experiment_page);

app.use(router);
app.mount('#app');





