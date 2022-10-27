<template lang="html">
    <div class="pageContainer">
        <div class="webglContainer">
            <nano_canvas
             :prop_vertex_shader_source="vertexShaderSource"
             :prop_fragment_shader_source="fragmentShaderSource"
            />
            <div id="uiContainer">
                <div id="ui">
                    <div id="x"></div>
                    <div id="y"></div>
                    <div id="z"></div>
                    <div id="angleX"></div>
                    <div id="angleY"></div>
                    <div id="angleZ"></div>
                    <div id="scaleX"></div>
                    <div id="scaleY"></div>
                    <div id="scaleZ"></div>
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


const desData = {
    category:"Webgl",
    name:"Orthographic",
    buttonContent:"查看源码",
    title:"正交投影",
    content:"Orthogonal is more like irrelevant."
}


const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_matrix;
    varying vec4 v_color;
    void main() {
        gl_Position = u_matrix * a_position;
        v_color = a_color;
    }
`

const fragmentShaderSource = `
precision mediump float;
varying vec4 v_color;
void main() {
    gl_FragColor = v_color;
}
`

const position = [
    // 正面。
    200,   50,  0,
    0, 50,  0,
    0,   150,  0,
    0, 150,  0,
    200, 150,  0,
    200,   50,  0,

    // 顶面。
    200,   50,  100,
    0,  50,  100,
    0,   50,  0,
    0,  50,  0,
    200,  50,  0,
    200,   50,  100,

    // 右侧面。
    200,  50,  0,
    200,  150,  0,
    200,  150,  100,
    200,  150,  100,
    200,  50,  100,
    200,  50,  0,

    // 左侧面。
    0,   50,  0,
    0,   50,  100,
    0,   150,  100,
    0,   150,  100,
    0,   150,  0,
    0, 50,  0,

    // 底面。
    0,   150,  0,
    0,   150,  100,
    200,   150,  100,
    200,   150,  100,
    200,  150,  0,
    0,   150,  0,

    // 后面。
    200,  50,  100,
    200,  150,  100,
    0,  150,  100,
    0,  150,  100,
    0,  50,  100,
    200,  50,  100,  


]

const colors = [
    // 正面。
    0,  59, 252,
    0,  80, 252,
    0,  218, 252,
    0,  218, 252,
    0,  80, 252,
    0,  59, 252,
    // 顶面。
    252,  0, 0,
    150,  0, 0,
    0,  0, 0,
    0,  0, 0,
    150,  0, 0,
    252,  0, 0,

    // 右侧面。
    252,  227, 103,
    150,  227, 103,
    0,  227, 103,
    0,  227, 103,
    150,  227, 103,
    252,  227, 103,

    // 左侧面。
    252,  227, 103,
    150,  227, 103,
    0,  227, 103,
    0,  227, 103,
    150,  227, 103,
    252,  227, 103,

    // 底面。
    252,  0, 0,
    150,  0, 0,
    0,  0, 0,
    0,  0, 0,
    150,  0, 0,
    252,  0, 0,

    // 后面。
    0,  59, 252,
    0,  80, 252,
    0,  218, 252,
    0,  218, 252,
    0,  80, 252,
    0,  59, 252,

]

/*
    @author:haruluya
    @des: Orthographic 3d.
*/

export default {
    name:'Orthographic',
    data() {
        return {
            gl: null,
            program: null,
            vertexShaderSource,
            fragmentShaderSource,
            desData,
            bufferData:{
                position:{data:position},
                color:{data:new Uint8Array(colors)},
            },
            uniformsData:{
                u_matrix: null,
            },
            bufferInfo:null,
            uniformSetters:null,
            attribSetters:null,
            transfrom:{
                translation:[120, 180, 0],
                rotation:[haruluya_webgl_utils.degToRad(40), haruluya_webgl_utils.degToRad(25), haruluya_webgl_utils.degToRad(325)],
                scale : [0.8, 0.8, 1]
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
            //Get bufferinfo and setters.
            this.bufferInfo = haruluya_webgl_utils.createBufferInfoFromArrays(gl, this.bufferData);
            this.uniformSetters = haruluya_webgl_utils.createUniformSetters(gl, this.program);
            this.attribSetters  = haruluya_webgl_utils.createAttributeSetters(gl, this.program);
            this.Render();

        },
        Render(){
            const gl = this.gl;
            haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Turn on culling.
            gl.enable(gl.CULL_FACE);
            
            // Turn on z-buffer.
            gl.enable(gl.DEPTH_TEST);

            gl.useProgram(this.program);

            this.uniformsData.u_matrix = haruluya_webgl_utils.projection3d(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
            this.uniformsData.u_matrix = haruluya_webgl_utils.getTransformMatrix(this.uniformsData.u_matrix,this.transfrom);

            haruluya_webgl_utils.setBuffersAndAttributes(gl, this.attribSetters, this.bufferInfo);
            haruluya_webgl_utils.setUniforms(this.uniformSetters, this.uniformsData);

            gl.drawArrays(gl.TRIANGLES, 0, 36);

        },
        SetUI(){
            const gl = this.gl;
            const updatePosition = function(index) {
                return function(event, ui) {
                    transfrom.translation[index] = ui.value;
                    Render();
                };
            }

            const updateRotation = function(index) {
                return function(event, ui) {
                    const angleInDegrees = ui.value;
                    const angleInRadians = angleInDegrees * Math.PI / 180;
                    transfrom.rotation[index] = angleInRadians;
                    Render();
                };
            }

            const updateScale = function(index) {
                return function(event, ui) {
                    transfrom.scale[index] = ui.value;
                    Render();
                };
            }
            
            haruluya_webgl_utils.setupSlider("x", {value: this.transfrom.translation[0], slide: updatePosition(0), max: gl.canvas.width });
            haruluya_webgl_utils.setupSlider("y", {value: this.transfrom.translation[1], slide: updatePosition(1), max: gl.canvas.height});
            haruluya_webgl_utils.setupSlider("z", {value: this.transfrom.translation[2], slide: updatePosition(2), max: gl.canvas.height});
            haruluya_webgl_utils.setupSlider("angleX", {value: haruluya_webgl_utils.radToDeg(this.transfrom.rotation[0]), slide: updateRotation(0), max: 360});
            haruluya_webgl_utils.setupSlider("angleY", {value: haruluya_webgl_utils.radToDeg(this.transfrom.rotation[1]), slide: updateRotation(1), max: 360});
            haruluya_webgl_utils.setupSlider("angleZ", {value: haruluya_webgl_utils.radToDeg(this.transfrom.rotation[2]), slide: updateRotation(2), max: 360});
            haruluya_webgl_utils.setupSlider("scaleX", {value: this.transfrom.scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
            haruluya_webgl_utils.setupSlider("scaleY", {value: this.transfrom.scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
            haruluya_webgl_utils.setupSlider("scaleZ", {value: this.transfrom.scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2});
            // transform callback.
            const transfrom = this.transfrom;
            const Render = this.Render;

           
        
        },
        Destory(){

        },
        handleClick() {
            window.location.href = "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/WebglDemo/Orthographic/index.vue";
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
