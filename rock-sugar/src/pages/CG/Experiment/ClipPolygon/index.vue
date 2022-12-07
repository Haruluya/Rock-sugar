<template lang="html">
    <nano_cg_experiment_page :prop_des_data="desData" :prop_ui_setter="uiSetter" :prop_section_params="sectionParams"
        ref="page" />
</template>
<script>

import uiSetting from "../ui-setting"
import { Point,Polygon,Rect} from "../Interfaces"
const desData = {
    category: "Experiment",
    name: "ClipPolygon",
    buttonContent: "查看源码",
    title: "多边形裁剪",
    content: "clip polygon."
}



/*
    @author:haruluya
    @des: Ex11 ClipPolygon.
*/

export default {
    name: "ClipPolygon",
    data() {
        return {
            canvas: null,
            ctx: null,
            // component data.
            desData,
            // params of page.
            sectionParams: {
                points: [{ x: 0, y: 100 }, { x: 100, y: 10 }, { x: 190, y: 100 }, { x: 100, y: 50 }],
                clipRect:new Rect(20,100,20,100),
                innerColor:'#0bc6e3',
                outerColor:'#ffffff',
                clipColor:'#000000',
                debugContent: null,
                girdSize: 3,
                screenTransform:{x:0,y:0,scale:100}
            }
        };
    },

    computed: {
        //uiSetter.
        uiSetter() {
            let sectionParams = this.sectionParams;
            let setter = [
                {
                    type: "slider", id: "girdSize", value: sectionParams.girdSize, min: 1, max: 100,
                    callback: uiSetting.globalUiCallbacks.updateValue(this, "girdSize")
                },
                { type: "color",id: "innerColor",default: sectionParams.innerColor, callback: uiSetting.globalUiCallbacks.updateValue(this, "innerColor")},
                { type: "color",id: "outerColor",default: sectionParams.outerColor, callback: uiSetting.globalUiCallbacks.updateValue(this, "outerColor")},
                { type: "color",id: "clipColor",default: sectionParams.clipColor, callback: uiSetting.globalUiCallbacks.updateValue(this, "clipColor")},
            ];
            for (let i= 0; i < this.sectionParams.points.length; i++){
                setter.push(
                 { type: "slider-vector", id: "point"+i , value: sectionParams.points[i], min: { x: 0, y: 0 }, max: { x: 500, y: 500 }, callback: uiSetting.globalUiCallbacks.updatePointArray(this, "points", i) },
                )
            }
            return setter;
        },

    },
    methods: {
        Init() {
            this.$refs.page.Init();

            this.canvas = this.$refs.page.getCanvas();
            this.ctx = canvas.getContext('2d');
            this.$refs.page.setViewer(this.sectionParams.screenTransform,this.sectionParams.girdSize,this.Render);

            this.Render();
        },
        Render() {
            this.$refs.page.Render();

            const ctx = this.ctx;
            const gridx = parseInt(this.canvas.width / this.sectionParams.girdSize) - 1;
            const gridy = parseInt(this.canvas.height / this.sectionParams.girdSize) - 1;

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            uiSetting.drawGrid(this);
            this.sectionParams.girdSize = this.$refs.page.girdSize;

            this.sectionParams.debugContent = [{
                title: "grid", content: "The number of cells in the x direction: " + gridx + "\nThe number of cells in the y direction: " + gridy,
            }];
          

            // clip polygon.
            //draw clip frame.
            const clipRect = this.sectionParams.clipRect;
            uiSetting.drawRectInGrid(this,clipRect,this.sectionParams.clipColor);
            uiSetting.drawPolygonInGrid(this,new Polygon(this.sectionParams.points),this.sectionParams.outerColor);
            const innerPoly = this.polyClip(new Polygon(this.sectionParams.points),this.sectionParams.clipRect);
            if (innerPoly.size() < 3){
                return;
            }
            uiSetting.drawPolygonInGrid(this,innerPoly,this.sectionParams.innerColor); 
       
        },
        polyClip(poly1,rect1){
            let x0, y0, x1, y1;
            let py0, py1, py2, py3;
            //裁剪左边
            x0 = rect1.X();
            y0 = rect1.Y()+rect1.Height();
            x1 = rect1.X();
            y1 = rect1.Y();
            py0 = this.edgeClip(poly1, new Point(x0,y0), new Point(x1,y1));

            //裁剪下边
            x0 = rect1.X()+rect1.Width();
            y0 = rect1.Y()+rect1.Height();
            x1 = rect1.X();
            y1 = rect1.Y()+rect1.Height();
            py1 = this.edgeClip(py0, new Point(x0,y0), new Point(x1,y1));
            //裁剪右边
            x0 = rect1.X()+rect1.Width();
            y0 = rect1.Y();
            x1 = rect1.X()+rect1.Width();
            y1 = rect1.Y()+rect1.Height();
            py2 = this.edgeClip(py1, new Point(x0,y0), new Point(x1,y1));
            //裁剪上边
            x0 = rect1.X();
            y0 = rect1.Y();
            x1 = rect1.X()+rect1.Width();
            y1 = rect1.Y();
            py3 = this.edgeClip(py2, new Point(x0,y0), new Point(x1,y1));
            return py3;
        },
        edgeClip(poly1,p0,p1){
            let v = [];
            let i;
            let m = poly1.size();
            let s, p;
            let pt;
            s = poly1.indexValue(m-1);
            for(i=0; i<m; i++)
            {
                p = poly1.indexValue(i);
                if(this.isInsideEdge(p,p0,p1))//点p在边(p0,p1)的内侧
                {
                    if(this.isInsideEdge(s,p0,p1))//情况1
                        v.push(p);
                    else//情况4
                    {
                        pt = this.intersect(s,p,p0,p1);
                        v.push(pt);
                        v.push(p);
                    }
                }
                else if(this.isInsideEdge(s,p0,p1)){//情况2
                        pt = this.intersect(s,p,p0,p1);
                        v.push(pt);
                }//情况3没有输出
                s=p;
            }
            return new Polygon(v);
        },
        isInsideEdge(p,p0,p1){
            if(p0.x>p1.x)//裁剪边为窗口的下边
            {
                if(p.y<=p0.y)
                    return true;
            }
            else if(p0.x<p1.x)//裁剪边为窗口的上边
            {
                if(p.y>=p0.y)
                    return true;
            }
            else if(p0.y<p1.y)//裁减边为窗口的右边
            {
                if(p.x<=p0.x)
                    return true;
            }
            else if(p0.y>p1.y)//裁减边为窗口的左边
            {
                if(p.x>=p0.x)
                    return true;
            }
            return false;
        },
        intersect(s,p,p0,p1){
            let m;
            let x,y;
            if(p0.y==p1.y)//水平裁剪边
            {
                m=(p.x-s.x)/(p.y-s.y);
                x=s.x+Math.floor((p0.y-s.y)*m);
                y=p0.y;
            }
            else//竖直裁剪边
            {
                m=(p.y-s.y)/(p.x-s.x);
                x = p0.x;
                y=s.y+Math.floor((p0.x-s.x)*m);
            }
            return new Point(x,y);
        },
        SetUI() {
            this.$refs.page.SetUI();
        },


    },
    mounted() {
        this.Init();
        this.SetUI();
    },

};

</script>
