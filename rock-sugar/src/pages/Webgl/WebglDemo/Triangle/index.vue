<template lang="html">
    <div class="pageContainer">
        <div class="webglContainer" id="canvasSlot">
            <nano_canvas
             :prop_vertex_shader_source="vertexShaderSource"
             :prop_fragment_shader_source="fragmentShaderSource"
            />
        </div>
        
        <div class="desPanel">
            <nano_webgl_des_panel
            :prop_category="desData.category"
            :prop_name="desData.name"
            :prop_button_content="desData.buttonContent"
            :prop_title="desData.title"
            :prop_content="desData.content"
            @handleClick="handleClick"
            />
        </div>

        <div class="sidePanel" ref="sidePanel"
            >
            <div class="mainPanel"
                :style="{left:sidePanelPos.mainPanel.x + 'px',top:sidePanelPos.mainPanel.y + 'px'}"
                @mousedown="uiSetting.panelDrag(this,'mainPanel',$event)" >
                <nano_param_panel
                :prop_ui_setter="uiSetter"
                @showDebug="showDebugPanel"
                />
            </div>
            <transition name="debugPanelTransition">
                <div class="debugPanel"
                    v-show="showDebug"
                    :style="{left:sidePanelPos.debugPanel.x + 'px',top:sidePanelPos.debugPanel.y + 'px'}"
                    @mousedown="uiSetting.panelDrag(this,'debugPanel',$event)">
                    <nano_param_output_panel
                        prop_title="Debug"
                        :prop_content="debugContent"
                    />
                </div>
            </transition>
        </div>
    </div>
</template>
<script>


import vertexShaderSource from './resource/vetex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import data from './resource/data.js'
import uiSetting from "../ui-setting"

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

            //gl context.
            gl: null,
            program: null,
            vertexShaderSource,
            fragmentShaderSource,

            //attribute and uniform.
            bufferData:{
                position:{numComponents:2,data:position}
            },
            uniformsData:{
                u_matrix: null,
            },
            bufferInfo:null,
            attribSetters:null,
            uniformSetters:null,

            //params.
            transfrom: {
                translation: [300, 200,0],
                rotation:[haruluya_webgl_utils.degToRad(0), haruluya_webgl_utils.degToRad(0), haruluya_webgl_utils.degToRad(0)],
                scale: [1, 1,1]
            },
            angleInRadians:0,

            // component data.
            desData,
            uiSetting,
   
            //vue watching data.
            sidePanelPos:{
                mainPanel:{ x: 1050, y: 150 },
                debugPanel:{x:1200, y:400}
            },
            showDebug:false,
            debugContent:null,

        };
    },

    computed:{
        //uiSetter.
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

        // callbacks of uisetter.
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
        
        SetUI(){
            uiSetting.setDefaultUI(this);
        },



        Destory() {
            console.log("WBBGL DESTORY!!!");
        
        },

        handleClick() {
            window.location.href = "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/WebglDemo/Triangle/index.vue";
        },
        
        showDebugPanel(){
            this.showDebug = !this.showDebug;
            if (this.showDebug){
                this.$nextTick(()=>{
                    uiSetting.setDebugPanelCon(this);
                })
            }else{
                uiSetting.nodeLines.debugPanelLine.hide('draw');
                uiSetting.nodeLines.debugPanelLine.remove();
                uiSetting.nodeLines.debugPanelLine = null;
            }
        },
    },
    mounted() {
        this.Init();
        this.SetUI();
    },
    destroyed() {
        this.Destory();
    },
<<<<<<< HEAD:rock-sugar/src/pages/Webgl/WebglDemo/Triangle/index.vue
  
=======
    components: { nano_canvas }
    
>>>>>>> 0e227d8e6363c650a7e358a6c663238e63a411e7:rock-sugar/src/pages/WebglDemo/Triangle/index.vue
};




</script>
<style lang="less" scoped>
@import "../index.less";
</style>