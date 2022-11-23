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


const desData = {
    category:"Webgl",
    name:"CameraPosition",
    buttonContent:"查看源码",
    title:"相机",
    content:"He suddenly realized he'd never taken a selfie before."
}



// import modelData from '_utils/outData/HeadData.js'

export default {
    name:'CameraPosition',
    data() {
        return {
            gl: null,
            canvas: null,
            program: null,
            vertexShaderSource,
            fragmentShaderSource,
            desData,
            bufferData:{
                position:{data:[]},
                color:{data:[]},
            },
            uniformsData:{
                u_matrix: null,
            },
            bufferInfo:null,
            uniformSetters:null,
            attribSetters:null,
            transfrom:{
                translation:[0, 0, 0],
                rotation:[HNWUEngine.degToRad(0), HNWUEngine.degToRad(0), HNWUEngine.degToRad(0)],
                scale : [1, 1, 1]

            },
            perspective:{
                aspect:0,
                fieldOfViewRadians:  HNWUEngine.degToRad(60),
                zNear: 1,
                zFar: 3000,
            },
            camera:{
                cameraTarget:[0,-100,0],
                cameraPosition:[500,300,500],
                up:[0,1,0]
            },
            sectionParams:{
                target:[0, 200, 300],
                targetAngleRadians: 0,
                targetRadius: 300,
                numFs:5,
                radius:600,
                deep:5,
                across:5,
            },
            numElements:0,

        }
    },
    mounted() {
        this.Init();
        this.SetUI();

    },
    methods: {
        Init(){
            this.page = this.$refs.page;
            this.gl = this.page.getGL();
            this.canvas = this.page.getCanvas();
            this.program = this.page.getProgram();
            //Get bufferinfo and setters.
            this.numElements = this.setPosition();
            this.setColor();
            this.perspective.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            this.page.addBuffer("position",{data:positions});
            this.page.addBuffer("color",{data:colors});
        },
        Render(){
            const gl = this.gl;
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            //perspective.
            let projectionMatrix = HNWUEngine.perspective(this.perspective.fieldOfViewRadians, 
                this.perspective.aspect, 
                this.perspective.zNear, 
                this.perspective.zFar
            );

            let cameraMatrix = HNWUEngine.lookAt(this.camera.cameraPosition, this.camera.cameraTarget, this.camera.up);
            let viewMatrix = HNWUEngine.inverse(cameraMatrix);
            let viewProjectionMatrix = HNWUEngine.multiply3d(projectionMatrix, viewMatrix);
            
            
            // Draw circle。
            let deep = this.sectionParams.deep;
            let across = this.sectionParams.across;
            for (let zz = 0; zz < deep; ++zz) {
                let v = zz / (deep - 1);
                let z = (v - .5) * deep * 150;
                for (let xx = 0; xx < across; ++xx) {
                    let u = xx / (across - 1);
                    let x = (u - .5) * across * 150;
                    let matrix = HNWUEngine.lookAt([x, 0, z], this.sectionParams.target, this.camera.up);
                    const MVP = HNWUEngine.multiply3d(viewProjectionMatrix, matrix);
                    this.uniformsData.u_matrix = MVP;
                    HNWUEngine.setUniforms(this.uniformSetters, this.uniformsData);
                    gl.drawArrays(gl.TRIANGLES, 0, this.numElements);
                }
            }
        },

        setPosition(){
            let positions = new Float32Array(modelData.positions);
            let matrix = HNWUEngine.multiply3d(HNWUEngine.scaling3d(6, 6, 6), HNWUEngine.yRotation(Math.PI));
            for (let ii = 0; ii < positions.length; ii += 3) {
                let vector = HNWUEngine.vectorMultiply([positions[ii + 0], positions[ii + 1], positions[ii + 2], 1], matrix);
                positions[ii + 0] = vector[0];
                positions[ii + 1] = vector[1];
                positions[ii + 2] = vector[2];
            }
            this.bufferData.position.data = positions;
            return positions.length / 3;
        },
        setColor(){
            let normals = modelData.normals;
            let colors = new Uint8Array(normals.length);
            let offset = 0;
            for (let ii = 0; ii < colors.length; ii += 3) {
                for (let jj = 0; jj < 3; ++jj) {
                colors[offset] = (normals[offset] * 0.5 + 0.5) * 255;
                ++offset;
                }
            }
            this.bufferData.color.data = colors;
        }

    },

}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>
