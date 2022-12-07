import Point from "./Point";

export default class InPoint{
    constructor(point){
        this.point = new Point(point.x,point.y)
    }
    setPoint(point){
        this.point = new Point(point.x,point.y)
    }
    setJudge(jud){
        this.jud = jud; 
    }
    getPoint(){
        return this.point
    }
    getJudge(){
        return this.jud;
    }
    copy(){
        let cp = new InPoint(this.point);
        cp.jud = this.jud;
        return cp;
    }
}