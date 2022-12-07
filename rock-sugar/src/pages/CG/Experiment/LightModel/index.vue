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
        @prop_ui_setter="uiSetter"
    />
</template>
<script>

import vertexShaderSource from './resource/vertex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import NanoObjParse from "../../../Webgl/HNWUEngine/ModelParse.js"
import uiSetting from '../ui-setting'

const desData = {
    category: "Experiment",
    name: "LightModel",
    buttonContent: "查看源码",
    title: "光照模型实例",
    content: "LightModel."
}



/*
    @author:haruluya
    @des: Ex16 LightModel.
*/


export default {
    name:"LightModel",
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
                zFar: 1000,
            },
            transform:{
                translation:[0, 0, 0],
                rotation:[HNWUEngine.degToRad(80), HNWUEngine.degToRad(130), HNWUEngine.degToRad(0)],
                scale:[1.8,1.8,1.8]
            },
            camera:{
                target:[0, 0, 0],
                position:[0, 0, 1],
                up:[0,1,0]
            },
            sectionParams:{
                lightDirection:{x:-1,y:3,z:5},
                lightColor:{x:255,y:255,z:255},
                diffuse: {x:203,y:143,z:24},
                ambient: {x:0,y:0,z:0},
                specular: {x:0,y:0,z:0},
                shininess: 30,
                opacity: 100,
            },
            page:null,
            uiSetter:[],
            objectData:null,
            objComponentsInfo:null,
            objOffset:null,

        }
    },
    computed:{
        uiSetter(){
            let sectionParams = this.sectionParams;
            let setter = [
                {type:"slider", id:"shininess", value: sectionParams.shininess, min:-50, max:50, 
                    callback:uiSetting.globalUiCallbacks.updateValue(this,"shininess")
                },
                {type:"slider", id:"opacity", value: sectionParams.opacity, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updateValue(this,"opacity")
                },
                { type: "slider-vector", id: "lightDirection" , value: sectionParams.lightDirection, min: { x: -100, y: -100,z:-100 }, max: { x: 100, y: 100,z:100}, callback: 
                    uiSetting.globalUiCallbacks.updatePoint(this, "lightDirection") },
                { type: "slider-vector", id: "lightColor" , value: sectionParams.lightColor, min: { x: 0, y: 0,z:0 }, max: { x: 255, y: 255,z:255}, callback: 
                    uiSetting.globalUiCallbacks.updatePoint(this, "lightColor") },    
                { type: "slider-vector", id: "diffuse" , value: sectionParams.diffuse, min: { x: 0, y: 0,z:0 }, max: { x: 255, y: 255,z:255}, callback: 
                uiSetting.globalUiCallbacks.updatePoint(this, "diffuse") },    
                { type: "slider-vector", id: "ambient" , value: sectionParams.ambient, min: { x: 0, y: 0,z:0 }, max: { x: 255, y: 255,z:255}, callback: 
                uiSetting.globalUiCallbacks.updatePoint(this, "ambient") },    
                { type: "slider-vector", id: "specular" , value: sectionParams.specular, min: { x: 0, y: 0,z:0 }, max: { x: 255, y: 255,z:255}, callback: 
                uiSetting.globalUiCallbacks.updatePoint(this, "specular") },    
            ];
            return setter;
        }
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
                }
            });

        },
        Render(){
            if(!this.objectData){
                return;
            }

            const gl = this.gl;

            gl.enable(gl.DEPTH_TEST);
            // gl.enable(gl.CULL_FACE);
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
                const uniforms = {
                    "u_world": worldMatrix,
                    "u_view": viewMatrix,
                    "u_lightDirection": HNWUEngine.normalize([
                        this.sectionParams.lightDirection.x,
                        this.sectionParams.lightDirection.y,
                        this.sectionParams.lightDirection.z
                    ]),
                    "u_ambientLight":[7,-3,5],
                    "u_projection": projectionMatrix,
                    "u_viewWorldPosition":this.camera.position,
                    "u_lightColor":[
                        this.sectionParams.lightColor.x /255,
                        this.sectionParams.lightColor.y/255,
                        this.sectionParams.lightColor.z/255
                    ],
                    "diffuse": [
                            this.sectionParams.diffuse.x/255,
                            this.sectionParams.diffuse.y/255,
                            this.sectionParams.diffuse.z/255,
                        ],
                    "ambient": [
                        this.sectionParams.ambient.x/255,
                        this.sectionParams.ambient.y/255,
                        this.sectionParams.ambient.z/255,
                    ],
                    "specular": [
                        this.sectionParams.specular.x/255,
                        this.sectionParams.specular.y/255,
                        this.sectionParams.specular.z/255,
                    ],
                    "shininess": this.sectionParams.shininess,
                    "opacity": this.sectionParams.opacity / 100,
                }
                Object.entries(uniforms).forEach(([key,value])=>{
                    this.page.addUniform(key,value,name);
                })
                this.page.setSetters(name);
                this.page.drawComponent(name)
            })


        },
        async getObjectData(){
            let objLink = './models/lightModel/LightModel.obj'

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
                    if (!texture) {
                        const textureHref = new URL(filename, baseLink).href;
                        texture = NanoObjParse.createTexture(this.gl, textureHref);
                        textures[filename] = texture;
                    }
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
