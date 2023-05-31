/*
    Just to make source code shorter.
*/
import AnimEvent from "_plugins/anim-event/anim-event.min.js"
import LeaderLine from "_plugins/leader-line/leader-line.min.js";
import {Edge, Point} from './Interfaces/index'




// dragable.
let dragPosition = {
    x: 0,
    y: 0,
    maxX: 10000,
    maxY: 400
};

// node line.
const nodeLines = {
    mainPanelLine: null,
    debugPanelLine: null
}

// drag callback.
const panelDrag = (sidePanelPos, panelID, e) => {
    dragPosition.x = e.clientX;
    dragPosition.y = e.clientY;
    nodeLines.mainPanelLine.show("draw");

    // scroll not support now.
    if (window.scrollY === 0) {
        document.body.style.overflow = 'hidden'
        Object.values(nodeLines).forEach(element => {
            if (element) {
                element.position();
            }
        });
        document.onmousemove = AnimEvent.add((e) => {
            const evt = e || event;
            const offsetX = evt.clientX - dragPosition.x;
            const offsetY = evt.clientY - dragPosition.y;
            if (!(sidePanelPos[panelID].y > dragPosition.maxY && offsetY > 0)) {
                sidePanelPos[panelID].x += offsetX;
                sidePanelPos[panelID].y += offsetY;
                dragPosition.x = evt.clientX;
                dragPosition.y = evt.clientY;
                Object.values(nodeLines).forEach(element => {
                    if (element) {
                        element.position();
                    }
                });
            }
        });
        document.onmouseup = () => {
            document.onmousemove = null;
            document.body.style.overflow = 'visible'
        };

    }




};


// page default ui.
const setDefaultUI = (component) => {
    let options = {
        startSocket: 'right',
        endSocket: 'top',
        color: 'rgba(255, 255, 0, 0.9)',
    };
    nodeLines.mainPanelLine = new LeaderLine(
        document.getElementById(component.slotID.MAIN_PANEL_SLOT_ID),
        document.getElementById(component.slotID.CORE_SLOT_TOP_ID),
        options,
    );

    Object.values(nodeLines).forEach(element => {
        if (element) {
            element.hide("none");
        }
    });

}


const setDebugPanelCon = (component) => {
    let options = {
        startSocket: 'right',
        endSocket: 'left',
        color: 'rgba(0, 255, 0, 0.9)',
    };

    nodeLines.debugPanelLine = new LeaderLine(
        document.getElementById(component.slotID.DEBUG_OUT_SLOT_ID),
        document.getElementById(component.slotID.DEBUG_IN_SLOT_ID),
        options,
    );
    nodeLines.debugPanelLine.hide('none');
}


// some normal callbacks for param.
const globalUiCallbacks = {
    updatePoint: (component, pointName) => {
        let sectionParams = component.sectionParams;
        let Render = component.Render;
        return function (event,ui) {

            sectionParams[pointName] = ui.value;
            Render();
        }
    },
    updateValue: (component, valueName) => {
        if(!component) return;  
        let sectionParams = component.sectionParams;
        let Render = component.Render;
        return function (event,ui) {

            sectionParams[valueName] = ui.value;
            Render();
        }
    },
    updatePointArray:(component, valueName, index) =>{
        let sectionParams = component.sectionParams;
        let Render = component.Render;
        return function (event, ui){
            sectionParams[valueName][index] = ui.value;
            Render();
        }
    }

}

const updateSlot = () => {
    Object.values(nodeLines).forEach(element => {
        if (element) {
            element.position();
        }
    });
}

const destroy = () => {
    Object.values(nodeLines).forEach(element => {
        if (element) {
            element.remove();
        }
    });
    screenTransform = {x:0,y:0,scale:100};
}



let screenTransform = {x:0,y:0,scale:100}

const setScreenTransform = (transform)=>{
    screenTransform = transform;
}

