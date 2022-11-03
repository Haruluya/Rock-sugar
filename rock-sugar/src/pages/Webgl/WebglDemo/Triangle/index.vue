<template lang="html">
    <nano_webgl_demo_panel
        :prop_des_data="desData"
        :prop_ui_setter="uiSetter"
        :prop_shader="shaderSource"
        :prop_section_params="sectionParams"
        ref="page"
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
            //gl context.
            gl: null,
            program: null,
            shaderSource:{
                vertexShaderSource,
                fragmentShaderSource
            },
            //attribute and uniform.
            bufferData:{
                position:{numComponents:2,data:position}
            },
            uniformsData:{
                u_matrix: null,
            },
            bufferInfo:null,
            attribSetters:null,
            uniformSetters:null,

            sectionParams:{
                //params.
                translation: [300, 200,0],
                rotation:[haruluya_webgl_utils.degToRad(0), haruluya_webgl_utils.degToRad(0), haruluya_webgl_utils.degToRad(0)],
                scale: [1, 1,1],
                angleInRadians:0,
                debugContent:null
            },

            // component data.
            desData,
        };
    },

    computed:{
        //uiSetter.
        uiSetter(){
            let sectionParams = this.sectionParams;
            return [
                { type: "slider", id: "beginX", value: sectionParams.translation[0], min: 0, max: 1000, callback: uiSetting.globalUiCallbacks.updatePoint(this, "translation", 0)
                },

            ]
        },
    },
    methods: {
        Init() {
            console.log(this.$refs.page)
            this.$refs.page.Init();
            const { gl, canvas } = haruluya_webgl_utils.initWebglContext("canvas");
            this.gl = gl;
            this.canvas = canvas;
            this.program = haruluya_webgl_utils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);
            // attributes.
            this.bufferInfo = haruluya_webgl_utils.createBufferInfoFromArrays(gl, this.bufferData);
            this.attribSetters  = haruluya_webgl_utils.createAttributeSetters(gl, this.program);
            this.Render();
        },
        Render() {
            this.$refs.page.Render();

            const gl = this.gl;
            haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(this.program);

            // set matix.
            const sectionParams = this.sectionParams;

            const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
            let matrix = haruluya_webgl_utils.projection2d(gl.canvas.clientWidth, gl.canvas.clientHeight);
            matrix = haruluya_webgl_utils.translate2d(matrix, sectionParams.translation[0], sectionParams.translation[1]);
            matrix = haruluya_webgl_utils.rotate2d(matrix, sectionParams.angleInRadians);
            matrix = haruluya_webgl_utils.scale2d(matrix, sectionParams.scale[0], sectionParams.scale[1]);
            gl.uniformMatrix3fv(matrixLocation, false, matrix);

            haruluya_webgl_utils.setBuffersAndAttributes(gl, this.attribSetters, this.bufferInfo);

            gl.drawArrays(gl.TRIANGLES, 0, 3);
        },
        
        SetUI(){
            this.$refs.page.SetUI();
        },
    },
    mounted() {
        this.Init();
        this.SetUI();
    },

};
</script>
