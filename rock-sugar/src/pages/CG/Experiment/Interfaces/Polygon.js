/*
    @author:haruluya
    @des:The obstraction of polygon
    @params:{
        points:the points of polygon.
    }
*/
class Polygon{
    constructor(points){
        this.points = points
        this.points.forEach((e,i)=>{
            this[i] = e;
        })
    }
    maxPointX(){
        let max = 0;
        this.points.forEach(element => {
            max = max > element.x ? max : element.x;
        });
        return max;
    }
    minPointX(){
        let min = this.maxPointX();
        this.points.forEach(element =>{
            min = min < element.x ? min : element.x;
        })
        return min;
    }
    maxPointY(){
        let max = 0;
        this.points.forEach(element => {
            max = max > element.y ? max : element.y;
        });
        return max;
    }
    minPointY(){
        let min = this.maxPointX();
        this.points.forEach(element =>{
            min = min < element.y ? min : element.y;
        })
        return min;
    }
    size(){
        return this.points.length;
    }
    indexValue(index){
        return this.points[index];
    }
    isInPolygon(point){
        let i, j;
        let c = false;
        for (i=0, j=this.size()-1; i<this.size(); j=i++)
        {
            if(((this.points[i].y>point.y) != (this.points[j].y>point.y)) &&
                (point.x<(this.points[j].x-this.points[i].x) *
                (point.y-this.points[i].y) / (this.points[j].y-this.points[i].y) + this.points[i].x))
            c = !c;
        }
        return c;
    }
}
export default Polygon;