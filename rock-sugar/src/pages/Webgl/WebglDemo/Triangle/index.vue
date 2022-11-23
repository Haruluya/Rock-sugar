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
    name:"Triangle",
    buttonContent:"查看源码",
    title:"三角",
    content:"Say 'Hello World!' to CG world."
}

const position =  data.position;

/*
    @author:haruluya
    @des: Hello World!.
*/
export default {
    name: "Triangle",
    data() {
        return {
            gl:null,
            canvas:null,
            program:null,
            vertexShaderSource,
            fragmentShaderSource,
            sectionParams:{
                translation: {x:300,y:200,z:0},
                scale: {x:1,y:1,z:1},
                angleInDegrees:0,
            },
            desData,
            uiSetter:[]
        };
    },
    computed:{
        angleInRadians(){
            let angleInDegrees = 360 - this.sectionParams.angleInDegrees;
            return  angleInDegrees * Math.PI / 180;
        }
    },
    methods: {
        Init() {
            this.gl = this.$refs.page.getGL();
            this.canvas = this.$refs.page.getCanvas();
            this.program = this.$refs.page.getProgram();

            this.$refs.page.addBuffer("position",{numComponents:2,data:position})
        },
        Render() {
            const gl = this.gl;
            // set matix.
            const sectionParams = this.sectionParams;
            let matrix = HNWUEngine.projection2d(gl.canvas.clientWidth, gl.canvas.clientHeight);
            matrix = HNWUEngine.translate2d(matrix, sectionParams.translation["x"], sectionParams.translation["y"]);
            matrix = HNWUEngine.rotate2d(matrix, this.angleInRadians);
            matrix = HNWUEngine.scale2d(matrix, sectionParams.scale["x"], sectionParams.scale["y"]);

            this.$refs.page.addUniform("u_matrix",matrix);
            this.$refs.page.glDraw({mode:gl.TRIANGLES,first:0,count:3})
        },

    },
    mounted() {
        this.uiSetter = [
                { type: "slider-vector", id: "translation" , value: this.sectionParams.translation, min: { x: 0, y: 0 ,z:0}, max: { x: 500, y: 500,z:500 }, callback: uiSetting.globalUiCallbacks.updateVector3(this.sectionParams, this.$refs.page.Render, "translation") },
                { type: "slider-vector", id: "scale" , value: this.sectionParams.scale, min: { x: 0, y: 0 ,z:0}, 
                max: { x: 10, y: 10,z:10 }, callback: uiSetting.globalUiCallbacks.updateVector3(this.sectionParams, this.$refs.page.Render, "scale") },
                {
                    type: "slider", id: "angleInDegrees", value: this.sectionParams.angleInDegrees, min: 0, max: 360,
                    callback: uiSetting.globalUiCallbacks.updateValue(this.sectionParams,this.$refs.page.Render, "angleInDegrees")
                },
            ]
    },

};
</script>
