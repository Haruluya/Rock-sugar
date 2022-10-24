<template lang="html">
    <body>
        <div class="webglContainer">
            <div class="canvesContainer">
                <canvas id="canvas">
                    <pre  id="vertex-shader" type="x-shader/x-vertex">
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
                        void main() {
                           gl_FragColor = v_color;
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
                </div>
            </div>
        </div>
        <div class="desContainer">
            <div class="des">
                <div class="title">
                    <span id="category">webgl</span>
                    <span id="name">Orthographic</span>
                </div>
                <div class="codeLink">
                    <nano_button @handleClick="handleClick"></nano_button>
                </div>
            </div>
            <div class="conclusion">
                <span class="title"><span id="conTitle">正交投影</span></span>
                <span class="content">Orthogonal is more like irrelevant.</span>
            </div>
        </div>
    </body>

   
    
</template>
<script>
export default {
    name:"Orthographic",
    mounted(){
        this.Render();
    },
    methods: {
        Render(){
            function setGeometry(gl) {
                        gl.bufferData(
                            gl.ARRAY_BUFFER,
                            new Float32Array([
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


                            ]),
                            gl.STATIC_DRAW);
                    }

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

            // transform.
            const translation = [120, 180, 0];
            const rotation = [haruluya_webgl_utils.degToRad(40), haruluya_webgl_utils.degToRad(25), haruluya_webgl_utils.degToRad(325)];
            const scale = [0.8, 0.8, 1];

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
            
            const canvas = document.querySelector("#canvas");
            const gl = canvas.getContext("webgl");
            if (!gl) {
                return;
            }
            const program = haruluya_webgl_utils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);

            // lookup.
            const positionLocation = gl.getAttribLocation(program, "a_position");
            const colorLocation = gl.getAttribLocation(program, "a_color");
            const matrixLocation = gl.getUniformLocation(program, "u_matrix");

            // set position.
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            // draw geometry.
            setGeometry(gl);

            const colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

            // draw color.
            setColors(gl);

            // update.
            drawScene();

            // draw slider.
            haruluya_webgl_utils.setupSlider("x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
            haruluya_webgl_utils.setupSlider("y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
            haruluya_webgl_utils.setupSlider("z", {value: translation[2], slide: updatePosition(2), max: gl.canvas.height});
            haruluya_webgl_utils.setupSlider("angleX", {value: haruluya_webgl_utils.radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
            haruluya_webgl_utils.setupSlider("angleY", {value: haruluya_webgl_utils.radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
            haruluya_webgl_utils.setupSlider("angleZ", {value: haruluya_webgl_utils.radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
            haruluya_webgl_utils.setupSlider("scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
            haruluya_webgl_utils.setupSlider("scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
            haruluya_webgl_utils.setupSlider("scaleZ", {value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2});

            // update function.
            function drawScene() {
                haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                // Turn on culling(只绘制正面或反面)
                gl.enable(gl.CULL_FACE);
                
                // Turn on z-buffer.
                gl.enable(gl.DEPTH_TEST);

                gl.useProgram(program);
                gl.enableVertexAttribArray(positionLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

                let size = 3;          
                let type = gl.FLOAT;   
                let normalize = false; 
                let stride = 0;       
                let offset = 0;       
                gl.vertexAttribPointer(
                    positionLocation, size, type, normalize, stride, offset);

                gl.enableVertexAttribArray(colorLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

                size = 3;               
                type = gl.UNSIGNED_BYTE; 
                normalize = true;        
                stride = 0;             
                offset = 0;             
                gl.vertexAttribPointer(
                    colorLocation, size, type, normalize, stride, offset);

                // projection and transform.
                let matrix = haruluya_webgl_utils.projection3d(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
                matrix = haruluya_webgl_utils.translate3d(matrix, translation[0], translation[1], translation[2]);
                matrix = haruluya_webgl_utils.xRotate(matrix, rotation[0]);
                matrix = haruluya_webgl_utils.yRotate(matrix, rotation[1]);
                matrix = haruluya_webgl_utils.zRotate(matrix, rotation[2]);
                matrix = haruluya_webgl_utils.scale3d(matrix,scale[0], scale[1], scale[2]);
                gl.uniformMatrix4fv(matrixLocation, false, matrix);

                const primitiveType = gl.TRIANGLES;
                offset = 0;
                const count = 6 * 6;
                gl.drawArrays(primitiveType, offset, count);
            }
        }
    },
}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>