/*
  @des: Webgl utils.
  @author: haruluya.
  @2021 copyright all.
*/

(function(root, factory) {  
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return factory.call(root);
      });
    } else {
      window.haruluya_webgl_utils = factory.call(root);
    }
  }(this,function() {
    'use strict';
    let MatType = Float32Array;
    const gopt = getQueryParams();
    var ctx = document.createElement("canvas").getContext("2d");

    var setCanvasSize = function(width, height) {
      ctx.canvas.width  = width;
      ctx.canvas.height = height;
    };

    const defaultShaderType = [
        'VERTEX_SHADER',
        'FRAGMENT_SHADER',
      ];


    const CUBE_FACE_INDICES = [
      [3, 7, 5, 1], // right
      [6, 2, 0, 4], // left
      [6, 7, 3, 2], // ??
      [0, 1, 5, 4], // ??
      [7, 6, 4, 5], // front
      [2, 3, 1, 0], // back
    ];

    const topWindow = window;

    // get context and shader source.
    function getWebglAndShaderSource(canvasId,vertexId,fragmentId){
        let canvas = document.getElementById(canvasId);
        let vertexShaderSource = document.getElementById(vertexId).innerText;
        let fragmentShaderSource = document.getElementById(fragmentId).innerText;
        let gl = canvas.getContext("webgl");
        if (!gl){
            console.log("Webgl Not Found!")
        }
        return {gl,vertexShaderSource,fragmentShaderSource};
    }





    // log error.
    function error(msg) {
        if (topWindow.console) {
          if (topWindow.console.error) {
            topWindow.console.error(msg);
          } else if (topWindow.console.log) {
            topWindow.console.log(msg);
          }
        }
    }



    // 获取webgl上下文。
    function initWebglContext(canvasId){
      var canvas = document.querySelector("#"+canvasId);
      var gl = canvas.getContext("webgl");
      if (!gl) {
          console.log("GET WBEGL CONTEXT FAILD!!!");
          return;
      }
      return {gl, canvas};

    }


    // 加载着色器。
    function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
        const errFn = opt_errorCallback || error;
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
        const lastError = gl.getShaderInfoLog(shader);
        errFn('*** Error compiling shader \'' + shader + '\':' + lastError + `\n` + shaderSource.split('\n').map((l,i) => `${i + 1}: ${l}`).join('\n'));
        gl.deleteShader(shader);
        return null;
        }
        return shader;
    }


    // 创建程序对象。
    function createProgram(
        gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
    const errFn = opt_errorCallback || error;
    const program = gl.createProgram();
    shaders.forEach(function(shader) {
        gl.attachShader(program, shader);
    });
    if (opt_attribs) {
        opt_attribs.forEach(function(attrib, ndx) {
        gl.bindAttribLocation(
            program,
            opt_locations ? opt_locations[ndx] : ndx,
            attrib);
        });
    }
    gl.linkProgram(program);

    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        const lastError = gl.getProgramInfoLog(program);
        errFn('Error in program linking:' + lastError);

        gl.deleteProgram(program);
        return null;
    }
    return program;
    }


    // 创建程序对象封装。
    function createProgramFromScripts(
        gl, shaderScriptIds, opt_attribs, opt_locations, opt_errorCallback) {
      const shaders = [];
      for (let ii = 0; ii < shaderScriptIds.length; ++ii) {
        shaders.push(createShaderFromScript(
            gl, shaderScriptIds[ii], gl[defaultShaderType[ii]], opt_errorCallback));
      }
      return createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
    }

    // 创建shader封装。
    function createShaderFromScript(
        gl, scriptId, opt_shaderType, opt_errorCallback) {
      let shaderSource = '';
      let shaderType;
      const shaderScript = document.getElementById(scriptId);
      if (!shaderScript) {
        throw ('*** Error: unknown script element' + scriptId);
      }
      shaderSource = shaderScript.innerText;
      if (!opt_shaderType) {
        if (shaderScript.type === 'x-shader/x-vertex') {
          shaderType = gl.VERTEX_SHADER;
        } else if (shaderScript.type === 'x-shader/x-fragment') {
          shaderType = gl.FRAGMENT_SHADER;
        } else if (shaderType !== gl.VERTEX_SHADER && shaderType !== gl.FRAGMENT_SHADER) {
          throw ('*** Error: unknown shader type');
        }
      }
  
      return loadShader(
          gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType,
          opt_errorCallback);
    }


    // 让画布width和height等于显示大小。
    function resizeCanvasToDisplaySize(canvas, multiplier) {
        multiplier = multiplier || 1;
        const width  = canvas.clientWidth  * multiplier | 0;
        const height = canvas.clientHeight * multiplier | 0;
        if (canvas.width !== width ||  canvas.height !== height) {
        canvas.width  = width;
        canvas.height = height;
        return true;
        }
        return false;
    }

    // 弧度和角度转换。
    function radToDeg(r) {
      return r * 180 / Math.PI;
    }
    function degToRad(d) {
        return d * Math.PI / 180;
    }

    // 二维图像的projection。返回一个二维映射矩阵。
    // 等价于：
    // 从像素坐标转换到 0.0 到 1.0
    // vec2 zeroToOne = position / u_resolution;
    // 再把 0->1 转换 0->2
    // vec2 zeroToTwo = zeroToOne * 2.0;
    // 把 0->2 转换到 -1->+1 (裁剪空间)
    // vec2 clipSpace = zeroToTwo - 1.0;
    function projection2d(width, height, dst) {
        dst = dst || new MatType(9);
        
        dst[0] = 2 / width;
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;
        dst[4] = -2 / height;
        dst[5] = 0;
        dst[6] = -1;
        dst[7] = 1;
        dst[8] = 1;

        return dst;
    }


    // 三维projection。返回一个三维映射矩阵。
    function projection3d(width, height, depth){
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
        -1, 1, 0, 1,
        ];
    }



    // 暴力矩阵乘法。
    function multiply2d(a, b, dst) {
        dst = dst || new MatType(9);
        var a00 = a[0 * 3 + 0];
        var a01 = a[0 * 3 + 1];
        var a02 = a[0 * 3 + 2];
        var a10 = a[1 * 3 + 0];
        var a11 = a[1 * 3 + 1];
        var a12 = a[1 * 3 + 2];
        var a20 = a[2 * 3 + 0];
        var a21 = a[2 * 3 + 1];
        var a22 = a[2 * 3 + 2];
        var b00 = b[0 * 3 + 0];
        var b01 = b[0 * 3 + 1];
        var b02 = b[0 * 3 + 2];
        var b10 = b[1 * 3 + 0];
        var b11 = b[1 * 3 + 1];
        var b12 = b[1 * 3 + 2];
        var b20 = b[2 * 3 + 0];
        var b21 = b[2 * 3 + 1];
        var b22 = b[2 * 3 + 2];

        dst[0] = b00 * a00 + b01 * a10 + b02 * a20;
        dst[1] = b00 * a01 + b01 * a11 + b02 * a21;
        dst[2] = b00 * a02 + b01 * a12 + b02 * a22;
        dst[3] = b10 * a00 + b11 * a10 + b12 * a20;
        dst[4] = b10 * a01 + b11 * a11 + b12 * a21;
        dst[5] = b10 * a02 + b11 * a12 + b12 * a22;
        dst[6] = b20 * a00 + b21 * a10 + b22 * a20;
        dst[7] = b20 * a01 + b21 * a11 + b22 * a21;
        dst[8] = b20 * a02 + b21 * a12 + b22 * a22;

        return dst;
    }

    // 获取平移矩阵。
    function translation2d(tx, ty, dst) {
        dst = dst || new MatType(9);

        dst[0] = 1;
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;
        dst[4] = 1;
        dst[5] = 0;
        dst[6] = tx;
        dst[7] = ty;
        dst[8] = 1;

        return dst;
    }

    // 进行平移操作。
    function translate2d(m,tx,ty){
        return multiply2d(m, translation2d(tx, ty));
    }


    //获取旋转矩阵。
    function rotation2d(angleInRadians, dst) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        dst = dst || new MatType(9);

        dst[0] = c;
        dst[1] = -s;
        dst[2] = 0;
        dst[3] = s;
        dst[4] = c;
        dst[5] = 0;
        dst[6] = 0;
        dst[7] = 0;
        dst[8] = 1;

        return dst;
    }

    // 进行旋转操作。
    function rotate2d(m, angleInRadians, dst) {
        return multiply2d(m, rotation2d(angleInRadians), dst);
    }

    // 获取缩放矩阵。
    function scaling2d(sx, sy, dst) {
        dst = dst || new MatType(9);

        dst[0] = sx;
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;
        dst[4] = sy;
        dst[5] = 0;
        dst[6] = 0;
        dst[7] = 0;
        dst[8] = 1;

        return dst;
    }

    // 进行缩放操作。
    function scale2d(m, sx, sy, dst) {
        return multiply2d(m, scaling2d(sx, sy), dst);
    }

    // 3维暴力矩阵相乘。
    function multiply3d(a, b, dst) {
        dst = dst || new MatType(16);
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        dst[ 0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        dst[ 1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        dst[ 2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        dst[ 3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        dst[ 4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        dst[ 5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        dst[ 6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        dst[ 7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        dst[ 8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        dst[ 9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
        return dst;
    }


    // 3维下获取平移矩阵。
    function translation3d(tx, ty, tz, dst) {
        dst = dst || new MatType(16);

        dst[ 0] = 1;
        dst[ 1] = 0;
        dst[ 2] = 0;
        dst[ 3] = 0;
        dst[ 4] = 0;
        dst[ 5] = 1;
        dst[ 6] = 0;
        dst[ 7] = 0;
        dst[ 8] = 0;
        dst[ 9] = 0;
        dst[10] = 1;
        dst[11] = 0;
        dst[12] = tx;
        dst[13] = ty;
        dst[14] = tz;
        dst[15] = 1;

        return dst;
    }


    // 3维下进行平移操作。
    function translate3d(m, tx, ty, tz, dst) {
        return multiply3d(m, translation3d(tx, ty, tz), dst);
    }

    // 获取延x旋转矩阵。
    function xRotation(angleInRadians, dst) {
        dst = dst || new MatType(16);
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        dst[ 0] = 1;
        dst[ 1] = 0;
        dst[ 2] = 0;
        dst[ 3] = 0;
        dst[ 4] = 0;
        dst[ 5] = c;
        dst[ 6] = s;
        dst[ 7] = 0;
        dst[ 8] = 0;
        dst[ 9] = -s;
        dst[10] = c;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    // 延X轴旋转操作。
    function xRotate(m, angleInRadians, dst) {
        return multiply3d(m, xRotation(angleInRadians), dst);
    }

    // 获取延Y旋转矩阵。
    function yRotation(angleInRadians, dst) {
        dst = dst || new MatType(16);
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        dst[ 0] = c;
        dst[ 1] = 0;
        dst[ 2] = -s;
        dst[ 3] = 0;
        dst[ 4] = 0;
        dst[ 5] = 1;
        dst[ 6] = 0;
        dst[ 7] = 0;
        dst[ 8] = s;
        dst[ 9] = 0;
        dst[10] = c;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    // 延Y轴旋转操作。
    function yRotate(m, angleInRadians, dst) {
        return multiply3d(m, yRotation(angleInRadians), dst);
    }

    // 获取延Z旋转矩阵。
    function zRotation(angleInRadians, dst) {
        dst = dst || new MatType(16);
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        dst[ 0] = c;
        dst[ 1] = s;
        dst[ 2] = 0;
        dst[ 3] = 0;
        dst[ 4] = -s;
        dst[ 5] = c;
        dst[ 6] = 0;
        dst[ 7] = 0;
        dst[ 8] = 0;
        dst[ 9] = 0;
        dst[10] = 1;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    // 延Z轴旋转操作。
    function zRotate(m, angleInRadians, dst) {
        return multiply3d(m, zRotation(angleInRadians), dst);
    }


    function axisRotation(axis, angleInRadians, dst) {
        dst = dst || new MatType(16);

        var x = axis[0];
        var y = axis[1];
        var z = axis[2];
        var n = Math.sqrt(x * x + y * y + z * z);
        x /= n;
        y /= n;
        z /= n;
        var xx = x * x;
        var yy = y * y;
        var zz = z * z;
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        var oneMinusCosine = 1 - c;

        dst[ 0] = xx + (1 - xx) * c;
        dst[ 1] = x * y * oneMinusCosine + z * s;
        dst[ 2] = x * z * oneMinusCosine - y * s;
        dst[ 3] = 0;
        dst[ 4] = x * y * oneMinusCosine - z * s;
        dst[ 5] = yy + (1 - yy) * c;
        dst[ 6] = y * z * oneMinusCosine + x * s;
        dst[ 7] = 0;
        dst[ 8] = x * z * oneMinusCosine + y * s;
        dst[ 9] = y * z * oneMinusCosine - x * s;
        dst[10] = zz + (1 - zz) * c;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }


    function axisRotate(m, axis, angleInRadians, dst) {
        return multiply(m, axisRotation(axis, angleInRadians), dst);
    }

    // 获取3维缩放矩阵。
    function scaling3d(sx, sy, sz, dst) {
        dst = dst || new MatType(16);

        dst[0] = sx;
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;
        dst[4] = 0;
        dst[5] = sy;
        dst[6] = 0;
        dst[7] = 0;
        dst[8] = 0;
        dst[9] = 0;
        dst[10] = sz;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    // 进行3维缩放操作。
    function scale3d(m, sx, sy, sz, dst) {
        return multiply3d(m, scaling3d(sx, sy, sz), dst);
    }

    // 正射投影。
    function orthographic(left, right, bottom, top, near, far, dst) {
        dst = dst || new MatType(16);

        dst[ 0] = 2 / (right - left);
        dst[ 1] = 0;
        dst[ 2] = 0;
        dst[ 3] = 0;
        dst[ 4] = 0;
        dst[ 5] = 2 / (top - bottom);
        dst[ 6] = 0;
        dst[ 7] = 0;
        dst[ 8] = 0;
        dst[ 9] = 0;
        dst[10] = 2 / (near - far);
        dst[11] = 0;
        dst[12] = (left + right) / (left - right);
        dst[13] = (bottom + top) / (bottom - top);
        dst[14] = (near + far) / (near - far);
        dst[15] = 1;
        return dst;
    }

    // 计算矩阵的逆。
    function inverse(m, dst) {
      dst = dst || new MatType(16);
      var m00 = m[0 * 4 + 0];
      var m01 = m[0 * 4 + 1];
      var m02 = m[0 * 4 + 2];
      var m03 = m[0 * 4 + 3];
      var m10 = m[1 * 4 + 0];
      var m11 = m[1 * 4 + 1];
      var m12 = m[1 * 4 + 2];
      var m13 = m[1 * 4 + 3];
      var m20 = m[2 * 4 + 0];
      var m21 = m[2 * 4 + 1];
      var m22 = m[2 * 4 + 2];
      var m23 = m[2 * 4 + 3];
      var m30 = m[3 * 4 + 0];
      var m31 = m[3 * 4 + 1];
      var m32 = m[3 * 4 + 2];
      var m33 = m[3 * 4 + 3];
      var tmp_0  = m22 * m33;
      var tmp_1  = m32 * m23;
      var tmp_2  = m12 * m33;
      var tmp_3  = m32 * m13;
      var tmp_4  = m12 * m23;
      var tmp_5  = m22 * m13;
      var tmp_6  = m02 * m33;
      var tmp_7  = m32 * m03;
      var tmp_8  = m02 * m23;
      var tmp_9  = m22 * m03;
      var tmp_10 = m02 * m13;
      var tmp_11 = m12 * m03;
      var tmp_12 = m20 * m31;
      var tmp_13 = m30 * m21;
      var tmp_14 = m10 * m31;
      var tmp_15 = m30 * m11;
      var tmp_16 = m10 * m21;
      var tmp_17 = m20 * m11;
      var tmp_18 = m00 * m31;
      var tmp_19 = m30 * m01;
      var tmp_20 = m00 * m21;
      var tmp_21 = m20 * m01;
      var tmp_22 = m00 * m11;
      var tmp_23 = m10 * m01;
  
      var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
          (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
      var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
          (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
      var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
          (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
      var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
          (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  
      var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  
      dst[0] = d * t0;
      dst[1] = d * t1;
      dst[2] = d * t2;
      dst[3] = d * t3;
      dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
      dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
      dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
      dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
      dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
      dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
      dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
      dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
      dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
      dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
      dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
      dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
  
      return dst;
    }


    // 透视投影配置矩阵。
    function perspective(fieldOfViewInRadians, aspect, near, far) {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / (near - far);
      console.log(f,aspect,"(((((")
        return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
        ];
    }

    // 获取贝塞尔曲线上点。
    function getPointOnBezierCurve(points, offset, t) {
        const invT = (1 - t);
        return v2.add(v2.mult(points[offset + 0], invT * invT * invT),
                    v2.mult(points[offset + 1], 3 * t * invT * invT),
                    v2.mult(points[offset + 2], 3 * invT * t * t),
                    v2.mult(points[offset + 3], t * t  *t));
    }


    // 设置滑块。
    function setupSlider(slider, options) {

      //let vue component effective.
        // var parent = document.getElementById(divId);
        if (!slider) {
          console.log("Slider ref not fount!")
          return;
        }
        return createSlider(slider, options); 
    }
    
    // 16进制转rgb。
    function colorToRGB(color) {
      var color1, color2, color3;
      color = ""+color;
      if (typeof color !== "string") return;
      if (color.charAt(0) == "#") {
        color = color.substring(1);
      }
      var not16num = color.split("").filter(function (item, index) {
        return isNaN(parseInt(item, 16))
      });
      if(not16num.length) return;
      switch (color.length) {
        case 3:
          color1 = color.substr(0,1);
          color2 = color.substr(1,1);
          color3 = color.substr(2,1);
          color1 = color1 + color1;
          color2 = color2 + color2;
          color3 = color3 + color3;
        break;
        case 6:
          color1 = color.substr(0,2);
          color2 = color.substr(2,2);
          color3 = color.substr(4,2);
        break;
        default:
        return false;
      }
      color1 = parseInt(color1, 16) / 256.0;
      color2 = parseInt(color2, 16) / 256.0;
      color3 = parseInt(color3, 16) / 256.0;
      return [color1,color2,color3];
    }


    // 创建滑块。
    function createSlider(parent, options) {


        var precision = options.precision || 0;
        var min = options.min || 0;
        var step = options.step || 1;
        var value = options.value || 0;
        var max = options.max || 1;
        var fn = options.slide;
        var name = gopt["ui-" + options.name] || options.name;
        var uiPrecision = options.uiPrecision === undefined ? precision : options.uiPrecision;
        var uiMult = options.uiMult || 1;
    
        min /= step;
        max /= step;
        value /= step;
        var valueElem = parent.$refs.sliderValue;
        var sliderElem = parent.$refs.sliderSlider;

        function updateValue(value) {
          valueElem.textContent = (value * step * uiMult).toFixed(uiPrecision);
        }
    
        updateValue(value);
    
        function handleChange(event) {
         
          var value = parseInt(event.target.value);
    
          updateValue(value);
          fn(event, { value: value * step });
        }
    
        sliderElem.addEventListener('input', handleChange);
        sliderElem.addEventListener('change', handleChange);
    
        return {
          elem: parent,
          updateValue: (v) => {
            v /= step;
            sliderElem.value = v;
            updateValue(v);
          },
        };
    }


    function getQueryParams() {
        var params = {};
        if (window.hackedParams) {
          Object.keys(window.hackedParams).forEach(function(key) {
            params[key] = window.hackedParams[key];
          });
        }
        if (window.location.search) {
          window.location.search.substring(1).split("&").forEach(function(pair) {
            var keyValue = pair.split("=").map(function(kv) {
              return decodeURIComponent(kv);
            });
            params[keyValue[0]] = keyValue[1];
          });
        }
        return params;
    }


    // 创建下拉框。
    function setDropDownBox(array,id,callback){
        let ui = document.getElementById(id);
        let select = document.createElement("select");
        select.classList.add("webgl-dropdownbox")
        for (var name in array) {
            var option = document.createElement("option");
            option.value = name;
            if (name === array[0]) {
                option.selected = true;
            }
            option.appendChild(document.createTextNode(name));
            select.appendChild(option);
        }
        select.onchange = callback;
        ui.appendChild(select);
    }


    // 创建取色器。
    function setupColorInput(colorRef,options){
      colorRef.$refs.input.onchange = (event)=>{
        let ui = {value:event.target.value};
        options.callback(event,ui);
      };
    }

    // 设置vectorUI回调。
    function setupSliderVector(vectorRef,options){
      vectorRef.$refs.container.addEventListener("slider_vector_change",(event)=>{
        let ui = {value:event.detail.sliderValue};
        options.callback(event,ui)
      })
    }

    // 向量相减，
    function subtractVectors(a, b) {
      return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }
    
    // 向量标准化。
    function normalize(v) {
      var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      // make sure we don't divide by 0.
      if (length > 0.00001) {
        return [v[0] / length, v[1] / length, v[2] / length];
      } else {
        return [0, 0, 0];
      }
    }
    
    // 向量叉乘。
    function cross(a, b) {
      return [a[1] * b[2] - a[2] * b[1],
              a[2] * b[0] - a[0] * b[2],
              a[0] * b[1] - a[1] * b[0]];
    }

    // 向量点积。
    function vectorMultiply(v,m){
      var dst = [];
      for (var i = 0; i < 4; ++i) {
        dst[i] = 0.0;
        for (var j = 0; j < 4; ++j) {
          dst[i] += v[j] * m[j * 4 + i];
        }
      }
      return dst;
    }

    // 创建lookat变换矩阵。 
    function lookAt(cameraPosition, target, up, dst) {
      dst = dst || new MatType(16);
      var zAxis = normalize(
          subtractVectors(cameraPosition, target));
      var xAxis = normalize(cross(up, zAxis));
      var yAxis = normalize(cross(zAxis, xAxis));
  
      dst[ 0] = xAxis[0];
      dst[ 1] = xAxis[1];
      dst[ 2] = xAxis[2];
      dst[ 3] = 0;
      dst[ 4] = yAxis[0];
      dst[ 5] = yAxis[1];
      dst[ 6] = yAxis[2];
      dst[ 7] = 0;
      dst[ 8] = zAxis[0];
      dst[ 9] = zAxis[1];
      dst[10] = zAxis[2];
      dst[11] = 0;
      dst[12] = cameraPosition[0];
      dst[13] = cameraPosition[1];
      dst[14] = cameraPosition[2];
      dst[15] = 1;
  
      return dst;
    }

    // 四维矩阵转化三维。
    function transformPoint(m, v, dst) {
      dst = dst || new MatType(3);
      var v0 = v[0];
      var v1 = v[1];
      var v2 = v[2];
      var d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3];
  
      dst[0] = (v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d;
      dst[1] = (v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d;
      dst[2] = (v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d;
  
      return dst;
    }

    // 矩阵转置。
    function transpose(m, dst) {
      dst = dst || new MatType(16);
  
      dst[ 0] = m[0];
      dst[ 1] = m[4];
      dst[ 2] = m[8];
      dst[ 3] = m[12];
      dst[ 4] = m[1];
      dst[ 5] = m[5];
      dst[ 6] = m[9];
      dst[ 7] = m[13];
      dst[ 8] = m[2];
      dst[ 9] = m[6];
      dst[10] = m[10];
      dst[11] = m[14];
      dst[12] = m[3];
      dst[13] = m[7];
      dst[14] = m[11];
      dst[15] = m[15];
  
      return dst;
    }

    // name 不取 indices。
    function allButIndices(name) {
      return name !== 'indices';
    }
  
    // 判断是否arraybuffer。
    function isArrayBuffer(a) {
      return a.buffer && a.buffer instanceof ArrayBuffer;
    }

    function setAttributes(setters, attribs) {
      setters = setters.attribSetters || setters;
      Object.keys(attribs).forEach(function(name) {
        const setter = setters[name];
        if (setter) {

          setter(attribs[name]);
        }
      });
    }

    function setUniforms(setters, ...values) {
      setters = setters.uniformSetters || setters;
      for (const uniforms of values) {
        
        Object.keys(uniforms).forEach(function(name) {
          const setter = setters[name];
          console.log(uniforms,setter);
          if (setter) {
            setter(uniforms[name]);
          }
        });
      }
    }

    function setBuffersAndAttributes(gl, setters, buffers) {
      setAttributes(setters, buffers.attribs);
      if (buffers.indices) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
      }
    }

    function getBindPointForSamplerType(gl, type) {
      if (type === gl.SAMPLER_2D)   return gl.TEXTURE_2D;        // eslint-disable-line
      if (type === gl.SAMPLER_CUBE) return gl.TEXTURE_CUBE_MAP;  // eslint-disable-line
      return undefined;
    }

    function augmentTypedArray(typedArray, numComponents) {
      let cursor = 0;
      typedArray.push = function() {
        for (let ii = 0; ii < arguments.length; ++ii) {
          const value = arguments[ii];
          if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
            for (let jj = 0; jj < value.length; ++jj) {
              typedArray[cursor++] = value[jj];
            }
          } else {
            typedArray[cursor++] = value;
          }
        }
      };
      typedArray.reset = function(opt_index) {
        cursor = opt_index || 0;
      };
      typedArray.numComponents = numComponents;
      Object.defineProperty(typedArray, 'numElements', {
        get: function() {
          return this.length / this.numComponents | 0;
        },
      });
      return typedArray;
    }

    function createAugmentedTypedArray(numComponents, numElements, opt_type) {
      const Type = opt_type || Float32Array;
      return augmentTypedArray(new Type(numComponents * numElements), numComponents);
    }

    // 返回arraybuffer。
    function makeTypedArray(array, name) {
      if (isArrayBuffer(array)) {
        return array;
      }
  
      if (array.data && isArrayBuffer(array.data)) {
        return array.data;
      }
  
      if (Array.isArray(array)) {
        array = {
          data: array,
        };
      }
  
      if (!array.numComponents) {
        array.numComponents = guessNumComponentsFromName(name, array.length);
      }
  
      let type = array.type;
      if (!type) {
        if (name === 'indices') {
          type = Uint16Array;
        }
      }
      const typedArray = createAugmentedTypedArray(array.numComponents, array.data.length / array.numComponents | 0, type);
      typedArray.push(array.data);
      return typedArray;
    }

    // 获取类型数组的类型。
    function getGLTypeForTypedArray(gl, typedArray) {
      if (typedArray instanceof Int8Array)    { return gl.BYTE; }            // eslint-disable-line
      if (typedArray instanceof Uint8Array)   { return gl.UNSIGNED_BYTE; }   // eslint-disable-line
      if (typedArray instanceof Int16Array)   { return gl.SHORT; }           // eslint-disable-line
      if (typedArray instanceof Uint16Array)  { return gl.UNSIGNED_SHORT; }  // eslint-disable-line
      if (typedArray instanceof Int32Array)   { return gl.INT; }             // eslint-disable-line
      if (typedArray instanceof Uint32Array)  { return gl.UNSIGNED_INT; }    // eslint-disable-line
      if (typedArray instanceof Float32Array) { return gl.FLOAT; }           // eslint-disable-line
      throw 'unsupported typed array type';
    }

    // 创建名字和变量的映射。
    function createMapping(obj) {
      const mapping = {};
      Object.keys(obj).filter(allButIndices).forEach(function(key) {
        mapping['a_' + key] = key;
      });
      return mapping;
    }

    // 获取是否标准化。
    function getNormalizationForTypedArray(typedArray) {
      if (typedArray instanceof Int8Array)    { return true; }  // eslint-disable-line
      if (typedArray instanceof Uint8Array)   { return true; }  // eslint-disable-line
      return false;
    }

    function guessNumComponentsFromName(name, length) {
      let numComponents;
      if (name.indexOf('coord') >= 0) {
        numComponents = 2;
      } else if (name.indexOf('color') >= 0) {
        // numComponents = 4;??
        numComponents = 3;
      } else {
        numComponents = 3;  // position, normals, indices ...
      }
  
      if (length % numComponents > 0) {
        throw 'can not guess numComponents. You should specify it.';
      }
  
      return numComponents;
    }

    // 返回attribute的数据对象。
    function createAttribsFromArrays(gl, arrays, opt_mapping) {
      const mapping = opt_mapping || createMapping(arrays);
      const attribs = {};
      Object.keys(mapping).forEach(function(attribName) {
        const bufferName = mapping[attribName];
        const origArray = arrays[bufferName];


        if (origArray.value) {
          attribs[attribName] = {
            value: origArray.value,
          };
        } else {
          const array = makeTypedArray(origArray, bufferName);
          console.log(array);
          attribs[attribName] = {
            buffer:        createBufferFromTypedArray(gl, array),
            numComponents: origArray.numComponents || array.numComponents || guessNumComponentsFromName(bufferName),
            type:          getGLTypeForTypedArray(gl, array),
            normalize:     getNormalizationForTypedArray(array),
          };
          console.log(attribs[attribName]);
        }
      });
      return attribs;
    }

    // 创建buffer。
    function createBufferFromTypedArray(gl, array, type, drawType) {
      type = type || gl.ARRAY_BUFFER;
      const buffer = gl.createBuffer();
      gl.bindBuffer(type, buffer);
      gl.bufferData(type, array, drawType || gl.STATIC_DRAW);
      return buffer;
    }

    function getNumComponents(array, arrayName) {
      return array.numComponents || array.size || guessNumComponentsFromName(arrayName, getArray(array).length);
    }

    function getArray(array) {
      return array.length ? array : array.data;
    }

    const positionKeys = ['position', 'positions', 'a_position'];
    function getNumElementsFromNonIndexedArrays(arrays) {
      let key;
      for (const k of positionKeys) {
        if (k in arrays) {
          key = k;
          break;
        }
      }
      key = key || Object.keys(arrays)[0];
      const array = arrays[key];
      const length = getArray(array).length;
      const numComponents = getNumComponents(array, key);
      const numElements = length / numComponents;
      if (length % numComponents > 0) {
        throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
      }
      return numElements;
    }

    // 创建bufferinfo。
    function createBufferInfoFromArrays(gl, arrays, opt_mapping) {
      const bufferInfo = {
        attribs: createAttribsFromArrays(gl, arrays, opt_mapping),
      };
      let indices = arrays.indices;
      if (indices) {

        indices = makeTypedArray(indices, 'indices');
        bufferInfo.indices = createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER);
        bufferInfo.numElements = indices.length;
      } else {
        bufferInfo.numElements = getNumElementsFromNonIndexedArrays(arrays);
      }
  
      return bufferInfo;
    }

    // 根据program创建全局变量setters。
    function createUniformSetters(gl, program) {
      let textureUnit = 0;
  
      /**
       * Creates a setter for a uniform of the given program with it's
       * location embedded in the setter.
       * @param {WebGLProgram} program
       * @param {WebGLUniformInfo} uniformInfo
       * @returns {function} the created setter.
       */
      function createUniformSetter(program, uniformInfo) {
        const location = gl.getUniformLocation(program, uniformInfo.name);
        const type = uniformInfo.type;
        // Check if this uniform is an array
        const isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]');
        if (type === gl.FLOAT && isArray) {
          return function(v) {
            gl.uniform1fv(location, v);
          };
        }
        if (type === gl.FLOAT) {
          return function(v) {
            gl.uniform1f(location, v);
          };
        }
        if (type === gl.FLOAT_VEC2) {
          return function(v) {
            gl.uniform2fv(location, v);
          };
        }
        if (type === gl.FLOAT_VEC3) {
          return function(v) {
            console.log(v)
            gl.uniform3fv(location, v);
          };
        }
        if (type === gl.FLOAT_VEC4) {
          return function(v) {
            gl.uniform4fv(location, v);
          };
        }
        if (type === gl.INT && isArray) {
          return function(v) {
            gl.uniform1iv(location, v);
          };
        }
        if (type === gl.INT) {
          return function(v) {
            gl.uniform1i(location, v);
          };
        }
        if (type === gl.INT_VEC2) {
          return function(v) {
            gl.uniform2iv(location, v);
          };
        }
        if (type === gl.INT_VEC3) {
          return function(v) {
            gl.uniform3iv(location, v);
          };
        }
        if (type === gl.INT_VEC4) {
          return function(v) {
            gl.uniform4iv(location, v);
          };
        }
        if (type === gl.BOOL) {
          return function(v) {
            gl.uniform1iv(location, v);
          };
        }
        if (type === gl.BOOL_VEC2) {
          return function(v) {
            gl.uniform2iv(location, v);
          };
        }
        if (type === gl.BOOL_VEC3) {
          return function(v) {
            gl.uniform3iv(location, v);
          };
        }
        if (type === gl.BOOL_VEC4) {
          return function(v) {
            gl.uniform4iv(location, v);
          };
        }
        if (type === gl.FLOAT_MAT2) {
          return function(v) {
            gl.uniformMatrix2fv(location, false, v);
          };
        }
        if (type === gl.FLOAT_MAT3) {
          return function(v) {
            gl.uniformMatrix3fv(location, false, v);
          };
        }
        if (type === gl.FLOAT_MAT4) {
          return function(v) {
            gl.uniformMatrix4fv(location, false, v);
          };
        }
        if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
          const units = [];
          for (let ii = 0; ii < info.size; ++ii) {
            units.push(textureUnit++);
          }
          return function(bindPoint, units) {
            return function(textures) {
              gl.uniform1iv(location, units);
              textures.forEach(function(texture, index) {
                gl.activeTexture(gl.TEXTURE0 + units[index]);
                gl.bindTexture(bindPoint, texture);
              });
            };
          }(getBindPointForSamplerType(gl, type), units);
        }
        if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
          return function(bindPoint, unit) {
            return function(texture) {
              gl.uniform1i(location, unit);
              gl.activeTexture(gl.TEXTURE0 + unit);
              gl.bindTexture(bindPoint, texture);
            };
          }(getBindPointForSamplerType(gl, type), textureUnit++);
        }
        throw ('unknown type: 0x' + type.toString(16)); // we should never get here.
      }
  
      const uniformSetters = { };
      const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  
      for (let ii = 0; ii < numUniforms; ++ii) {
        const uniformInfo = gl.getActiveUniform(program, ii);
        if (!uniformInfo) {
          break;
        }
        let name = uniformInfo.name;
        // remove the array suffix.
        if (name.substr(-3) === '[0]') {
          name = name.substr(0, name.length - 3);
        }
        const setter = createUniformSetter(program, uniformInfo);
        uniformSetters[name] = setter;
      }
      return uniformSetters;
    }

    // 创建属性setters。
    function createAttributeSetters(gl, program) {
      const attribSetters = {
      };
  
      function createAttribSetter(index) {
        return function(b) {
            if (b.value) {
              gl.disableVertexAttribArray(index);
              switch (b.value.length) {
                case 4:
                  gl.vertexAttrib4fv(index, b.value);
                  break;
                case 3:
                  gl.vertexAttrib3fv(index, b.value);
                  break;
                case 2:
                  gl.vertexAttrib2fv(index, b.value);
                  break;
                case 1:
                  gl.vertexAttrib1fv(index, b.value);
                  break;
                default:
                  throw new Error('the length of a float constant value must be between 1 and 4!');
              }
            } else {
              gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
              gl.enableVertexAttribArray(index);
              gl.vertexAttribPointer(
                  index, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
            }
          };
      }
  
      const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
      for (let ii = 0; ii < numAttribs; ++ii) {
        const attribInfo = gl.getActiveAttrib(program, ii);
        if (!attribInfo) {
          break;
        }
        const index = gl.getAttribLocation(program, attribInfo.name);
        attribSetters[attribInfo.name] = createAttribSetter(index);
      }
  
      return attribSetters;
    }

    function scaleVector(v, s, dst) {
      dst = dst || new MatType(3);
      dst[0] = v[0] * s;
      dst[1] = v[1] * s;
      dst[2] = v[2] * s;
      return dst;
    }

    function addVectors(a, b, dst) {
      dst = dst || new MatType(3);
      dst[0] = a[0] + b[0];
      dst[1] = a[1] + b[1];
      dst[2] = a[2] + b[2];
      return dst;
    }

    function length(v) {
      return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    }

    // 根据shadersource创建程序对象。
    function createProgramFromSources(
      gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) {
    const shaders = [];
    for (let ii = 0; ii < shaderSources.length; ++ii) {
      shaders.push(loadShader(
          gl, shaderSources[ii], gl[defaultShaderType[ii]], opt_errorCallback));
    }
    return createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
    }

    // 创建程序信息对象。
    function createProgramInfo(
      gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) {
    shaderSources = shaderSources.map(function(source) {
      const script = document.getElementById(source);
      return script ? script.innerText : source;
    });
    const program = createProgramFromSources(gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback);
    if (!program) {
      return null;
    }
    // 获取setter。
    const uniformSetters = createUniformSetters(gl, program);
    const attribSetters = createAttributeSetters(gl, program);
    return {
      program: program,
      uniformSetters: uniformSetters,
      attribSetters: attribSetters,
    };
  }

  // 获得单位向量。
  function identity(dst) {
    dst = dst || new MatType(16);

    dst[ 0] = 1;
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = 1;
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = 0;
    dst[10] = 1;
    dst[11] = 0;
    dst[12] = 0;
    dst[13] = 0;
    dst[14] = 0;
    dst[15] = 1;

    return dst;
  }

  // 矩阵复制。
  function copy(src, dst) {
    dst = dst || new MatType(16);
    dst[ 0] = src[ 0];
    dst[ 1] = src[ 1];
    dst[ 2] = src[ 2];
    dst[ 3] = src[ 3];
    dst[ 4] = src[ 4];
    dst[ 5] = src[ 5];
    dst[ 6] = src[ 6];
    dst[ 7] = src[ 7];
    dst[ 8] = src[ 8];
    dst[ 9] = src[ 9];
    dst[10] = src[10];
    dst[11] = src[11];
    dst[12] = src[12];
    dst[13] = src[13];
    dst[14] = src[14];
    dst[15] = src[15];

    return dst;
  }
  
  
  var makeTexture = function(gl) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return tex;
  };
  
  // 获取条纹材质。
  var makeStripeTexture = function(gl, options) {
    options = options || {};
    var width  = options.width  || 2;
    var height = options.height || 2;
    var color1 = options.color1 || "white";
    var color2 = options.color2 || "black";
  
    setCanvasSize(width, height);
  
    ctx.fillStyle = color1 || "white";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = color2 || "black";
    ctx.fillRect(0, 0, width, height / 2);
  
    return makeTexture(gl);
  };
  
  // 获取方格材质。
  var makeCheckerTexture = function(gl, options) {
    options = options || {};
    var width  = options.width  || 2;
    var height = options.height || 2;
    var color1 = options.color1 || "white";
    var color2 = options.color2 || "black";
  
    setCanvasSize(width, height);
  
    ctx.fillStyle = color1 || "white";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = color2 || "black";
    ctx.fillRect(0, 0, width / 2, height / 2);
    ctx.fillRect(width / 2, height / 2, width / 2, height / 2);
  
    return makeTexture(gl);
  };
  
  // 获取圆形材质。
  var makeCircleTexture = function(gl, options) {
    options = options || {};
    var width  = options.width  || 128;
    var height = options.height || 128;
    var color1 = options.color1 || "white";
    var color2 = options.color2 || "black";
  
    setCanvasSize(width, height);
  
    var size = Math.min(width, height);
    ctx.fillStyle = color1 || "white";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = color2 || "black";
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    ctx.arc(0, 0, width / 2 - 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color1 || "white";
    ctx.beginPath();
    ctx.arc(0, 0, width / 4 - 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  
    return makeTexture(gl);
  };
  
  // 获取随机材质。
  var makeRandomTexture = function(gl, options) {
    options = options || {};
    var w   = options.width  || 2;
    var h   = options.height || 2;
    var min = options.min    || 0;
    var max = options.max    || 256;
  
    var numPixels = w * h;
    var pixels = new Uint8Array(numPixels * 4);
    var strong = 4;randInt(3);
    for (var p = 0; p < numPixels; ++p) {
      var off = p * 4;
      pixels[off + 0] = rand(min, max);
      pixels[off + 1] = rand(min, max);
      pixels[off + 2] = rand(min, max);
      pixels[off + 3] = 255;
    }
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    gl.generateMipmap(gl.TEXTURE_2D);
    return texture;
  };


  function makeRandomVertexColors(vertices, options) {
    options = options || {};
    const numElements = vertices.position.numElements;
    const vcolors = createAugmentedTypedArray(4, numElements, Uint8Array);
    const rand = options.rand || function(ndx, channel) {
      return channel < 3 ? randInt(256) : 255;
    };
    vertices.color = vcolors;
    if (vertices.indices) {
      // just make random colors if index
      for (let ii = 0; ii < numElements; ++ii) {
        vcolors.push(rand(ii, 0), rand(ii, 1), rand(ii, 2), rand(ii, 3));
      }
    } else {
      // make random colors per triangle
      const numVertsPerColor = options.vertsPerColor || 3;
      const numSets = numElements / numVertsPerColor;
      for (let ii = 0; ii < numSets; ++ii) {
        const color = [rand(ii, 0), rand(ii, 1), rand(ii, 2), rand(ii, 3)];
        for (let jj = 0; jj < numVertsPerColor; ++jj) {
          vcolors.push(color);
        }
      }
    }
    return vertices;
  }


  function deindexVertices(vertices) {
    const indices = vertices.indices;
    const newVertices = {};
    const numElements = indices.length;

    function expandToUnindexed(channel) {
      const srcBuffer = vertices[channel];
      const numComponents = srcBuffer.numComponents;
      const dstBuffer = createAugmentedTypedArray(numComponents, numElements, srcBuffer.constructor);
      for (let ii = 0; ii < numElements; ++ii) {
        const ndx = indices[ii];
        const offset = ndx * numComponents;
        for (let jj = 0; jj < numComponents; ++jj) {
          dstBuffer.push(srcBuffer[offset + jj]);
        }
      }
      newVertices[channel] = dstBuffer;
    }

    Object.keys(vertices).filter(allButIndices).forEach(expandToUnindexed);

    return newVertices;
  }

  function createCubeVertices(size) {
    const k = size / 2;

    const cornerVertices = [
      [-k, -k, -k],
      [+k, -k, -k],
      [-k, +k, -k],
      [+k, +k, -k],
      [-k, -k, +k],
      [+k, -k, +k],
      [-k, +k, +k],
      [+k, +k, +k],
    ];

    const faceNormals = [
      [+1, +0, +0],
      [-1, +0, +0],
      [+0, +1, +0],
      [+0, -1, +0],
      [+0, +0, +1],
      [+0, +0, -1],
    ];

    const uvCoords = [
      [1, 0],
      [0, 0],
      [0, 1],
      [1, 1],
    ];

    const numVertices = 6 * 4;
    const positions = createAugmentedTypedArray(3, numVertices);
    const normals   = createAugmentedTypedArray(3, numVertices);
    const texCoords = createAugmentedTypedArray(2 , numVertices);
    const indices   = createAugmentedTypedArray(3, 6 * 2, Uint16Array);

    for (let f = 0; f < 6; ++f) {
      const faceIndices = CUBE_FACE_INDICES[f];
      for (let v = 0; v < 4; ++v) {
        const position = cornerVertices[faceIndices[v]];
        const normal = faceNormals[f];
        const uv = uvCoords[v];

        // Each face needs all four vertices because the normals and texture
        // coordinates are not all the same.
        positions.push(position);
        normals.push(normal);
        texCoords.push(uv);

      }
      // Two triangles make a square face.
      const offset = 4 * f;
      indices.push(offset + 0, offset + 1, offset + 2);
      indices.push(offset + 0, offset + 2, offset + 3);
    }

    return {
      position: positions,
      normal: normals,
      texcoord: texCoords,
      indices: indices,
    };
  }


  function createFlattenedFunc(vertFunc) {
    return function(gl, ...args) {
      let vertices = vertFunc(...args);
      vertices = deindexVertices(vertices);
      vertices = makeRandomVertexColors(vertices, {
          vertsPerColor: 6,
          rand: function(ndx, channel) {
            return channel < 3 ? ((128 + Math.random() * 128) | 0) : 255;
          },
        });
      return createBufferInfoFromArrays(gl, vertices);
    };
  }

  function createSphereVertices(
      radius,
      subdivisionsAxis,
      subdivisionsHeight,
      opt_startLatitudeInRadians,
      opt_endLatitudeInRadians,
      opt_startLongitudeInRadians,
      opt_endLongitudeInRadians) {
    if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
      throw Error('subdivisionAxis and subdivisionHeight must be > 0');
    }

    opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
    opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
    opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
    opt_endLongitudeInRadians = opt_endLongitudeInRadians || (Math.PI * 2);

    const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
    const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

    // We are going to generate our sphere by iterating through its
    // spherical coordinates and generating 2 triangles for each quad on a
    // ring of the sphere.
    const numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
    const positions = createAugmentedTypedArray(3, numVertices);
    const normals   = createAugmentedTypedArray(3, numVertices);
    const texCoords = createAugmentedTypedArray(2 , numVertices);

    // Generate the individual vertices in our vertex buffer.
    for (let y = 0; y <= subdivisionsHeight; y++) {
      for (let x = 0; x <= subdivisionsAxis; x++) {
        // Generate a vertex based on its spherical coordinates
        const u = x / subdivisionsAxis;
        const v = y / subdivisionsHeight;
        const theta = longRange * u + opt_startLongitudeInRadians;
        const phi = latRange * v + opt_startLatitudeInRadians;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
        const ux = cosTheta * sinPhi;
        const uy = cosPhi;
        const uz = sinTheta * sinPhi;
        positions.push(radius * ux, radius * uy, radius * uz);
        normals.push(ux, uy, uz);
        texCoords.push(1 - u, v);
      }
    }

    const numVertsAround = subdivisionsAxis + 1;
    const indices = createAugmentedTypedArray(3, subdivisionsAxis * subdivisionsHeight * 2, Uint16Array);
    for (let x = 0; x < subdivisionsAxis; x++) {
      for (let y = 0; y < subdivisionsHeight; y++) {
        // Make triangle 1 of quad.
        indices.push(
            (y + 0) * numVertsAround + x,
            (y + 0) * numVertsAround + x + 1,
            (y + 1) * numVertsAround + x);

        // Make triangle 2 of quad.
        indices.push(
            (y + 1) * numVertsAround + x,
            (y + 0) * numVertsAround + x + 1,
            (y + 1) * numVertsAround + x + 1);
      }
    }

    return {
      position: positions,
      normal: normals,
      texcoord: texCoords,
      indices: indices,
    };
  }


  function drawBufferInfo(gl, bufferInfo, primitiveType, count, offset) {
    const indices = bufferInfo.indices;
    primitiveType = primitiveType === undefined ? gl.TRIANGLES : primitiveType;
    const numElements = count === undefined ? bufferInfo.numElements : count;
    offset = offset === undefined ? 0 : offset;
    if (indices) {
      gl.drawElements(primitiveType, numElements, gl.UNSIGNED_SHORT, offset);
    } else {
      gl.drawArrays(primitiveType, offset, numElements);
    }
  }

//--------------------------------------
function getTransformMatrix(matrix, transfrom){
 
  matrix = translate3d(matrix, transfrom.translation[0],transfrom. translation[1], transfrom.translation[2]);
  matrix = xRotate(matrix, transfrom.rotation[0]);
  matrix = yRotate(matrix, transfrom.rotation[1]);
  matrix = zRotate(matrix, transfrom.rotation[2]);
  matrix = scale3d(matrix,transfrom.scale[0], transfrom.scale[1], transfrom.scale[2]);
  return matrix;

}


  return{
     initWebglContext:initWebglContext,
      getWebglAndShaderSource:getWebglAndShaderSource,
      loadShader:loadShader,
      createProgram:createProgram,
      resizeCanvasToDisplaySize:resizeCanvasToDisplaySize,
      projection2d:projection2d,
      translate2d:translate2d,
      scale2d:scale2d,
      rotate2d:rotate2d,
      setupSlider:setupSlider,
      createProgramFromScripts:createProgramFromScripts,
      createShaderFromScript:createShaderFromScript,
      setDropDownBox:setDropDownBox,
      radToDeg:radToDeg,
      degToRad:degToRad,
      projection3d:projection3d,
      xRotate:xRotate,
      yRotate:yRotate,
      zRotate:zRotate,
      scale3d:scale3d,
      translate3d:translate3d,
      projection3d:projection3d,
      perspective:perspective,
      inverse:inverse,
      lookAt:lookAt,
      scaling3d:scaling3d,
      vectorMultiply:vectorMultiply,
      yRotation:yRotation,
      xRotation:xRotation,
      zRotation:zRotation,
      multiply3d:multiply3d,
      translation3d:translation3d,
      transformPoint:transformPoint,
      transpose:transpose,
      normalize:normalize,
      setupColorInput:setupColorInput,
      colorToRGB:colorToRGB,
      createBufferInfoFromArrays:createBufferInfoFromArrays,
      createProgramInfo:createProgramInfo,
      identity:identity,
      copy:copy,
      makeStripeTexture:makeStripeTexture,
      makeCheckerTexture:makeCheckerTexture,
      makeCircleTexture:makeCircleTexture,
      setBuffersAndAttributes:setBuffersAndAttributes,
      setUniforms:setUniforms,
      subtractVectors:subtractVectors,
      scaleVector:scaleVector,
      addVectors:addVectors,
      length:length,
      drawBufferInfo:drawBufferInfo,
      createSphereWithVertexColorsBufferInfo: createFlattenedFunc(createSphereVertices),
      createCubeWithVertexColorsBufferInfo: createFlattenedFunc(createCubeVertices),
      createUniformSetters:createUniformSetters,
      createAttributeSetters:createAttributeSetters,
      getTransformMatrix:getTransformMatrix,

      setupSliderVector:setupSliderVector
    }


  })
)


export default {};
