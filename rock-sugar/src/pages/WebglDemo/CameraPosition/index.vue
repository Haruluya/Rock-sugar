<template lang="html">
    <div class="pageContainer">
        <div class="webglContainer">
            <nano_canvas
             :prop_vertex_shader_source="vertexShaderSource"
             :prop_fragment_shader_source="fragmentShaderSource"
            />
            <div id="uiContainer">
                <div id="ui">
                    <div id="targetAngle"></div>
                    <div id="targetHeight"></div>
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
    name:"CameraPosition",
    buttonContent:"查看源码",
    title:"相机",
    content:"I suddenly realized I'd never taken a selfie before."
}



import modelData from '_utils/outData/HeadData.js'

export default {
    name:'CameraPosition',
    data() {
        return {
            gl: null,
            canvas: null,
            program: null,
            vertexShaderSource,
            fragmentShaderSource,
            desData,
            bufferData:{
                position:{data:[]},
                color:{data:[]},
            },
            uniformsData:{
                u_matrix: null,
            },
            bufferInfo:null,
            uniformSetters:null,
            attribSetters:null,
            transfrom:{
                translation:[0, 0, 0],
                rotation:[haruluya_webgl_utils.degToRad(0), haruluya_webgl_utils.degToRad(0), haruluya_webgl_utils.degToRad(0)],
                scale : [1, 1, 1]

            },
            perspective:{
                aspect:0,
                fieldOfViewRadians:  haruluya_webgl_utils.degToRad(60),
                zNear: 1,
                zFar: 3000,
            },
            camera:{
                cameraTarget:[0,-100,0],
                cameraPosition:[500,300,500],
                up:[0,1,0]
            },
            sectionParams:{
                target:[0, 200, 300],
                targetAngleRadians: 0,
                targetRadius: 300,
                numFs:5,
                radius:600,
                deep:5,
                across:5,
            },
            numElements:0,

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
            //Get bufferinfo and setters.
            this.numElements = this.setPosition();
            this.setColor();
            this.perspective.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

            this.bufferInfo = haruluya_webgl_utils.createBufferInfoFromArrays(gl, this.bufferData);
            this.uniformSetters = haruluya_webgl_utils.createUniformSetters(gl, this.program);
            this.attribSetters  = haruluya_webgl_utils.createAttributeSetters(gl, this.program);
            this.Render();
        },
        Render(){
            const gl = this.gl;
            const program = this.program;
            haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            gl.useProgram(program);

            haruluya_webgl_utils.setBuffersAndAttributes(gl, this.attribSetters, this.bufferInfo);


            //perspective.
            let projectionMatrix = haruluya_webgl_utils.perspective(this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
            );

            let cameraMatrix = haruluya_webgl_utils.lookAt(this.camera.cameraPosition, this.camera.cameraTarget, this.camera.up);
            let viewMatrix = haruluya_webgl_utils.inverse(cameraMatrix);
            let viewProjectionMatrix = haruluya_webgl_utils.multiply3d(projectionMatrix, viewMatrix);
            
            
            // Draw circle。
            let deep = this.sectionParams.deep;
            let across = this.sectionParams.across;
            for (let zz = 0; zz < deep; ++zz) {
                let v = zz / (deep - 1);
                let z = (v - .5) * deep * 150;
                for (let xx = 0; xx < across; ++xx) {
                    let u = xx / (across - 1);
                    let x = (u - .5) * across * 150;
                    let matrix = haruluya_webgl_utils.lookAt([x, 0, z], this.sectionParams.target, this.camera.up);
                    const MVP = haruluya_webgl_utils.multiply3d(viewProjectionMatrix, matrix);
                    this.uniformsData.u_matrix = MVP;
                    haruluya_webgl_utils.setUniforms(this.uniformSetters, this.uniformsData);
                    gl.drawArrays(gl.TRIANGLES, 0, this.numElements);
                }
            }
        },
        SetUI(){
            const Render = this.Render;
            let targetAngleRadians = this.sectionParams.targetAngleRadians;
            let target = this.sectionParams.target;


            // callback.
            const updateTargetAngle = function (event, ui) {
                targetAngleRadians = haruluya_webgl_utils.degToRad(ui.value);
                target[0] = Math.sin(targetAngleRadians) * targetRadius;
                target[2] = Math.cos(targetAngleRadians) * targetRadius;
                Render();
            }
            const updateTargetHeight = function (event, ui) {
                target[1] = ui.value;
                Render();
            }
                    // ui.
            haruluya_webgl_utils.setupSlider("targetAngle", {value: haruluya_webgl_utils.radToDeg(targetAngleRadians), slide: updateTargetAngle, min: -360, max: 360});
            haruluya_webgl_utils.setupSlider("targetHeight", {value: target[1], slide: updateTargetHeight, min: 50, max: 300});
        },
        Destory(){

        },

        handleClick() {
            window.location.href = "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/WebglDemo/CameraPosition/index.vue";
        },

        setPosition(){
            let positions = new Float32Array(modelData.positions);
            let matrix = haruluya_webgl_utils.multiply3d(haruluya_webgl_utils.scaling3d(6, 6, 6), haruluya_webgl_utils.yRotation(Math.PI));
            for (let ii = 0; ii < positions.length; ii += 3) {
                let vector = haruluya_webgl_utils.vectorMultiply([positions[ii + 0], positions[ii + 1], positions[ii + 2], 1], matrix);
                positions[ii + 0] = vector[0];
                positions[ii + 1] = vector[1];
                positions[ii + 2] = vector[2];
            }
            this.bufferData.position.data = positions;
            return positions.length / 3;
        },
        setColor(){
            let normals = modelData.normals;
            let colors = new Uint8Array(normals.length);
            let offset = 0;
            for (let ii = 0; ii < colors.length; ii += 3) {
                for (let jj = 0; jj < 3; ++jj) {
                colors[offset] = (normals[offset] * 0.5 + 0.5) * 255;
                ++offset;
                }
            }
            this.bufferData.color.data = colors;
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
