<template lang="html">
    <nano_webgl_demo_panel
        :prop_des_data="desData"
        :prop_ui_setter="uiSetter"
        :prop_vertex_shader="vertexShaderSource"
        :prop_fragment_shader="fragmentShaderSource"
        :prop_section_params="sectionParams"
        ref="page"
        @Init="Init"
        @Render="Render"
        @prop_ui_setter="uiSetter"
    />
</template>
<script>
import vertexShaderSource from './resource/vertex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import data from './resource/data.js'
import uiSetting from "../ui-setting"

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
            perspective:{
                aspect:0,
                fieldOfViewRadians:  HNWUEngine.degToRad(60),
                zNear: 1,
                zFar: 2000,
            },
            transform:{
                translation:[0, 0, 0],
                rotation:[HNWUEngine.degToRad(190), HNWUEngine.degToRad(200), HNWUEngine.degToRad(360)],
                scale : [1, 0.8, 1]
            },
            camera:{
                target:[0, 35, 0],
                position:[100, 150, 200],
                up:[0,1,0]
            },
            sectionParams:{
                shininess:10,
                lightRotation:{x:0,y:0},
                lightDirection:[0,0,1],
                lightPosition:{x:40,y:60,z:120},
                innerLimit:21,
                outerLimit:35,
            },

            uiSetter:[]
        }
    },

    methods: {
        Init(){
            this.gl = this.$refs.page.getGL();
            this.canvas = this.$refs.page.getCanvas();
            this.program = this.$refs.page.getProgram();

            //Get bufferinfo and setters.
            this.perspective.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

            this.setPosition();

            const lightPosition = [
                this.sectionParams.lightPosition.x,
                this.sectionParams.lightPosition.y,
                this.sectionParams.lightPosition.z
            ]

            var lmat = HNWUEngine.lookAt(lightPosition, this.camera.target, this.camera.up);
            lmat = HNWUEngine.multiply3d(HNWUEngine.xRotation(this.sectionParams.lightRotation.x), lmat);
            lmat = HNWUEngine.multiply3d(HNWUEngine.yRotation(this.sectionParams.lightRotation.y), lmat);
            this.sectionParams.lightDirection = [-lmat[8], -lmat[9],-lmat[10]];
            
            this.$refs.page.setTransform(this.transform);
            this.$refs.page.addBuffer("position",{data:positions});
            this.$refs.page.addBuffer("color",{data:colors});
            this.$refs.page.addBuffer("normal",{data:normals});
        },
        Render(){
            const gl = this.gl;
            const lightPosition = [
                this.sectionParams.lightPosition.x,
                this.sectionParams.lightPosition.y,
                this.sectionParams.lightPosition.z
            ]

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            let cameraMatrix = HNWUEngine.lookAt(
                this.camera.position, 
                this.camera.target, 
                this.camera.up
                );
            let viewMatrix = HNWUEngine.inverse(cameraMatrix);
            let projectionMatrix = HNWUEngine.perspective(
                this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
                );
            let viewProjectionMatrix = HNWUEngine.multiply3d(projectionMatrix, viewMatrix);

   
            let worldMatrix = HNWUEngine.getTransformMatrix(
                    HNWUEngine.yRotation(0),this.transform);

            // Multiply the matrices.
            let worldViewProjectionMatrix = HNWUEngine.multiply3d(viewProjectionMatrix, worldMatrix);
            let worldInverseMatrix = HNWUEngine.inverse(worldMatrix);
            let worldInverseTransposeMatrix = HNWUEngine.transpose(worldInverseMatrix);

            this.$refs.page.addUniform("u_worldViewProjection",worldViewProjectionMatrix);
            this.$refs.page.addUniform("u_worldInverseTranspose",worldInverseTransposeMatrix);
            this.$refs.page.addUniform("u_world",worldMatrix);
            this.$refs.page.addUniform("u_lightWorldPosition",lightPosition);
            this.$refs.page.addUniform("u_viewWorldPosition",this.camera.position);
            this.$refs.page.addUniform("u_shininess",this.sectionParams.shininess);
            this.$refs.page.addUniform("u_lightDirection",this.sectionParams.lightDirection);
            this.$refs.page.addUniform("u_innerLimit",Math.cos(HNWUEngine.degToRad(this.sectionParams.innerLimit)));
            this.$refs.page.addUniform("u_outerLimit",Math.cos(HNWUEngine.degToRad(this.sectionParams.outerLimit)));

            //update lightDirection.
            var lmat = HNWUEngine.lookAt(
                lightPosition, 
                this.camera.target, 
                this.camera.up
                );

            lmat = HNWUEngine.multiply3d(HNWUEngine.xRotation(this.sectionParams.lightRotation.x), lmat);
            lmat = HNWUEngine.multiply3d(HNWUEngine.yRotation(this.sectionParams.lightRotation.y), lmat);
            this.sectionParams.lightDirection = [-lmat[8], -lmat[9],-lmat[10]];

            this.$refs.page.glDraw({mode:gl.TRIANGLES,first:0,count:16*6})

        },
        setPosition(){
            let matrix = HNWUEngine.xRotation(Math.PI);
            matrix = HNWUEngine.translate3d(matrix, -50, -75, -15);

            for (let ii = 0; ii < positions.length; ii += 3) {
                let vector = HNWUEngine.transformPoint(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
                positions[ii + 0] = vector[0];
                positions[ii + 1] = vector[1];
                positions[ii + 2] = vector[2];
            }
        },

    },
    mounted() {
        this.uiSetter = [
                {
                    type: "slider", id: "shininess", value: this.sectionParams.shininess, min: 0, max: 20,
                    callback: uiSetting.globalUiCallbacks.updateValue(this.sectionParams,this.$refs.page.Render, "shininess")
                },
                {
                    type: "slider", id: "innerLimit", value: this.sectionParams.innerLimit, min: 0, max: 50,
                    callback: uiSetting.globalUiCallbacks.updateValue(this.sectionParams,this.$refs.page.Render, "innerLimit")
                },
                {
                    type: "slider", id: "outerLimit", value: this.sectionParams.outerLimit, min: 0, max: 100,
                    callback: uiSetting.globalUiCallbacks.updateValue(this.sectionParams,this.$refs.page.Render, "outerLimit")
                },

                { 
                    type: "slider-vector", id: "lightRotation" , value: this.sectionParams.lightRotation, min: { x: -100, y: -100 }, max: { x: 100, y: 100 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(this.sectionParams, this.$refs.page.Render, "lightRotation")
                },
                
                { 
                    type: "slider-vector", id: "lightPosition" , value: this.sectionParams.lightPosition, min: { x: -100, y: -100,z:-100 }, max: { x: 100, y: 100,z:100 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(this.sectionParams, this.$refs.page.Render, "lightPosition")
                },
            ]
    },
}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>
