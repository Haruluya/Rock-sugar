<template lang="html">
    <div class="pageContainer">
        <div class="webglContainer">
            <nano_canvas
             :prop_vertex_shader_source="vertexShaderSource"
             :prop_fragment_shader_source="fragmentShaderSource"
            />
            <div id="uiContainer">
                <div id="ui">

                </div>
            </div>
        </div>
        
        <nano_webgl_des_panel
            :prop_category="desData.category"
            :prop_name="desData.name"
            :prop_button_content="desData.buttonContent"
            :prop_title="desData.title"
            :prop_content="desData.content"
            @handleClick="handleClick"
            />

    </div>

    
</template>
<script>
import haruluyaImg from "_assets/images/haruluya.jpg"
import vertexShaderSource from './resource/vertex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import data from './resource/data'

const desData = {
    category:"Webgl",
    name:"ImageProcess",
    buttonContent:"查看源码",
    title:"图像处理",
    content:"Image processing can change people's appearance and judge people's life and death."
}

const texcoord = data.texcoord;
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
            bufferData:{
                position:{numComponents:2,data:[]},
                texCoord:{numComponents:2,data:texcoord},
            },
            uniformsData:{
                // u_image:null,
                u_textureSize:null,
                u_kernel:[],
                u_kernelWeight:null,
                u_resolution:null,
            },

            bufferInfo:null,
            uniformSetters:null,
            attribSetters:null,

            img:null,
            texture:null,
            kernels,
            selection:"normal"
        }   
    },
    mounted() {
        this.LoadImg();
        this.SetUI();
    },
    methods: {
        LoadImg(){
            const image = new Image();
            image.src = haruluyaImg;
            this.img = image;
            image.onload = ()=>{
                this.position = this.getImgPosition(canvas, this.img.width, this.img.height);
                this.Init();
            }
        },
        Init(){
            const { gl, canvas } = haruluya_webgl_utils.initWebglContext("canvas");
            this.gl = gl;
            this.canvas = canvas;
            this.program = haruluya_webgl_utils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);

           

            this.bufferData.position.data = this.position;

            this.bufferInfo = haruluya_webgl_utils.createBufferInfoFromArrays(gl, this.bufferData);
            this.uniformSetters = haruluya_webgl_utils.createUniformSetters(gl, this.program);
            this.attribSetters  = haruluya_webgl_utils.createAttributeSetters(gl, this.program);
                
            this.texture =  gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
            

            this.Render(this.selection);

        },
        Render(selection){
            const gl = this.gl;
            haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(this.program);

            this.uniformsData.u_resolution = [gl.canvas.width, gl.canvas.height];
            this.uniformsData.u_textureSize = [this.img.width, this.img.height];
            this.uniformsData.u_kernel = this.kernels[selection];
            this.uniformsData.u_kernelWeight = this.computeKernelWeight(this.kernels[selection]);

            haruluya_webgl_utils.setBuffersAndAttributes(gl, this.attribSetters, this.bufferInfo);
            haruluya_webgl_utils.setUniforms(this.uniformSetters, this.uniformsData);
           

            gl.drawArrays(gl.TRIANGLES, 0, 6);

        },
        SetUI(){
            const Render = this.Render;
            haruluya_webgl_utils.setDropDownBox(this.kernels,"ui",function(event) {
                Render(this.options[this.selectedIndex].value);
            })

        },
        Destory(){

        },
        handleClick() {
            window.location.href = "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/WebglDemo/ImageProcess/index.vue";
        },

        computeKernelWeight(kernel){
            let weight = kernel.reduce(function(prev, curr) {
                    return prev + curr;
                });
                return weight <= 0 ? 1 : weight;
        },

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
    beforeDestory() {
        this.Destory();
    },
}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>
