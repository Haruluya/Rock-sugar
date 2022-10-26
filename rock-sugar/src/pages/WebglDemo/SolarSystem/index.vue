<template>
    <body>
        <div class="webglContainer">
            <div class="canvesContainer">
                <canvas id="canvas" ref="canvas">
                    <pre id="vertex-shader" type="x-shader/x-vertex">
                        attribute vec4 a_position;
                        attribute vec4 a_color;
                        uniform mat4 u_matrix;
                        varying vec4 v_color;
                        void main() {
                          gl_Position = u_matrix * a_position;
                          v_color = a_color;
                        }
                    </pre>
                    <pre  id="fragment-shader" type="x-shader/x-fragment">
                        precision mediump float;
                        varying vec4 v_color; 
                        uniform vec4 u_colorMult;
                        uniform vec4 u_colorOffset;
                        void main() {
                           gl_FragColor = v_color * u_colorMult + u_colorOffset;
                        }
                    </pre>
                </canvas>
            </div>
            <div id="uiContainer">
                <div id="ui">
                    <div id="x"></div>
                    <div id="y"></div>
                    <div id="z"></div>
                    <div id="angleX"></div>
                    <div id="angleY"></div>
                    <div id="angleZ"></div>
                </div>
            </div>
        </div>
        <div class="desContainer">
            <div class="des">
                <div class="title">
                    <span id="category">webgl</span>
                    <span id="name">SolarSystem</span>
                </div>
                <div class="codeLink">
                    <nano_button @handleClick="handleClick"></nano_button>
                </div>
            </div>
            <div class="conclusion">
                <span class="title"><span id="conTitle">太阳系</span></span>
                <span class="content">Will I ever see humans fly out of the solar system?</span>
            </div>
            <div class="menu">
                <nano_items_menu></nano_items_menu>
            </div>
        </div>
    </body>
</template>
<script>

import nano_button from "_packages/nano_button/index.js"
import nano_items_menu from "_packages/nano_items_menu/index.js"

export default {
    name:'SolarSystem',
    components:{
        nano_button,
        nano_items_menu
    },  
    methods:{
        handleClick(){
            window.location.href = 'https://github.com/haruluya/Rock-Sugar';
        }
    },
    mounted() {
        Render();
    }
};
</script>
<style lang="less" scoped>
@import "../index.less";
</style>