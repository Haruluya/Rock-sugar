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


import uiSetting from "../ui-setting"

const desData = {
    category:"Webgl",
    name:"ObjResolver",
    buttonContent:"查看源码",
    title:"模型解析",
    content:"Model analysis."
}

export default {
    name:"ObjResolver",
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
                rotation:[HNWUEngine.degToRad(0), HNWUEngine.degToRad(0), HNWUEngine.degToRad(0)],
                scale:[1,1,1]
            },
            camera:{
                target:[0, 0, 0],
                position:[0, 0, 3],
                up:[0,1,0]
            },
            sectionParams:{
                
            },
            page:null,
            uiSetter:[],
            objectData:null
        }
    },
    mounted(){
        this.getObjectData();
    },
    methods: {
        Init(){
            


            if(!this.objectData){
                return;
            }
            this.page = this.$refs.page;
            this.gl = this.page.getGL();
            this.canvas = this.page.getCanvas();
            this.program = this.page.getProgram();

            //Get bufferinfo and setters.
            this.perspective.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

            this.page.setTransform(this.transform);

            const data = this.objectParse(this.objectData);
            console.log(data,"data")
            data.geometries.map(({data}) => {
                this.page.addBuffer("position",{data:data.position});
                this.page.addBuffer("texcoord",{numComponents:2,data:data.texcoord});
                this.page.addBuffer("normal",{data:data.normal});
            });
        },
        Render(){
            if(!this.objectData){
                return;
            }
            const gl = this.gl;

            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);

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
            this.page.addUniform("u_view",viewMatrix);
            this.page.addUniform("u_lightDirection",HNWUEngine.normalize([-1,3,5]));
            this.page.addUniform("u_projection",projectionMatrix);

            this.page.addUniform("u_diffuse",[1, 1, 1, 1]);
            this.page.addUniform("u_world",worldMatrix);
        },
        async getObjectData(){
            const response =  await fetch('https://webglfundamentals.org/webgl/resources/models/chair/chair.obj');  
            const text = await response.text();
            this.objectData = text;
            this.$refs.page.Init();
        },
        objectParse(text) {
            // because indices are base 1 let's just fill in the 0th data
            const objPositions = [[0, 0, 0]];
            const objTexcoords = [[0, 0]];
            const objNormals = [[0, 0, 0]];

            // same order as `f` indices
            const objVertexData = [
                objPositions,
                objTexcoords,
                objNormals,
            ];

            // same order as `f` indices
            let webglVertexData = [
                [],   // positions
                [],   // texcoords
                [],   // normals
            ];

            const materialLibs = [];
            const geometries = [];
            let geometry;
            let groups = ['default'];
            let material = 'default';
            let object = 'default';

            const noop = () => {};

            function newGeometry() {
                // If there is an existing geometry and it's
                // not empty then start a new one.
                if (geometry && geometry.data.position.length) {
                geometry = undefined;
                }
            }

            function setGeometry() {
                if (!geometry) {
                const position = [];
                const texcoord = [];
                const normal = [];
                webglVertexData = [
                    position,
                    texcoord,
                    normal,
                ];
                geometry = {
                    object,
                    groups,
                    material,
                    data: {
                    position,
                    texcoord,
                    normal,
                    },
                };
                geometries.push(geometry);
                }
            }

            function addVertex(vert) {
                const ptn = vert.split('/');
                ptn.forEach((objIndexStr, i) => {
                if (!objIndexStr) {
                    return;
                }
                const objIndex = parseInt(objIndexStr);
                const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
                webglVertexData[i].push(...objVertexData[i][index]);
                });
            }

            const keywords = {
                v(parts) {
                objPositions.push(parts.map(parseFloat));
                },
                vn(parts) {
                objNormals.push(parts.map(parseFloat));
                },
                vt(parts) {
                // should check for missing v and extra w?
                objTexcoords.push(parts.map(parseFloat));
                },
                f(parts) {
                    setGeometry();
                    const numTriangles = parts.length - 2;
                    for (let tri = 0; tri < numTriangles; ++tri) {
                        addVertex(parts[0]);
                        addVertex(parts[tri + 1]);
                        addVertex(parts[tri + 2]);
                    }
                },
                s: noop,    // smoothing group
                mtllib(parts, unparsedArgs) {
                    // the spec says there can be multiple filenames here
                    // but many exist with spaces in a single filename
                    materialLibs.push(unparsedArgs);
                },
                usemtl(parts, unparsedArgs) {
                    material = unparsedArgs;
                    newGeometry();
                },
                g(parts) {
                    groups = parts;
                    newGeometry();
                },
                o(parts, unparsedArgs) {
                    object = unparsedArgs;
                    newGeometry();
                },
            };

            const keywordRE = /(\w*)(?: )*(.*)/;
            const lines = text.split('\n');
            for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
                const line = lines[lineNo].trim();
                if (line === '' || line.startsWith('#')) {
                    continue;
                }
                const m = keywordRE.exec(line);
                if (!m) {
                    continue;
                }
                const [, keyword, unparsedArgs] = m;
                const parts = line.split(/\s+/).slice(1);
                const handler = keywords[keyword];
                if (!handler) {
                    console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
                    continue;
                }
                handler(parts, unparsedArgs);
            }

            // remove any arrays that have no entries.
            for (const geometry of geometries) {
                geometry.data = Object.fromEntries(
                    Object.entries(geometry.data).filter(([, array]) => array.length > 0));
            }

            return {
                geometries,
                materialLibs,
            };
        },

    }
}
</script>
