<template lang="html">
    <div class="pageContainer">
        <div class="webglContainer">
            <nano_canvas
             :prop_vertex_shader_source="vertexShaderSource"
             :prop_fragment_shader_source="fragmentShaderSource"
            />
            <div id="uiContainer">
                <div id="ui">
                  <ui id="x"></ui>
                  <ui id="y"></ui>
                  <ui id="angle"></ui>
                  <ui id="scaleX"></ui>
                  <ui id="scaleY"></ui>
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
import { nano_canvas } from '@/packages';

const desData = {
    category:"Webgl",
    name:"Triangle",
    buttonContent:"查看源码",
    title:"三角",
    content:"Say 'Hello World!' to CG world."
}

const vertexShaderSource = `
        attribute vec2 a_position;
        uniform mat3 u_matrix;
        varying vec4 v_color;    
        void main() {
            gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
            v_color = gl_Position * 0.5 + 0.5;
        }
`;

const fragmentShaderSource = `
        precision mediump float;
        varying vec4 v_color;
        void main() {
            gl_FragColor = v_color;
        }

`;

const position =  new Float32Array([0, -100, 150, 125, -175, 100]);

/*
    @author:haruluya
    @des: Hello World!.
*/

export default {
    name: "Triangle",
    data() {
        return {
            gl: null,
            canvas: null,
            program: null,
            bufferData:{
                position:{numComponents:2,data:position}
            },
            uniformsData:{
                u_matrix: null,
            },
            bufferInfo:null,
            attribSetters:null,
            transfrom: {
                translation: [300, 200,0],
                rotation:[haruluya_webgl_utils.degToRad(0), haruluya_webgl_utils.degToRad(0), haruluya_webgl_utils.degToRad(0)],
                scale: [1, 1,1]
            },
            angleInRadians:0,
            vertexShaderSource,
            fragmentShaderSource,
            desData
        };
    },
    methods: {
        Init() {
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
            const gl = this.gl;
            haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(this.program);

            // set matix.
            const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
            let matrix = haruluya_webgl_utils.projection2d(gl.canvas.clientWidth, gl.canvas.clientHeight);
            matrix = haruluya_webgl_utils.translate2d(matrix, this.transfrom.translation[0], this.transfrom.translation[1]);
            matrix = haruluya_webgl_utils.rotate2d(matrix, this.angleInRadians);
            matrix = haruluya_webgl_utils.scale2d(matrix, this.transfrom.scale[0], this.transfrom.scale[1]);
            gl.uniformMatrix3fv(matrixLocation, false, matrix);

            haruluya_webgl_utils.setBuffersAndAttributes(gl, this.attribSetters, this.bufferInfo);

            gl.drawArrays(gl.TRIANGLES, 0, 3);
        },
        SetUI() {
            
            //setup ui.
            const gl = this.gl;
            haruluya_webgl_utils.setupSlider("x", { value: this.transfrom.translation[0], slide: updatePosition(0), max: gl.canvas.width });
            haruluya_webgl_utils.setupSlider("y", { value: this.transfrom.translation[1], slide: updatePosition(1), max: gl.canvas.height });
            haruluya_webgl_utils.setupSlider("angle", { slide: updateAngle, max: 360 });
            haruluya_webgl_utils.setupSlider("scaleX", { value: this.transfrom.scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2 });
            haruluya_webgl_utils.setupSlider("scaleY", { value: this.transfrom.scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2 });
            
            let transfrom = this.transfrom;
            let Render = this.Render;
            let angleInRadians = this.angleInRadians;
            // position callback.
            function updatePosition(index) {
                return function (event, ui) {
                    transfrom.translation[index] = ui.value;
                    Render();
                };
            }
            // rotation callback.
            function updateAngle(event, ui) {
                var angleInDegrees = 360 - ui.value;
                angleInRadians = angleInDegrees * Math.PI / 180;
                Render();
            }
            // scale callback.
            function updateScale(index) {
                return function (event, ui) {
                    transfrom.scale[index] = ui.value;
                    Render();
                };
            }
        },
        Destory() {
            console.log("WBBGL DESTORY!!!");
        },
        handleClick() {
            window.location.href = "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/WebglDemo/Triangle/index.vue";
        }
    },
    mounted() {
        this.Init();
        this.SetUI();
    },
    beforeDestory() {
        this.Destory();
    },
    components: { nano_canvas }
};




</script>
<style lang="less" scoped>
@import "../index.less";
</style>