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
import vertexShaderSource from './resource/vertex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import data from './resource/data'

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
        this.Init();
        this.SetUI();

    },
    methods: {
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
            window.location.href = "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/WebglDemo/DataTexture/index.vue";
        },

    },
    beforeDestory() {
        this.Destory();
    },
}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>
