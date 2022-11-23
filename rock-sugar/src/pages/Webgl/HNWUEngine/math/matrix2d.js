

// 二维图像的projection。返回一个二维映射矩阵。
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