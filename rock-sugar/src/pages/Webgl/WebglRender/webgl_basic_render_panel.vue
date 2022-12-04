<template>
    <div class="pageContainer">
        <div class="webglContainer" id="canvasSlot" >
            <div ref="nanoCanvasContainer">
                <nano_canvas ref="nanoCanvas"
                @mousedown="viewer"
                @mousewheel="viewer"
                />
            </div>
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
import NanoObjParse from "../HNWUEngine/ModelParse.js"

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
import FirstPersonCamera from '../HNWUEngine/components/FirstPersonCamera.js'
import uiSetting from "./ui-setting"
export default {

    name:"webgl_basic_render_panel",
    data() {
        return {
            gl:null,
            canvas:null,
            bufferData:{},
            uniformsData:{},
            uiSetting,
            perspective:null,
            cameraComponent:null,
            camera:null,
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
            },
            //mutiy program.
            programList:{},
            shaderList:[],

            //skybox.
            skyboxTexture:null,

            componentList:{},
            deltaTime:0,
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
            const { gl, canvas } = HNWUEngine.initWebglContext("canvas");
            this.gl = gl;
            this.canvas = canvas;
            this.$emit("Init");
            Object.entries(this.componentList).forEach((value) => {
                let bufferInfo = HNWUEngine.createBufferInfoFromArrays(this.gl, this.bufferData[value[0]]);
                let attribSetters  = HNWUEngine.createAttributeSetters(this.gl, value[1].program);

                let uniformSetters = HNWUEngine.createUniformSetters(this.gl, value[1].program);
                value[1].bufferInfo = bufferInfo; value[1].attribSetters = attribSetters; value[1].uniformSetters = uniformSetters;
            });
            // attributes.
            this.Render();
        },
        Render(){
            let beginTime = Date.now();
            const gl = this.gl;
            HNWUEngine.resizeCanvasToDisplaySize(gl.canvas);

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
            this.deltaTime = (Date.now() - beginTime)/1000;
            return this.deltaTime;
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

        getGL(){
            return this.gl;
        },
        getCanvas(){
            return this.canvas;
        },
        getComponents(){
            return this.componentList;
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
            this.transform = transform;
            // this.cameraComponent = new FirstPersonCamera(this.$refs.nanoCanvasContainer,this.camera,this.Render,this.deltaTime);
            // this.cameraComponent.load();
            
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
        caculateMVPMatrix(perspective,camera,transform){
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
        },
        setObjectToSceenCenter(geometries){
            const extents = NanoObjParse.getGeometriesExtents(geometries);
            const range = HNWUEngine.subtractVectors(extents.max, extents.min);
            let objOffset = HNWUEngine.scaleVector(
                HNWUEngine.addVectors(
                    extents.min,
                    HNWUEngine.scaleVector(range, 0.5)),
                -1);
            const radius = HNWUEngine.length(range) * 1.2;

            this.camera.position[2] = radius;
            this.perspective.zNear = radius / 100;
            this.perspective.zFar = radius * 3;
            return objOffset;
        },
        addBuffer(name,data,componentName){
            this.bufferData[componentName][name] = data;
        },
        addUniform(name,data,componentName){
            this.uniformsData[componentName][name] = data;
        },
        addProgram(name,vertexShaderSource,fragmentShaderSource){
            this.programList[name] = HNWUEngine.createProgramFromShaderSource(this.gl, vertexShaderSource,fragmentShaderSource);  
        },

        addComponent(programName,componentName){
            this.componentList[componentName] = {
                program:this.programList[programName],
                bufferInfo:{},
                attribSetters:{},
                uniformSetters:{}
            }
            
            this.bufferData[componentName] = {};
            this.uniformsData[componentName] = {};
        },

        setSetters(name){
            if(Object.getOwnPropertyNames(this.bufferData[name]).length != 0){
                HNWUEngine.setBuffersAndAttributes(this.gl, this.componentList[name].attribSetters,  this.componentList[name].bufferInfo);
                HNWUEngine.setUniforms( this.componentList[name].uniformSetters, this.uniformsData[name]);
            }
        },
        drawComponent(componentName,primitiveType, count, offset) {
            const gl = this.gl;
            const bufferInfo = this.componentList[componentName].bufferInfo;
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
        useProgram(program){
            if(program){
                this.gl.useProgram(program)
            }
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
            let cameraMatrix = HNWUEngine.lookAt(this.camera.position, this.camera.target, this.camera.up);
            let viewMatrix = HNWUEngine.inverse(cameraMatrix);
            let projectionMatrix = HNWUEngine.perspective(
                this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
                );
            let viewDirectionMatrix = HNWUEngine.copy(viewMatrix);
            viewDirectionMatrix[12] = 0;
            viewDirectionMatrix[13] = 0;
            viewDirectionMatrix[14] = 0;
            let viewDirectionProjectionMatrix = HNWUEngine.multiply3d(
                projectionMatrix, viewDirectionMatrix);
            let viewDirectionProjectionInverseMatrix =
                HNWUEngine.inverse(viewDirectionProjectionMatrix);
            this.addUniform("u_viewDirectionProjectionInverse",viewDirectionProjectionInverseMatrix,"skybox")
            this.addUniform("u_texture",this.skyboxTexture,"skybox");
            this.useProgram("skybox");
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            this.setSetters("skybox");
            this.glDraw({mode:gl.TRIANGLES,first:0,count:6*6})
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