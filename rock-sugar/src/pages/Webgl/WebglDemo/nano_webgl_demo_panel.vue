<template>
    <div class="pageContainer">
        <div class="webglContainer" id="canvasSlot">
            <nano_canvas ref="nanoCanvas"
                :prop_vertex_shader_source="prop_vertex_shader"
                :prop_fragment_shader_source="prop_fragment_shader"
                @mousedown="viewer"
                @mousewheel="viewer"
                />
        </div>
        <div class="desPanel">
            <nano_webgl_des_panel
                :prop_category="prop_des_data.category"
                :prop_name="prop_des_data.name"
                :prop_button_content="prop_des_data.buttonContent"
                :prop_title="prop_des_data.title"
                :prop_content="prop_des_data.content"
                :prop_core_slot_id="slotID.CORE_SLOT_TOP_ID"
                @handleClick="pageCallback().handleClick"
            />
        </div>

        <div class="sidePanel" ref="sidePanel"
            >
            <div class="mainPanel"
                :style="{left:sidePanelPos.mainPanel.x + 'px',top:sidePanelPos.mainPanel.y + 'px'}"
                @mousedown="uiSetting.panelDrag(this.sidePanelPos,'mainPanel',$event)" >
                <nano_param_panel
                    :prop_ui_setter="prop_ui_setter"
                    :prop_panel_slot_id="slotID.MAIN_PANEL_SLOT_ID"
                    :prop_debug_slot_id="slotID.DEBUG_OUT_SLOT_ID"
                    @showDebug="pageCallback().showDebugPanel"
                    @updateSlot="uiSetting.updateSlot"
                />
            </div>
            <transition name="debugPanelTransition">
                <div class="debugPanel"
                    v-show="showDebug"
                    :style="{left:sidePanelPos.debugPanel.x + 'px',top:sidePanelPos.debugPanel.y + 'px'}"
                    @mousedown="uiSetting.panelDrag(this.sidePanelPos,'debugPanel',$event)">
                    <nano_param_output_panel
                        prop_title="Debug"
                        :prop_slot_id="slotID.DEBUG_IN_SLOT_ID"
                        :prop_content="debugContent"
                    />
                </div>
            </transition>
        </div>
    </div>
</template>
<script>

/*
    @author:haruluya.
    @des:This component is used to make the source code more concise.
*/

