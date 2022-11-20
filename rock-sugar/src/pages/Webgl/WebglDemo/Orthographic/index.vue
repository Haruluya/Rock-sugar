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
import data from './resource/data.js'

const desData = {
    category:"Webgl",
    name:"Orthographic",
    buttonContent:"查看源码",
    title:"正交投影",
    content:"Orthogonal is more like irrelevant."
}


const positions = data.position;
const colors = data.color;

/*
    @author:haruluya
    @des: Orthographic 3d.
*/
export default {
    name:'Orthographic',
    data() {
        return {
            gl: null,
            canvas:null,
            program: null,
            vertexShaderSource,
            fragmentShaderSource,
            desData,
            sectionParams:{
                transform:{
                    translation:[120, 180, 0],
                    rotation:[haruluya_webgl_utils.degToRad(40), haruluya_webgl_utils.degToRad(25), haruluya_webgl_utils.degToRad(325)],
                    scale : [0.8, 0.8, 1]
                }
            },
        }
    },
    methods: {
        Init(){
            this.gl = this.$refs.page.getGL();
            this.canvas = this.$refs.page.getCanvas();
            this.program = this.$refs.page.getProgram();

            this.$refs.page.setTransfrom(this.sectionParams.transform);
            this.$refs.page.addBuffer("position",{data:positions});
            this.$refs.page.addBuffer("color",{data:colors});
        },
        Render(){
            const gl = this.gl;
            // Turn on culling.
            gl.enable(gl.CULL_FACE);
            // Turn on z-buffer.
            gl.enable(gl.DEPTH_TEST);
            let matrix = haruluya_webgl_utils.projection3d(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
            matrix = haruluya_webgl_utils.getTransformMatrix(matrix,this.sectionParams.transform);
            this.$refs.page.addUniform("u_matrix",matrix);
            this.$refs.page.glDraw({mode:gl.TRIANGLES,first:0,count:36})
        },

    },
}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>
