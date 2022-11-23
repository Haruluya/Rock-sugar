

const defaultShaderType = [
    'VERTEX_SHADER',
    'FRAGMENT_SHADER',
  ];

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

// get context.
function initWebglContext(canvasId){
    var canvas = document.querySelector("#"+canvasId);
    var gl = canvas.getContext("webgl");
    if (!gl) {
        console.log("GET WBEGL CONTEXT FAILD!!!");
        return;
    }
    return {gl, canvas};
}

// load shader source.
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

// create program.
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

//from shader scripts.
function createProgramFromScripts(
    gl, shaderScriptIds, opt_attribs, opt_locations, opt_errorCallback) {
    const shaders = [];

    for (let ii = 0; ii < shaderScriptIds.length; ++ii) {
    shaders.push(createShaderFromScript(
        gl, shaderScriptIds[ii], gl[defaultShaderType[ii]], opt_errorCallback));
    }
    return createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
}

//create Shader From Scripts.
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

//create shader from shader sources.
function createShaderFromSource(
    gl, shaderSource, opt_shaderType, opt_errorCallback) {
    let shaderType;
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

function createProgramFromShaderSource(
    gl, vertexShaderSource, fragmentShaderSource, opt_attribs, opt_locations, opt_errorCallback
  ){
    const source = [vertexShaderSource,fragmentShaderSource];
    const shaders = [];
    for (let ii = 0; ii < 2; ++ii) {
      shaders.push(createShaderFromSource(
          gl, source[ii], gl[defaultShaderType[ii]], opt_errorCallback));
    }
    return createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
}



// make canvas`s size to screen`s size.
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

