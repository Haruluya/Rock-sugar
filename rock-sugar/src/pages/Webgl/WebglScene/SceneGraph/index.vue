<template lang="html">
    <nano_webgl_scene_panel
        :prop_des_data="desData"
        :prop_ui_setter="uiSetter"
        :prop_section_params="sectionParams"
        ref="page"
        @Init="Init"
        @Render="Render"
        @prop_ui_setter="uiSetter"
    />
</template>
<script>
import data from './resource/data.js'
const desData = {
    category:"Webgl",
    name:"SceneGraph",
    buttonContent:"查看源码",
    title:"场景图",
    content:"SceneGraph"
}

export default {
    name:'SpotLight',
    data() {
        return {
            gl: null,
            desData,
            perspective:{
                aspect:0,
                fieldOfViewRadians:  HNWUEngine.degToRad(60),
                zNear: 1,
                zFar: 2000,
            },
            transform:{
                translation:[0, 0, -0],
                rotation:[HNWUEngine.degToRad(180), HNWUEngine.degToRad(200), HNWUEngine.degToRad(0)],
                scale:[1,1,1]
            },
            camera:{
                target:[0, 0, 0],
                position:[0, 0, 2],
                up:[0,1,0]
            },
            sectionParams:{
                texture:null,
            },
            page:null,
            uiSetter:[],
        }
    },

    methods: {
        Init(){


        },
        Render(){

        }
    }
}