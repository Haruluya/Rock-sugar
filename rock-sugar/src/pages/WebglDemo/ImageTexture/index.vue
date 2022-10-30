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
import haruluyaImg from "../../../assets/images/haruluya.jpg"
import vertexShaderSource from './resource/vertex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import data from './resource/data'

const desData = {
    category:"Webgl",
    name:"ImageTexture",
    buttonContent:"查看源码",
    title:"材质",
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
            bufferData:{
                position:{numComponents:3,data:positions},
                texcoord:{numComponents:2,data:texCoords},
            },
            uniformsData:{
                u_matrix:null,
                // u_texture:null
            },
            bufferInfo:null,
            uniformSetters:null,
            attribSetters:null,
            transfrom:{

            },
            sectionParams:{
                last:0,
                fieldOfViewRadians: haruluya_webgl_utils.degToRad(60),
                modelXRotationRadians: haruluya_webgl_utils.degToRad(0),
                modelYRotationRadians: haruluya_webgl_utils.degToRad(0),
                texture:0,
                img:null,
            },
            perspective:{
                aspect:0,
                fieldOfViewRadians:  haruluya_webgl_utils.degToRad(60),
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
    mounted() {

        this.LoadImg();
        this.SetUI();

    },
    methods: {
        LoadImg(){
            // Set image.
            let image = new Image();
            image.src = haruluyaImg;
            this.img = image;
            image.onload = ()=>{

                this.Init();
            }

        },
        Init(){
            const { gl, canvas } = haruluya_webgl_utils.initWebglContext("canvas");
            this.gl = gl;
            this.canvas = canvas;
            this.program = haruluya_webgl_utils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);
            this.perspective.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            //Get bufferinfo and setters.
            this.bufferInfo = haruluya_webgl_utils.createBufferInfoFromArrays(gl, this.bufferData);
            this.uniformSetters = haruluya_webgl_utils.createUniformSetters(gl, this.program);
            this.attribSetters  = haruluya_webgl_utils.createAttributeSetters(gl, this.program);
            
            this.texture = gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, this.img);
            if (this.isPowerOf2(this.img.width) && this.isPowerOf2(this.img.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            
           
            
            requestAnimationFrame(this.Render);
        },
        Render(time){

            time *= 0.001;
            let deltaTime = time - this.sectionParams.last;
            this.sectionParams.last = time;

            const gl = this.gl;
            const program = this.program;

            haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            this.sectionParams.modelYRotationRadians += -0.7 * deltaTime;
            this.sectionParams.modelXRotationRadians += -0.4 * deltaTime;
            
            gl.useProgram(program);
            haruluya_webgl_utils.setBuffersAndAttributes(gl, this.attribSetters, this.bufferInfo);
            
            let cameraMatrix = haruluya_webgl_utils.lookAt(this.camera.position, this.camera.target, this.camera.up);
            let viewMatrix = haruluya_webgl_utils.inverse(cameraMatrix);
            let projectionMatrix = haruluya_webgl_utils.perspective(
                this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
                );
            let viewProjectionMatrix = haruluya_webgl_utils.multiply3d(projectionMatrix, viewMatrix);

            let matrix = haruluya_webgl_utils.xRotate(viewProjectionMatrix, this.sectionParams.modelXRotationRadians);
            matrix = haruluya_webgl_utils.yRotate(matrix, this.sectionParams.modelYRotationRadians);
            this.uniformsData.u_matrix = matrix;

            // this.uniformsData.u_texture = 0;
            gl.uniform1i(gl.getUniformLocation(program, "u_texture"), 0);
            
            haruluya_webgl_utils.setUniforms(this.uniformSetters, this.uniformsData);

            gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);

            requestAnimationFrame(this.Render);

        },
        SetUI(){

        },
        Destory(){

        },
        handleClick() {
            window.location.href = "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/WebglDemo/ImageTexture/index.vue";
        },
        isPowerOf2(value) {
                return (value & (value - 1)) === 0;
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
