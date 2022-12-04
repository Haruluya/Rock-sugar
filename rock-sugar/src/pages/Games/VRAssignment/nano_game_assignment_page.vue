<template>
    <div class="pageContainer" :style="{backgroundImage:'url('+BgImg + ')'}">
        <div class="webglContainer" id="canvasSlot" >
            <div ref="nanoCanvasContainer">
                <nano_canvas ref="nanoCanvas"
                />
                <div class="effect"
                    @mouseenter="beginGameRender"
                    @mouseout="endGameRender">
                    <div class="screenUi" v-if="showScene1UI"
                    >
                        <section class="title" data-heading="VRAssignment">
                            VRAssignment
                        </section>
                        <div class="buttons">
                            <div class="button" @click="carInfo">
                                Car Information
                                <svg t="1667261923908" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2961" width="32" height="32"><path d="M512 947.2c-12.8 0-19.2-6.4-25.6-12.8L6.4 233.6C0 224 0 211.2 6.4 201.6c6.4-9.6 16-16 28.8-16H992c19.2 0 32 12.8 32 32s-12.8 32-32 32H96L515.2 864l291.2-368c9.6-12.8 32-16 44.8-6.4s16 32 6.4 44.8l-320 403.2c-6.4 6.4-16 9.6-25.6 9.6z" fill="#ffffff" p-id="2962"></path></svg>
                            </div>
                            <div class="button" @click="freePerspective">
                                Free Perspective
                                <svg t="1667261923908" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2961" width="32" height="32"><path d="M512 947.2c-12.8 0-19.2-6.4-25.6-12.8L6.4 233.6C0 224 0 211.2 6.4 201.6c6.4-9.6 16-16 28.8-16H992c19.2 0 32 12.8 32 32s-12.8 32-32 32H96L515.2 864l291.2-368c9.6-12.8 32-16 44.8-6.4s16 32 6.4 44.8l-320 403.2c-6.4 6.4-16 9.6-25.6 9.6z" fill="#ffffff" p-id="2962"></path></svg>
                            </div>
                            <div class="button" @click="startRacing">
                                Start Racing
                                <svg t="1667261923908" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2961" width="32" height="32"><path d="M512 947.2c-12.8 0-19.2-6.4-25.6-12.8L6.4 233.6C0 224 0 211.2 6.4 201.6c6.4-9.6 16-16 28.8-16H992c19.2 0 32 12.8 32 32s-12.8 32-32 32H96L515.2 864l291.2-368c9.6-12.8 32-16 44.8-6.4s16 32 6.4 44.8l-320 403.2c-6.4 6.4-16 9.6-25.6 9.6z" fill="#ffffff" p-id="2962"></path></svg>
                            </div>
                        </div>
                        <div class="carInfo" 
                            data-content="
                                Lamborghini, the design of the Terzo Millennio is very special, 
                                even provocative. The pencil stroke of its bodywork is exceptional, 
                                but what is even more so is its on-board technology.
                                 Indeed, the technological content of the Terzo Millennio revolves around four pillars which are energy, material innovation, 
                                 the powertrain and vehicle architecture and, finally, sound and emotion"
                            v-if="showCarInfo"
                        >
                            !
                        </div>
                        <div class="author">
                            Haruluya 1.0.0
                        </div>
                    </div>
                    <div class="screenUi" v-if="showScene2UI">
                        <section class="title" data-heading="Racing">
                            Racing
                        </section>
                        <div class="buttons">
                            <div class="button" @click="endRacing">
                                End Racing
                                <svg t="1667261923908" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2961" width="32" height="32"><path d="M512 947.2c-12.8 0-19.2-6.4-25.6-12.8L6.4 233.6C0 224 0 211.2 6.4 201.6c6.4-9.6 16-16 28.8-16H992c19.2 0 32 12.8 32 32s-12.8 32-32 32H96L515.2 864l291.2-368c9.6-12.8 32-16 44.8-6.4s16 32 6.4 44.8l-320 403.2c-6.4 6.4-16 9.6-25.6 9.6z" fill="#ffffff" p-id="2962"></path></svg>
                            </div>
                        </div>
                        <div class="author">
                            Haruluya 1.0.0
                        </div>
                    </div>
                    <div class="loadingPage" v-if="loading">
                        <div class="loading">
                            <div class="loader__bar"></div>
                            <div class="loader__bar loader__bar--delay-1"></div>
                            <div class="loader__bar loader__bar--delay-2"></div>
                            <div class="loader__bar loader__bar--delay-3"></div>
                            <div class="loader__bar loader__bar--delay-4"></div>
                            <div class="loader__bar loader__bar--delay-5"></div>
                        </div>
                        <div class="label">
                            Rendering...
                        </div>
                    </div>
                    <nano_canvas ref="effectCanvas"
                    prop_canvas_id="effectCanvas"
                    />
                </div>

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
                    :prop_ui_setter="uiSetter"
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

