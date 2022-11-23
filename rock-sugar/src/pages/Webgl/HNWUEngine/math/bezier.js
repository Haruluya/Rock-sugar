

// 获取贝塞尔曲线上点。
function getPointOnBezierCurve(points, offset, t) {
    const invT = (1 - t);
    return v2.add(v2.mult(points[offset + 0], invT * invT * invT),
                v2.mult(points[offset + 1], 3 * t * invT * invT),
                v2.mult(points[offset + 2], 3 * invT * t * t),
                v2.mult(points[offset + 3], t * t  *t));
}