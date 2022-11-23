function setAttributes(setters, attribs) {
    setters = setters.attribSetters || setters;
    Object.keys(attribs).forEach(function (name) {
        const setter = setters[name];
        if (setter) {

            setter(attribs[name]);
        }
    });
}

function setUniforms(setters, ...values) {
    setters = setters.uniformSetters || setters;
    for (const uniforms of values) {

        Object.keys(uniforms).forEach(function (name) {
            const setter = setters[name];
            console.log(name, uniforms, setter, "per uniforms");
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
    if (type === gl.SAMPLER_2D) return gl.TEXTURE_2D; // eslint-disable-line
    if (type === gl.SAMPLER_CUBE) return gl.TEXTURE_CUBE_MAP; // eslint-disable-line
    return undefined;
}

function augmentTypedArray(typedArray, numComponents) {
    let cursor = 0;
    typedArray.push = function () {
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
    typedArray.reset = function (opt_index) {
        cursor = opt_index || 0;
    };
    typedArray.numComponents = numComponents;
    Object.defineProperty(typedArray, 'numElements', {
        get: function () {
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
    if (typedArray instanceof Int8Array) {
        return gl.BYTE;
    } // eslint-disable-line
    if (typedArray instanceof Uint8Array) {
        return gl.UNSIGNED_BYTE;
    } // eslint-disable-line
    if (typedArray instanceof Int16Array) {
        return gl.SHORT;
    } // eslint-disable-line
    if (typedArray instanceof Uint16Array) {
        return gl.UNSIGNED_SHORT;
    } // eslint-disable-line
    if (typedArray instanceof Int32Array) {
        return gl.INT;
    } // eslint-disable-line
    if (typedArray instanceof Uint32Array) {
        return gl.UNSIGNED_INT;
    } // eslint-disable-line
    if (typedArray instanceof Float32Array) {
        return gl.FLOAT;
    } // eslint-disable-line
    throw 'unsupported typed array type';
}

// 创建名字和变量的映射。
function createMapping(obj) {
    const mapping = {};
    Object.keys(obj).filter(allButIndices).forEach(function (key) {
        mapping['a_' + key] = key;
    });
    return mapping;
}

// 获取是否标准化。
function getNormalizationForTypedArray(typedArray) {
    if (typedArray instanceof Int8Array) {
        return true;
    } // eslint-disable-line
    if (typedArray instanceof Uint8Array) {
        return true;
    } // eslint-disable-line
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
        numComponents = 3; // position, normals, indices ...
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
    Object.keys(mapping).forEach(function (attribName) {
        const bufferName = mapping[attribName];
        const origArray = arrays[bufferName];


        if (origArray.value) {
            attribs[attribName] = {
                value: origArray.value,
            };
        } else {
            const array = makeTypedArray(origArray, bufferName);
            // console.log(array);
            attribs[attribName] = {
                buffer: createBufferFromTypedArray(gl, array),
                numComponents: origArray.numComponents || array.numComponents || guessNumComponentsFromName(bufferName),
                type: getGLTypeForTypedArray(gl, array),
                normalize: getNormalizationForTypedArray(array),
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
            return function (v) {
                gl.uniform1fv(location, v);
            };
        }
        if (type === gl.FLOAT) {
            return function (v) {
                gl.uniform1f(location, v);
            };
        }
        if (type === gl.FLOAT_VEC2) {
            return function (v) {
                gl.uniform2fv(location, v);
            };
        }
        if (type === gl.FLOAT_VEC3) {
            return function (v) {
                console.log(v)
                gl.uniform3fv(location, v);
            };
        }
        if (type === gl.FLOAT_VEC4) {
            return function (v) {
                gl.uniform4fv(location, v);
            };
        }
        if (type === gl.INT && isArray) {
            return function (v) {
                gl.uniform1iv(location, v);
            };
        }
        if (type === gl.INT) {
            return function (v) {
                gl.uniform1i(location, v);
            };
        }
        if (type === gl.INT_VEC2) {
            return function (v) {
                gl.uniform2iv(location, v);
            };
        }
        if (type === gl.INT_VEC3) {
            return function (v) {
                gl.uniform3iv(location, v);
            };
        }
        if (type === gl.INT_VEC4) {
            return function (v) {
                gl.uniform4iv(location, v);
            };
        }
        if (type === gl.BOOL) {
            return function (v) {
                gl.uniform1iv(location, v);
            };
        }
        if (type === gl.BOOL_VEC2) {
            return function (v) {
                gl.uniform2iv(location, v);
            };
        }
        if (type === gl.BOOL_VEC3) {
            return function (v) {
                gl.uniform3iv(location, v);
            };
        }
        if (type === gl.BOOL_VEC4) {
            return function (v) {
                gl.uniform4iv(location, v);
            };
        }
        if (type === gl.FLOAT_MAT2) {
            return function (v) {
                gl.uniformMatrix2fv(location, false, v);
            };
        }
        if (type === gl.FLOAT_MAT3) {
            return function (v) {
                gl.uniformMatrix3fv(location, false, v);
            };
        }
        if (type === gl.FLOAT_MAT4) {
            return function (v) {
                gl.uniformMatrix4fv(location, false, v);
            };
        }
        if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
            const units = [];
            for (let ii = 0; ii < info.size; ++ii) {
                units.push(textureUnit++);
            }
            return function (bindPoint, units) {
                return function (textures) {
                    gl.uniform1iv(location, units);
                    textures.forEach(function (texture, index) {
                        gl.activeTexture(gl.TEXTURE0 + units[index]);
                        gl.bindTexture(bindPoint, texture);
                    });
                };
            }(getBindPointForSamplerType(gl, type), units);
        }
        if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
            return function (bindPoint, unit) {
                return function (texture) {
                    gl.uniform1i(location, unit);
                    gl.activeTexture(gl.TEXTURE0 + unit);
                    gl.bindTexture(bindPoint, texture);
                };
            }(getBindPointForSamplerType(gl, type), textureUnit++);
        }
        throw ('unknown type: 0x' + type.toString(16)); // we should never get here.
    }

    const uniformSetters = {};
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
    const attribSetters = {};

    function createAttribSetter(index) {
        return function (b) {
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
    shaderSources = shaderSources.map(function (source) {
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
    
        dst[0] = 1;
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;
        dst[4] = 0;
        dst[5] = 1;
        dst[6] = 0;
        dst[7] = 0;
        dst[8] = 0;
        dst[9] = 0;
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
        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
        dst[3] = src[3];
        dst[4] = src[4];
        dst[5] = src[5];
        dst[6] = src[6];
        dst[7] = src[7];
        dst[8] = src[8];
        dst[9] = src[9];
        dst[10] = src[10];
        dst[11] = src[11];
        dst[12] = src[12];
        dst[13] = src[13];
        dst[14] = src[14];
        dst[15] = src[15];
    
        return dst;
      }