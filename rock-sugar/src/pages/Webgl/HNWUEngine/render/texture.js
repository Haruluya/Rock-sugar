
  var makeTexture = function (gl) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return tex;
  };

  // 获取条纹材质。
  var makeStripeTexture = function (gl, options) {
    options = options || {};
    var width = options.width || 2;
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
  var makeCheckerTexture = function (gl, options) {
    options = options || {};
    var width = options.width || 2;
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
  var makeCircleTexture = function (gl, options) {
    options = options || {};
    var width = options.width || 128;
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
  var makeRandomTexture = function (gl, options) {
    options = options || {};
    var w = options.width || 2;
    var h = options.height || 2;
    var min = options.min || 0;
    var max = options.max || 256;

    var numPixels = w * h;
    var pixels = new Uint8Array(numPixels * 4);
    var strong = 4;
    randInt(3);
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
    const rand = options.rand || function (ndx, channel) {
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