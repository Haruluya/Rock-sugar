import Point from "./Point";

export default class Rect{
    left = 0;
    right = 0;
    top = 0;
    bottom = 0;
    constructor(left,right,top,bottom){
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }
    X(){
        return this.left;
    }
    Y(){
        return this.top;
    }
    Height(){
        return this.bottom - this.top;

    }
    Width(){
        return this.right - this.left;
    }
    Left(){
        return this.left;
    }
    Right(){
        return this.right;
    }
    Top(){
        return this.top;
    }
    Bottom(){
        return this.bottom;
    }
    RectPoints(){
        return {
            leftTop:new Point(this.left,this.top),
            rightTop:new Point(this.right,this.top),
            leftBottom:new Point(this.left,this.bottom),
            rightBottom:new Point(this.right,this.bottom),
        }
    }
    Intersected(rect){
        const left = rect.left - this.left > 0 ?rect.left :this.left;
        const right = rect.right - this.right > 0 ?this.right :rect.right;
        const top = rect.top - this.top > 0 ? rect.top :this.top;
        const bottom = rect.bottom - this.bottom > 0 ?this.bottom :rect.bottom;
        
        if(left > right || top > bottom){
            return null;
        }

        return new Rect(left,right,top,bottom);
    }
    Scale(scale){
        if(scale <= 0) return;
        this.left *= scale;this.right *= scale;this.top *= scale;this.bottom *= scale;
    }

}