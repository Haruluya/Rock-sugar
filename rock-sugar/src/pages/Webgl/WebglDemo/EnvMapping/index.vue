<template lang="html">
    <nano_webgl_demo_panel
        :prop_des_data="desData"
        :prop_ui_setter="uiSetter"
        :prop_section_params="sectionParams"
        :prop_vertex_shader="vertexShaderSource"
        :prop_fragment_shader="fragmentShaderSource"
        ref="page"
        @Init="Init"
        @Render="Render"
        @prop_ui_setter="uiSetter"
    />
</template>
<script>
import vertexShaderSource from './resource/vertex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import negx from './images/neg-x.jpg'
import negy from './images/neg-y.jpg'
import negz from './images/neg-z.jpg'
import posx from './images/pos-x.jpg'
import posy from './images/pos-y.jpg'
import posz from './images/pos-z.jpg'

import data from './resource/data.js'
import uiSetting from "../ui-setting"

const desData = {
    category:"Webgl",
    name:"EnvMapping",
    buttonContent:"查看源码",
    title:"环境贴图",
    content:"Environment mapping."
}

const positions = data.position
const normals = data.normal

export default {
    name:'SpotLight',
    data() {
        return {
            gl: null,
            desData,
            program:null,
            vertexShaderSource,
            fragmentShaderSource,
            perspective:{
                aspect:0,
                fieldOfViewRadians:  haruluya_webgl_utils.degToRad(60),
                zNear: 1,
                zFar: 2000,
            },
            transform:{
                translation:[0, 0, -0],
                rotation:[haruluya_webgl_utils.degToRad(180), haruluya_webgl_utils.degToRad(200), haruluya_webgl_utils.degToRad(0)],
                scale:[1,1,1]
            },
            camera:{
                target:[0, 0, 0],
                position:[0, 0, 2],
                up:[0,1,0]
            },
            sectionParams:{
                texture:null,
            },
            page:null,
            uiSetter:[],
        }
    },
    methods: {
        Init(){
            this.page = this.$refs.page;
            this.gl = this.page.getGL();
            const gl = this.gl;
            
            this.program = this.page.getProgram();

            //Get bufferinfo and setters.
            this.perspective.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

            this.$refs.page.setTransform(this.transform);
            this.page.addBuffer("position",{numComponents:3,data:positions});
            this.page.addBuffer("normal",{numComponents:3,data:normals});
            this.sectionParams.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.sectionParams.texture);
            this.faceInfos(gl).forEach((faceInfo,index) => {
                const {target, url} = faceInfo;

                // Upload the canvas to the cubemap face.
                const level = 0;
                const internalFormat = gl.RGBA;
                const format = gl.RGBA;
                const type = gl.UNSIGNED_BYTE;

                // Asynchronously load an image
                const image = new Image();
                image.src = url;
                image.addEventListener('load', ()=>{
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.sectionParams.texture);
                    gl.texImage2D(target, level, internalFormat, format, type, image);
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                    if (index === 5){
                        this.page.Render()
                    }
                });
            });
           
        },
        Render(){
            const gl = this.gl;
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            let cameraMatrix = haruluya_webgl_utils.lookAt(this.camera.position, this.camera.target, this.camera.up);
            let viewMatrix = haruluya_webgl_utils.inverse(cameraMatrix);
            let projectionMatrix = haruluya_webgl_utils.perspective(
                this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
                );
            let worldMatrix = haruluya_webgl_utils.getTransformMatrix(
                haruluya_webgl_utils.xRotation(0),
                this.transform
            )
            
            this.page.addUniform("u_projection",projectionMatrix);
            this.page.addUniform("u_view",viewMatrix);
            this.page.addUniform("u_world",worldMatrix);
            this.page.addUniform("u_worldCameraPosition",this.camera.position);
            this.page.addUniform("u_texture",this.sectionParams.texture);

            this.$refs.page.glDraw({mode:gl.TRIANGLES,first:0,count:6*6})

        },
        faceInfos(gl){
            return[
                {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                url: negx,
                },
                {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                url: negy,
                },
                {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                url: negz,
                },
                {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                url: posx,
                },
                {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                url: posy,
                },
                {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                url: posz,
                },
            ]
        }

    },

}
</script>