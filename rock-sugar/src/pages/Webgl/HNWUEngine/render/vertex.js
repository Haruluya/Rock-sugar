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
    const normals = createAugmentedTypedArray(3, numVertices);
    const texCoords = createAugmentedTypedArray(2, numVertices);
    const indices = createAugmentedTypedArray(3, 6 * 2, Uint16Array);

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
    return function (gl, ...args) {
        let vertices = vertFunc(...args);
        vertices = deindexVertices(vertices);
        vertices = makeRandomVertexColors(vertices, {
            vertsPerColor: 6,
            rand: function (ndx, channel) {
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
    const normals = createAugmentedTypedArray(3, numVertices);
    const texCoords = createAugmentedTypedArray(2, numVertices);

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