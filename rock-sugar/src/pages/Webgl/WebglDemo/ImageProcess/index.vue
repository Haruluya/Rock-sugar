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
    name:"ImageProcess",
    buttonContent:"查看源码",
    title:"图像处理",
    content:"Image processing can change people's appearance and judge people's life and death."
}

const texCoords = data.texcoord;
const kernels = data.kernels;


/*
    @author:haruluya
    @des: Simple image processing.
*/


export default {
    name:'ImageProcess',
    data() {
        return {
            gl: null,
            canvas: null,
            program: null,
            vertexShaderSource,
            fragmentShaderSource,
            desData,
            positions:null,
            sectionParams:{
                img:null,
                selection:"normal"
            },

            texture:null,
            kernels,

        }   
    },
    mounted() {
        this.LoadImg();
    },
    methods: {
        LoadImg(){
            const image = new Image();
            image.src = haruluyaImg;
            this.sectionParams.img = image;
            image.onload = ()=>{
                this.positions = this.getImgPosition(canvas, this.sectionParams.img.width,this.sectionParams.img.height);
                this.$refs.page.Init();
            }
        },
        Init(){
            if (!this.sectionParams.img){
                return;
            }
            this.page = this.$refs.page;
            this.gl = this.page.getGL();
            this.canvas = this.page.getCanvas();
            this.program = this.page.getProgram();
            const gl = this.gl;

            //Get bufferinfo and setters.
            this.page.addBuffer("position",{numComponents:2,data:this.positions});
            this.page.addBuffer("texCoord",{numComponents:2,data:texCoords});


            this.texture = this.page.addTexture(this.sectionParams.img);
        },
        Render(){
            if (!this.sectionParams.img){
                return;
            }
            const gl = this.gl;

            this.page.addUniform("u_resolution",[gl.canvas.width, gl.canvas.height]);
            this.page.addUniform("u_textureSize",[this.sectionParams.img.width, this.sectionParams.img.height]);
            this.page.addUniform("u_kernel",this.kernels[this.sectionParams.selection]);
            this.page.addUniform("u_kernelWeight",this.computeKernelWeight(this.kernels[this.sectionParams.selection]));
            

            this.page.glDraw({mode:gl.TRIANGLES,first:0,count:6})

        },
      

        computeKernelWeight(kernel){
            let weight = kernel.reduce(function(prev, curr) {
                    return prev + curr;
                });
                return weight <= 0 ? 1 : weight;
        },
        //Restricted position.
        getImgPosition(canvas, width, height){
            width = width > 300 ? 300 : width;
            height = height > 300 ? 300 : height;
            const beginX = canvas.getBoundingClientRect().width/2 - width/2;
            const beginY =  canvas.getBoundingClientRect().height/2 - height/2;
            let x1 = beginX;
            let x2 = beginX + width;
            let y1 = beginY;
            let y2 = beginY + height;
            return new Float32Array([
                x1, y1,
                x2, y1,
                x1, y2,
                x1, y2,
                x2, y1,
                x2, y2,
            ]);
        }
    },

}
</script>

