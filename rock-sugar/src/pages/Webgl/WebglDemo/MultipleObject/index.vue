<template lang="html">
    <body>
        <div class="webglContainer">
            <div class="canvesContainer">
                <canvas id="canvas">
                    <pre  id="vertex-shader" type="x-shader/x-vertex">
                        uniform mat4 u_worldViewProjection;
                        uniform vec3 u_lightWorldPos;
                        uniform mat4 u_world;
                        uniform mat4 u_viewInverse;
                        uniform mat4 u_worldInverseTranspose;
                        attribute vec4 a_position;
                        attribute vec3 a_normal;
                        attribute vec2 a_texcoord;
                        varying vec4 v_position;
                        varying vec2 v_texCoord;
                        varying vec3 v_normal;
                        varying vec3 v_surfaceToLight;
                        varying vec3 v_surfaceToView;
                
                        void main() {
                            v_texCoord = a_texcoord;
                            v_position = (u_worldViewProjection * a_position);
                            v_normal = (u_worldInverseTranspose * vec4(a_normal, 0)).xyz;
                            v_surfaceToLight = u_lightWorldPos - (u_world * a_position).xyz;
                            v_surfaceToView = (u_viewInverse[3] - (u_world * a_position)).xyz;
                            gl_Position = v_position;
                        }
                
                    </pre>
                    <pre  id="fragment-shader" type="x-shader/x-fragment">
                        precision mediump float;
                
                        varying vec4 v_position;
                        varying vec2 v_texCoord;
                        varying vec3 v_normal;
                        varying vec3 v_surfaceToLight;
                        varying vec3 v_surfaceToView;
                        
                        uniform vec4 u_lightColor;
                        uniform vec4 u_colorMult;
                        uniform sampler2D u_diffuse;
                        uniform vec4 u_specular;
                        uniform float u_shininess;
                        uniform float u_specularFactor;
                        
                        vec4 lit(float l ,float h, float m) {
                          return vec4(1.0,
                                      abs(l), (l > 0.0) ? pow(max(0.0, h), m) : 0.0,
                                      1.0);
                        }
                        
                        void main() {
                          vec4 diffuseColor = texture2D(u_diffuse, v_texCoord);
                          vec3 a_normal = normalize(v_normal);
                          vec3 surfaceToLight = normalize(v_surfaceToLight);
                          vec3 surfaceToView = normalize(v_surfaceToView);
                          vec3 halfVector = normalize(surfaceToLight + surfaceToView);
                          vec4 litR = lit(dot(a_normal, surfaceToLight),
                                            dot(a_normal, halfVector), u_shininess);
                          vec4 outColor = vec4((
                          u_lightColor * (diffuseColor * litR.y * u_colorMult +
                                        u_specular * litR.z * u_specularFactor)).rgb,
                              diffuseColor.a);
                          gl_FragColor = outColor;
                        }
                    </pre>
                </canvas>
            </div>
            <div id="uiContainer">
                <div id="ui">
                  <div id="color1"></div>
                  <div id="color2"></div>
                  <div id="amount"></div>
                </div>
              </div>
        </div>
        <div class="desContainer">
            <div class="des">
                <div class="title">
                    <span id="category">webgl</span>
                    <span id="name">MultipleObject</span>
                </div>
                <div class="codeLink">
                    <nano_button @handleClick="handleClick"></nano_button>
                </div>
            </div>
            <div class="conclusion">
                <span class="title"><span id="conTitle">???????????????</span></span>
                <span class="content">I want to render a lot of money.</span>
            </div>
            <div class="menu">
                <nano_items_menu></nano_items_menu>
            </div>
        </div>
    </body>



</template>
<script>

// const chroma = require('_utils/chroma.min');

