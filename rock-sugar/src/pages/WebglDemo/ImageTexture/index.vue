<template lang="html">
    <div class="pageContainer">
        <div class="webglContainer">
            <nano_canvas
             :prop_vertex_shader_source="vertexShaderSource"
             :prop_fragment_shader_source="fragmentShaderSource"
            />
            <div id="uiContainer">
                <div id="ui">
                </div>
            </div>
        </div>
        
        <nano_webgl_des_panel
            :prop_category="desData.category"
            :prop_name="desData.name"
            :prop_button_content="desData.buttonContent"
            :prop_title="desData.title"
            :prop_content="desData.content"
            @handleClick="handleClick"
            />

    </div>

    
</template>
<script>
import haruluyaImg from "../../../assets/images/haruluya.jpg"

const desData = {
    category:"Webgl",
    name:"ImageTexture",
    buttonContent:"查看源码",
    title:"材质",
    content:"Maybe putting my picture here is the only way I can make a record."
}


const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec2 a_texcoord;

    uniform mat4 u_matrix;

    varying vec2 v_texcoord;

    void main() {
        gl_Position = u_matrix * a_position;
        v_texcoord = a_texcoord;
    }
`

const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_texcoord;
    uniform sampler2D u_texture;

    void main() {
        gl_FragColor = texture2D(u_texture, v_texcoord);
    }
`

const position = [
    -0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
    0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
    0.5,  0.5,  -0.5,
    0.5, -0.5,  -0.5,

    -0.5, -0.5,   0.5,
    0.5, -0.5,   0.5,
    -0.5,  0.5,   0.5,
    -0.5,  0.5,   0.5,
    0.5, -0.5,   0.5,
    0.5,  0.5,   0.5,

    -0.5,   0.5, -0.5,
    -0.5,   0.5,  0.5,
    0.5,   0.5, -0.5,
    -0.5,   0.5,  0.5,
    0.5,   0.5,  0.5,
    0.5,   0.5, -0.5,

    -0.5,  -0.5, -0.5,
    0.5,  -0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,  -0.5,  0.5,
    0.5,  -0.5, -0.5,
    0.5,  -0.5,  0.5,

    -0.5,  -0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,   0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,   0.5,  0.5,
    -0.5,   0.5, -0.5,

    0.5,  -0.5, -0.5,
    0.5,   0.5, -0.5,
    0.5,  -0.5,  0.5,
    0.5,  -0.5,  0.5,
    0.5,   0.5, -0.5,
    0.5,   0.5,  0.5,

]
const texcord =  [
    // select the top left image
    0   , 0  ,
    0   , 0.5,
    0.25, 0  ,
    0   , 0.5,
    0.25, 0.5,
    0.25, 0  ,
    // select the top middle image
    0.25, 0  ,
    0.5 , 0  ,
    0.25, 0.5,
    0.25, 0.5,
    0.5 , 0  ,
    0.5 , 0.5,
    // select to top right image
    0.5 , 0  ,
    0.5 , 0.5,
    0.75, 0  ,
    0.5 , 0.5,
    0.75, 0.5,
    0.75, 0  ,
    // select the bottom left image
    0   , 0.5,
    0.25, 0.5,
    0   , 1  ,
    0   , 1  ,
    0.25, 0.5,
    0.25, 1  ,
    // select the bottom middle image
    0.25, 0.5,
    0.25, 1  ,
    0.5 , 0.5,
    0.25, 1  ,
    0.5 , 1  ,
    0.5 , 0.5,
    // select the bottom right image
    0.5 , 0.5,
    0.75, 0.5,
    0.5 , 1  ,
    0.5 , 1  ,
    0.75, 0.5,
    0.75, 1  ,
]

export default {
    name:'ImageTexture',
    data() {
        return {
            gl: null,
            canvas: null,
            program: null,
            vertexShaderSource,
            fragmentShaderSource,
            desData,
            position,
            texcord,
            transfrom:{
                fieldOfViewRadians: haruluya_webgl_utils.degToRad(60),
                modelXRotationRadians: haruluya_webgl_utils.degToRad(0),
                modelYRotationRadians: haruluya_webgl_utils.degToRad(0),

            }
        }
    },
    mounted() {
        this.Init();
        this.SetUI();

    },
    methods: {
        Init(){
            const { gl, canvas } = haruluya_webgl_utils.initWebglContext("canvas");
            this.gl = gl;
            this.canvas = canvas;
            this.program = haruluya_webgl_utils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);
            
        },
        Render(){

        },
        SetUI(){

        },
        Destory(){

        },
        handleClick() {
            window.location.href = "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/WebglDemo/ImageTexture/index.vue";
        },

    },
    beforeDestory() {
        this.Destory();
    },
}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>
