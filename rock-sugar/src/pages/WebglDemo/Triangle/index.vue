<template lang="html">
    <div class="pageContainer">
        <div class="webglContainer">
            <nano_canvas
             :prop_vertex_shader_source="vertexShaderSource"
             :prop_fragment_shader_source="fragmentShaderSource"
            />


        </div>
        
        <nano_webgl_des_panel
            :prop_category="desData.category"
            :prop_name="desData.name"
            :prop_button_content="desData.buttonContent"
            :prop_title="desData.title"
            :prop_content="desData.content"
            @handleClick="handleClick"
            />
        <div class="sidePanel">
            <nano_param_panel
                :prop_ui_setter="uiSetter"
                @SetUI="SetUI"
            />

        </div>
    </div>
</template>
<script>
import { nano_canvas, nano_param_panel } from '@/packages';
import vertexShaderSource from './resource/vetex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import data from './resource/data.js'



const desData = {
    category:"Webgl",
    name:"Triangle",
    buttonContent:"查看源码",
    title:"三角",
    content:"Say 'Hello World!' to CG world."
}
const position =  data.position;


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
            desData,
  
        };
    },

    computed:{
        uiSetter(){
            let transfrom = this.transfrom;
            let angleInRadians = this.angleInRadians;
            return [
                {type:"slider", id:"x", value: transfrom.translation[0], min:0, max:400, callback:this.uiCallback.updatePosition(0)},
                {type:"slider", id:"y", value: transfrom.translation[1], min:0, max:400,  callback:this.uiCallback.updatePosition(1)},
                {type:"slider", id:"angle", value: angleInRadians, min:0, max:360,  callback:this.uiCallback.updateAngle},
                {type:"slider", id:"scaleX", value: transfrom.scale[0], min:-5, max:5, callback:this.uiCallback.updateScale(0)},
                {type:"slider", id:"scaleY", value: transfrom.scale[1], min:-5, max:5, callback:this.uiCallback.updateScale(1)},
            ]
        },
        // ui callback.
        uiCallback(){
            let Render = this.Render;
            let transfrom = this.transfrom;
            let angleInRadians =this.angleInRadians;
            return {
                updatePosition:(index)=>{
                    return function (event, ui) {
                        transfrom.translation[index] = ui.value;
                        Render();
                    };
                },
                updateAngle:()=>{
                    let Render = this.Render;
                    var angleInDegrees = 360 - ui.value;
                    angleInRadians = angleInDegrees * Math.PI / 180;
                    Render();
                },
                updateScale:(index)=>{
                    let transfrom = this.transfrom;
                    let Render = this.Render;
                    return function (event, ui) {
                        transfrom.scale[index] = ui.value;
                        Render();
                    };
                }
            }
        },  
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
        
        SetUI(panel) {
            console.log(this.uiSetter,panel.$refs,'XXXXXX')
            //setup ui.
            this.uiSetter.forEach(element => {
                if (element.type === "slider"){
                    haruluya_webgl_utils.setupSlider(
                        panel.$refs[element.id], 
                        { value: element.value, slide: element.callback, max: element.max, min: element.min }
                    );
                }
            });
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
    },
    beforeDestory() {
        this.Destory();
    },
    components: { nano_canvas, nano_param_panel }
};




</script>
<style lang="less" scoped>
@import "../index.less";
</style>