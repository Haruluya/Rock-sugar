<template lang="html">
    <body>
            <div class="title">
        1_Triangle
    </div>
    <canvas id="triangle_content">
        <div id="vertex-shader">
            attribute vec2 a_position;
            uniform mat3 u_matrix;
            varying vec4 v_color;    
            void main() {
              gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
              v_color = gl_Position * 0.5 + 0.5;
            }
        </div>
        <div id="frament-shader">
            precision mediump float;
            varying vec4 v_color;
            void main() {
              gl_FragColor = v_color;
            }
        </div>
    </canvas>
    <div id="uiContainer">
        <div id="ui">
          <div id="x"></div>
          <div id="y"></div>
          <div id="angle"></div>
          <div id="scaleX"></div>
          <div id="scaleY"></div>
        </div>
    </div>
    </body>
    
</template>
<script>
const Render =  function(){
    "use strict";

    //设置几何体。 
    function setGeometry(gl) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                    250, 100,
                100,  300,
                400,  300]),
            gl.STATIC_DRAW);
    }

    // 绘制画布。
    function drawScene() {
        haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


        var size = 2;          
        var type = gl.FLOAT;   
        var normalize = false; 
        var stride = 0;        
        var offset = 0;       
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);

        // 设置变换矩阵。
        var matrix = haruluya_webgl_utils.projection2d(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = haruluya_webgl_utils.translate2d(matrix, translation[0], translation[1]);
        matrix = haruluya_webgl_utils.rotate2d(matrix, angleInRadians);
        matrix = haruluya_webgl_utils.scale2d(matrix, scale[0], scale[1]);
        gl.uniformMatrix3fv(matrixLocation, false, matrix);

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
    }

    // 获取画布context和shader源。
    const {gl,vertexShaderSource,fragmentShaderSource} = haruluya_webgl_utils.getWebglAndShaderSource("triangle_content","vertex-shader","frament-shader");
    
    // 创建Shader和程序对象。
    const vertexShader = haruluya_webgl_utils.loadShader(gl, vertexShaderSource,gl.VERTEX_SHADER);
    const fragmentShader = haruluya_webgl_utils.loadShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const program = haruluya_webgl_utils.createProgram(gl, [vertexShader, fragmentShader]);

    // 获取attribute位置。
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");


    // 复制到缓冲区。
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    setGeometry(gl)

    // 定义初始变换矩阵。
    var translation = [0, 0];
    var angleInRadians = 0;
    var scale = [1, 1];

    drawScene();

    // 更新位置回调。
    function updatePosition(index) {
        return function(event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    // 更新旋转回调。
    function updateAngle(event, ui) {
        var angleInDegrees = 360 - ui.value;
        angleInRadians = angleInDegrees * Math.PI / 180;
        drawScene();
    }

    // 更新缩放回调。
    function updateScale(index) {
        return function(event, ui) {
            scale[index] = ui.value;
            drawScene();
        };
    }

    haruluya_webgl_utils.setupSlider("x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    haruluya_webgl_utils.setupSlider("y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    haruluya_webgl_utils.setupSlider("angle", {slide: updateAngle, max: 360});
    haruluya_webgl_utils.setupSlider("scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    haruluya_webgl_utils.setupSlider("scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

}
export default {
    name:'Triangle',
    mounted() {
        Render();
    }
};




</script>
<style lang="css">
    
</style>