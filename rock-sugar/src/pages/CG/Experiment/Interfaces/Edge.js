/*
    @author:haruluya
    @des:The obstraction of edge
    @params:{
        x:The starting x coordinate of the edge or the coordinate of the intersection of the edge and the scan line.
        dx:Reciprocal of the slope of an edge.
        ymax:The maximum y coordinate of the edge.
    }
*/
class Edge {
    constructor(x, dx, ymax) {
        this.x = x;
        this.dx = dx;
        this.ymax = ymax;
    }
    setX(x) {
        this.x = x;
    }
    setDx(dx) {
        this.dx = dx;
    }
    setYmax(ymax) {
        this.ymax = ymax;
    }
    getX() {
        return this.x;
    }
    getDx() {
        return this.dx;
    }
    getYmax() {
        return this.ymax;
    }
}
export default Edge;