const slotID = {
    MAIN_PANEL_SLOT_ID : 1,
    DEBUG_IN_SLOT_ID : 2,
    DEBUG_OUT_SLOT_ID : 3,
    CORE_SLOT_TOP_ID : 4
}
import { tsImportEqualsDeclaration } from "@babel/types"
import AnimEvent from "_plugins/anim-event/anim-event.min.js"
import uiSetting from "./ui-setting"
export default {

    name:"nano_webgl_demo_panel",
    data() {
        return {
            gl:null,
            canvas:null,
            program:null,
            bufferData:{},
            uniformsData:{},
            bufferInfo:null,
            attribSetters:null,
            uniformSetters:null,
            uiSetting,
            transform:{
                translation:[0,0, 0],
                rotation:[HNWUEngine.degToRad(0), HNWUEngine.degToRad(0), HNWUEngine.degToRad(0)],
                scale : [1, 1,1]
            },
            //vue watching data.
            sidePanelPos:{
                mainPanel:{ x: 1050, y: 150 },
                debugPanel:{x:1200, y:400}
            },
            showDebug:false,
            debugContent:[],
            slotID,
            drawMode:{},
            mousePosition:{
                x:0,
                y:0
            }
        }
    },
    mounted(){
        this.Init();
        this.SetUI();
 
    },
    watch:{
        uiSetter:{
            deep:true
        }
    },
    props:{
        prop_des_data:{
            type:Object,
            default:{
                category:"None",
                name:"None",
                buttonContent:"None",
                title:"None",
                content:"None"
            },
            required:true
        },
        prop_section_params:{
            type:Object,
            default:{
            },
            required:true
        },
        prop_vertex_shader:{
            type:Object,
            default:"",
            required:true
        },
        prop_fragment_shader:{
            type:Object,
            default:"",
            required:true
        },
        prop_ui_setter:{
            type:Array,
            default:[],
            required:true
        }

    },
    computed:{


    },
    updated() {

    },
    methods:{
        Init(){
            const { gl, canvas } = HNWUEngine.initWebglContext("canvas");
            this.gl = gl;
            this.canvas = canvas;
            this.program = HNWUEngine.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);
            this.$emit("Init");

            // attributes.
            if (Object.getOwnPropertyNames(this.bufferData).length != 0){
                this.bufferInfo = HNWUEngine.createBufferInfoFromArrays(gl, this.bufferData);
                this.attribSetters  = HNWUEngine.createAttributeSetters(gl, this.program);
                this.uniformSetters = HNWUEngine.createUniformSetters(gl, this.program);
                this.Render();
            }
        },
        Render(){
            const gl = this.gl;
            HNWUEngine.resizeCanvasToDisplaySize(gl.canvas);

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(this.program);

            this.$emit("Render");
            HNWUEngine.setBuffersAndAttributes(gl, this.attribSetters, this.bufferInfo);
            HNWUEngine.setUniforms(this.uniformSetters, this.uniformsData);
            
            // gl.drawArrays(this.drawMode.mode, this.drawMode.first,this.drawMode.count);
            this.drawBufferInfo(gl,this.bufferInfo);
            
            if(this.debugLog.length == 0){
                this.debugLog("None","No thing to debug.")
            }
        },
        Destroy() {
            uiSetting.destroy();
        },
        SetUI(){
            uiSetting.setDefaultUI(this.slotID);
        },
        
        pageCallback() {
            return {
                handleClick: () => {
                    window.location.href =
                        "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/WebglDemo/"+this.prop_des_data.name+"/index.vue";
                },
                showDebugPanel: () => {
                    this.showDebug = !this.showDebug;
                    if (this.showDebug) {
                        this.$nextTick(() => {
                            uiSetting.setDebugPanelCon(this.slotID);
                            uiSetting.nodeLines.debugPanelLine.show("draw");
                        });
                    }
                    else {
                        uiSetting.nodeLines.debugPanelLine.hide("draw");
                        uiSetting.nodeLines.debugPanelLine.remove();
                        uiSetting.nodeLines.debugPanelLine = null;
                    }
                },
            };
        },
        drawBufferInfo(gl, bufferInfo, primitiveType, count, offset) {
            const indices = bufferInfo.indices;
            primitiveType = primitiveType === undefined ? gl.TRIANGLES : primitiveType;
            const numElements = count === undefined ? bufferInfo.numElements : count;
            offset = offset === undefined ? 0 : offset;
            if (indices) {
            gl.drawElements(primitiveType, numElements, gl.UNSIGNED_SHORT, offset);
            } else {
            gl.drawArrays(primitiveType, offset, numElements);
            }
        },
        addBuffer(name,data){
            this.bufferData[name] = data;
        },
        addUniform(name,data){
            this.uniformsData[name] = data;
        },
        getGL(){
            return this.gl;
        },
        getCanvas(){
            return this.canvas;
        },
        getProgram(){
            return this.program;
        },
        glDraw(drawMode){
            this.drawMode = drawMode;
        },
        debugLog(title,content){
            this.debugContent.push({
                title,
                content
            })
        },
        setTransform(transform){
            this.transform = transform
        },
        addTexture(img){
            const gl = this.gl;
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, img);
            return texture;
        },

        viewer(e){
          if (e.type === "mousedown"){
            this.mousePosition.x = e.clientX;
           this.mousePosition.y = e.clientY;
           document.onmousemove = AnimEvent.add((e)=>{

                const offsetX = e.clientX - this.mousePosition.x;
                const offsetY = e.clientY - this.mousePosition.y;
                
                this.transform.rotation[1] += offsetX/1000;
                // this.transform.rotation[0] += offsetY/1000;
                this.Render()

            });
            document.onmouseup = () => {
                document.onmousemove = null;
            };
          }else if (e.type === "mousewheel"){
            e.preventDefault();
            for (let i = 0; i < this.transform.scale.length;i++){
                this.transform.scale[i] -= e.deltaY > 0? 0.15 : -0.15;
            }
            this.Render()
            }
        },
        caculateMVPMatrix(camera,perspective,transform){
            let cameraMatrix = HNWUEngine.lookAt(camera.position, camera.target, camera.up);
            let viewMatrix = HNWUEngine.inverse(cameraMatrix);
            let projectionMatrix = HNWUEngine.perspective(
                perspective.fieldOfViewRadians, 
                perspective.aspect, 
                perspective.zNear, 
                perspective.zFar
                );
            let viewProjectionMatrix = HNWUEngine.multiply3d(projectionMatrix, viewMatrix);
           
            let worldMatrix = HNWUEngine.getTransformMatrix(
                HNWUEngine.xRotation(0),
                transform
            )
            let worldViewProjectionMatrix = HNWUEngine.multiply3d(viewProjectionMatrix, worldMatrix);
            return worldViewProjectionMatrix;
        }

    },
    unmounted(){
        this.Destroy();
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>