// draw grid as canvas`s background.
const drawGrid = (component) => {
    const CanvasWidth = component.canvas.width;
    const CanvasHeight = component.canvas.height;
    //fix div 0 bug.
    const girdSize = component.sectionParams.girdSize < 1 ? 1 :component.sectionParams.girdSize;
    const ctx = component.ctx;
    var xLineTotals = Math.floor(CanvasHeight / girdSize);
    var yLineTotals = Math.floor(CanvasWidth / girdSize);
    for (var i = 0; i < xLineTotals; i++) {
        ctx.beginPath();
        ctx.moveTo(0, girdSize * i);
        ctx.lineTo((yLineTotals - 1) * girdSize, girdSize * i);
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
    }
    for (var j = 0; j < yLineTotals; j++) {
        ctx.beginPath();
        ctx.moveTo(girdSize * j, 0);
        ctx.lineTo(girdSize * j, (xLineTotals - 1) * girdSize);
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
    }

}


// draw line in grid by Bresenham.
const drawPointInGrid = (component, gridx, gridy, color) => {
    gridx += screenTransform.x;
    gridy += screenTransform.y;
    gridx *= screenTransform.scale /100;
    gridy *= screenTransform.scale /100;
    const girdSize = component.sectionParams.girdSize;
    // cant overflow.
    if (gridx > parseInt(component.canvas.width / girdSize) - 2 ||
        gridy > parseInt(component.canvas.height) / girdSize - 2)
        return;
    const rectx = gridx * girdSize;
    const recty = gridy * girdSize;
    component.ctx.fillStyle = color;
    component.ctx.fillRect(rectx, recty, girdSize, girdSize);
}

