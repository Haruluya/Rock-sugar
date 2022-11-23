<template lang="html">
    <nano_webgl_scene_panel
        :prop_des_data="desData"
        :prop_ui_setter="uiSetter"
        :prop_section_params="sectionParams"
        ref="page"
        @Init="Init"
        @Render="Render"
        @prop_ui_setter="uiSetter"
    />
</template>
<script>
import objFragmentShader from './resource/obj-fragment-shader.js'
import objVertexShader from './resource/obj-vertex-shader.js'
import skyboxFragmentShader from './resource/skybox-fragment-shader.js'
import skyboxVertexShader from './resource/skybox-vertex-shader.js'
import negx from './images/neg-x.jpg'
import negy from './images/neg-y.jpg'
import negz from './images/neg-z.jpg'
import posx from './images/pos-x.jpg'
import posy from './images/pos-y.jpg'
import posz from './images/pos-z.jpg'


import data from './resource/data.js'


const desData = {
    category:"Webgl",
    name:"Skybox",
    buttonContent:"查看源码",
    title:"天空盒",
    content:"From the rendering world, you can never see the truth outside the sky box."
}

const objPositions = data.obj.position
const objNormals = data.obj.normal
const skyboxPosition = data.skybox.position
export default {
    name:'SpotLight',
    data() {
        return {
            gl: null,
            desData,
            perspective:{
                aspect:0,
                fieldOfViewRadians:  HNWUEngine.degToRad(60),
                zNear: 1,
                zFar: 2000,
            },
            transform:{
                translation:[0, 0, -0],
                rotation:[HNWUEngine.degToRad(180), HNWUEngine.degToRad(200), HNWUEngine.degToRad(0)],
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
            
            //create programs.
            this.page.addProgram("obj",objVertexShader,objFragmentShader);
            this.page.addProgram("skybox",skyboxVertexShader,skyboxFragmentShader);


            //create components.
            this.page.addComponent("obj","obj");
            this.page.addComponent("skybox","skybox");
            

            //set aspect.
            this.perspective.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

            //set tranform for 3dviewer.
            this.$refs.page.set3DViewer(this.perspective,this.camera,this.transform);

            //Get bufferinfo and setters.
            this.page.addBuffer("position",{numComponents:3,data:objPositions},"obj");
            this.page.addBuffer("normal",{numComponents:3,data:objNormals},"obj");
            this.page.addBuffer("position",{numComponents:2,data:skyboxPosition},"skybox");

            this.sectionParams.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.sectionParams.texture);
            
            this.faceInfos(gl).forEach((faceInfo) => {
                const {target, url} = faceInfo;

                // Upload the canvas to the cubemap face.
                const level = 0;
                const internalFormat = gl.RGBA;
                const width = 512;
                const height = 512;
                const format = gl.RGBA;
                const type = gl.UNSIGNED_BYTE;

                // setup each face so it's immediately renderable
                gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

                // Asynchronously load an image
                const image = new Image();
                image.src = url;
                image.addEventListener('load', ()=>{
                    // Now that the image has loaded make copy it to the texture.
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.sectionParams.texture);
                    gl.texImage2D(target, level, internalFormat, format, type, image);
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                    this.page.Render();
                });
            });

            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        },
        Render(){
            const gl = this.gl;
            // matrix.
            let cameraMatrix = HNWUEngine.lookAt(this.camera.position, this.camera.target, this.camera.up);
            let viewMatrix = HNWUEngine.inverse(cameraMatrix);
            let projectionMatrix = HNWUEngine.perspective(
                this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
                );
            let worldMatrix = HNWUEngine.getTransformMatrix(
                HNWUEngine.xRotation(0),
                this.transform
            )
            //skybox matrix.
            var viewDirectionMatrix = HNWUEngine.copy(viewMatrix);
            viewDirectionMatrix[12] = 0;
            viewDirectionMatrix[13] = 0;
            viewDirectionMatrix[14] = 0;
            var viewDirectionProjectionMatrix = HNWUEngine.multiply3d(
                projectionMatrix, viewDirectionMatrix);
            var viewDirectionProjectionInverseMatrix =
                HNWUEngine.inverse(viewDirectionProjectionMatrix);

            //set uniform.
            this.page.addUniform("u_projection",projectionMatrix,"obj");
            this.page.addUniform("u_view",viewMatrix,"obj");
            this.page.addUniform("u_world",worldMatrix,"obj");
            this.page.addUniform("u_worldCameraPosition",this.camera.position,"obj");
            this.page.addUniform("u_viewDirectionProjectionInverse",viewDirectionProjectionInverseMatrix,"skybox")
            this.page.addUniform("u_texture",this.sectionParams.texture,"obj");
            this.page.addUniform("u_texture",this.sectionParams.texture,"skybox");
            this.page.useProgram(this.page.getComponent("obj").program)
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LESS);  // use the default depth test
            this.page.setSetters("obj");
            this.page.drawComponent("obj")


            this.page.useProgram(this.page.getComponent("skybox").program);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            this.page.setSetters("skybox");
            this.page.drawComponent("skybox")

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
    mounted() {

    },
}
</script>