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
        path: '/cg',
        name: 'cg_nav',
        component: () => import('../pages/CG/Nav'),
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
        path: '/cg/webgl_demo/Triangle',
        name: 'Triangle',
        component: () => import('_pages/Webgl/WebglDemo/Triangle'),
    },
    {
        path: '/cg/webgl_demo/SpotLight',
        name: 'SpotLight',
        component: () => import('_pages/Webgl/WebglDemo/SpotLight'),
    },
    {
        path: '/cg/webgl_demo/SolarSystem',
        name: 'SolarSystem',
        component: () => import('_pages/Webgl/WebglDemo/SolarSystem'),
    },
    {
        path: '/cg/webgl_demo/Perspective',
        name: 'Perspective',
        component: () => import('_pages/Webgl/WebglDemo/Perspective'),
    },
    {
        path: '/cg/webgl_demo/Orthographic',
        name: 'Orthographic',
        component: () => import('_pages/Webgl/WebglDemo/Orthographic'),
    },
    {
        path: '/cg/webgl_demo/ObjResolver',
        name: 'ObjResolver',
        component: () => import('_pages/Webgl/WebglDemo/ObjResolver'),
    },
    {
        path: '/cg/webgl_demo/MultipleObject',
        name: 'MultipleObject',
        component: () => import('_pages/Webgl/WebglDemo/MultipleObject'),
    },
    {
        path: '/cg/webgl_demo/LightingPoint',
        name: 'LightingPoint',
        component: () => import('_pages/Webgl/WebglDemo/LightingPoint'),
    },
    {
        path: '/cg/webgl_demo/ImageTexture',
        name: 'ImageTexture',
        component: () => import('_pages/Webgl/WebglDemo/ImageTexture'),
    },
    {
        path: '/cg/webgl_demo/ImageProcess',
        name: 'ImageProcess',
        component: () => import('_pages/Webgl/WebglDemo/ImageProcess'),
    },
    {
        path: '/cg/webgl_demo/DirectionalLight',
        name: 'DirectionalLight',
        component: () => import('_pages/Webgl/WebglDemo/DirectionalLight'),
    },
    {
        path: '/cg/webgl_demo/CameraPosition',
        name: 'CameraPosition',
        component: () => import('_pages/Webgl/WebglDemo/CameraPosition'),
    },
    {
        path: '/cg/webgl_demo/DataTexture',
        name: 'DataTexture',
        component: () => import('_pages/Webgl/WebglDemo/DataTexture'),
    },
    {
        path: '/CompTest',
        name: 'CompTest',
        component: () => import('_pages/Test/CompTest'),
    },
    {
        path: '/cg/experiment/3DHouse',
        name: '3DHouse',
        component: () => import('_pages/CG/Experiment/3DHouse'),
    },
    {
        path: '/cg/experiment/Bezier',
        name: 'Bezier',
        component: () => import('_pages/CG/Experiment/Bezier'),
    },
    {
        path: '/cg/experiment/Bresenham',
        name: 'Bresenham',
        component: () => import('_pages/CG/Experiment/Bresenham'),
    },
    {
        path: '/cg/experiment/ClipLine',
        name: 'ClipLine',
        component: () => import('_pages/CG/Experiment/ClipLine'),
    },
    {
        path: '/cg/experiment/ClipPolygon',
        name: 'ClipPolygon',
        component: () => import('_pages/CG/Experiment/ClipPolygon'),
    },
    {
        path: '/cg/experiment/DAA',
        name: 'DAA',
        component: () => import('_pages/CG/Experiment/DAA'),
    },
    {
        path: '/cg/experiment/DrawCircle',
        name: 'DrawCircle',
        component: () => import('_pages/CG/Experiment/DrawCircle'),
    },
    {
        path: '/cg/experiment/DrawEllipse',
        name: 'DrawEllipse',
        component: () => import('_pages/CG/Experiment/DrawEllipse'),
    },
    {
        path: '/cg/experiment/DrawLine',
        name: 'DrawLine',
        component: () => import('_pages/CG/Experiment/DrawLine'),
    },
    {
        path: '/cg/experiment/EdgeTablePolygon',
        name: 'EdgeTablePolygon',
        component: () => import('_pages/CG/Experiment/EdgeTablePolygon'),
    },
    {
        path: '/cg/experiment/EdgeTablePolygonFlag',
        name: 'EdgeTablePolygonFlag',
        component: () => import('_pages/CG/Experiment/EdgeTablePolygonFlag'),
    },
    {
        path: '/cg/experiment/Interaction',
        name: 'Interaction',
        component: () => import('_pages/CG/Experiment/Interaction'),
    },
    {
        path: '/cg/experiment/LightModel',
        name: 'LightModel',
        component: () => import('_pages/CG/Experiment/LightModel'),
    },
    {
        path: '/cg/experiment/MidPoint',
        name: 'MidPoint',
        component: () => import('_pages/CG/Experiment/MidPoint'),
    },
    {
        path: '/cg/experiment/Pyramid',
        name: 'Pyramid',
        component: () => import('_pages/CG/Experiment/Pyramid'),
    },
    {
        path: '/cg/experiment/SeedPolygon',
        name: 'SeedPolygon',
        component: () => import('_pages/CG/Experiment/SeedPolygon'),
    },
    {
        path: '/cg/experiment/ShadowShade',
        name: 'ShadowShade',
        component: () => import('_pages/CG/Experiment/ShadowShade'),
    },
    {
        path: '/cg/experiment/Texture',
        name: 'Texture',
        component: () => import('_pages/CG/Experiment/Texture'),
    },
    {
        path: '/cg/experiment/ViewTransform',
        name: 'ViewTransform',
        component: () => import('_pages/CG/Experiment/ViewTransform'),
    },
    {
        path: '/cg/experiment/WeilerAthenton',
        name: 'WeilerAthenton',
        component: () => import('_pages/CG/Experiment/WeilerAthenton'),
    },
]