<template lang="html">
 <div class="title">
        9_MultipleObject
    </div>
    <canvas id="canvas"></canvas>
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
    <div id="uiContainer">
      <div id="ui">
        <div id="color1"></div>
        <div id="color2"></div>
        <div id="amount"></div>
      </div>
    </div>
</template>
<script>

const chroma = require('../../../utils/chroma.min');

export default {
    name:"MultipleObject",
    mounted() {
        this.Render();
    },
    methods: {
        Render(){
        // transform。
        var cameraAngleRadians = haruluya_webgl_utils.degToRad(0);
        var fieldOfViewRadians = haruluya_webgl_utils.degToRad(60);
        var cameraHeight = 50;

        var canvas = document.querySelector("#canvas");
        var gl = canvas.getContext("webgl");
        if (!gl) {
            return;
        }

        gl.enable(gl.DEPTH_TEST);

        // attributes array。
        var arrays = {
            position: { numComponents: 3, data: [0, -10, 0, 10, 10, 0, -10, 10, 0], },
            texcoord: { numComponents: 2, data: [0.5, 0, 1, 1, 0, 1],               },
            normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1],        },
        };

        // 创建buffer。
        var bufferInfo = haruluya_webgl_utils.createBufferInfoFromArrays(gl, arrays);

        // programinfo。
        var programInfo = haruluya_webgl_utils.createProgramInfo(gl, ["vertex-shader", "fragment-shader"]);

        // const全局变量。
        var uniformsThatAreTheSameForAllObjects = {
            u_lightWorldPos:         [-50, 30, 100],
            u_viewInverse:           haruluya_webgl_utils.identity(),
            u_lightColor:            [1, 1, 1, 1],
        };

        // 可变全局变量。
        var uniformsThatAreComputedForEachObject = {
            u_worldViewProjection:   haruluya_webgl_utils.identity(),
            u_world:                 haruluya_webgl_utils.identity(),
            u_worldInverseTranspose: haruluya_webgl_utils.identity(),
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
        haruluya_webgl_utils.setupSlider("amount", {value: amount, slide: updateAmount, min: 0, max: 300, step: 10, precision: 2});
        haruluya_webgl_utils.setupColorInput("color1",updateColor1);
        haruluya_webgl_utils.setupColorInput("color2",updateColor2);


        // 材质。
        var objects = [];

        function createObjects(){
            // 循环创建。
            objects = [];
            var textures = [
                haruluya_webgl_utils.makeStripeTexture(gl, { color1, color2, }),
                haruluya_webgl_utils.makeCheckerTexture(gl,{ color1, color2, }),
                haruluya_webgl_utils.makeCircleTexture(gl, { color1, color2, }),
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
            haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            var projectionMatrix =
                haruluya_webgl_utils.perspective(fieldOfViewRadians, aspect, 1, 2000);

            var cameraPosition = [0, 0, 100];
            var target = [0, 0, 0];
            var up = [0, 1, 0];
            var cameraMatrix = haruluya_webgl_utils.lookAt(cameraPosition, target, up, uniformsThatAreTheSameForAllObjects.u_viewInverse);

            var viewMatrix = haruluya_webgl_utils.inverse(cameraMatrix);
            var viewProjectionMatrix = haruluya_webgl_utils.multiply3d(projectionMatrix, viewMatrix);
            gl.useProgram(programInfo.program);

            // 设置buffer和属性。
            haruluya_webgl_utils.setBuffersAndAttributes(gl, programInfo, bufferInfo);

            // 设置全局变量。
            haruluya_webgl_utils.setUniforms(programInfo, uniformsThatAreTheSameForAllObjects);

            // Draw objects
            objects.forEach(function(object) {
                var worldMatrix = haruluya_webgl_utils.xRotation(object.xRotation * time);
                worldMatrix = haruluya_webgl_utils.yRotate(worldMatrix, object.yRotation * time);
                worldMatrix = haruluya_webgl_utils.translate3d(worldMatrix, 0, 0, object.radius);
                uniformsThatAreComputedForEachObject.u_world = worldMatrix;

                haruluya_webgl_utils.multiply3d(viewProjectionMatrix, worldMatrix, uniformsThatAreComputedForEachObject.u_worldViewProjection);
                haruluya_webgl_utils.transpose(haruluya_webgl_utils.inverse(worldMatrix), uniformsThatAreComputedForEachObject.u_worldInverseTranspose);

                // 设置材质。
                haruluya_webgl_utils.setUniforms(programInfo, uniformsThatAreComputedForEachObject);
                haruluya_webgl_utils.setUniforms(programInfo, object.materialUniforms);
                gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
                // gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
            });

            requestAnimationFrame(drawScene);
        }
        }
    },
}
</script>
<style lang="">
    
</style>