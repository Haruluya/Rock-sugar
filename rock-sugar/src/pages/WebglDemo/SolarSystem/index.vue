<template>
    <div class="title">
        10_SolarSystem
    </div>
    <div ref="a"> xxx</div>
    <canvas id="canvas" ref="canvas"></canvas>
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
</template>
<script>

export default {
    name:'SoloarSystem',
    mounted(){
        this.Render();
    },
    methods: {
        Render(){
            console.log('first')

            var TRS = function() {
                this.translation = [0, 0, 0];
                this.rotation = [0, 0, 0];
                this.scale = [1, 1, 1];
            };
            
            TRS.prototype.getMatrix = function(dst) {
            dst = dst || new Float32Array(16);
            var t = this.translation;
            var r = this.rotation;
            var s = this.scale;
            
            // 通过平移，旋转和缩放计算矩阵
            haruluya_webgl_utils.translation3d(t[0], t[1], t[2], dst);
                matrixMultiply( haruluya_webgl_utils.xRotation(r[0]), dst, dst);
                matrixMultiply( haruluya_webgl_utils.yRotation(r[1]), dst, dst);
                matrixMultiply( haruluya_webgl_utils.zRotation(r[2]), dst, dst);
                matrixMultiply( haruluya_webgl_utils.scaling(s[0], s[1], s[2]), dst, dst);
                return dst;
            };

            // 结点。
            var Node = function() {
                this.children = [];
                this.localMatrix = haruluya_webgl_utils.identity();
                this.worldMatrix = haruluya_webgl_utils.identity();
                this.source = source;
            };

            // 结点设置父节点。
            Node.prototype.setParent = function(parent) {

                if (this.parent) {
                    var ndx = this.parent.children.indexOf(this);
                    if (ndx >= 0) {
                        this.parent.children.splice(ndx, 1);
                    }
                }
                if (parent) {
                    parent.children.push(this);
                }
                this.parent = parent;
            };

            // 更新世界矩阵。
            Node.prototype.updateWorldMatrix = function(parentWorldMatrix) {

                var source = this.source;
                if (source) {
                    source.getMatrix(this.localMatrix);
                }

                if (parentWorldMatrix) {
                    haruluya_webgl_utils.multiply3d(parentWorldMatrix, this.localMatrix, this.worldMatrix);
                } else {
                    haruluya_webgl_utils.copy(this.localMatrix, this.worldMatrix);
                }
                var worldMatrix = this.worldMatrix;
                this.children.forEach(function(child) {
                    child.updateWorldMatrix(worldMatrix);
                });
            };

            var cameraAngleRadians = haruluya_webgl_utils.degToRad(0);
            var fieldOfViewRadians = haruluya_webgl_utils.degToRad(60);
            var cameraHeight = 50;

            var canvas = this.$refs.canvas;

            var gl = canvas.getContext("webgl");
            if (!gl) {
                return;
            }

            function rand(min, max) {
                return Math.random() * (max - min) + min;
            }

            function emod(x, n) {
                return x >= 0 ? (x % n) : ((n - (-x % n)) % n);
            }

            const sphereBufferInfo = haruluya_webgl_utils.createSphereWithVertexColorsBufferInfo(gl, 10, 12, 6);

            var programInfo = haruluya_webgl_utils.createProgramInfo(gl, ["vertex-shader", "fragment-shader"]);

            var objectsToDraw = [];
            var objects = [];

            // 配置solarsystem和earthorbit，moonOrbit结点。
            var solarSystemNode = new Node();
            var earthOrbitNode = new Node();
            earthOrbitNode.localMatrix = haruluya_webgl_utils.translation3d(100, 0, 0);  
            var moonOrbitNode = new Node();
            moonOrbitNode.localMatrix = haruluya_webgl_utils.translation3d(30, 0, 0);  

            // 配置sunnode。
            var sunNode = new Node();
            sunNode.localMatrix = haruluya_webgl_utils.scaling3d(5, 5, 5);  
            sunNode.drawInfo = {
                uniforms: {
                    u_colorOffset: [1, 0.6, 0.07, 1], 
                    u_colorMult:   [0.4, 0.4, 0, 1],
                },
                programInfo: programInfo,
                bufferInfo: sphereBufferInfo,
            };


            // 配置earthNode。
            var earthNode = new Node();
            earthNode.localMatrix = haruluya_webgl_utils.scaling3d(2, 2, 2);   
            earthNode.drawInfo = {
                uniforms: {
                    u_colorOffset: [0, 1, 1, 1],  
                    u_colorMult:   [0.8, 0.5, 0.2, 1],
                },
                programInfo: programInfo,
                bufferInfo: sphereBufferInfo,
            };

            // 配置moonNode。
            var moonNode = new Node();
            moonNode.localMatrix = haruluya_webgl_utils.scaling3d(0.6, 0.6, 0.6);
            moonNode.drawInfo = {
                uniforms: {
                    u_colorOffset: [0.95, 0.95, 0.95, 1],  
                    u_colorMult:   [0.1, 0.1, 0.1, 1],
                },
                programInfo: programInfo,
                bufferInfo: sphereBufferInfo,
            };

            // 挂载结点。
            sunNode.setParent(solarSystemNode);
            earthOrbitNode.setParent(solarSystemNode);
            earthNode.setParent(earthOrbitNode);
            moonOrbitNode.setParent(earthOrbitNode);
            moonNode.setParent(moonOrbitNode);

            var objects = [
                sunNode,
                earthNode,
                moonNode,
            ];

            var objectsToDraw = [
                sunNode.drawInfo,
                earthNode.drawInfo,
                moonNode.drawInfo,
            ];

            requestAnimationFrame(drawScene);

            // transform.
            const translation = [0, 0, 0];
            const rotation = [haruluya_webgl_utils.degToRad(0), haruluya_webgl_utils.degToRad(0), haruluya_webgl_utils.degToRad(0)];

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

            haruluya_webgl_utils.setupSlider("x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
            haruluya_webgl_utils.setupSlider("y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
            haruluya_webgl_utils.setupSlider("z", {value: translation[2], slide: updatePosition(2), max: gl.canvas.height});
            haruluya_webgl_utils.setupSlider("angleX", {value: haruluya_webgl_utils.radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
            haruluya_webgl_utils.setupSlider("angleY", {value: haruluya_webgl_utils.radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
            haruluya_webgl_utils.setupSlider("angleZ", {value: haruluya_webgl_utils.radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
    

            function drawScene(time) {
                time *= 0.0005;
                haruluya_webgl_utils.resizeCanvasToDisplaySize(gl.canvas);
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

                gl.enable(gl.CULL_FACE);
                gl.enable(gl.DEPTH_TEST);
                gl.clearColor(0.34, 0.34, 0.34, 1);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
                var projectionMatrix =
                    haruluya_webgl_utils.perspective(fieldOfViewRadians, aspect, 1, 2000);
                var cameraPosition = [0, -300, 0];
                var target = [0, 0, 0];
                var up = [0, 0, 1];
    
                var cameraMatrix = haruluya_webgl_utils.lookAt(cameraPosition, target, up);
                var viewMatrix = haruluya_webgl_utils.inverse(cameraMatrix);
                var viewProjectionMatrix = haruluya_webgl_utils.multiply3d(projectionMatrix, viewMatrix);

                haruluya_webgl_utils.multiply3d(haruluya_webgl_utils.yRotation(0.01), earthOrbitNode.localMatrix, earthOrbitNode.localMatrix);
                haruluya_webgl_utils.multiply3d(haruluya_webgl_utils.yRotation(0.01), moonOrbitNode.localMatrix, moonOrbitNode.localMatrix);
                haruluya_webgl_utils.multiply3d(haruluya_webgl_utils.yRotation(0.05), earthNode.localMatrix, earthNode.localMatrix);
                haruluya_webgl_utils.multiply3d(haruluya_webgl_utils.yRotation(-0.01), moonNode.localMatrix, moonNode.localMatrix);
                solarSystemNode.updateWorldMatrix();

                // 最终变换矩阵。
                objects.forEach(function(object) {
                    object.worldMatrix = haruluya_webgl_utils.multiply3d(object.worldMatrix,haruluya_webgl_utils.xRotation(rotation[0]));
                    object.worldMatrix = haruluya_webgl_utils.multiply3d(object.worldMatrix,haruluya_webgl_utils.translation3d(translation[0],translation[1],translation[2]));
                    object.worldMatrix = haruluya_webgl_utils.multiply3d(object.worldMatrix,haruluya_webgl_utils.yRotation(rotation[1]));
                    object.worldMatrix = haruluya_webgl_utils.multiply3d(object.worldMatrix,haruluya_webgl_utils.zRotation(rotation[2]));
                    object.drawInfo.uniforms.u_matrix = haruluya_webgl_utils.multiply3d(viewProjectionMatrix, object.worldMatrix);
                });

                var lastUsedProgramInfo = null;
                var lastUsedBufferInfo = null;

                objectsToDraw.forEach(function(object) {
                    var programInfo = object.programInfo;
                    var bufferInfo = object.bufferInfo;
                    var bindBuffers = false;

                    if (programInfo !== lastUsedProgramInfo) {
                        lastUsedProgramInfo = programInfo;
                        gl.useProgram(programInfo.program);
                        bindBuffers = true;
                    }

                    if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
                        lastUsedBufferInfo = bufferInfo;
                        haruluya_webgl_utils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
                    }

                    // Set the uniforms.
                    haruluya_webgl_utils.setUniforms(programInfo, object.uniforms);

                    // Draw
                    gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
                });

                requestAnimationFrame(drawScene);
            }

        }
    },
}
</script>
<style lang="">
    
</style>