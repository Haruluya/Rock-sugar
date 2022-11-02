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
                    <ui id="z"></ui>
                    <ui id="angleX"></ui>
                    <ui id="angleY"></ui>
                    <ui id="angleZ"></ui>
                    <ui id="scaleX"></ui>
                    <ui id="scaleY"></ui>
                    <ui id="scaleZ"></ui>
                    <ui id="shininess"></ui>
                    <ui id="lightColor"></ui>
                    <ui id="fRotation"></ui>
                    <ui id="lightRotationX"></ui>
                    <ui id="lightRotationY"></ui>
                    <ui id="innerLimit"></ui>
                    <ui id="outerLimit"></ui>
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
import vertexShaderSource from './resource/vetex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import data from './resource/data.js'

const desData = {
    category:"Webgl",
    name:"SpotLight",
    buttonContent:"查看源码",
    title:"聚光灯",
    content:"potlight will never be on me."
}




const positions = data.position;
const colors = data.color;
const normals = data.normal;

export default {
    name:'SpotLight',
    data() {
        return {
            gl: null,
            canvas: null,
            program: null,
            vertexShaderSource,
            fragmentShaderSource,
            desData,
            bufferData:{
                position:{data:[]},
                color:{data:colors},
                normal:{data:normals}
            },
            uniformsData:{
                u_shininess:null,
                u_lightDirection:null,
                u_innerLimit:null,
                u_outerLimit:null,
                u_lightWorldPosition:null,
                u_viewWorldPosition:null,
                u_world:null,
                u_worldViewProjection:null,
                u_worldInverseTranspose:null,

            },
            bufferInfo:null,
            uniformSetters:null,
            attribSetters:null,
            transfrom:{
                translation:[0, 0, 0],
                rotation:[haruluya_webgl_utils.degToRad(190), haruluya_webgl_utils.degToRad(200), haruluya_webgl_utils.degToRad(360)],
                scale : [1, 0.8, 1]
            },
            perspective:{
                aspect:0,
                fieldOfViewRadians:  haruluya_webgl_utils.degToRad(60),
                zNear: 1,
                zFar: 2000,
            },
            sectionParams:{
                shininess:10,
                lightRotationX:0,
                lightRotationY:0,
                lightDirection:[0,0,1],
                lightColor:null,
                lightPosition:[40, 60, 120],
                innerLimit:haruluya_webgl_utils.degToRad(21),
                outerLimit:haruluya_webgl_utils.degToRad(35),
            },
            camera:{
                target:[0, 35, 0],
                position:[100, 150, 200],
                up:[0,1,0]
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
            this.perspective.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

            this.setPosition();

            var lmat = haruluya_webgl_utils.lookAt(this.sectionParams.lightPosition, this.camera.target, this.camera.up);
            lmat = haruluya_webgl_utils.multiply3d(haruluya_webgl_utils.xRotation(this.sectionParams.lightRotationX), lmat);
            lmat = haruluya_webgl_utils.multiply3d(haruluya_webgl_utils.yRotation(this.sectionParams.lightRotationY), lmat);
            this.sectionParams.lightDirection = [-lmat[8], -lmat[9],-lmat[10]];

            this.bufferInfo = haruluya_webgl_utils.createBufferInfoFromArrays(gl, this.bufferData);
            this.uniformSetters = haruluya_webgl_utils.createUniformSetters(gl, this.program);
            this.attribSetters  = haruluya_webgl_utils.createAttributeSetters(gl, this.program);
            this.Render();
        },
        Render(){
            const gl = this.gl;
            const program = this.program;
            haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            gl.useProgram(program);

            haruluya_webgl_utils.setBuffersAndAttributes(gl, this.attribSetters, this.bufferInfo);
            let cameraMatrix = haruluya_webgl_utils.lookAt(this.camera.position, this.camera.target, this.camera.up);
            let viewMatrix = haruluya_webgl_utils.inverse(cameraMatrix);
            let projectionMatrix = haruluya_webgl_utils.perspective(
                this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
                );
            let viewProjectionMatrix = haruluya_webgl_utils.multiply3d(projectionMatrix, viewMatrix);

   
            let worldMatrix = haruluya_webgl_utils.getTransformMatrix(
                    haruluya_webgl_utils.yRotation(0),this.transfrom);

            // Multiply the matrices.
            let worldViewProjectionMatrix = haruluya_webgl_utils.multiply3d(viewProjectionMatrix, worldMatrix);
            let worldInverseMatrix = haruluya_webgl_utils.inverse(worldMatrix);
            let worldInverseTransposeMatrix = haruluya_webgl_utils.transpose(worldInverseMatrix);

            this.uniformsData.u_worldViewProjection = worldViewProjectionMatrix;
            this.uniformsData.u_worldInverseTranspose = worldInverseTransposeMatrix;

            this.uniformsData.u_world = worldMatrix;
            this.uniformsData.u_lightWorldPosition = this.sectionParams.lightPosition;
            this.uniformsData.u_viewWorldPosition = this.camera.position;
            this.uniformsData.u_shininess = this.sectionParams.shininess;
            this.uniformsData.u_lightDirection = this.sectionParams.lightDirection;
            this.uniformsData.u_innerLimit = Math.cos(this.sectionParams.innerLimit);
            this.uniformsData.u_outerLimit = Math.cos(this.sectionParams.outerLimit);

            var lmat = haruluya_webgl_utils.lookAt(this.sectionParams.lightPosition, this.camera.target, this.camera.up);
            lmat = haruluya_webgl_utils.multiply3d(haruluya_webgl_utils.xRotation(this.sectionParams.lightRotationX), lmat);
            lmat = haruluya_webgl_utils.multiply3d(haruluya_webgl_utils.yRotation(this.sectionParams.lightRotationY), lmat);
            this.sectionParams.lightDirection = [-lmat[8], -lmat[9],-lmat[10]];

            haruluya_webgl_utils.setUniforms(this.uniformSetters, this.uniformsData);

            gl.drawArrays(gl.TRIANGLES, 0, 16*6);

        },
        SetUI(){
            const gl = this.gl;
            const Render = this.Render;
            let sectionParams = this.sectionParams;
            // callbacks.

            const updatelightRotationX = function (event, ui) {
                sectionParams.lightRotationX = ui.value;
                Render();
            }

            const updatelightRotationY = function (event, ui) {
                sectionParams.lightRotationY = ui.value;
                Render();
            }

            const updateInnerLimit = function (event, ui) {
                sectionParams.innerLimit = haruluya_webgl_utils.degToRad(ui.value);
                Render();
            }

            const updateOuterLimit = function (event, ui) {
                sectionParams.outerLimit = haruluya_webgl_utils.degToRad(ui.value);
                Render();
            }

            let transform = this.transfrom;

            // transform callback.
            const updatePosition = function (index) {
                return function(event, ui) {
                    transform.translation[index] = ui.value;
                    Render();
                };
            }

            const updateRotation = function (index) {
                return function(event, ui) {
                    const angleInDegrees = ui.value;
                    const angleInRadians = angleInDegrees * Math.PI / 180;
                    transform.rotation[index] = angleInRadians;
                    Render();
                };
            }

            const updateScale = function (index) {
                return function(event, ui) {
                    transform.scale[index] = ui.value;
                    Render();
                };
            }

            const updateShininess = function (event, ui) {
                sectionParams.shininess = ui.value;
                Render();
            }

            const updateLightColor = function (event){
                sectionParams.lightColor = haruluya_webgl_utils.colorToRGB(event.target.value);
                Render();
            }


            // ui.
            haruluya_webgl_utils.setupSlider("lightRotationX", {value: sectionParams.lightRotationX, slide: updatelightRotationX, min: -2, max: 2, precision: 2, step: 0.001});
            haruluya_webgl_utils.setupSlider("lightRotationY", {value: sectionParams.lightRotationY, slide: updatelightRotationY, min: -2, max: 2, precision: 2, step: 0.001});
            haruluya_webgl_utils.setupSlider("innerLimit", {value: haruluya_webgl_utils.radToDeg(sectionParams.innerLimit), slide: updateInnerLimit, min: 0, max: 180});
            haruluya_webgl_utils.setupSlider("outerLimit", {value: haruluya_webgl_utils.radToDeg(sectionParams.outerLimit), slide: updateOuterLimit, min: 0, max: 180});
            haruluya_webgl_utils.setupSlider("shininess", {value: sectionParams.shininess, slide: updateShininess, min: 0, max: 10});
            haruluya_webgl_utils.setupSlider("x", {value: transform.translation[0], slide: updatePosition(0), max: gl.canvas.width });
            haruluya_webgl_utils.setupSlider("y", {value: transform.translation[1], slide: updatePosition(1), max: gl.canvas.height});
            haruluya_webgl_utils.setupSlider("z", {value: transform.translation[2], slide: updatePosition(2), max: gl.canvas.height});
            haruluya_webgl_utils.setupSlider("angleX", {value: haruluya_webgl_utils.radToDeg(transform.rotation[0]), slide: updateRotation(0), max: 360});
            haruluya_webgl_utils.setupSlider("angleY", {value: haruluya_webgl_utils.radToDeg(transform.rotation[1]), slide: updateRotation(1), max: 360});
            haruluya_webgl_utils.setupSlider("angleZ", {value: haruluya_webgl_utils.radToDeg(transform.rotation[2]), slide: updateRotation(2), max: 360});
            haruluya_webgl_utils.setupSlider("scaleX", {value: transform.scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
            haruluya_webgl_utils.setupSlider("scaleY", {value: transform.scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
            haruluya_webgl_utils.setupSlider("scaleZ", {value: transform.scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2});
        },
        Destory(){

        },
        handleClick() {
            window.location.href = "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/WebglDemo/Orthographic/index.vue";
        },
        setPosition(){
            let matrix = haruluya_webgl_utils.xRotation(Math.PI);
            matrix = haruluya_webgl_utils.translate3d(matrix, -50, -75, -15);

            for (let ii = 0; ii < positions.length; ii += 3) {
                let vector = haruluya_webgl_utils.transformPoint(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
                positions[ii + 0] = vector[0];
                positions[ii + 1] = vector[1];
                positions[ii + 2] = vector[2];
            }
            this.bufferData.position = positions;
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
