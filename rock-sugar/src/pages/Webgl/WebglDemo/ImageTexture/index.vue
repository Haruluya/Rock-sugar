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
import haruluyaImg from "_assets/images/haruluya.jpg"

const desData = {
    category:"Webgl",
    name:"ImageTexture",
    buttonContent:"查看源码",
    title:"贴图",
    content:"Maybe putting my picture here is the only way I can make a record."
}

const positions = data.position;
const texCoords = data.texcoord;


export default {
    name:'ImageTexture',
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
                last:0,
                fieldOfViewRadians: HNWUEngine.degToRad(60),
                modelXRotationRadians: HNWUEngine.degToRad(0),
                modelYRotationRadians: HNWUEngine.degToRad(0),
                texture:0,
                img:null,
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
        LoadImg(){
            // Set image.
            let image = new Image();
            image.src = haruluyaImg;
            this.sectionParams.img = image;
            image.onload = this.$refs.page.Init;
        },
        Init(){
            if (!this.sectionParams.img){
                return;
            }
            this.page = this.$refs.page;
            this.gl = this.page.getGL();
            this.canvas = this.page.getCanvas();
            this.program = this.page.getProgram();
            //Get bufferinfo and setters.
            this.perspective.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
            this.page.addBuffer("position",{numComponents:3,data:positions});
            this.page.addBuffer("texcoord",{numComponents:2,data:texCoords});
            this.page.setTransform(this.transform);
            this.sectionParams.texture = this.page.addTexture(this.sectionParams.img);
        },
        Render(){
            if (!this.sectionParams.img){
                return;
            }
            const gl = this.gl;

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
           
            //matrix.
            const mvp = this.page.caculateMVPMatrix(this.camera,this.perspective,this.transform);
            this.page.addUniform("u_worldViewProjection",mvp);
            this.page.addUniform("u_texture",this.sectionParams.texture)


            this.page.glDraw({mode:gl.TRIANGLES,first:0,count:6*6})
        },

        isPowerOf2(value) {
            return (value & (value - 1)) === 0;
        }
    },
    mounted(){
        this.LoadImg();
    }
}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>
