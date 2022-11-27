<template lang="html">
    <nano_game_assignment_page
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
import vertexShaderSource from './resource/vertex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import NanoObjParse from "_pages/Webgl/HNWUEngine/ModelParse.js"
import {GeometryComponent} from "./resource/utils.js"
import back from './resource/images/heaven/back.jpg'
import bottom from './resource/images/heaven/bottom.jpg'
import front from './resource/images/heaven/front.jpg'
import left from './resource/images/heaven/left.jpg'
import right from './resource/images/heaven/right.jpg'
import top from './resource/images/heaven/top.jpg'


const sceneTransformFile = './sceneTransform.json'

const skyboxImgs = {
    back,bottom,front,left,right,top
}


const desData = {
    category:"Webgl",
    name:"VRAssignment",
    buttonContent:"查看源码",
    title:"VRAssignment",
    content:"just a assignment for vr course."
}

export default {
    name:'VRAssignment',
    data() {
        return {
            gl: null,
            canvas: null,
            program: null,
            vertexShaderSource,
            fragmentShaderSource,
            desData,
            desData,
            sectionParams:{
                lightDirection:[-1,3,5]
            },
            page:null,
            uiSetter:[],
            objectData:[],
            objOffset:null,
        }
    },

    mounted(){
        this.getObjectData(["./models/car/F-360_modena.obj","./models/road/smallroad.obj"]);
    },
    methods: {
        Init(){
            this.page = this.$refs.page;
            this.gl = this.page.getGL();

            if(this.objectData.length == 0){
                return;
            }

            this.page.addSkybox(skyboxImgs);
            
            //program.
            const Objprogram = this.page.createProgram(vertexShaderSource,fragmentShaderSource);

            const data = this.objectData[0].obj;

            //offset.
            this.objOffset = this.page.setObjectToScreenCenter(data.geometries);

            this.objectData.forEach(model=>{
                const data = model.obj;
                const transform = model.transform;
                const components = model.components;

  

                data.geometries.forEach(({material,data,object})=>{
                    const componentName = object+material;
                    const geometryComponent = new GeometryComponent(componentName,Objprogram);
                    //handel normal.
                    if (data.texcoord && data.normal) {
                        data.tangent = NanoObjParse.generateTangents(data.position, data.texcoord);
                        geometryComponent.addBuffer("tangent",data.tangent);
                    } else {
                        geometryComponent.addBuffer("tangent",{ value: [1, 0, 0] });
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
                            geometryComponent.addBuffer("color",data.color);
                        }
                    }else{
                        geometryComponent.addBuffer("color",{ value: [1, 1, 1, 1] });
                    }
                    geometryComponent.addBuffer("position",{data:data.position});
                    geometryComponent.addBuffer("texcoord",{numComponents:2,data:data.texcoord});
                    geometryComponent.addBuffer("normal",{data:data.normal});
                    geometryComponent.setMaterial({
                        ...HNWUEngine.getDefaultMaterial(),
                        ...model.materials[material]
                    })
                    geometryComponent.setTransform(transform);
                    //camera.
                    if (components.firstPersonCamera){
                            this.page.setFirstPersonCamera(geometryComponent);
                    }

                    this.page.addGeometryComponent(geometryComponent);
                })
            })


        },
        Render(){
            if(this.objectData.length == 0){
                return;
            }
            const gl = this.gl;

            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.depthFunc(gl.LESS);

 
            const viewMatrix = this.page.getViewMatrix();
            const projectionMatrix = this.page.getProjectionMatrix();
            const cameraPosition = this.page.getCameraData().position;

            const sharedUniforms = {
                "u_view": viewMatrix,
                "u_lightDirection": HNWUEngine.normalize(this.sectionParams.lightDirection),
                "u_projection": projectionMatrix,
                "u_viewWorldPosition":cameraPosition,
            }
            

            this.page.setSharedUniforms(sharedUniforms);

        },

        async getObjectData(pathList){
            
            for (let i = 0; i < pathList.length; i++){
                //load objects.
                const path = pathList[i];
                let objLink = path;
                const objResponse =  await fetch(objLink);  
                const text = await objResponse.text();
                const obj = NanoObjParse.objectParse(text);
                const baseLink = new URL(objLink, window.location.href);
                const matTexts = await Promise.all(obj.materialLibs.map(async filename => {
                    const matHref = new URL(filename, baseLink).href;
                    const matResponse = await fetch(matHref);
                    return await matResponse.text();
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

                //load transform.
                const transfromResponse =  await fetch(sceneTransformFile);  
                const data = JSON.parse(await transfromResponse.text());
                const transform = data[i].transform;
                const components = data[i].components;
                this.objectData.push({path,obj,materials,transform,components})
            }
            this.$refs.page.Init();
        },
    }
}
</script>