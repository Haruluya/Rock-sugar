<template lang="html">
    <nano_shader_toy_renderer_page
        :prop_des_data="desData"
        :prop_ui_setter="uiSetter"
        :prop_vertex_shader="vertexShaderSource"
        :prop_fragment_shader="fragmentShaderSource"
        ref="page"
        @Init="Init"
        @Render="Render"
    />
</template>
<script>
import vertexShaderSource from './resource/vertex-shader'
import fragmentShaderSource from './resource/fragment-shader'

const desData = {
    category:"Experiment",
    name:"ShadowShade",
    buttonContent:"查看源码",
    title:"阴影",
    content:"ShadowShade"
}


const positions = new Float32Array(
    [
    -1, -1,  
     1, -1,
    -1,  1,
    -1,  1, 
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