//skybox resources.
import skyboxFragmentShader from './resource/skybox-fragment-shader.js'
import skyboxVertexShader from './resource/skybox-vertex-shader.js'
import skyboxData from './resource/skybox-data.js'
import screenSnowVertexShader from './resource/screen-snow-vertex-shader'
import screenSnowFragmentShader from './resource/screen-snow-fragment-shader'

//model parse.
import NanoObjParse from "_pages/Webgl/HNWUEngine/ModelParse.js"
import uiSetting from './ui-setting'

//components.
import FirstPersonCamera from '_pages/Webgl/HNWUEngine/components/FirstPersonCamera.js'
import NanoPageUtils from "_utils/NanoPageUtils"
import CameraAnimationController from './resource/scripts/CameraAnimationController'
import ComponentSetters from './resource/scripts/ComponentSetters'
import GeometryComponent from './resource/scripts/GeometryComponent'
import BgImg from './resource/images/bg.png'
import ViewerCamera from './resource/scripts/ViewerCamera.js'

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
//for screen effect.
const screenPositions = new Float32Array(
    [
    -1, -1,  
     1, -1,
    -1,  1,
    -1,  1, 
     1, -1,
     1,  1,
])


export default {
    name: "nano_game_assignment_page",
    data() {
        return {
            //webgl.
            gl: null,
            effectGL:null,
            canvas: null,
            effectCanvas:null,
            NanoPageUtils,
            cameraComponent: null,
            perspective: {
                aspect: 0,
                fieldOfViewRadians: HNWUEngine.degToRad(60),
                zNear: 0.1,
                zFar: 10000,
            },
            transform: {
                translation: [0, 0, 0],
                rotation: [HNWUEngine.degToRad(180), HNWUEngine.degToRad(200), HNWUEngine.degToRad(0)],
                scale: [1, 1, 1]
            },
            camera: {
                target: [-19.676, 11.2, 12.278],
                position: [-19.667, 11.333, 11.119],
                up: [0, 1, 0]
            },

            //for global scene.
            sceneTransform:{
                translation: [0, 0, 0],
                rotation: [HNWUEngine.degToRad(0), HNWUEngine.degToRad(0), HNWUEngine.degToRad(0)],
                scale: [1, 1, 1]
            },

            //vue watching data.
            sidePanelPos: {
                mainPanel: { x: 1050, y: 150 },
                debugPanel: { x: 1200, y: 400 }
            },
            showDebug: false,
            debugContent: [],
            slotID,
            drawMode: {},
            mousePosition: {
                x: 0,
                y: 0
            },

            //mutiy program.
            geometryComponents: {},
            geometryComponentsSetters: {},
            
            //skybox.
            skyboxTexture: null,
            skyboxComponent: null,

            //screenSnow.
            screenSnowComponent: null,
            showScreenSnow: false,

            //anims.
            cameraAnims:null,

            //time.
            deltaTime: 0,
            then: 0,
            time: 0,

            //ui.
            BgImg,

            //flags.
            mousePosition: {
                x: 0,
                y: 0
            },
            requestid: undefined,
            scaleScreen: false,

            //light.
            lightDirection: [0, 1, -20],
            lightIntensity: [255, 255, 255],

            //scene display.
            showScene1UI: false,
            showScene2UI: false,
            showCarInfo:true,
            loading:true,
            currentVehicleMode:-1,
        };
    },
    mounted() {
        this.Init();
        this.SetUI();
    },
    computed: {
        uiSetter() {
            return [
                {
                    type: "slider-vector",
                    id: "cameraPosition",
                    value: this.camera.position,
                    min: { 0: -200, 1: -200, 2: -200 },
                    max: { 0: 100, 1: 100, 2: 100 },
                    callback: uiSetting.globalUiCallbacks.updateArray3(this.camera, this.beginGameRender, "position")
                },
                {
                    type: "slider-vector",
                    id: "cameraTarget",
                    value: this.camera.target,
                    min: { 0: -200, 1: -200, 2: -200 },
                    max: { 0: 100, 1: 100, 2: 100 },
                    callback: uiSetting.globalUiCallbacks.updateArray3(this.camera, this.beginGameRender, "target")
                },
                {
                    type: "slider-vector",
                    id: "lightDirection",
                    value: this.lightDirection,
                    min: { 0: -200, 1: -200, 2: -200 },
                    max: { 0: 100, 1: 100, 2: 100 },
                    callback: uiSetting.globalUiCallbacks.updateArray3(this, this.beginGameRender, "lightDirection")
                },
                {
                    type: "slider-vector",
                    id: "lightIntensity",
                    value: this.lightIntensity,
                    min: { 0: 0, 1: 0, 2: 0 },
                    max: { 0: 255, 1: 255, 2: 255 },
                    callback: uiSetting.globalUiCallbacks.updateArray3(this, this.beginGameRender, "lightIntensity")
                },

            ];
        }
    },
    props: {
        prop_des_data: {
            type: Object,
            default: {
                category: "None",
                name: "None",
                buttonContent: "None",
                title: "None",
                content: "None"
            },
            required: true
        },
        prop_buttons_callback:{
            type:Object,
            default:{}
        },
    },
    methods: {
        Init() {
            const { gl, canvas } = HNWUEngine.initWebglContext("canvas");
            const effect = HNWUEngine.initWebglContext("effectCanvas")

            this.gl = gl;
            this.canvas = canvas;
            this.effectGL = effect.gl;
            this.effectCanvas = effect.canvas;
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
                document.addEventListener("pointerlockchange", this.lockChange, false);
                document.addEventListener("mozpointerlockchange", this.lockChange, false);
            }
            this.requestFrame();
        },
        Render(timestep) {
            if (!timestep)
                return;
            //time.
            let elapsedTime;
            {
                this.requestId = undefined;
                timestep *= 0.001;
                elapsedTime = Math.min(timestep - this.then, 0.1);
                this.time += elapsedTime;
                this.then = timestep;
                //temp.
                window.deltaTime = elapsedTime * 1000;
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
            if (this.skyboxTexture) {
                this.renderSkybox();
            }

            //rending components.
            Object.values(this.geometryComponents).forEach(component => {
                component.addUniform("u_world", this.getWorldMatrix(component.getTransform()));
                component.update();
                this.drawGeometryComponent(component);
            });

            {
                this.debugLog("FPS", "Current fps: " + Math.floor(1 / (elapsedTime)));
                this.debugLog("Camera", "CameraPosition: " + this.camera.position[0] + "\n"
                    + this.camera.position[1] + "\n" + this.camera.position[2] + "\n");
                this.debugLog("Camera", "CameraTarget: " + this.camera.target[0] + "\n"
                    + this.camera.target[1] + "\n" + this.camera.target[2] + "\n");
                this.debugLog("Current vehicle mode: ", this.currentVehicleMode);
                this.debugLog("Light", "lightDirection: " + this.lightDirection[0] + "\n"
                    + this.lightDirection[1] + "\n" + this.lightDirection[2] + "\n");
                this.debugLog("Light", "lightIntensity: " + this.lightIntensity[0] + "\n"
                    + this.lightIntensity[1] + "\n" + this.lightIntensity[2] + "\n");
            }

            //effect.
            if (this.showScreenSnow) {
                this.gl = this.effectGL;
                this.renderScreenSnowEffect();
                this.gl = gl;
            }

            this.requestFrame();
        },
        Destroy() {
            NanoPageUtils.destroy();
        },
        SetUI() {
            NanoPageUtils.setDefaultUI(this.slotID);
        },
        pageCallback() {
            return {
                handleClick: () => {
                    window.location.href =
                        "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/Games/" + this.prop_des_data.name + "/index.vue";
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
        getGL() {
            return this.gl;
        },
        getCanvas() {
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
        beginGameRender() {
            document.onkeypress = (e) => { e.preventDefault(); this.handleKeyPress(e); };
            this.requestFrame();
        },
        endGameRender() {
            if (document.pointerLockElement === this.canvas ||
                document.mozPointerLockElement === this.canvas) {
            }
            else {
                // document.removeEventListener("mousemove",this.setMousePosition,false)
                document.onkeypress = null;
                this.cancelFrame();
            }
        },
        handleKeyPress(e) {
            //space.
            if (e.keyCode == 32) {
                this.canvas.requestPointerLock();
            }
            //z.
            if (e.keyCode == 122){
                if(this.currentVehicleMode == 0){
                    this.camera.position[1] -= 1.5;
                    this.camera.position[2] += 2.57;
                    this.currentVehicleMode = 1;
                }else if(this.currentVehicleMode == 1){
                    this.camera.position[1] += 1.5;
                    this.camera.position[2] -= 2.57;
                    this.currentVehicleMode = 0;
                }
            }
        },
        lockChange() {
            if (document.pointerLockElement === this.canvas ||
                document.mozPointerLockElement === this.canvas) {
                this.scaleScreen = true;
            }
            else {
                this.scaleScreen = false;
            }
        },
        setMousePosition(e) {
            const rect = this.$refs.nanoCanvas.$refs.canvas.getBoundingClientRect();
            if (document.pointerLockElement === this.canvas ||
                document.mozPointerLockElement === this.canvas) {
                this.mousePosition.x += e.movementX;
                this.mousePosition.y += e.movementY;
            }
            else {
                this.mousePosition.x = e.clientX + -rect.left;
                this.mousePosition.y = rect.height - (e.clientY - rect.top) - 1;
            }
        },
        debugLog(title, content) {
            this.debugContent.push({
                title,
                content
            });
        },
        setCamera(type) {
            if(type == "firstPerson"){
                this.cameraComponent = new FirstPersonCamera(this.$refs.nanoCanvasContainer, this.camera, this.Render);
                this.cameraComponent.load();
            }else if(type == "viewer"){
                this.cameraComponent = new ViewerCamera(this.canvas,this.camera);
                this.cameraComponent.load();
            }else if(type == "vehicle"){
                this.cameraComponent.unload();
                this.cameraComponent = null;
            }
           

        },
        caculateMVPMatrix(perspective, camera, transform) {
            let cameraMatrix = HNWUEngine.lookAt(camera.position, camera.target, camera.up);
            let viewMatrix = HNWUEngine.inverse(cameraMatrix);
            // let projectionMatrix = HNWUEngine.perspective(
            //     perspective.fieldOfViewRadians, 
            //     perspective.aspect, 
            //     perspective.zNear, 
            //     perspective.zFar
            //     );
            let projectionMatrix = HNWUEngine.orthographic(0, this.canvas.width, 0, this.canvas.height, 0, 10000);
            let viewProjectionMatrix = HNWUEngine.multiply3d(projectionMatrix, viewMatrix);
            let worldMatrix = HNWUEngine.getTransformMatrix(HNWUEngine.xRotation(0), transform);
            let worldViewProjectionMatrix = HNWUEngine.multiply3d(viewProjectionMatrix, worldMatrix);
            return worldViewProjectionMatrix;
        },
        createCameraAnims(anims){
            this.cameraAnims = new CameraAnimationController(anims,this.camera);
            return this.cameraAnims;
        },
        setObjectToScreenCenter(geometries) {
            const extents = NanoObjParse.getGeometriesExtents(geometries);
            const range = HNWUEngine.subtractVectors(extents.max, extents.min);
            let objOffset = HNWUEngine.scaleVector(HNWUEngine.addVectors(extents.min, HNWUEngine.scaleVector(range, 0.5)), -1);
            const center = HNWUEngine.scaleVector(HNWUEngine.addVectors(extents.max, extents.min), 0.5);
            return center;
        },
        createProgram(vertexShaderSource, fragmentShaderSource) {
            return HNWUEngine.createProgramFromShaderSource(this.gl, vertexShaderSource, fragmentShaderSource);
        },
        addGeometryComponent(geometryComponent) {
            this.geometryComponents[geometryComponent.name] = geometryComponent;
        },
        drawGeometryComponent(component) {
            const gl = this.gl;
            gl.useProgram(component.getProgram());
            const setter = this.geometryComponentsSetters[component.name];
            //set setters.
            HNWUEngine.setBuffersAndAttributes(this.gl, setter.getAttribSetters(), setter.getBufferInfo());
            HNWUEngine.setUniforms(setter.getUniformSetters(), component.getUnifromData());
            const bufferInfo = setter.getBufferInfo();
            const indices = bufferInfo.indices;
            const primitiveType = gl.TRIANGLES;
            const numElements = bufferInfo.numElements;
            const offset = 0;
            if (indices) {
                gl.drawElements(primitiveType, numElements, gl.UNSIGNED_SHORT, offset);
            }
            else {
                gl.drawArrays(primitiveType, offset, numElements);
            }
        },
        addScreenSnowEffect() {
            const gl = this.gl;
            this.gl = this.effectGL;
            const program = this.createProgram(screenSnowVertexShader, screenSnowFragmentShader);
            const geometryComponent = new GeometryComponent(this.gl,"screenSnow", program);
            geometryComponent.addBuffer("position", { numComponents: 2, data: screenPositions });
            this.screenSnowComponent = geometryComponent;
            this.createComponentSetter(this.screenSnowComponent);
            this.showScreenSnow = true;
            this.gl = gl;
        },
        renderScreenSnowEffect() {
            const canvasRect = [this.gl.canvas.width, this.gl.canvas.height];
            this.screenSnowComponent.addUniform("iResolution", canvasRect);
            this.screenSnowComponent.addUniform("iTime", this.time);
            this.drawGeometryComponent(this.screenSnowComponent);
        },
        //add skybox in scene.
        addSkybox(imgList) {
            const gl = this.gl;
            const skyboxData = this.faceInfos(gl, imgList);
            const program = this.createProgram(skyboxVertexShader, skyboxFragmentShader);
            const geometryComponent = new GeometryComponent(gl,"skybox", program);
            geometryComponent.addBuffer("position", { numComponents: 2, data: skyboxPosition });
            this.skyboxComponent = geometryComponent;
            this.createComponentSetter(this.skyboxComponent);
            this.skyboxTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.skyboxTexture);
            skyboxData.forEach((e, i) => {
                const { target, url } = e;
                const level = 0;
                const internalFormat = gl.RGBA;
                const format = gl.RGBA;
                const type = gl.UNSIGNED_BYTE;
                // gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
                // Asynchronously load an image
                const image = new Image();
                image.src = url;
                image.addEventListener("load", () => {
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.skyboxTexture);
                    gl.texImage2D(target, level, internalFormat, format, type, image);
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                });
            });
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        },
        faceInfos(gl, skyboxImgs) {
            return [
                {
                    target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                    url: skyboxImgs["right"],
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                    url: skyboxImgs["left"],
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                    url: skyboxImgs["up"],
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                    url: skyboxImgs["down"],
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                    url: skyboxImgs["back"],
                },
                {
                    target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                    url: skyboxImgs["front"],
                },
            ];
        },
        renderSkybox() {
            const gl = this.gl;
            let viewMatrix = this.getViewMatrix();
            let projectionMatrix = this.getProjectionMatrix();
            let viewDirectionMatrix = HNWUEngine.copy(viewMatrix);
            viewDirectionMatrix[12] = 0;
            viewDirectionMatrix[13] = 0;
            viewDirectionMatrix[14] = 0;
            let viewDirectionProjectionMatrix = HNWUEngine.multiply3d(projectionMatrix, viewDirectionMatrix);
            let viewDirectionProjectionInverseMatrix = HNWUEngine.inverse(viewDirectionProjectionMatrix);
            this.skyboxComponent.addUniform("u_viewDirectionProjectionInverse", viewDirectionProjectionInverseMatrix);
            this.skyboxComponent.addUniform("u_skybox", this.skyboxTexture);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            this.drawGeometryComponent(this.skyboxComponent);
            gl.depthFunc(gl.LESS);
        },
        getProjectionMatrix() {
            return HNWUEngine.perspective(this.perspective.fieldOfViewRadians, this.perspective.aspect, this.perspective.zNear, this.perspective.zFar);
        },
        getViewMatrix() {
            let cameraMatrix = HNWUEngine.lookAt(this.camera.position, this.camera.target, this.camera.up);
            let viewMatrix = HNWUEngine.inverse(cameraMatrix);
            return viewMatrix;
        },
        getWorldMatrix(transform, objOffset) {
            let worldMatrix = HNWUEngine.getTransformMatrix(HNWUEngine.yRotation(0), transform);
            worldMatrix = HNWUEngine.getTransformMatrix(worldMatrix,this.sceneTransform); 
            if (objOffset) {
                worldMatrix = HNWUEngine.translate3d(worldMatrix, ...objOffset);
            }
            return worldMatrix;
        },
        getCameraData() {
            return this.camera;
        },
        setSharedUniforms(sharedUniforms) {
            Object.values(this.geometryComponents).forEach(element => {
                Object.entries(sharedUniforms).forEach(([key, value]) => {
                    element.addUniform(key, value);
                });
            });
        },
        createComponentSetter(component) {
            let bufferInfo = HNWUEngine.createBufferInfoFromArrays(this.gl, component.getBufferData());
            let attribSetters = HNWUEngine.createAttributeSetters(this.gl, component.getProgram());
            let uniformSetters = HNWUEngine.createUniformSetters(this.gl, component.getProgram());
            this.geometryComponentsSetters[component.name] =
                new ComponentSetters(component.name, bufferInfo, attribSetters, uniformSetters);
        },

        clearComponents(){
            this.geometryComponents = {},
            this.geometryComponentsSetters = {};
        },
        
        //scene logical fuctions.
        carInfo(){
            this.prop_buttons_callback.carInfo();
        },
        freePerspective(){  
            console.log(this.prop_buttons_callback,"S")
            this.prop_buttons_callback.freePerspective();
        },
        startRacing(){ 
            this.prop_buttons_callback.startRacing();
        },
        endRacing(){ 
            this.prop_buttons_callback.endRacing();
        },
        showLoadingPage(){
            this.loading = true;
        }

    },
    unmounted() {
        this.Destroy();
    },
}

</script>
<style lang="less" scoped>
@import "./index.less";
</style>