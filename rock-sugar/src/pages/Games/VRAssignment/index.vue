<template lang="html">
    <nano_game_assignment_page
        :prop_des_data="desData"
        :prop_ui_setter="uiSetter"
        :prop_section_params="sectionParams"
        :prop_buttons_callback="sceneCallbacks"
        ref="page"
        @Init="Init"
        @Render="Render"
    />
</template>
<script>
/*
    author:haruluya.
    date:2022/12/4.
    des:只是一个vr选修课的大作业。
        包括模型解析，场景渲染和简单屏幕后处理，摄像机和赛车控制器。
*/


import vertexShaderSource from './resource/vertex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import NanoObjParse from "_pages/Webgl/HNWUEngine/ModelParse.js"
import GeometryComponent from "./resource/scripts/GeometryComponent.js"
import back from './resource/images/cloud1/back.jpg'
import down from './resource/images/cloud1/down.jpg'
import front from './resource/images/cloud1/front.jpg'
import left from './resource/images/cloud1/left.jpg'
import right from './resource/images/cloud1/right.jpg'
import up from './resource/images/cloud1/up.jpg'
import VehicleController from './resource/scripts/VehicleController.js'


//json data.
let sceneTransformFile = './sceneTransform1.json'
let sceneAnimsDataFile = './sceneAnimation.json'

const skyboxImgs = {
    back,down,front,left,right,up
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
            page:null,
            uiSetter:[],
            objectData:[],
            objOffset:null,
            carTransform:{
                translation:[0, 0, 0],
                rotation:[HNWUEngine.degToRad(180), HNWUEngine.degToRad(200), HNWUEngine.degToRad(0)],
                scale:[1,1,1]
            },
            vehicleController:null,
            cameraAnims:null,

            sceneAnims:{
                scene1ShowPlt:true,
            },
            sceneAnimsData:null,

            currentScene:0
        }
    },

    mounted(){           
        this.getObjectData(['./models/vrAssignmentBeginScene/scene.obj'])
    },
    computed:{
        sceneCallbacks(){
            return {
                carInfo:()=>{
                    const camera = this.$refs.page.getCameraData();
                    camera.position = [-19.667, 11.333, 11.119];
                    camera.target = [-19.676, 11.2, 12.278];
                    this.sceneAnims.scene1ShowPlt = false;
                    this.$refs.page.showCarInfo = true;
                    this.$refs.page.beginGameRender();
                },
                freePerspective:()=>{
                    if(this.sceneAnims.scene1ShowPlt){
                        this.sceneAnims.scene1ShowPlt = false;
                        this.$refs.page.beginGameRender();
                    }else{
                        this.sceneAnims.scene1ShowPlt = true;
                        this.$refs.page.beginGameRender();
                    }
                },
                startRacing:()=>{
                    this.$refs.page.showLoadingPage();
                    this.objectData = [];
                    this.currentScene = 1;
                    this.$refs.page.clearComponents();
                    this.sceneAnims.scene1ShowPlt = false;
                    this.$refs.page.setCamera("vehicle");
                    const camera = this.$refs.page.getCameraData();
                    camera.position = [-22, 11.8, 5.1];
                    camera.target = [-19.676, 10.3, 12.278];
                    this.vehicleController = new VehicleController(this.canvas,this.page.getCameraData());
                    this.$refs.page.currentVehicleMode = 0;
                    sceneTransformFile = "./sceneTransform2.json"
                    this.getObjectData(['./models/runScene/car.obj','./models/runScene/scene2_road.obj']);
                },
                endRacing:()=>{
                    this.$refs.page.showLoadingPage();
                    this.objectData = [];
                    this.currentScene = 0;
                    this.$refs.page.clearComponents();
                    this.sceneAnims.scene1ShowPlt = true;
                    this.$refs.page.setCamera("viewer");
                    const camera = this.$refs.page.getCameraData();
                    camera.position = [-19.667, 11.333, 11.119];
                    camera.target = [-19.676, 11.2, 12.278];
                    this.vehicleController = null;
                    this.$refs.page.currentVehicleMode = -1;
                    sceneTransformFile = "./sceneTransform1.json"
                    this.getObjectData(['./models/vrAssignmentBeginScene/scene.obj'])
                }
            }
        }
    },
    methods: {
        Init(){
            this.page = this.$refs.page;
            this.gl = this.page.getGL();
            this.canvas = this.page.canvas;
            if(this.objectData.length == 0){
                return;
            }

        
            //show scene ui.
            this.page.loading = false;
            this.$refs.page.showCarInfo = false;
            if(this.currentScene == 0){
                this.page.showScene1UI = true;
                this.page.showScene2UI = false;
            }else if(this.currentScene == 1){
                this.page.showScene1UI = false;
                this.page.showScene2UI = true;
            }

            this.page.addSkybox(skyboxImgs);
            //screen effects.
            {
                this.page.addScreenSnowEffect();
            }

            //program.
            const Objprogram = this.page.createProgram(vertexShaderSource,fragmentShaderSource);

            this.page.setCamera("viewer");

            this.cameraAnims = this.page.createCameraAnims(this.sceneAnimsData);

            this.objectData.forEach(model=>{
                const gl = this.gl;
                const modelData = model.obj;
                const transform = model.transform;
                const components = model.components;
                const center = this.page.setObjectToScreenCenter(modelData.geometries);
                modelData.geometries.forEach(({material,data,object})=>{
                    const componentName = object+material;
                    const geometryComponent = new GeometryComponent(gl,componentName,Objprogram);
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
                        ...HNWUEngine.getDefaultMaterial(gl),
                        ...model.materials[material]
                    })
                    geometryComponent.setTransform(transform);
                    //camera.
                    if (components.vehicleController){
                        
                        geometryComponent.setPosition(center)
                        this.vehicleController.load(geometryComponent)
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
                "u_lightDirection": HNWUEngine.normalize(this.page.lightDirection),
                "u_projection": projectionMatrix,
                "u_viewWorldPosition":cameraPosition,
                "u_lightIntensity":this.page.lightIntensity.map(e=>{return e/255;}),
            }
            

            this.page.setSharedUniforms(sharedUniforms);

            //scene1showplt auto play.
            if(this.sceneAnims.scene1ShowPlt){
                if(this.cameraAnims.play("scene1ShowPlt")){
                    console.log("Scene1ShowPlt play over!");
                }
            }
            
        },

        async getObjectData(pathList){
            //scene animation.
            const sceneAnimsDataResponse =  await fetch(sceneAnimsDataFile);  
            this.sceneAnimsData = JSON.parse(await sceneAnimsDataResponse.text());

            //each component data.
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