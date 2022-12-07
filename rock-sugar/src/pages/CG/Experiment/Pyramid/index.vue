<template lang="html">
    <webgl_basic_render_panel
        :prop_des_data="desData"
        :prop_ui_setter="uiSetter"
        :prop_vertex_shader="vertexShaderSource"
        :prop_fragment_shader="fragmentShaderSource"
        :prop_section_params="sectionParams"
        ref="page"
        @Init="Init"
        @Render="Render"
    />
</template>
<script>

import vertexShaderSource from './resource/vertex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import NanoObjParse from "../../../Webgl/HNWUEngine/ModelParse.js"
import uiSetting from '../ui-setting'

const desData = {
    category: "Pyramid",
    name: "ClipPolygon",
    buttonContent: "查看源码",
    title: "金字塔",
    content: "Pyramid."
}



/*
    @author:haruluya
    @des: Ex15 Pyramid.
*/


export default {
    name:"Pyramid",
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
                zFar: 10000,
            },
            transform:{
                translation:[0, 0, 15],
                rotation:[HNWUEngine.degToRad(0), HNWUEngine.degToRad(270), HNWUEngine.degToRad(0)],
                scale:[.7,.7,.7]
            },
            camera:{
                target:[0, 0, 0],
                position:[0, 0, 1],
                up:[0,1,0]
            },
            sectionParams:{
                lightDirection:{x:-1,y:3,z:5},
                texture:null,
            },
            page:null,
            uiSetter:[],
            objectData:null,
            objComponentsInfo:null,
            objOffset:null,

        }
    },
    computed:{
        defaultMaterial(){
            return{
                diffuse: [1, 1, 1],
                diffuseMap: NanoObjParse.create1PixelTexture(this.gl, [255, 255, 255, 0]),
                normalMap:  NanoObjParse.create1PixelTexture(this.gl, [255, 255, 255, 0]),
                ambient: [0, 0, 0],
                specular: [0, 0, 0],
                specularMap: NanoObjParse.create1PixelTexture(this.gl, [255, 255, 255, 255]),
                shininess: 400,
                opacity: 1,
            }
        },
        //uiSetter.
        uiSetter() {
            let sectionParams = this.sectionParams;
            let setter = [
                { type: "slider-vector", id: "lightDirection" , value: sectionParams.lightDirection, min: { x: 0, y: 0,z:0 }, max: { x: 100, y: 100 ,z:100}, 
                    callback: uiSetting.globalUiCallbacks.updatePoint(this, "lightDirection") },
            ];

            return setter;
        },
    },
    mounted(){
        this.getObjectData();
    },
    methods: {
        Init(){
            this.page = this.$refs.page;
            this.gl = this.page.getGL();
            if(!this.objectData){
                return;
            }
            this.page.addProgram("obj",vertexShaderSource,fragmentShaderSource);

            //Get bufferinfo and setters.
            this.perspective.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

            //set tranform for 3dviewer.
            this.$refs.page.set3DViewer(this.perspective,this.camera,this.transform);

            const data = this.objectData.obj;
            
            //offset.
            this.objOffset = this.page.setObjectToSceenCenter(data.geometries);

            //get object info.
            this.objComponentsInfo = data.geometries.map(({material,data,object}) => {
                const componentName = object+material;
                this.page.addComponent("obj",componentName);
                //handel normal.
                if (data.texcoord && data.normal) {
                    data.tangent = NanoObjParse.generateTangents(data.position, data.texcoord);
                    this.page.addBuffer("tangent",data.tangent,componentName);
                } else {
                    this.page.addBuffer("tangent",{ value: [1, 0, 0] },componentName);
                }
                
                if (!data.texcoord) {
                    data.texcoord = { value: [0, 0] };
                }

                if (!data.normal) {
                    data.normal = { value: [0, 0, 1] };
                }

                //handle color.
                if (data.color) {
                    if (data.position.length === data.color.length) {
                        data.color = { numComponents: 3, data: data.color };
                        this.page.addBuffer("color",data.color,componentName);
                    }
                }else{
                    this.page.addBuffer("color",{ value: [1, 1, 1, 1] },componentName);
                }

                this.page.addBuffer("position",{data:data.position},componentName);
                this.page.addBuffer("texcoord",{numComponents:2,data:data.texcoord},componentName);
                this.page.addBuffer("normal",{data:data.normal},componentName);
                
                return {
                    name:componentName,
                    component:this.page.getComponents()[componentName],
                    material:{
                        ...this.defaultMaterial,
                        ...this.objectData.materials[material]
                    }
                }
            });

           {
            const gl = this.gl;
            this.sectionParams.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.sectionParams.texture);

            // fill texture with 3x2 pixels
            const level = 0;
            const internalFormat = gl.LUMINANCE;
            const width = 3;
            const height = 2;
            const border = 0;
            const format = gl.LUMINANCE;
            const type = gl.UNSIGNED_BYTE;
            const data = new Uint8Array([
                126,  153, 126,
                0, 0,   0,
            ]);
            const alignment = 1;
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border,
                            format, type, data);

            // set the filtering so we don't need mips and it's not filtered
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
           }
        },
        Render(){
            if(!this.objectData){
                return;
            }

            const gl = this.gl;

            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.MULTISAMPLE);
            //matrix.
            let projectionMatrix = HNWUEngine.perspective(
                this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
                );
            let cameraMatrix = HNWUEngine.lookAt(this.camera.position, this.camera.target, this.camera.up);
            let viewMatrix = HNWUEngine.inverse(cameraMatrix);

            let worldMatrix = HNWUEngine.getTransformMatrix(
                    HNWUEngine.yRotation(0),this.transform);
            worldMatrix = HNWUEngine.translate3d(worldMatrix,...this.objOffset);

            //render components.
            this.objComponentsInfo.forEach(({name,component,material})=>{
                this.page.useProgram(component.program);
                if(name != "defaultphong1SG"){
                    material.diffuseMap = this.sectionParams.texture;
                }
                const lightDirection = [this.sectionParams.lightDirection.x,this.sectionParams.lightDirection.y,this.sectionParams.lightDirection.z]
                const sharedUniforms = {
                    "u_world": worldMatrix,
                    "u_view": viewMatrix,
                    "u_lightDirection": HNWUEngine.normalize(lightDirection),
                    "u_projection": projectionMatrix,
                    "u_viewWorldPosition":this.camera.position,
                }
                const uniforms = Object.assign(sharedUniforms,material);
                Object.entries(uniforms).forEach(([key,value])=>{
                    this.page.addUniform(key,value,name);
                })
                this.page.setSetters(name);
                this.page.drawComponent(name)
            })


        },
        async getObjectData(){
            let objLink = './models/pyramid/pyramid.obj'

            const response =  await fetch(objLink);  
            const text = await response.text();
            const obj = NanoObjParse.objectParse(text);
            const baseLink = new URL(objLink, window.location.href);
            const matTexts = await Promise.all(obj.materialLibs.map(async filename => {
                const matHref = new URL(filename, baseLink).href;
                const response = await fetch(matHref);
                return await response.text();
            }));
            const materials = NanoObjParse.parseMTL(matTexts.join('\n'));
            const textures = {
                defaultWhite: NanoObjParse.create1PixelTexture(this.gl, [255, 255, 255, 255]),
            };
            // load texture for materials
            for (const material of Object.values(materials)) {
                Object.entries(material)
                .filter(([key]) => key.endsWith('Map'))
                .forEach(([key, filename]) => {
                    let texture = textures[filename];
                    material[key] = texture;
                });
            }
            this.objectData = {
                obj,
                materials,
            };
            this.$refs.page.Init();
        },
    }
}
</script>
