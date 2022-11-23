

// 弧度和角度转换。
function radToDeg(r) {
    return r * 180 / Math.PI;
    }
function degToRad(d) {
    return d * Math.PI / 180;
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