const drawLine = (ctx, beginPoint, endPoint, color) => {
    ctx.beginPath();
    ctx.moveTo(beginPoint.x, beginPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = color;
    ctx.stroke();
}

// draw line in grid with bresenham.
const drawLineInGrid = (component, beginPoint, endPoint, color) => {
    let temp = null;
    let m, x, y = 0;
    let e = -0.5;
    //Horizontal line.
    if (beginPoint.y == endPoint.y) {
        if (beginPoint.x > endPoint.x) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        for (x = beginPoint.x; x < endPoint.x; x++)
            drawPointInGrid(component, x, beginPoint.y, color);
        return;
    }
    //Vertical line.
    if (beginPoint.x == endPoint.x) {
        if (beginPoint.y > endPoint.y) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        for (y = beginPoint.y; y < endPoint.y; y++)
            drawPointInGrid(component, beginPoint.x, y, color);
        return;
    }

    m = (endPoint.y - beginPoint.y) / (endPoint.x - beginPoint.x);
    if (m > 0 && m <= 1) {
        if (beginPoint.x > endPoint.x) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = -0.5;
        x = beginPoint.x;
        y = beginPoint.y;
        while (x < endPoint.x) {
            drawPointInGrid(component, x, y, color);
            e = e + m;
            if (e > 0) {
                y++;
                e = e - 1;
            }
            x++;
        }
    } else if (m >= -1 && m < 0) {
        if (beginPoint.x > endPoint.x) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = 0.5;
        x = beginPoint.x;
        y = beginPoint.y;
        while (x < endPoint.x) {
            drawPointInGrid(component, x, y, color);
            e = e + m;
            if (e < 0) {
                y--;
                e = e + 1;
            }
            x++;
        }
    } else if (m > 1) {
        if (beginPoint.y > endPoint.y) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = -0.5;
        x = beginPoint.x;
        y = beginPoint.y;
        while (y < endPoint.y) {
            drawPointInGrid(component, x, y, color);
            e = e + 1 / m;
            if (e > 0) {
                x = x + 1;
                e = e - 1;
            }
            y++;
        }
    } else {
        if (beginPoint.y > endPoint.y) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = 0.5;
        x = beginPoint.x;
        y = beginPoint.y;
        while (y < endPoint.y) {
            drawPointInGrid(component, x, y, color);
            e = e + 1 / m;
            if (e < 0) {
                x--;
                e = e + 1;
            }
            y++;
        }
    }
}

const drawRectInGrid = (component,rect,color) =>{
    const {leftTop,rightTop,leftBottom,rightBottom} = rect.RectPoints();
    {
        drawLineInGrid(component, leftTop, rightTop , color);
        drawLineInGrid(component, leftTop, leftBottom , color);
        drawLineInGrid(component, rightBottom, leftBottom , color);
        drawLineInGrid(component, rightBottom, rightTop , color);
    }
}

const drawPolygonInGrid = (component,poly,color) =>{
    if(poly.size()<3)
    return;
    //获取多边形最小包围盒
    let minx, maxx, miny, maxy;
    minx = poly.minPointX();
    maxx = poly.maxPointX();
    miny = poly.minPointY();
    maxy = poly.maxPointY();

    //设置一个标志矩阵
    let m = maxy - miny;
    let n = maxx - minx;
    let MF = [];
    let i,j;
    for(i=0; i<m; i++)
        for(j=0; j<n; j++)
            MF[i*n+j] = false;

    //对于多边形每一条边，从这条边向右直到包围盒右边界进行扫描
    let p0, p1, temp;
    let dx, tx;
    let x;
    let k;
    let vertics = poly.size();

    for(k=0; k<vertics; k++)
    {
        //获取一条边p0p1
        if(k == vertics-1)
        {
            p0 = poly[k];
            p1 = poly[0];
        }
        else
        {
            p0 = poly[k];
            p1 = poly[k+1];
        }

        if(p0.y>p1.y)//将p0设为边的起点坐标，y坐标较小
        {
            temp = p0;
            p0 = p1;
            p1 = temp;
        }

        //对于一条边，从左至右对标志位求反
        if(p0.y != p1.y)//非水平边
        {
            dx = (p1.x-p0.x)/(p1.y-p0.y);
            //对于一条边，y每次递增1,x每次递增dx
            x = p0.x;
            tx = x;
            for(i=p0.y; i<p1.y; i++)
            {
                x = Math.floor(tx);
                for(j=x; j<maxx; j++)
                    MF[(i-miny)*n+j-minx] = !MF[(i-miny)*n + j-minx];
                tx = tx+dx;
            }
        }
    }
    //对整个包围盒扫描，为true，用前景色绘制
    for(i=0; i<m; i++)
        for(j=0; j<n; j++)
            if(MF[i*n+j])
                drawPointInGrid(component, j+minx, i+miny , color);

}

const drawEllipseInGrid = (component,px,py,a,b,color)=>{
    const radiusA = a;
    const radiusB = b;
    const circleCenter = new Point(px,py);
    if(radiusA==0 || radiusB==0)
        return;
    let d;
    let x,y;
    x = 0; y = radiusB;
    d = 4*radiusB*radiusB - 4*radiusA*radiusA*radiusB + radiusA*radiusA;
    while((radiusA*radiusA*(2*y-1))>=2*(radiusB*radiusB*(x+1)))
    {
        drawPointInGrid(component,x + circleCenter.x,  y + circleCenter.y,color);
        drawPointInGrid(component,-x+ circleCenter.x,  y + circleCenter.y,color);
        drawPointInGrid(component,x + circleCenter.x,  -y+ circleCenter.y,color);
        drawPointInGrid(component,-x+ circleCenter.x,  -y+ circleCenter.y,color);

        if(d<0)
            d=d+4*radiusB*radiusB*(2*x+3);
        else{
            d=d+4*radiusB*radiusB*(2*x+3)-8*radiusA*radiusA*(y-1);
            y--;
        }
        x++;
    }
    x = radiusA; y = 0;
    d = 4*radiusA*radiusA - 4*radiusA*radiusB*radiusB + radiusB*radiusB;
    while((radiusB*radiusB*(2*x-1))>2*(radiusA*radiusA*(y-1)))
    {
        drawPointInGrid(component,x + circleCenter.x,  y + circleCenter.y,color);
        drawPointInGrid(component,-x+ circleCenter.x,  y + circleCenter.y,color);
        drawPointInGrid(component,x + circleCenter.x,  -y+ circleCenter.y,color);
        drawPointInGrid(component,-x+ circleCenter.x,  -y+ circleCenter.y,color);

        if(d<0)
            d=d+4*radiusA*radiusA*(2*y+3);
        else{
            d=d+4*radiusA*radiusA*(2*y+3)-8*radiusB*radiusB*(x-1);
            x--;
        }
        y++;
    }
}

export default {
    panelDrag,
    setDefaultUI,
    setDebugPanelCon,
    nodeLines,
    globalUiCallbacks,
    setScreenTransform,
    updateSlot,
    destroy,
    drawGrid,
    drawPointInGrid,
    drawLine,
    drawLineInGrid,
    drawRectInGrid,
    drawPolygonInGrid,
    drawEllipseInGrid
}