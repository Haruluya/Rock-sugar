<template>
    <div class="pageContainer">
        <div class="webglContainer" id="canvasSlot">
            <nano_canvas ref="nanoCanvas"
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
import skyboxFragmentShader from './resource/skybox-fragment-shader.js'
import skyboxVertexShader from './resource/skybox-vertex-shader.js'
import skyboxData from './resource/skybox-data.js'
/*
    @author:haruluya.
    @des:This component is used to make the source code more concise.
*/
const skyboxPosition = skyboxData.position;

const slotID = {
    MAIN_PANEL_SLOT_ID : 1,
    DEBUG_IN_SLOT_ID : 2,
    DEBUG_OUT_SLOT_ID : 3,
    CORE_SLOT_TOP_ID : 4
}
import AnimEvent from "_plugins/anim-event/anim-event.min.js"
import uiSetting from "./ui-setting"
export default {

    name:"nano_webgl_scene_panel",
    data() {
        return {
            gl:null,
            canvas:null,
            //{gl-setter.

            //     bufferInfo:null,
            //     attribSetters:null,
            //     uniformSetters:null,
            // }
            bufferData:{},
            uniformsData:{},
            glSetters:{},
            uiSetting,
            perspective:null,
            camera:null,
            transform:{
                translation:[0,0, 0],
                rotation:[haruluya_webgl_utils.degToRad(0), haruluya_webgl_utils.degToRad(0), haruluya_webgl_utils.degToRad(0)],
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
            },
            //mutiy program.
            programList:[],
            shaderList:[],

            //skybox.
            skyboxTexture:null,
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
            const { gl, canvas } = haruluya_webgl_utils.initWebglContext("canvas");
            this.gl = gl;
            this.canvas = canvas;
            this.$emit("Init");
          
            this.programList.forEach(element => {
                let bufferInfo = haruluya_webgl_utils.createBufferInfoFromArrays(this.gl, this.bufferData[element.name]);
                let attribSetters  = haruluya_webgl_utils.createAttributeSetters(this.gl, element.program);
  
                let uniformSetters = haruluya_webgl_utils.createUniformSetters(this.gl, element.program);
                this.glSetters[element.name] = {bufferInfo,attribSetters,uniformSetters};

            });
            // attributes.
            this.Render();
        },
        Render(){
            const gl = this.gl;
            haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            // if skybox open, render skybox.
            if (this.skyboxTexture){
                this.renderSkybox();
            }
            this.$emit("Render");


            if(this.debugLog.length === 0){
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
        addBuffer(name,data,index){
            this.bufferData[index][name] = data;
        },
        addUniform(name,data,index){
            this.uniformsData[index][name] = data;
        },
        getGL(){
            return this.gl;
        },
        getCanvas(){
            return this.canvas;
        },
        getProgram(name){
            let program;
            this.programList.forEach(e=>{
                if (e.name == name){
                    program =  e.program;
                }
            })
            return program;
        },
        glDraw(drawMode){
            this.drawMode = drawMode;
            this.gl.drawArrays(this.drawMode.mode, this.drawMode.first,this.drawMode.count);
        },

        debugLog(title,content){
            this.debugContent.push({
                title,
                content
            })
        },
        set3DViewer(perspective,camera,transform){
            this.perspective = perspective;
            this.camera = camera;
            this.transform = transform
        },
        caculateMVPMatrix(perspective,camera,transform){
            let cameraMatrix = haruluya_webgl_utils.lookAt(camera.position, camera.target, camera.up);
            let viewMatrix = haruluya_webgl_utils.inverse(cameraMatrix);
            let projectionMatrix = haruluya_webgl_utils.perspective(
                perspective.fieldOfViewRadians, 
                perspective.aspect, 
                perspective.zNear, 
                perspective.zFar
                );
            let viewProjectionMatrix = haruluya_webgl_utils.multiply3d(projectionMatrix, viewMatrix);
            let worldMatrix = haruluya_webgl_utils.getTransformMatrix(
                haruluya_webgl_utils.xRotation(0),
                transform
            )
            let worldViewProjectionMatrix = haruluya_webgl_utils.multiply3d(viewProjectionMatrix, worldMatrix);
            return worldViewProjectionMatrix;
        },
        addProgram(name,vertexShaderSource,fragmentShaderSource){
            this.programList.push({name,program:haruluya_webgl_utils.createProgramFromShaderSource(this.gl, vertexShaderSource,fragmentShaderSource)});  
            console.log(this.programList,'program')
            this.glSetters[name] = {};
            this.bufferData[name] = {};
            this.uniformsData[name] = {};
        },

        setSetters(name){
            if(Object.getOwnPropertyNames(this.bufferData[name]).length != 0){
                haruluya_webgl_utils.setBuffersAndAttributes(this.gl, this.glSetters[name].attribSetters,  this.glSetters[name].bufferInfo);
                haruluya_webgl_utils.setUniforms( this.glSetters[name].uniformSetters,  this.uniformsData[name]);
            }
        },
        useProgram(name){
            this.programList.forEach(e=>{
                if(e.name === name){
                    this.gl.useProgram(e.program);
                }
            })
           console.log(this.programList,this.glSetters)
        },
        //add skybox in scene.
        addSkybox(imgList){
            const gl = this.gl;
            this.addProgram("skybox",skyboxVertexShader,skyboxFragmentShader);
            this.addBuffer("position",{numComponents:2,data:skyboxPosition},"skybox");

            this.skyboxTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.skyboxTexture);
            imgList.forEach((e,i)=>{
                const {target, url} = e;
                const level = 0;
                const internalFormat = gl.RGBA;
                const format = gl.RGBA;
                const type = gl.UNSIGNED_BYTE;
                // gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

                // Asynchronously load an image
                const image = new Image();
                image.src = url;
                image.addEventListener('load', ()=>{
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.skyboxTexture);
                    gl.texImage2D(target, level, internalFormat, format, type, image);
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                    if(i === imgList.length-1){
                        this.Render();
                    }
                });
            })
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            
        },
        renderSkybox(){
            const gl = this.gl;
            let cameraMatrix = haruluya_webgl_utils.lookAt(this.camera.position, this.camera.target, this.camera.up);
            let viewMatrix = haruluya_webgl_utils.inverse(cameraMatrix);
            let projectionMatrix = haruluya_webgl_utils.perspective(
                this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
                );
            let viewDirectionMatrix = haruluya_webgl_utils.copy(viewMatrix);
            viewDirectionMatrix[12] = 0;
            viewDirectionMatrix[13] = 0;
            viewDirectionMatrix[14] = 0;
            let viewDirectionProjectionMatrix = haruluya_webgl_utils.multiply3d(
                projectionMatrix, viewDirectionMatrix);
            let viewDirectionProjectionInverseMatrix =
                haruluya_webgl_utils.inverse(viewDirectionProjectionMatrix);
            this.addUniform("u_viewDirectionProjectionInverse",viewDirectionProjectionInverseMatrix,"skybox")
            this.addUniform("u_texture",this.skyboxTexture,"skybox");
            this.useProgram("skybox");
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            this.setSetters("skybox");
            this.glDraw({mode:gl.TRIANGLES,first:0,count:6*6})
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
                this.transform.scale[i] += e.deltaY > 0? 0.15 : -0.15;
            }
            this.Render()
            }
        },

    },
    unmounted(){
        this.Destroy();
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>