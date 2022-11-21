import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routers';
import Haruluya from '_utils/webgl-learn-utils';


// components.
import {nano_install} from '_components/packages'
import nano_cg_experiment_page from "_pages/CG/Experiment/nano_cg_experiment_page"
import nano_webgl_demo_panel from "_pages/Webgl/WebglDemo/nano_webgl_demo_panel"
import nano_webgl_scene_panel from "_pages/Webgl/WebglScene/nano_webgl_scene_panel"
import webgl_basic_render_panel from "_pages/Webgl/WebglRender/webgl_basic_render_panel"

const app = createApp(App);

// install must before use.

nano_install(app);

app.component(nano_cg_experiment_page.name,nano_cg_experiment_page);
app.component(nano_webgl_demo_panel.name,nano_webgl_demo_panel);
app.component(nano_webgl_scene_panel.name,nano_webgl_scene_panel);
app.component(webgl_basic_render_panel.name,webgl_basic_render_panel);
app.use(router);
app.mount('#app');





