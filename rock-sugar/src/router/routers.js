
import {routes} from './routerPath.js';
import {createWebHistory,createRouter} from 'vue-router';
const routerHistory = createWebHistory()
const router = createRouter({
  base:'/http/',
  history: routerHistory,  
  routes,
})



export default router
