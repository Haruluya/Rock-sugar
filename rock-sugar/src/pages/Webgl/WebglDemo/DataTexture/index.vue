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
    name:"DataTexture",
    buttonContent:"查看源码",
    title:"程序纹理",
    content:"The next is DataHuman."
}

const positions = data.position;
const texCoords = data.texcoord;


export default {
    name:'DataTexture',
    data() {
        return {
            gl: null,
            canvas: null,
            program: null,
            vertexShaderSource,
            fragmentShaderSource,
            desData,
            transform:{
                translation:[0, 0, 0],
                rotation:[HNWUEngine.degToRad(0), HNWUEngine.degToRad(0), HNWUEngine.degToRad(0)],
                scale:[1,1,1]
            },
            sectionParams:{
                texture:0,
            },
            perspective:{
                aspect:0,
                fieldOfViewRadians:  HNWUEngine.degToRad(60),
                zNear: 1,
                zFar: 2000,
            },
            camera:{
                target:[0, 0, 0],
                position:[0, 0, 2],
                up:[0,1,0]
            },
        }
    },
    methods: {
        Init(){
            this.page = this.$refs.page;
            this.gl = this.page.getGL();
            this.canvas = this.page.getCanvas();
            this.program = this.page.getProgram();
            const gl = this.gl;
            this.perspective.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            //Get bufferinfo and setters.
            this.page.addBuffer("position",{numComponents:3,data:positions});
            this.page.addBuffer("texcoord",{numComponents:2,data:texCoords});
            this.page.setTransform(this.transform);
            this.sectionParams.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.sectionParams.texture);

            // fill texture with 3x2 pixels
            const level = 0;
            const internalFormat = gl.LUMINANCE;
            const width = 3;
            const height = 2;
            const border = 0;
            const format = gl.LUMINANCE;
            const type = gl.UNSIGNED_BYTE;
            const data = new Uint8Array([
                128,  64, 128,
                0, 192,   0,
            ]);
            const alignment = 1;
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border,
                            format, type, data);

            // set the filtering so we don't need mips and it's not filtered
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        },
        Render(){
            const gl = this.gl;
            const program = this.program;

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            
            //mvp matrix.
            const mvp = this.page.caculateMVPMatrix(this.camera,this.perspective,this.transform);
            this.page.addUniform("u_matrix",mvp);

            gl.uniform1i(gl.getUniformLocation(program, "u_texture"), 0);
            this.page.glDraw({mode:gl.TRIANGLES,first:0,count:6*6})

        },
    }
}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>
