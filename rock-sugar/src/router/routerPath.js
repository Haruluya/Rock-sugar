export const routes = [
    {
        path: '/',
        component: () => import('../pages/RSHome'),
        meta:{
            showFooter:true,
        },
    },
    {
        path: '/rshome',
        name: 'RSHome',
        component: () => import('../pages/RSHome'),
        meta:{
        },
    },
    {
        path: '/webgl_demo/Triangle',
        name: 'WebglDemo',
        component: () => import('_pages/WebglDemo/Triangle'),
    },
]