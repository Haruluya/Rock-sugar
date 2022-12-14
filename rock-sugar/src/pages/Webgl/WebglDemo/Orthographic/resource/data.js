export default
{
    position: new Float32Array([
        // 正面。
        200,   50,  0,
        0, 50,  0,
        0,   150,  0,
        0, 150,  0,
        200, 150,  0,
        200,   50,  0,
    
        // 顶面。
        200,   50,  100,
        0,  50,  100,
        0,   50,  0,
        0,  50,  0,
        200,  50,  0,
        200,   50,  100,
    
        // 右侧面。
        200,  50,  0,
        200,  150,  0,
        200,  150,  100,
        200,  150,  100,
        200,  50,  100,
        200,  50,  0,
    
        // 左侧面。
        0,   50,  0,
        0,   50,  100,
        0,   150,  100,
        0,   150,  100,
        0,   150,  0,
        0, 50,  0,
    
        // 底面。
        0,   150,  0,
        0,   150,  100,
        200,   150,  100,
        200,   150,  100,
        200,  150,  0,
        0,   150,  0,
    
        // 后面。
        200,  50,  100,
        200,  150,  100,
        0,  150,  100,
        0,  150,  100,
        0,  50,  100,
        200,  50,  100,  
    
    
    ]),

    color: new Uint8Array([
        // 正面。
        0,  59, 252,
        0,  80, 252,
        0,  218, 252,
        0,  218, 252,
        0,  80, 252,
        0,  59, 252,
        // 顶面。
        252,  0, 0,
        150,  0, 0,
        0,  0, 0,
        0,  0, 0,
        150,  0, 0,
        252,  0, 0,
    
        // 右侧面。
        252,  227, 103,
        150,  227, 103,
        0,  227, 103,
        0,  227, 103,
        150,  227, 103,
        252,  227, 103,
    
        // 左侧面。
        252,  227, 103,
        150,  227, 103,
        0,  227, 103,
        0,  227, 103,
        150,  227, 103,
        252,  227, 103,
    
        // 底面。
        252,  0, 0,
        150,  0, 0,
        0,  0, 0,
        0,  0, 0,
        150,  0, 0,
        252,  0, 0,
    
        // 后面。
        0,  59, 252,
        0,  80, 252,
        0,  218, 252,
        0,  218, 252,
        0,  80, 252,
        0,  59, 252,
    
    ]),
    
}