export default {
    name:"MultipleObject",
    mounted() {
        this.Render();
    },
    methods: {
        Render(){
        // transform???
        var cameraAngleRadians = HNWUEngine.degToRad(0);
        var fieldOfViewRadians = HNWUEngine.degToRad(60);
        var cameraHeight = 50;

        var canvas = document.querySelector("#canvas");
        var gl = canvas.getContext("webgl");
        if (!gl) {
            return;
        }

        gl.enable(gl.DEPTH_TEST);

        // attributes array???
        var arrays = {
            position: { numComponents: 3, data: [0, -10, 0, 10, 10, 0, -10, 10, 0], },
            texcoord: { numComponents: 2, data: [0.5, 0, 1, 1, 0, 1],               },
            normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1],        },
        };

        // ??????buffer???
        var bufferInfo = HNWUEngine.createBufferInfoFromArrays(gl, arrays);

        // programinfo???
        var programInfo = HNWUEngine.createProgramInfo(gl, ["vertex-shader", "fragment-shader"]);

        // const???????????????
        var uniformsThatAreTheSameForAllObjects = {
            u_lightWorldPos:         [-50, 30, 100],
            u_viewInverse:           HNWUEngine.identity(),
            u_lightColor:            [1, 1, 1, 1],
        };

        // ?????????????????????
        var uniformsThatAreComputedForEachObject = {
            u_worldViewProjection:   HNWUEngine.identity(),
            u_world:                 HNWUEngine.identity(),
            u_worldInverseTranspose: HNWUEngine.identity(),
        };

        var rand = function(min, max) {
            if (max === undefined) {
            max = min;
            min = 0;
            }
            return min + Math.random() * (max - min);
        };

        var randInt = function(range) {
            return Math.floor(Math.random() * range);
        };

        // transform.
        let color1 = "#FFD700";
        let color2 = "#FFFF00";
        let amount = 200;

        // callback.
        function updateColor1(event) {
            color1 = event.target.value;
            createObjects();
            drawScene();
        }
        function updateColor2(event){
            color1 = event.target.value;
            createObjects();
            drawScene();
        }
        function updateAmount(event,ui) {
            amount = ui.value;
            createObjects();
            drawScene();
        }
        HNWUEngine.setupSlider("amount", {value: amount, slide: updateAmount, min: 0, max: 300, step: 10, precision: 2});
        HNWUEngine.setupColorInput("color1",updateColor1);
        HNWUEngine.setupColorInput("color2",updateColor2);


        // ?????????
        var objects = [];

        function createObjects(){
            // ???????????????
            objects = [];
            var textures = [
                HNWUEngine.makeStripeTexture(gl, { color1, color2, }),
                HNWUEngine.makeCheckerTexture(gl,{ color1, color2, }),
                HNWUEngine.makeCircleTexture(gl, { color1, color2, }),
            ];
            var numObjects = amount;
            var baseColor = rand(240);
            for (var ii = 0; ii < numObjects; ++ii) {
                objects.push({
                    radius: rand(150),
                    xRotation: rand(Math.PI * 2),
                    yRotation: rand(Math.PI),
                    materialUniforms: {
                        u_colorMult:             chroma.hsv(rand(baseColor, baseColor + 120), 0.5, 1).gl(),
                        u_diffuse:               textures[randInt(textures.length)],
                        u_specular:              [1, 1, 1, 1],
                        u_shininess:             rand(500),
                        u_specularFactor:        rand(1),
                    },
                });
            }
        }

        createObjects()

        requestAnimationFrame(drawScene);

        function drawScene(time) {
            time = time * 0.0001 + 5;
            HNWUEngine.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            var projectionMatrix =
                HNWUEngine.perspective(fieldOfViewRadians, aspect, 1, 2000);

            var cameraPosition = [0, 0, 100];
            var target = [0, 0, 0];
            var up = [0, 1, 0];
            var cameraMatrix = HNWUEngine.lookAt(cameraPosition, target, up, uniformsThatAreTheSameForAllObjects.u_viewInverse);

            var viewMatrix = HNWUEngine.inverse(cameraMatrix);
            var viewProjectionMatrix = HNWUEngine.multiply3d(projectionMatrix, viewMatrix);
            gl.useProgram(programInfo.program);

            // ??????buffer????????????
            HNWUEngine.setBuffersAndAttributes(gl, programInfo, bufferInfo);

            // ?????????????????????
            HNWUEngine.setUniforms(programInfo, uniformsThatAreTheSameForAllObjects);

            // Draw objects
            objects.forEach(function(object) {
                var worldMatrix = HNWUEngine.xRotation(object.xRotation * time);
                worldMatrix = HNWUEngine.yRotate(worldMatrix, object.yRotation * time);
                worldMatrix = HNWUEngine.translate3d(worldMatrix, 0, 0, object.radius);
                uniformsThatAreComputedForEachObject.u_world = worldMatrix;

                HNWUEngine.multiply3d(viewProjectionMatrix, worldMatrix, uniformsThatAreComputedForEachObject.u_worldViewProjection);
                HNWUEngine.transpose(HNWUEngine.inverse(worldMatrix), uniformsThatAreComputedForEachObject.u_worldInverseTranspose);

                // ???????????????
                HNWUEngine.setUniforms(programInfo, uniformsThatAreComputedForEachObject);
                HNWUEngine.setUniforms(programInfo, object.materialUniforms);
                gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
                // gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
            });

            requestAnimationFrame(drawScene);
        }
        }
    },
}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>