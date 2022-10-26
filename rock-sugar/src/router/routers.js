
import {routes} from './routerPath.js';
import {createWebHistory,createRouter} from 'vue-router';
const routerHistory = createWebHistory()
const router = createRouter({
  base:'/http/',
  history: routerHistory,  
  routes,
})

router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
  // chrome
    document.body.scrollTop = 0
    // firefox
    document.documentElement.scrollTop = 0
    // safari
    window.pageYOffset = 0
});



export default router
