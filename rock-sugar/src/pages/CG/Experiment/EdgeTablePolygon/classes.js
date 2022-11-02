
/*
    @author:haruluya
    @des:The obstraction of edge
    @params:{
        x:The starting x coordinate of the edge or the coordinate of the intersection of the edge and the scan line.
        dx:Reciprocal of the slope of an edge.
        ymax:The maximum y coordinate of the edge.
    }
*/
let Edge = function(x, dx,ymax){
    this.x = x;
    this.dx = dx;
    this.ymax = ymax;
}
Edge.prototype = {
    setX:function(x){
        this.x = x;
    },
    setDx:function(dx){
        this.dx = dx;
    },
    setYmax:function(ymax){
        this.ymax = ymax;
    },
    getX:function(){
        return this.x;
    },
    getDx:function(){
        return this.dx;
    },
    getYmax:function(){
        return this.ymax;
    }
}


/*
    @author:haruluya
    @des:The obstraction of polygon
    @params:{
        points:the points of polygon.
    }
*/
let Polygon = function(points){
    this.points = points
}

Polygon.prototype = {
    maxPointX:function(){
        let max = 0;
        this.points.forEach(element => {
            max = max > element.x ? max : element.x;
        });
        return max;
    },
    minPointX:function(){
        let min = this.maxPointX();
        this.points.forEach(element =>{
            min = min < element.x ? min : element.x;
        })
        return min;
    },
    maxPointY:function(){
        let max = 0;
        this.points.forEach(element => {
            max = max > element.y ? max : element.y;
        });
        return max;
    },
    minPointY:function(){
        let min = this.maxPointX();
        this.points.forEach(element =>{
            min = min < element.y ? min : element.y;
        })
        return min;
    },
    size:function(){
        return this.points.length;
    },
    indexValue:function(index){
        return this.points[index];
    }
}


export  {
    Edge,
    Polygon
};