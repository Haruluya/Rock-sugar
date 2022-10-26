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
                  <div id="targetAngle"></div>
                  <div id="targetHeight"></div>
                </div>
              </div>
        </div>
        <div class="desContainer">
            <div class="des">
                <div class="title">
                    <span id="category">webgl</span>
                    <span id="name">CameraPosition</span>
                </div>
                <div class="codeLink">
                    <nano_button @handleClick="handleClick"></nano_button>
                </div>
            </div>
            <div class="conclusion">
                <span class="title"><span id="conTitle">相机</span></span>
                <span class="content">I suddenly realized I'd never taken a selfie before.</span>
            </div>
            <div class="menu">
                <nano_items_menu></nano_items_menu>
            </div>
        </div>
    </body>



</template>
<script>
export default {
    name:'CameraPosition',
    mounted() {
        this.Render();
    },
    methods: {
        Render(){
        function setGeometry(gl) {
            var positions = new Float32Array(HeadData.positions);
            var matrix = haruluya_webgl_utils.multiply3d(haruluya_webgl_utils.scaling3d(6, 6, 6), haruluya_webgl_utils.yRotation(Math.PI));
            for (var ii = 0; ii < positions.length; ii += 3) {
                var vector = haruluya_webgl_utils.vectorMultiply([positions[ii + 0], positions[ii + 1], positions[ii + 2], 1], matrix);
                positions[ii + 0] = vector[0];
                positions[ii + 1] = vector[1];
                positions[ii + 2] = vector[2];
            }

            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
            return positions.length / 3;
        }
        function setColors(gl, numElements) {
            var normals = HeadData.normals;
            var colors = new Uint8Array(normals.length);
            var offset = 0;
            for (var ii = 0; ii < colors.length; ii += 3) {
                for (var jj = 0; jj < 3; ++jj) {
                colors[offset] = (normals[offset] * 0.5 + 0.5) * 255;
                ++offset;
                }
            }
            gl.bufferData(
                gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        }


        // transform.
        const target = [0, 200, 300];
        const targetAngleRadians = 0;
        const targetRadius = 300;
        const fieldOfViewRadians = haruluya_webgl_utils.degToRad(60);
        // callback.
        function updateTargetAngle(event, ui) {
            targetAngleRadians = haruluya_webgl_utils.degToRad(ui.value);
            target[0] = Math.sin(targetAngleRadians) * targetRadius;
            target[2] = Math.cos(targetAngleRadians) * targetRadius;
            drawScene();
        }
        function updateTargetHeight(event, ui) {
            target[1] = ui.value;
            drawScene();
        }


        const canvas = document.querySelector("#canvas");
        const gl = canvas.getContext("webgl");
        if (!gl) {
            return;
        }

        const program = haruluya_webgl_utils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);
        gl.useProgram(program);

        // lookup.
        const positionLocation = gl.getAttribLocation(program, "a_position");
        const colorLocation = gl.getAttribLocation(program, "a_color");
        const matrixLocation = gl.getUniformLocation(program, "u_matrix");
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // set geometry.
        const numElements = setGeometry(gl);

        // set color.
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        setColors(gl);

        drawScene();

        // ui.
        haruluya_webgl_utils.setupSlider("targetAngle", {value: haruluya_webgl_utils.radToDeg(targetAngleRadians), slide: updateTargetAngle, min: -360, max: 360});
        haruluya_webgl_utils.setupSlider("targetHeight", {value: target[1], slide: updateTargetHeight, min: 50, max: 300});


        // update.
        function drawScene() {

            const numFs = 5;
            const radius = 600;
            haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.useProgram(program);

            // position.
            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            let size = 3;         
            let type = gl.FLOAT;   
            let normalize = false; 
            let stride = 0;        
            let offset = 0;       
            gl.vertexAttribPointer(
                positionLocation, size, type, normalize, stride, offset);

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
            let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            let zNear = 1;
            let zFar = 3000;
            let projectionMatrix = haruluya_webgl_utils.perspective(fieldOfViewRadians, aspect, zNear, zFar);


            // 相机追踪目标。
            var cameraTarget = [0, -100, 0];
            var cameraPosition = [500, 300, 500];
            var up = [0, 1, 0];
            var cameraMatrix = haruluya_webgl_utils.lookAt(cameraPosition, cameraTarget, up);
            var viewMatrix = haruluya_webgl_utils.inverse(cameraMatrix);
            var viewProjectionMatrix = haruluya_webgl_utils.multiply3d(projectionMatrix, viewMatrix);

            // 画人头。
            var deep = 5;
            var across = 5;
            for (var zz = 0; zz < deep; ++zz) {
                var v = zz / (deep - 1);
                var z = (v - .5) * deep * 150;
                for (var xx = 0; xx < across; ++xx) {
                    var u = xx / (across - 1);
                    var x = (u - .5) * across * 150;
                    var matrix = haruluya_webgl_utils.lookAt([x, 0, z], target, up);
                    drawHead(matrix, viewProjectionMatrix, matrixLocation, numElements);
                }
            }
            drawHead(haruluya_webgl_utils.translation3d(target[0], target[1], target[2]), viewProjectionMatrix, matrixLocation, numElements);
        }

        function drawHead(matrix, viewProjectionMatrix, matrixLocation, numElements) {
            matrix = haruluya_webgl_utils.multiply3d(viewProjectionMatrix, matrix);

            gl.uniformMatrix4fv(matrixLocation, false, matrix);
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            gl.drawArrays(gl.TRIANGLES, 0, numElements);
        }
        }
    },
}
</script>
<style lang="less" scoped>
@import "../index.less";
</style>