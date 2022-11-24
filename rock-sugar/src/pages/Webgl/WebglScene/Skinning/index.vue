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
import data from './resource/data.js'
import skinVertexShaderSource from './resource/skin-vertex-shader.js'
import meshVertexShaderSource from './resource/mesh-vertex-shader.js'
import fragmentShaderSource from './resource/fragment-shader.js'
import MeshRenderer from '../../HNWUEngine/MeshRenderer'
import {TRS,Node} from '../../HNWUEngine/SceneNode'
import Skin from '../../HNWUEngine/Skin'
import SkinRenderer from '../../HNWUEngine/SkinRenderer'


const desData = {
    category:"Webgl",
    name:"Skinning",
    buttonContent:"查看源码",
    title:"蒙皮",
    content:"Skinning."
}
const accessorTypeToNumComponentsMap = {
    'SCALAR': 1,
    'VEC2': 2,
    'VEC3': 3,
    'VEC4': 4,
    'MAT2': 4,
    'MAT3': 9,
    'MAT4': 16,
};
const glTypeToTypedArrayMap = {
    '5120': Int8Array,    // gl.BYTE
    '5121': Uint8Array,   // gl.UNSIGNED_BYTE
    '5122': Int16Array,   // gl.SHORT
    '5123': Uint16Array,  // gl.UNSIGNED_SHORT
    '5124': Int32Array,   // gl.INT
    '5125': Uint32Array,  // gl.UNSIGNED_INT
    '5126': Float32Array, // gl.FLOAT
};

