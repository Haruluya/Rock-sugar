<template lang="html">
    <div class="title">
        2_ImageProcess
    </div>
    <canvas id="imageProcess_content">
        <pre id="vertex-shader" type="notjs">
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            uniform vec2 u_resolution;
            varying vec2 v_texCoord;

            void main() {
               vec2 zeroToOne = a_position / u_resolution;
               vec2 zeroToTwo = zeroToOne * 2.0;
               vec2 clipSpace = zeroToTwo - 1.0;
               gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
               v_texCoord = a_texCoord;
            }
        </pre>
        <pre id="frament-shader" type="notjs">
            precision mediump float;

            uniform sampler2D u_image;
            uniform vec2 u_textureSize;
            uniform float u_kernel[9];
            uniform float u_kernelWeight;
            
            varying vec2 v_texCoord;
            
            void main() {
               vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
               vec4 colorSum =
                   texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
                   texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
                   texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
                   texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
                   texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
                   texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
                   texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
                   texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
                   texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
               gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1);
            }
        </pre>
    </canvas>
    <div id="uiContainer">
        <div id="ui"></div>
      </div>
</template>
<script>
export default {
    name:'ImageProcess',
    mounted() {
        // this.Render();
    },
    methods: {
        Render(){
             // 绘制几何体。
        function setGeometry(gl, x, y, width, height) {
            let x1 = x;
            let x2 = x + width;
            let y1 = y;
            let y2 = y + height;
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                x1, y1,
                x2, y1,
                x1, y2,
                x1, y2,
                x2, y1,
                x2, y2,
            ]), gl.STATIC_DRAW);
        }

        const image = new Image();
        image.src = "../../../assets/logo.png";  
        image.onload = function() {
            render(image);
        };
        
        function render(image) {

            var canvas = document.getElementById("imageProcess_content");
            var gl = canvas.getContext("webgl");
            if (!gl) {
                return;
            }

            var program = haruluya_webgl_utils.createProgramFromScripts(gl, ["vertex-shader", "frament-shader"]);

            // a_positon:顶点着色器绘制位置。
            var positionLocation = gl.getAttribLocation(program, "a_position");
            // a_texCoord:v_texCoord。
            var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
            var positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            setGeometry( gl, 50, 0, image.width, image.height);

            var texcoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                0.0,  0.0,
                1.0,  0.0,
                0.0,  1.0,
                0.0,  1.0,
                1.0,  0.0,
                1.0,  1.0,
            ]), gl.STATIC_DRAW);

            // 创建纹理。
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            // 图片作为纹理。
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
            var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
            var kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
            var kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");

            // 定义卷积核。
            var kernels = {
                normal: [
                0, 0, 0,
                0, 1, 0,
                0, 0, 0
                ],
                gaussianBlur: [
                0.045, 0.122, 0.045,
                0.122, 0.332, 0.122,
                0.045, 0.122, 0.045
                ],
                gaussianBlur2: [
                1, 2, 1,
                2, 4, 2,
                1, 2, 1
                ],
                gaussianBlur3: [
                0, 1, 0,
                1, 1, 1,
                0, 1, 0
                ],
                unsharpen: [
                -1, -1, -1,
                -1,  9, -1,
                -1, -1, -1
                ],
                sharpness: [
                0,-1, 0,
                -1, 5,-1,
                0,-1, 0
                ],
                sharpen: [
                -1, -1, -1,
                -1, 16, -1,
                -1, -1, -1
                ],
                edgeDetect: [
                -0.125, -0.125, -0.125,
                -0.125,  1,     -0.125,
                -0.125, -0.125, -0.125
                ],
                edgeDetect2: [
                -1, -1, -1,
                -1,  8, -1,
                -1, -1, -1
                ],
                edgeDetect3: [
                -5, 0, 0,
                    0, 0, 0,
                    0, 0, 5
                ],
                edgeDetect4: [
                -1, -1, -1,
                    0,  0,  0,
                    1,  1,  1
                ],
                edgeDetect5: [
                -1, -1, -1,
                    2,  2,  2,
                -1, -1, -1
                ],
                edgeDetect6: [
                -5, -5, -5,
                -5, 39, -5,
                -5, -5, -5
                ],
                sobelHorizontal: [
                    1,  2,  1,
                    0,  0,  0,
                -1, -2, -1
                ],
                sobelVertical: [
                    1,  0, -1,
                    2,  0, -2,
                    1,  0, -1
                ],
                previtHorizontal: [
                    1,  1,  1,
                    0,  0,  0,
                -1, -1, -1
                ],
                previtVertical: [
                    1,  0, -1,
                    1,  0, -1,
                    1,  0, -1
                ],
                boxBlur: [
                    0.111, 0.111, 0.111,
                    0.111, 0.111, 0.111,
                    0.111, 0.111, 0.111
                ],
                triangleBlur: [
                    0.0625, 0.125, 0.0625,
                    0.125,  0.25,  0.125,
                    0.0625, 0.125, 0.0625
                ],
                emboss: [
                -2, -1,  0,
                -1,  1,  1,
                    0,  1,  2
                ]
            };
            var initialSelection = 'edgeDetect2';

            haruluya_webgl_utils.setDropDownBox(kernels,"ui",function(event) {
                drawWithKernel(this.options[this.selectedIndex].value);
            })

            drawWithKernel(initialSelection);

            function computeKernelWeight(kernel) {
                var weight = kernel.reduce(function(prev, curr) {
                    return prev + curr;
                });
                return weight <= 0 ? 1 : weight;
            }

            function drawWithKernel(name) {
                haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);

                gl.useProgram(program);

                // 设置位置。
                gl.enableVertexAttribArray(positionLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                var size = 2;         
                var type = gl.FLOAT;  
                var normalize = false; 
                var stride = 0;       
                var offset = 0;       
                gl.vertexAttribPointer(
                    positionLocation, size, type, normalize, stride, offset);

                // 设置纹理。
                gl.enableVertexAttribArray(texcoordLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
                var size = 2;          
                var type = gl.FLOAT;   
                var normalize = false; 
                var stride = 0;        
                var offset = 0;       
                gl.vertexAttribPointer(
                    texcoordLocation, size, type, normalize, stride, offset);

                gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
                gl.uniform2f(textureSizeLocation, image.width, image.height);
                gl.uniform1fv(kernelLocation, kernels[name]);
                gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));

                // 绘制。
                var primitiveType = gl.TRIANGLES;
                var offset = 0;
                var count = 6;
                gl.drawArrays(primitiveType, offset, count);
            }
        }
        }
    },
}
</script>
<style lang="">
    
</style>