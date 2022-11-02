<template lang="html">
    <div class="pageContainer">
        <div class="webglContainer">
            <nano_canvas
             :prop_vertex_shader_source="vertexShaderSource"
             :prop_fragment_shader_source="fragmentShaderSource"
            />
            <div id="uiContainer">
                <div id="ui">
                    <ui id="fieldOfView"></ui>
                    <ui id="x"></ui>
                    <ui id="y"></ui>
                    <ui id="z"></ui>
                    <ui id="angleX"></ui>
                    <ui id="angleY"></ui>
                    <ui id="angleZ"></ui>
                    <ui id="scaleX"></ui>
                    <ui id="scaleY"></ui>
                    <ui id="scaleZ"></ui>
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
            canvas: null,
            program: null,
            vertexShaderSource,
            fragmentShaderSource,
            desData,
            colors,
            bufferData:{
                position:{data:positions},
                color:{data:colors},
            },
            uniformsData:{
                u_matrix: null,
            },
            bufferInfo:null,
            uniformSetters:null,
            attribSetters:null,
            transfrom:{
                translation:[-150, 0, -360],
                rotation:[haruluya_webgl_utils.degToRad(190), haruluya_webgl_utils.degToRad(40), haruluya_webgl_utils.degToRad(320)],
                scale:[1,1,1]
            },
            sectionParams:{
                fieldOfViewRadians:haruluya_webgl_utils.degToRad(60),
                zNear:1,
                zFar:2000,
            }
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
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            this.uniformsData.u_matrix = haruluya_webgl_utils.perspective(this.sectionParams.fieldOfViewRadians, aspect, this.sectionParams.zNear, this.sectionParams.zFar);
            this.uniformsData.u_matrix = haruluya_webgl_utils.getTransformMatrix(this.uniformsData.u_matrix,this.transfrom);
            
            haruluya_webgl_utils.setBuffersAndAttributes(gl, this.attribSetters, this.bufferInfo);
            haruluya_webgl_utils.setUniforms(this.uniformSetters, this.uniformsData);

            gl.drawArrays(gl.TRIANGLES, 0, 36);
        },
        SetUI(){
            
            const Render = this.Render;
            let fieldOfViewRadians = this.sectionParams.fieldOfViewRadians;
            let transform = this.transfrom;
            const updateFieldOfView = function (event, ui) {
                fieldOfViewRadians = haruluya_webgl_utils.degToRad(ui.value);
                Render();
            }

            const updatePosition = function updatePosition(index) {
                return function(event, ui) {
                    transform.translation[index] = ui.value;
                    Render();
                };
            }

            const updateRotation = function (index) {
                return function(event, ui) {
                    let angleInDegrees = ui.value;
                    let angleInRadians = angleInDegrees * Math.PI / 180;
                    transform.rotation[index] = angleInRadians;
                    Render();
                };
            }

            const updateScale = function (index) {
                return function(event, ui) {
                    transform.scale[index] = ui.value;
                    Render();
                };
            }
            // ui.
            haruluya_webgl_utils.setupSlider("fieldOfView", {value: haruluya_webgl_utils.radToDeg(fieldOfViewRadians), slide: updateFieldOfView, min: 1, max: 179});
            haruluya_webgl_utils.setupSlider("x", {value: transform.translation[0], slide: updatePosition(0), min: -200, max: 200 });
            haruluya_webgl_utils.setupSlider("y", {value: transform.translation[1], slide: updatePosition(1), min: -200, max: 200});
            haruluya_webgl_utils.setupSlider("z", {value: transform.translation[2], slide: updatePosition(2), min: -1000, max: 0});
            haruluya_webgl_utils.setupSlider("angleX", {value: haruluya_webgl_utils.radToDeg(transform.rotation[0]), slide: updateRotation(0), max: 360});
            haruluya_webgl_utils.setupSlider("angleY", {value: haruluya_webgl_utils.radToDeg(transform.rotation[1]), slide: updateRotation(1), max: 360});
            haruluya_webgl_utils.setupSlider("angleZ", {value: haruluya_webgl_utils.radToDeg(transform.rotation[2]), slide: updateRotation(2), max: 360});
            haruluya_webgl_utils.setupSlider("scaleX", {value: transform.scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
            haruluya_webgl_utils.setupSlider("scaleY", {value: transform.scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
            haruluya_webgl_utils.setupSlider("scaleZ", {value: transform.scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2});

        },
        Destory(){

        },
        handleClick() {
            window.location.href = "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/WebglDemo/Perspective/index.vue";
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
