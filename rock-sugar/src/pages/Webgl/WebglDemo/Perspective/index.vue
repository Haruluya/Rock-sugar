<template lang="html">
    <nano_webgl_demo_panel
        :prop_des_data="desData"
        :prop_ui_setter="uiSetter"
        :prop_vertex_shader="vertexShaderSource"
        :prop_fragment_shader="fragmentShaderSource"
        :prop_section_params="sectionParams"
        ref="page"
        @Init="Init"
        @Render="Render"
        @prop_ui_setter="uiSetter"
    />
</template>
<script>
import vertexShaderSource from './resource/vertex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import data from './resource/data.js'
import uiSetting from "../ui-setting"
const desData = {
    category:"Webgl",
    name:"Perspective",
    buttonContent:"查看源码",
    title:"透视投影",
    content:"Failure is like perspective, throughout a person's life."
}

const positions = data.position;
const colors = data.color;


 

export default {
    name:'ImageProcess',
    data() {
        return {
            gl: null,
            canvas:null,
            program: null,
            vertexShaderSource,
            fragmentShaderSource,
            desData,
            sectionParams:{
                transform:{
                    translation:[-150, 0, -360],
                    rotation:[haruluya_webgl_utils.degToRad(190), haruluya_webgl_utils.degToRad(40), haruluya_webgl_utils.degToRad(320)],
                    scale:[1,1,1]
                },
                fieldOfViewRadians:60,
                zNear:1,
                zFar:2000,
            },
            uiSetter:[]
        }
    },

    methods: {
        Init(){
            this.gl = this.$refs.page.getGL();
            this.canvas = this.$refs.page.getCanvas();
            this.program = this.$refs.page.getProgram();

            this.$refs.page.setTransfrom(this.sectionParams.transform);
            this.$refs.page.addBuffer("position",{data:positions});
            this.$refs.page.addBuffer("color",{data:colors});
        },
        Render(){
            const gl = this.gl;
            // Turn on culling.
            gl.enable(gl.CULL_FACE);
            // Turn on z-buffer.
            gl.enable(gl.DEPTH_TEST);
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            let matrix =
                haruluya_webgl_utils.perspective(
                    haruluya_webgl_utils.degToRad(this.sectionParams.fieldOfViewRadians), 
                    aspect, 
                    this.sectionParams.zNear, 
                    this.sectionParams.zFar
                );
            matrix = haruluya_webgl_utils.getTransformMatrix(matrix,this.sectionParams.transform);
            this.$refs.page.addUniform("u_matrix",matrix);
            this.$refs.page.glDraw({mode:gl.TRIANGLES,first:0,count:36})
        },
    },
    mounted() {
        this.uiSetter = [
                {
                    type: "slider", id: "fieldOfViewRadians", value: this.sectionParams.fieldOfViewRadians, min: 1, max: 180,
                    callback: uiSetting.globalUiCallbacks.updateValue(this.sectionParams,this.$refs.page.Render, "fieldOfViewRadians")
                },
                {
                    type: "slider", id: "zNear", value: this.sectionParams.zNear, min: 1, max: 3000,
                    callback: uiSetting.globalUiCallbacks.updateValue(this.sectionParams,this.$refs.page.Render, "zNear")
                },
                {
                    type: "slider", id: "zFar", value: this.sectionParams.zFar, min: 1, max: 3000,
                    callback: uiSetting.globalUiCallbacks.updateValue(this.sectionParams,this.$refs.page.Render, "zFar")
                },
            ]
    },
}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>