export default {
    name:'Skinning',
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
                translation:[0, 0, 0],
                rotation:[HNWUEngine.degToRad(180), HNWUEngine.degToRad(200), HNWUEngine.degToRad(0)],
                scale:[1,1,1]
            },
            camera:{
                target:[0, 0, 0],
                position:[10, 0, 0],
                up:[0,1,0]
            },
            sectionParams:{
                texture:null,
            },
            page:null,
            uiSetter:[],
            gltfData:null,
            origMatrices:null,
            skinProgramInfo:null,
            meshProgramInfo:null,

        }
    },
    methods: {
        async Init(){
            this.page = this.$refs.page;
            this.gl = this.page.getGL();
            this.gltfData = await this.loadGLTF(
                'https://webglfundamentals.org/webgl/resources/models/killer_whale/whale.CYCLES.gltf'
                );
            //set aspect.
            this.perspective.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

            this.skinProgramInfo = HNWUEngine.createProgramInfo(this.gl, [skinVertexShaderSource,fragmentShaderSource ]);
            this.meshProgramInfo = HNWUEngine.createProgramInfo(this.gl, [meshVertexShaderSource,fragmentShaderSource ]);
            const ext = this.gl.getExtension('OES_texture_float');
            if (!ext) {
                console.log("NO EXTENSION!")
                return;  // the extension doesn't exist on this device
            }
            this.origMatrices = new Map();   

            requestAnimationFrame(this.page.Render);  
        },
        Render(time){
            if(!this.gltfData){
                return;
            }

            console.log(this.gltfData,"gltfdata");
            this.animSkin(this.gltfData.skins[0], Math.sin(time*0.001) * .5);
            
            const sharedUniforms = {
                u_lightDirection: HNWUEngine.normalize([0, 0, 1]),
            };

            let cameraMatrix = HNWUEngine.lookAt(this.camera.position, this.camera.target, this.camera.up);
            let viewMatrix = HNWUEngine.inverse(cameraMatrix);
            let projectionMatrix = HNWUEngine.perspective(
                this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
                );

            const renderDrawables = (node)=>{
                for (const drawable of node.drawables) {
                    if (drawable.skin){
                        drawable.render(this.gl,this.skinProgramInfo,node, projectionMatrix, viewMatrix, sharedUniforms);
                    }else if(drawable.mesh){
                        drawable.render(this.gl,this.meshProgramInfo,node, projectionMatrix, viewMatrix, sharedUniforms);
                    }else{
                        console.log("drawable have not renderer.")
                    }
                   
                }
            }

            for (const scene of this.gltfData.scenes) {
                // updatte all world matices in the scene.
                scene.root.updateWorldMatrix();
                // walk the scene and render all renderables
                scene.root.traverse(renderDrawables);

            }
            requestAnimationFrame(this.page.Render);  
        },
                    
        animSkin(skin, a) {
            for (let i = 0; i < skin.joints.length; ++i) {
                const joint = skin.joints[i];
                // if there is no matrix saved for this joint
                if (!this.origMatrices.has(joint)) {
                    // save a matrix for joint
                    this.origMatrices.set(joint, joint.source.getMatrix());
                }
                // get the original matrix
                const origMatrix = this.origMatrices.get(joint);
                // rotate it
                const m = HNWUEngine.xRotate(origMatrix, a);
                // decompose it back into position, rotation, scale
                // into the joint
                HNWUEngine.decompose(m, joint.source.position, joint.source.rotation, joint.source.scale);
            }
        },
        accessorTypeToNumComponents(type) {
            return accessorTypeToNumComponentsMap[type] || throwNoKey(type);
        },

        glTypeToTypedArray(type) {
            return glTypeToTypedArrayMap[type] || throwNoKey(type);
        },

        getAccessorTypedArrayAndStride(gl, gltf, accessorIndex) {
            const accessor = gltf.accessors[accessorIndex];
            const bufferView = gltf.bufferViews[accessor.bufferView];
            const TypedArray = this.glTypeToTypedArray(accessor.componentType);
            const buffer = gltf.buffers[bufferView.buffer];
            return {
            accessor,
            array: new TypedArray(
                buffer,
                bufferView.byteOffset + (accessor.byteOffset || 0),
                accessor.count * this.accessorTypeToNumComponents(accessor.type)),
            stride: bufferView.byteStride || 0,
            };
        },
        //通过accessor获得buffer.
        getAccessorAndWebGLBuffer(gl, gltf, accessorIndex) {
            const accessor = gltf.accessors[accessorIndex];
            const bufferView = gltf.bufferViews[accessor.bufferView];
            if (!bufferView.webglBuffer) {
                const buffer = gl.createBuffer();
                const target = bufferView.target || gl.ARRAY_BUFFER;
                const arrayBuffer = gltf.buffers[bufferView.buffer];
                const data = new Uint8Array(arrayBuffer, bufferView.byteOffset, bufferView.byteLength);
                gl.bindBuffer(target, buffer);
                gl.bufferData(target, data, gl.STATIC_DRAW);
                bufferView.webglBuffer = buffer;
            }
            return {
                accessor,
                buffer: bufferView.webglBuffer,
                stride: bufferView.stride || 0,
            };
        },
        async loadGLTF(url) {
            const gl = this.gl;
            //gltf josn.
            const gltf = await this.loadJSON(url);
            // load all the referenced files relative to the gltf file
            const baseURL = new URL(url, location.href);
            gltf.buffers = await Promise.all(gltf.buffers.map((buffer) => {
                const url = new URL(buffer.uri, baseURL.href);
                return this.loadBinary(url.href);
            }));

            const defaultMaterial = {
                uniforms: {
                    u_diffuse: [1, 1, 1, 1],
                },
            };

            // setup meshes
            gltf.meshes.forEach((mesh) => {
                mesh.primitives.forEach((primitive) => {
                    const attribs = {};
                    let numElements;
                    //通过mesh获取buffer数据。
                    for (const [attribName, index] of Object.entries(primitive.attributes)) {
                        const {accessor, buffer, stride} = this.getAccessorAndWebGLBuffer(gl, gltf, index);
                        numElements = accessor.count;
                        attribs[`a_${attribName}`] = {
                            buffer,
                            type: accessor.componentType,
                            numComponents: this.accessorTypeToNumComponents(accessor.type),
                            stride,
                            offset: accessor.byteOffset | 0,
                        };
                    }   

                    const bufferInfo = {
                        attribs,
                        numElements,
                    };

                    if (primitive.indices !== undefined) {
                        const {accessor, buffer} = this.getAccessorAndWebGLBuffer(gl, gltf, primitive.indices);
                        bufferInfo.numElements = accessor.count;
                        bufferInfo.indices = buffer;
                        bufferInfo.elementType = accessor.componentType;
                    }

                    primitive.bufferInfo = bufferInfo;

                    // save the material info for this primitive
                    primitive.material = gltf.materials && gltf.materials[primitive.material] || defaultMaterial;
                });
            });

            const skinNodes = [];
            const origNodes = gltf.nodes;
            gltf.nodes = gltf.nodes.map((n) => {
                const {name, skin, mesh, translation, rotation, scale} = n;
                const trs = new TRS(translation, rotation, scale);
                const node = new Node(trs, name);
                const realMesh = gltf.meshes[mesh];
                if (skin !== undefined) {
                    skinNodes.push({node, mesh: realMesh, skinNdx: skin});
                } else if (realMesh) {
                    node.drawables.push(new MeshRenderer(realMesh));
                }
                return node;
            });

            // setup skins
            gltf.skins = gltf.skins.map((skin) => {
                const joints = skin.joints.map(ndx => gltf.nodes[ndx]);
                const {array} = this.getAccessorTypedArrayAndStride(gl, gltf, skin.inverseBindMatrices);
                return new Skin(gl,joints, array);
            });

            // Add SkinRenderers to nodes with skins
            for (const {node, mesh, skinNdx} of skinNodes) {
                node.drawables.push(new SkinRenderer(mesh, gltf.skins[skinNdx]));
            }

            // arrange nodes into graph
            gltf.nodes.forEach((node, ndx) => {
                const children = origNodes[ndx].children;
                if (children) {
                    this.addChildren(gltf.nodes, node, children);
                }
            });

            // setup scenes
            for (const scene of gltf.scenes) {
                scene.root = new Node(new TRS(), scene.name);
                this.addChildren(gltf.nodes, scene.root, scene.nodes);
            }

            return gltf;
        },

        addChildren(nodes, node, childIndices) {
            childIndices.forEach((childNdx) => {
                const child = nodes[childNdx];
                child.setParent(node);
            });
        },

        async loadFile(url, typeFunc) {
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error(`could not load: ${url}`);
            }
            return await response[typeFunc]();
        },

        async loadBinary(url) {
            return this.loadFile(url, 'arrayBuffer');
        },

        async loadJSON(url) {
            return this.loadFile(url, 'json');
        },
    }

}

</script>