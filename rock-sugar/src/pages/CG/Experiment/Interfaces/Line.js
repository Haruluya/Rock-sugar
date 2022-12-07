import Point from "./Point";

export default class Line{
    constructor(p1,p2){
        this.p1 = new Point(p1.x,p1.y);
        this.p2 = new Point(p2.x,p2.y);;
    }
    P1(){
        return this.p1;
    }
    P2(){
        return this.p2;
    }
}