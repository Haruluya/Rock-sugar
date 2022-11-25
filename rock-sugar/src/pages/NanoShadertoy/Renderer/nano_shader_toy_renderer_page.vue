<template>
    <div class="pageContainer">
        <div :class="{'webglContainer':true,'scaleScreen':scaleScreen}" id="canvasSlot">
            <nano_canvas ref="nanoCanvas" class="nanoCanvas"
            :prop_vertex_shader_source="prop_vertex_shader"
            :prop_fragment_shader_source="prop_fragment_shader"
            @mouseenter="beginShaderRender"
            @mouseout="endShaderRender"
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

import uiSetting from "./ui-setting"
export default {

    name:"nano_shader_toy_renderer_page",
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
            //vue watching data.
            sidePanelPos:{
                mainPanel:{ x: 1050, y: 150 },
                debugPanel:{x:1200, y:400}
            },
            showDebug:false,
            debugContent:[],
            slotID,
            mousePosition:{
                x:0,
                y:0
            },
            then:0,
            time:0,
            requestid:undefined,
            scaleScreen:false,
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
            }
            //canvas lock.
            {
                this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
                    this.canvas.mozRequestPointerLock;

                document.exitPointerLock = document.exitPointerLock ||
                                        document.mozExitPointerLock;
                document.addEventListener('pointerlockchange', this.lockChange, false);
                document.addEventListener('mozpointerlockchange', this.lockChange, false);
            }
            this.requestFrame();
        },
        Render(timestep){
            if(!timestep) return;
            //time.
            let elapsedTime;
            {
                this.requestId = undefined;
                timestep *= 0.001;  
                elapsedTime = Math.min(timestep - this.then, 0.1);
                this.time += elapsedTime;
                this.then = timestep;
            }

            const gl = this.gl;
            HNWUEngine.resizeCanvasToDisplaySize(gl.canvas);
            this.debugContent = [];
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(this.program);

            this.$emit("Render");
            HNWUEngine.setBuffersAndAttributes(gl, this.attribSetters, this.bufferInfo);
            HNWUEngine.setUniforms(this.uniformSetters, this.uniformsData);
            

            this.drawBufferInfo(gl,this.bufferInfo);
            this.debugLog("FPS","Current fps: "+ Math.floor(1 / (elapsedTime)));
            this.requestFrame();
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
        getMousePosition(){
            return this.mousePosition;
        },
        getTime(){
            return this.time;
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
        requestFrame() {
            if (!this.requestId) {
                this.requestId = requestAnimationFrame(this.Render);
            }
        },
        cancelFrame() {
            if (this.requestId) {
                cancelAnimationFrame(this.requestId);
                this.requestId = undefined;
            }
        },
        beginShaderRender(){
            document.onkeypress= (e)=>{e.preventDefault();this.handleKeyPress(e);};
            document.addEventListener("mousemove",this.setMousePosition,false)
            this.requestFrame();
        },
        endShaderRender(){

            if (document.pointerLockElement === this.canvas ||
                document.mozPointerLockElement === this.canvas) {
            }else{
                document.removeEventListener("mousemove",this.setMousePosition,false)
                document.onkeypress = null;
                this.cancelFrame()
            }
        },
        
        setMousePosition(e) {
            const rect = this.$refs.nanoCanvas.$refs.canvas.getBoundingClientRect();
            if (document.pointerLockElement === this.canvas ||
                document.mozPointerLockElement === this.canvas) {
                    this.mousePosition.x += e.movementX;
                    this.mousePosition.y += e.movementY;
            }else{
                this.mousePosition.x = e.clientX + - rect.left;
                this.mousePosition.y = rect.height  - (e.clientY - rect.top) - 1;
            }
  
        },
        handleKeyPress(e){
            //space.
            if(e.keyCode == 32){
                this.canvas.requestPointerLock();

            }

        },
        lockChange(){
            if (document.pointerLockElement === this.canvas ||
                document.mozPointerLockElement === this.canvas) {
                    this.scaleScreen = true;
            }else{
                this.scaleScreen = false;
            }
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