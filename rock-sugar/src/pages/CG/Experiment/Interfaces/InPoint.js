export default class InPoint{
    constructor(point){
        this.point = point
    }
    setPoint(point){
        this.point = point;
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
}