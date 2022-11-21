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
    name:"LightingPoint",
    buttonContent:"查看源码",
    title:"点光源",
    content:"Point light source illuminates the world and causes shadows."
}

const positions = data.position;
const colors = data.color;
const normals = data.normal;


export default {
    name:'LightingPoint',
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
                fieldOfViewRadians:  haruluya_webgl_utils.degToRad(60),
                zNear: 1,
                zFar: 2000,
            },
            transform:{
                translation:[100, 120, -20],
                rotation:[haruluya_webgl_utils.degToRad(180), haruluya_webgl_utils.degToRad(200), haruluya_webgl_utils.degToRad(0)],
                scale:[1,.7,.7]
            },
            camera:{
                target:[0, 35, 0],
                position:[100, 150, 200],
                up:[0,1,0]
            },
            sectionParams:{
                lightColor:{r:1,g:1,b:1},
                specularColor:{r:1,g:1,b:1},
                shininess:10,
                lightPosition:{x:0,y:0,z:120},
            },
            page:null,
            uiSetter:[]
        }
    },
    methods: {
        Init(){
            this.page = this.$refs.page;
            this.gl = this.page.getGL();
            this.canvas = this.page.getCanvas();
            this.program = this.page.getProgram();

            //Get bufferinfo and setters.
            this.perspective.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

            this.page.setTransform(this.transform);

            this.page.addBuffer("position",{data:positions});
            this.page.addBuffer("color",{data:colors});
            this.page.addBuffer("normal",{data:normals});
        },
        Render(){
            const gl = this.gl;
            const lightPosition = [
                this.sectionParams.lightPosition.x,
                this.sectionParams.lightPosition.y,
                this.sectionParams.lightPosition.z
            ]
            const lightColor = [
                this.sectionParams.lightColor.r,
                this.sectionParams.lightColor.g,
                this.sectionParams.lightColor.b
            ]
            const specularColor = [
                this.sectionParams.specularColor.r,
                this.sectionParams.specularColor.g,
                this.sectionParams.specularColor.b 
            ]

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            let projectionMatrix = haruluya_webgl_utils.perspective(
                this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
                );
            let cameraMatrix = haruluya_webgl_utils.lookAt(this.camera.position, this.camera.target, this.camera.up);
            let viewMatrix = haruluya_webgl_utils.inverse(cameraMatrix);
            var viewProjectionMatrix = haruluya_webgl_utils.multiply3d(projectionMatrix, viewMatrix);
            let worldMatrix = haruluya_webgl_utils.getTransformMatrix(
                haruluya_webgl_utils.xRotation(0),
                this.transform
            )
            // normal transform.
            var worldViewProjectionMatrix = haruluya_webgl_utils.multiply3d(viewProjectionMatrix, worldMatrix);
            var worldInverseMatrix = haruluya_webgl_utils.inverse(worldMatrix);
            var worldInverseTransposeMatrix = haruluya_webgl_utils.transpose(worldInverseMatrix);

            this.page.addUniform("u_worldViewProjection",worldViewProjectionMatrix);
            this.page.addUniform("u_worldInverseTranspose",worldInverseTransposeMatrix);
            this.page.addUniform("u_world",worldMatrix);
            this.page.addUniform("u_lightWorldPosition",lightPosition);
            this.page.addUniform("u_viewWorldPosition",this.camera.position);
            this.page.addUniform("u_shininess",this.sectionParams.shininess);
            this.page.addUniform("u_lightColor",haruluya_webgl_utils.normalize(lightColor));
            this.page.addUniform("u_specularColor",haruluya_webgl_utils.normalize(specularColor));

            this.page.glDraw({mode:gl.TRIANGLES,first:0,count:16*6})
        },

    },
    mounted() {
        this.uiSetter = [
                {
                    type: "slider", id: "shininess", value: this.sectionParams.shininess, min: 0, max: 20,
                    callback: uiSetting.globalUiCallbacks.updateValue(this.sectionParams,this.$refs.page.Render, "shininess")
                },

                { 
                    type: "color",id: "lightColor",default: this.sectionParams.lightColor, callback: uiSetting.globalUiCallbacks.updateValue(
                    this.sectionParams,this.$refs.page.Render, "lightColor")
                },
                { 
                    type: "color",id: "specularColor",default: this.sectionParams.specularColor, callback: uiSetting.globalUiCallbacks.updateValue(
                    this.sectionParams,this.$refs.page.Render, "specularColor")
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
