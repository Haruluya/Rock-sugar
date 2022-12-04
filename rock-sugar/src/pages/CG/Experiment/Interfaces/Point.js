/*
    @author:haruluya
    @des:The obstraction of point, just make code clear.
*/

class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    x(){
        return this.x;
    }
    y(){
        return this.y;
    }
    setX(x){
        this.x = x;
    }
    setY(y){
        this.y = y;
    }
    sub(p){
        return new Point(this.x - p.x(), this.y - p.y());
    }
    add(p){
        return new Point(this.x + p.x(), this.y + p.y());
    }
}

export default Point;