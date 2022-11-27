<template>
    <div class="pageContainer" :style="{backgroundImage:'url('+BgImg + ')'}">
        <div class="webglContainer" id="canvasSlot" >
            <div ref="nanoCanvasContainer">
                <nano_canvas ref="nanoCanvas"
                @mouseenter="beginGameRender"
                @mouseout="endGameRender"
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
                @mousedown="NanoPageUtils.panelDrag(this.sidePanelPos,'mainPanel',$event)" >
                <nano_param_panel
                    :prop_ui_setter="prop_ui_setter"
                    :prop_panel_slot_id="slotID.MAIN_PANEL_SLOT_ID"
                    :prop_debug_slot_id="slotID.DEBUG_OUT_SLOT_ID"
                    @showDebug="pageCallback().showDebugPanel"
                    @updateSlot="NanoPageUtils.updateSlot"
                />
            </div>
            <transition name="debugPanelTransition">
                <div class="debugPanel"
                    v-show="showDebug"
                    :style="{left:sidePanelPos.debugPanel.x + 'px',top:sidePanelPos.debugPanel.y + 'px'}"
                    @mousedown="NanoPageUtils.panelDrag(this.sidePanelPos,'debugPanel',$event)">
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
import NanoObjParse from "_pages/Webgl/HNWUEngine/ModelParse.js"

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
import FirstPersonCamera from '_pages/Webgl/HNWUEngine/components/FirstPersonCamera.js'
import NanoPageUtils from "_utils/NanoPageUtils"
import {ComponentSetters,GeometryComponent} from "./resource/utils.js"
import BgImg from './resource/images/bg.png'
export default {

    name:"nano_game_assignment_page",
    data() {
        return {
            gl:null,
            canvas:null,
            NanoPageUtils,

            cameraComponent:null,

            perspective:{
                aspect:0,
                fieldOfViewRadians: HNWUEngine.degToRad(60),
                zNear: 1,
                zFar: 2000,
            },
            transform:{
                translation:[0, 0, 0],
                rotation:[HNWUEngine.degToRad(180), HNWUEngine.degToRad(200), HNWUEngine.degToRad(0)],
                scale:[1,1,1]
            },
            camera:{
                target:[0, 0, 0],
                position:[0, 0, 2],
                up:[0,1,0]
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
            geometryComponents:{},
            geometryComponentsSetters:{},

            //skybox.
            skyboxTexture:null,
            skyboxComponent:null,

            //time.
            deltaTime:0,
            then:0,
            time:0,
            //ui.
            BgImg,
            //flags.
            mousePosition:{
                x:0,
                y:0
            },
            requestid:undefined,
            scaleScreen:false,

            
        }
    },

    mounted(){
        this.Init();
        this.SetUI();
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
    methods:{
        Init(){
            const { gl, canvas } = HNWUEngine.initWebglContext("canvas");
            this.gl = gl;
            this.canvas = canvas;
             //set aspect.
            this.perspective.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
            
            this.$emit("Init");

            //create setters.
            Object.values(this.geometryComponents).forEach((component) => {
                this.createComponentSetter(component);
            });

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

                //temp.
                window.deltaTime = elapsedTime*1000;
            }

            {
                this.debugContent = [];
            }

            const gl = this.gl;
            HNWUEngine.resizeCanvasToDisplaySize(gl.canvas);

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);

            this.$emit("Render");

            // if skybox open, render skybox.
            if (this.skyboxTexture){
                this.renderSkybox();
            }


            //rending components.
            Object.values(this.geometryComponents).forEach(component=>{
                component.addUniform("u_world",this.getWorldMatrix(component.getTransform()));
                component.update();
                this.drawGeometryComponent(component);
            })

            this.debugLog("FPS","Current fps: "+ Math.floor(1 / (elapsedTime)));
            this.requestFrame();
        },
        Destroy() {
            NanoPageUtils.destroy();
        },
        SetUI(){
            NanoPageUtils.setDefaultUI(this.slotID);
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
                            NanoPageUtils.setDebugPanelCon(this.slotID);
                            NanoPageUtils.nodeLines.debugPanelLine.show("draw");
                        });
                    }
                    else {
                        NanoPageUtils.nodeLines.debugPanelLine.hide("draw");
                        NanoPageUtils.nodeLines.debugPanelLine.remove();
                        NanoPageUtils.nodeLines.debugPanelLine = null;
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
        beginGameRender(){
            document.onkeypress= (e)=>{e.preventDefault();this.handleKeyPress(e);};
            this.requestFrame();
        },
        endGameRender(){

            if (document.pointerLockElement === this.canvas ||
                document.mozPointerLockElement === this.canvas) {
            }else{
                // document.removeEventListener("mousemove",this.setMousePosition,false)
                document.onkeypress = null;
                this.cancelFrame()
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
        debugLog(title,content){
            this.debugContent.push({
                title,
                content
            })
        },
        setFirstPersonCamera(component){
            const cameraComponent = new FirstPersonCamera(this.$refs.nanoCanvasContainer,this.camera,this.Render);
            cameraComponent.load(); 
            component.addComponent("FirstPersonCamera",cameraComponent);
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
        setObjectToScreenCenter(geometries){
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
        createProgram(vertexShaderSource,fragmentShaderSource){
            return HNWUEngine.createProgramFromShaderSource(this.gl, vertexShaderSource,fragmentShaderSource);
        },
        addGeometryComponent(geometryComponent){
            this.geometryComponents[geometryComponent.name] = geometryComponent;
        },
        drawGeometryComponent(component) {
            const gl = this.gl;
            gl.useProgram(component.getProgram());
            const setter = this.geometryComponentsSetters[component.name];
            //set setters.
            HNWUEngine.setBuffersAndAttributes(this.gl, setter.getAttribSetters(),setter.getBufferInfo());
            HNWUEngine.setUniforms(setter.getUniformSetters(),component.getUnifromData());
            const bufferInfo = setter.getBufferInfo();
            const indices = bufferInfo.indices;
            const primitiveType = gl.TRIANGLES;
            const numElements = bufferInfo.numElements;
            const offset = 0;
            if (indices) {
                gl.drawElements(primitiveType, numElements, gl.UNSIGNED_SHORT, offset);
            } else {
                gl.drawArrays(primitiveType, offset, numElements);
            }
        },
        //add skybox in scene.
        addSkybox(imgList){
            const gl = this.gl;
            const skyboxData = this.faceInfos(gl,imgList);
            const program = this.createProgram(skyboxVertexShader,skyboxFragmentShader);
            const geometryComponent = new GeometryComponent("skybox",program);
            geometryComponent.addBuffer("position",{numComponents:2,data:skyboxPosition});
            this.skyboxComponent = geometryComponent;
            this.createComponentSetter(this.skyboxComponent);
            
            this.skyboxTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.skyboxTexture);
            skyboxData.forEach((e,i)=>{
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
                });
            })
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        },
        faceInfos(gl,skyboxImgs){
            return[
                {
                    target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                    url: skyboxImgs['right'],
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                    url: skyboxImgs['left'],
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                    url: skyboxImgs['top'],
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                    url: skyboxImgs['bottom'],
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                    url: skyboxImgs['back'],
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                    url: skyboxImgs['front'],
                },
            ]
        },
        renderSkybox(){
            const gl = this.gl;
            let viewMatrix = this.getViewMatrix();
            let projectionMatrix = this.getProjectionMatrix();
            let viewDirectionMatrix = HNWUEngine.copy(viewMatrix);
            viewDirectionMatrix[12] = 0;
            viewDirectionMatrix[13] = 0;
            viewDirectionMatrix[14] = 0;
            let viewDirectionProjectionMatrix = HNWUEngine.multiply3d(
                projectionMatrix, viewDirectionMatrix);
            let viewDirectionProjectionInverseMatrix =
                HNWUEngine.inverse(viewDirectionProjectionMatrix);

            this.skyboxComponent.addUniform("u_viewDirectionProjectionInverse",viewDirectionProjectionInverseMatrix)
            this.skyboxComponent.addUniform("u_skybox",this.skyboxTexture);

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);

            this.drawGeometryComponent(this.skyboxComponent);
            gl.depthFunc(gl.LESS);
        },
        getProjectionMatrix(){
            return HNWUEngine.perspective(
                this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
            );
        },
        getViewMatrix(){
            let cameraMatrix = HNWUEngine.lookAt(this.camera.position, this.camera.target, this.camera.up);
            let viewMatrix = HNWUEngine.inverse(cameraMatrix);
            return viewMatrix;
        },
        getWorldMatrix(transform,objOffset){

            let worldMatrix = HNWUEngine.getTransformMatrix(
                HNWUEngine.yRotation(0),transform);
            if(objOffset){
                worldMatrix = HNWUEngine.translate3d(worldMatrix,...objOffset);
            }
            return worldMatrix;
        },
        getCameraData(){
            return this.camera;
        },
        setSharedUniforms(sharedUniforms){
           Object.values(this.geometryComponents).forEach(element=>{
                Object.entries(sharedUniforms).forEach(([key,value])=>{
                    element.addUniform(key,value);
                })
            })
        },
        createComponentSetter(component){
            let bufferInfo = HNWUEngine.createBufferInfoFromArrays(this.gl, component.getBufferData())
            let attribSetters  = HNWUEngine.createAttributeSetters(this.gl, component.getProgram());
            let uniformSetters = HNWUEngine.createUniformSetters(this.gl, component.getProgram());
            this.geometryComponentsSetters[component.name] = 
                    new ComponentSetters(component.name,bufferInfo,attribSetters,uniformSetters);
        },
        savaObjToJson(data, filename){
            if(!data) {
                console.error('Console.save: No data')
                return;
            }
            if(!filename) filename = 'data.json'
            if(typeof data === "object"){
                data = JSON.stringify(data, undefined, 4)
            }
            var blob = new Blob([data], {type: 'text/json'}),
                e    = document.createEvent('MouseEvents'),
                a    = document.createElement('a')
            a.download = filename
            a.href = window.URL.createObjectURL(blob)
            a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            a.dispatchEvent(e)
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