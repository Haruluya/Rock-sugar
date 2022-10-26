<template lang="html">
    <body>
        <div class="webglContainer">
            <div class="canvesContainer">
                <canvas id="canvas">
                    <pre  id="vertex-shader" type="x-shader/x-vertex">
                        attribute vec4 a_position;
                        attribute vec3 a_normal;
                        attribute vec4 a_color;
                        //点光源位置。
                        uniform vec3 u_lightWorldPosition;
                        //
                        uniform vec3 u_viewWorldPosition;
                        //变换矩阵.
                        uniform mat4 u_world;
                        uniform mat4 u_worldViewProjection;
                        uniform mat4 u_worldInverseTranspose;
                        varying vec3 v_normal;
                        varying vec3 v_surfaceToLight;
                        varying vec3 v_surfaceToView;
                        varying vec4 v_color;
                        void main() {
                          gl_Position = u_worldViewProjection * a_position;
                          v_normal = mat3(u_worldInverseTranspose) * a_normal;
                          vec3 surfaceWorldPosition = (u_world * a_position).xyz;
                          v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
                          v_surfaceToView = normalize(u_viewWorldPosition - surfaceWorldPosition);
                          v_color = a_color;
                        }
                    </pre>
                    <pre  id="fragment-shader" type="x-shader/x-fragment">
                        precision mediump float;
                        varying vec3 v_normal;
                        varying vec3 v_surfaceToLight;
                        varying vec3 v_surfaceToView;
                        varying vec4 v_color;
                        uniform float u_shininess;
                        uniform vec3 u_lightColor;
                        uniform vec3 u_specularColor;
                        
                        void main() {
                          vec3 normal = normalize(v_normal);
                          vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
                          vec3 surfaceToViewDirection = normalize(v_surfaceToView);
                          vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
                          float light = dot(normal, surfaceToLightDirection);
                          float specular = 0.0;
                          //高光.
                          if (light > 0.0) {
                            specular = pow(dot(normal, halfVector), u_shininess);
                          }
                          gl_FragColor = v_color;
                          gl_FragColor.rgb *= light * u_lightColor;
                          gl_FragColor.rgb += specular * u_specularColor;
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
                    <div id="scaleX"></div>
                    <div id="scaleY"></div>
                    <div id="scaleZ"></div>
                    <div id="shininess"></div>
                    <div id="lightColor"></div>
                </div>
            </div>
        </div>
        <div class="desContainer">
            <div class="des">
                <div class="title">
                    <span id="category">webgl</span>
                    <span id="name">LightingPoint</span>
                </div>
                <div class="codeLink">
                    <nano_button @handleClick="handleClick"></nano_button>
                </div>
            </div>
            <div class="conclusion">
                <span class="title"><span id="conTitle">点光源</span></span>
                <span class="content">Point light is like a ray of hope, destined not to shine on the whole world</span>
            </div>
            <div class="menu">
                <nano_items_menu></nano_items_menu>
            </div>
        </div>
    </body>

    

</template>
<script>
export default {
    name:'LightingPoint',
    mounted() {
        this.Render();
    },
    methods: {
        Render(){
                  function setGeometry(gl) {
            var positions = new Float32Array([
                    // 正面。
                    200,   50,  0,
                    0, 50,  0,
                    0,   150,  0,
                    0, 150,  0,
                    200, 150,  0,
                    200,   50,  0,

                    // 顶面。
                    200,   50,  100,
                    0,  50,  100,
                    0,   50,  0,
                    0,  50,  0,
                    200,  50,  0,
                    200,   50,  100,

                    // 右侧面。
                    200,  50,  0,
                    200,  150,  0,
                    200,  150,  100,
                    200,  150,  100,
                    200,  50,  100,
                    200,  50,  0,

                    // 左侧面。
                    0,   50,  0,
                    0,   50,  100,
                    0,   150,  100,
                    0,   150,  100,
                    0,   150,  0,
                    0, 50,  0,

                    // 底面。
                    0,   150,  0,
                    0,   150,  100,
                    200,   150,  100,
                    200,   150,  100,
                    200,  150,  0,
                    0,   150,  0,

                    // 后面。
                    200,  50,  100,
                    200,  150,  100,
                    0,  150,  100,
                    0,  150,  100,
                    0,  50,  100,
                    200,  50,  100,  


                ]);
                var matrix = haruluya_webgl_utils.xRotation(Math.PI);
                matrix = haruluya_webgl_utils.translate3d(matrix, -50, -75, -15);

                for (var ii = 0; ii < positions.length; ii += 3) {
                    var vector = haruluya_webgl_utils.transformPoint(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
                    positions[ii + 0] = vector[0];
                    positions[ii + 1] = vector[1];
                    positions[ii + 2] = vector[2];
                }

                gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
            }

        // color.
        function setColors(gl) {
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Uint8Array([
                    // 正面。
                    0,  59, 252,
                    0,  80, 252,
                    0,  218, 252,
                    0,  218, 252,
                    0,  80, 252,
                    0,  59, 252,
                    // 顶面。
                    252,  0, 0,
                    150,  0, 0,
                    0,  0, 0,
                    0,  0, 0,
                    150,  0, 0,
                    252,  0, 0,

                    // 右侧面。
                    252,  227, 103,
                    150,  227, 103,
                    0,  227, 103,
                    0,  227, 103,
                    150,  227, 103,
                    252,  227, 103,

                    // 左侧面。
                    252,  227, 103,
                    150,  227, 103,
                    0,  227, 103,
                    0,  227, 103,
                    150,  227, 103,
                    252,  227, 103,

                    // 底面。
                    252,  0, 0,
                    150,  0, 0,
                    0,  0, 0,
                    0,  0, 0,
                    150,  0, 0,
                    252,  0, 0,

                    // 后面。
                    0,  59, 252,
                    0,  80, 252,
                    0,  218, 252,
                    0,  218, 252,
                    0,  80, 252,
                    0,  59, 252,

                  ]),
                gl.STATIC_DRAW);
        }

        // normal. 
        function setNormals(gl) {
            var normals = new Float32Array([
                // 正面。
                0,0,1,
                0,0,1,
                0,0,1,
                0,0,1,
                0,0,1,
                0,0,1,
                // 顶面。
                0,1,0,
                0,1,0,
                0,1,0,
                0,1,0,
                0,1,0,
                0,  1,0,
                // 右侧面。
                1,0,0,
                1,0,0,
                1,0,0,
                1,0,0,
                1,0,0,
                1,0,0,
                // 左侧面。
                -1,0,0,
                -1,0,0,
                -1,0,0,
                -1,0,0,
                -1,0,0,
                -1,0,0,
                // 底面。
                0,-1,0,
                0,-1,0,
                0,-1,0,
                0,-1,0,
                0,-1,0,
                0,-1,0,
                // 后面。
                0,0,-1,
                0,0,-1,
                0,0,-1,
                0,0,-1,
                0,0,-1,
                0,0,-1,
        
            ]);
            gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        }
        
        
        var shininess = 150;
        // transform.
        const translation = [0, 0, 0];
        const rotation = [haruluya_webgl_utils.degToRad(180), haruluya_webgl_utils.degToRad(185), haruluya_webgl_utils.degToRad(360)];
        const scale = [1, 0.8, 1];
        let lightColor = [1,1,1];
        // transform callback.
        function updatePosition(index) {
            return function(event, ui) {
                translation[index] = ui.value;
                drawScene();
            };
        }

        function updateRotation(index) {
            return function(event, ui) {
                const angleInDegrees = ui.value;
                const angleInRadians = angleInDegrees * Math.PI / 180;
                rotation[index] = angleInRadians;
                drawScene();
            };
        }

        function updateScale(index) {
            return function(event, ui) {
                scale[index] = ui.value;
                drawScene();
            };
        }

        function updateShininess(event, ui) {
            shininess = ui.value;
            drawScene();
        }

        function updateLightColor(event){
            lightColor = haruluya_webgl_utils.colorToRGB(event.target.value);
            drawScene();
        }

        var canvas = document.querySelector("#canvas");
        var gl = canvas.getContext("webgl");
        if (!gl) {
            return;
        }

        var program = haruluya_webgl_utils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);
        
        // lookup.
        var positionLocation = gl.getAttribLocation(program, "a_position");
        var normalLocation = gl.getAttribLocation(program, "a_normal");
        var worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
        var worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
        var shininessLocation = gl.getUniformLocation(program, "u_shininess");
        var lightWorldPositionLocation =
            gl.getUniformLocation(program, "u_lightWorldPosition");
        var viewWorldPositionLocation =
            gl.getUniformLocation(program, "u_viewWorldPosition");
        var worldLocation =
            gl.getUniformLocation(program, "u_world");
        var lightColorLocation =
            gl.getUniformLocation(program, "u_lightColor");
        var specularColorLocation =
            gl.getUniformLocation(program, "u_specularColor");
        const colorLocation = gl.getAttribLocation(program, "a_color");
     

        // position.
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        setGeometry(gl);

        // normal.
        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        setNormals(gl);
        
        // color.
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        setColors(gl);

        drawScene();

    
        haruluya_webgl_utils.setupSlider("shininess", {value: shininess, slide: updateShininess, min: 1, max: 300});
        haruluya_webgl_utils.setupSlider("x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
        haruluya_webgl_utils.setupSlider("y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
        haruluya_webgl_utils.setupSlider("z", {value: translation[2], slide: updatePosition(2), max: gl.canvas.height});
        haruluya_webgl_utils.setupSlider("angleX", {value: haruluya_webgl_utils.radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
        haruluya_webgl_utils.setupSlider("angleY", {value: haruluya_webgl_utils.radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
        haruluya_webgl_utils.setupSlider("angleZ", {value: haruluya_webgl_utils.radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
        haruluya_webgl_utils.setupSlider("scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
        haruluya_webgl_utils.setupSlider("scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
        haruluya_webgl_utils.setupSlider("scaleZ", {value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2});
        haruluya_webgl_utils.setupColorInput("lightColor",updateLightColor)

        function drawScene() {
            haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.useProgram(program);

            // position.
            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            var size = 3;        
            var type = gl.FLOAT;  
            var normalize = false; 
            var stride = 0;       
            var offset = 0;        
            gl.vertexAttribPointer(
                positionLocation, size, type, normalize, stride, offset);


            // normal.
            gl.enableVertexAttribArray(normalLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            var size = 3;         
            var type = gl.FLOAT;  
            var normalize = false; 
            var stride = 0;       
            var offset = 0;      
            gl.vertexAttribPointer(
                normalLocation, size, type, normalize, stride, offset);

            // color.
            gl.enableVertexAttribArray(colorLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            size = 3;               
            type = gl.UNSIGNED_BYTE; 
            normalize = true;        
            stride = 0;             
            offset = 0;             
            gl.vertexAttribPointer(
                colorLocation, size, type, normalize, stride, offset);

            // perspective.
            var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            var zNear = 1;
            var zFar = 2000;
            var projectionMatrix = haruluya_webgl_utils.perspective(haruluya_webgl_utils.degToRad(60) , aspect, zNear, zFar);

            // lookAt transform.
            var camera = [100, 150, 200];
            var target = [0, 35, 0];
            var up = [0, 1, 0];
            var cameraMatrix = haruluya_webgl_utils.lookAt(camera, target, up);

            var viewMatrix = haruluya_webgl_utils.inverse(cameraMatrix);
            var viewProjectionMatrix = haruluya_webgl_utils.multiply3d(projectionMatrix, viewMatrix);
            var worldMatrix =  haruluya_webgl_utils.xRotation(rotation[0]);
            worldMatrix = haruluya_webgl_utils.multiply3d(worldMatrix,haruluya_webgl_utils.translation3d(translation[0],translation[1],translation[2]));
            worldMatrix = haruluya_webgl_utils.multiply3d(worldMatrix,haruluya_webgl_utils.yRotation(rotation[1]));
            worldMatrix = haruluya_webgl_utils.multiply3d(worldMatrix,haruluya_webgl_utils.zRotation(rotation[2]));
            worldMatrix = haruluya_webgl_utils.multiply3d(worldMatrix,haruluya_webgl_utils.scaling3d(scale[0],scale[1],scale[2]));

            // Multiply the matrices.
            var worldViewProjectionMatrix = haruluya_webgl_utils.multiply3d(viewProjectionMatrix, worldMatrix);
            var worldInverseMatrix = haruluya_webgl_utils.inverse(worldMatrix);
            var worldInverseTransposeMatrix = haruluya_webgl_utils.transpose(worldInverseMatrix);

            // Set the matrices
            gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix);
            gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
            gl.uniformMatrix4fv(worldLocation, false, worldMatrix);

        
            gl.uniform3fv(lightWorldPositionLocation, [0, 0, 120]);
            gl.uniform3fv(viewWorldPositionLocation, camera);
            gl.uniform1f(shininessLocation, shininess);
            gl.uniform3fv(lightColorLocation, haruluya_webgl_utils.normalize(lightColor));  
            gl.uniform3fv(specularColorLocation, haruluya_webgl_utils.normalize(lightColor));  


            // Draw the geometry.
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 6 * 6;
            gl.drawArrays(primitiveType, offset, count);
        }
        }
    },
}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>    