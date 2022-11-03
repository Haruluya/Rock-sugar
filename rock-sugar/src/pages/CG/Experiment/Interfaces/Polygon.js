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
}
export default Polygon;