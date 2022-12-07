/*
    @author:haruluya
    @des:The obstraction of point, just make code clear.
*/

class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    X(){
        return this.x;
    }
    Y(){
        return this.y;
    }
    setX(x){
        this.x = x;
    }
    setY(y){
        this.y = y;
    }
    sub(p){
        return new Point(this.x - p.X(), this.y - p.Y());
    }
    add(p){
        return new Point(this.x + p.X(), this.y + p.Y());
    }
    mutiply(p){
        return new Point(this.x * p.X(),this.y * p.Y());
    }
    mut(t){
        return new Point(this.x * t,this.y * t);
    }
}

export default Point;