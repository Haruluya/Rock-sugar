<template lang="html">
    <nano_shader_toy_renderer_page
        :prop_des_data="desData"
        :prop_ui_setter="uiSetter"
        :prop_vertex_shader="vertexShaderSource"
        :prop_fragment_shader="fragmentShaderSource"
        ref="page"
        @Init="Init"
        @Render="Render"
        @prop_ui_setter="uiSetter"
    />
</template>
<script>
import vertexShaderSource from './resource/vertex-shader'
import fragmentShaderSource from './resource/fragment-shader'

const desData = {
    category:"Webgl",
    name:"NanoShaderToy",
    buttonContent:"查看源码",
    title:"Shadertoy 渲染器",
    content:"."
}
const positions = new Float32Array(
    [
    -1, -1,  // first triangle
     1, -1,
    -1,  1,
    -1,  1,  // second triangle
     1, -1,
     1,  1,
]
)

export default {
    name:'SpotLight',
    data() {
        return {
            gl: null,
            desData,
            vertexShaderSource,
            fragmentShaderSource,
            perspective:{
                aspect:0,
                fieldOfViewRadians: HNWUEngine.degToRad(60),
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
            page:null,
            uiSetter:[],


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
            this.page.addBuffer("position",{numComponents:2,data:positions});

        },
        Render(){
            const mousePosition = [this.page.getMousePosition().x,this.page.getMousePosition().y];
            const canvasRect = [this.gl.canvas.width,this.gl.canvas.height]
            const time = this.page.getTime();
            this.page.addUniform("iResolution",canvasRect);
            this.page.addUniform("iMouse",mousePosition);
            this.page.addUniform("iTime",time);
           
        },

    }
}

</script>