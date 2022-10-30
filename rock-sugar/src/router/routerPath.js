export const routes = [
    {
        path: '/',
        component: () => import('../pages/Main'),
        meta:{
            showFooter:true,
        },
    },
    {
        path: '/main',
        name: 'Main',
        component: () => import('../pages/Main'),
        meta:{
        },
    },
    {
        path: '/nanocore',
        name: 'NanoCore',
        component: () => import('../pages/NanoCore'),
        meta:{
        },
    },
    {
        path: '/webgl_demo/Triangle',
        name: 'WebglDemo',
        component: () => import('_pages/WebglDemo/Triangle'),
    },
    {
        path: '/webgl_demo/SpotLight',
        name: 'SpotLight',
        component: () => import('_pages/WebglDemo/SpotLight'),
    },
    {
        path: '/webgl_demo/SolarSystem',
        name: 'SolarSystem',
        component: () => import('_pages/WebglDemo/SolarSystem'),
    },
    {
        path: '/webgl_demo/Perspective',
        name: 'Perspective',
        component: () => import('_pages/WebglDemo/Perspective'),
    },
    {
        path: '/webgl_demo/Orthographic',
        name: 'Orthographic',
        component: () => import('_pages/WebglDemo/Orthographic'),
    },
    {
        path: '/webgl_demo/ObjResolver',
        name: 'ObjResolver',
        component: () => import('_pages/WebglDemo/ObjResolver'),
    },
    {
        path: '/webgl_demo/MultipleObject',
        name: 'MultipleObject',
        component: () => import('_pages/WebglDemo/MultipleObject'),
    },
    {
        path: '/webgl_demo/LightingPoint',
        name: 'LightingPoint',
        component: () => import('_pages/WebglDemo/LightingPoint'),
    },
    {
        path: '/webgl_demo/ImageTexture',
        name: 'ImageTexture',
        component: () => import('_pages/WebglDemo/ImageTexture'),
    },
    {
        path: '/webgl_demo/ImageProcess',
        name: 'ImageProcess',
        component: () => import('_pages/WebglDemo/ImageProcess'),
    },
    {
        path: '/webgl_demo/DirectionalLight',
        name: 'DirectionalLight',
        component: () => import('_pages/WebglDemo/DirectionalLight'),
    },
    {
        path: '/webgl_demo/CameraPosition',
        name: 'CameraPosition',
        component: () => import('_pages/WebglDemo/CameraPosition'),
    },
    {
        path: '/webgl_demo/DataTexture',
        name: 'DataTexture',
        component: () => import('_pages/WebglDemo/DataTexture'),
    },
    {
        path: '/CompTest',
        name: 'CompTest',
        component: () => import('_pages/Test/CompTest'),
    },
    
]