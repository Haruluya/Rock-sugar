<template lang="html">
    <nano_cg_experiment_page :prop_des_data="desData" :prop_ui_setter="uiSetter" :prop_section_params="sectionParams"
        ref="page" />
</template>
<script>

import uiSetting from "../ui-setting"
import { Edge, Polygon } from "../Interfaces"

const desData = {
    category: "Experiment",
    name: "EdgeTablePolygon",
    buttonContent: "查看源码",
    title: "种子填充",
    content: "Seed polygon."
}



/*
    @author:haruluya
    @des: Ex09 SeedPolygon.
*/

export default {
    name: "SeedPolygon",
    data() {
        return {
            canvas: null,
            ctx: null,
            // component data.
            desData,
            // params of page.
            sectionParams: {
                points: [{ x: 10, y: 100 }, { x: 100, y: 10 }, { x: 190, y: 100 }, { x: 100, y: 50 }],
                // points:[{x:125,y:125},{x:250,y:43},{x:0,y:43}],
                color:'#0bc6e3',
                debugContent: null,
                girdSize: 3,
                seed:{x:100,y:20}
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
                { type: "color",id: "color",default: sectionParams.color, callback: uiSetting.globalUiCallbacks.updateValue(this, "color")}
            ];
            for (let i= 0; i < this.sectionParams.points.length; i++){
                setter.push(
                 { type: "slider-vector", id: "point"+i , value: sectionParams.points[i], min: { x: 0, y: 0 }, max: { x: 500, y: 500 }, callback: uiSetting.globalUiCallbacks.updatePointArray(this, "points", i) },
                )
            }
            setter.push(
                { type: "slider-vector", id: "seed" , value: sectionParams.seed, min: { x: 0, y: 0 }, max: { x: 500, y: 500 }, callback: uiSetting.globalUiCallbacks.updatePoint(this, "seed") },
            )
            return setter;
        },

    },
    methods: {
        Init() {
            this.$refs.page.Init();

            this.canvas = this.$refs.page.getCanvas();
            this.ctx = canvas.getContext('2d');

            this.Render();
        },
        Render() {
            this.$refs.page.Render();

            const ctx = this.ctx;
            const gridx = parseInt(this.canvas.width / this.sectionParams.girdSize) - 1;
            const gridy = parseInt(this.canvas.height / this.sectionParams.girdSize) - 1;

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            uiSetting.drawGrid(this);

            this.sectionParams.debugContent = [{
                title: "grid", content: "The number of cells in the x direction: " + gridx + "\nThe number of cells in the y direction: " + gridy,
            }];
            const seed = this.sectionParams.seed;
            //showPolygonInEdgeFlag.
            const points = new Polygon(this.sectionParams.points);
            if(!points.isInPolygon(seed) || points.size()<3){
                console.log("points invalid!!!")
                return;
            }

            //获取多边形最小包围盒
            let minx, maxx, miny, maxy;
            minx = points.minPointX()-1;
            maxx = points.maxPointX()+1;
            miny = points.minPointY()-1;
            maxy = points.maxPointY()+1;

            if(seed.x<=minx || seed.x>=maxx || seed.y<=miny || seed.y>=maxy)
                return;
            //设置一个标志矩阵
            let m = maxy - miny;
            let n = maxx - minx;
            let MF = [];
            let i,j;
            for(i=0; i<m; i++)
                for(j=0; j<n; j++)
                    MF[i*n+j] = false;
            //绘制边界，并将边界像素标志置为true
            let p0, p1;
            let temp;
            let vertics = points.size();
            let x, y;
            let tx, ty, dx, dy;
            let k;
            let x0, x1, y0, y1;

            for(k=0; k<vertics; k++)//逐边绘制
            {
                //获取一条边p0p1
                if(k == vertics-1)
                {
                    p0 = points[k];
                    p1 = points[0];
                }
                else
                {
                    p0 = points[k];
                    p1 = points[k+1];
                }

                x0 = p0.x;
                y0 = p0.y;
                x1 = p1.x;
                y1 = p1.y;

                if(y0 == y1)//水平边
                {
                    y = y0;
                    if(x0>x1)
                    {
                        temp = x0;
                        x0 = x1;
                        x1 = temp;
                    }
                    for(x=x0; x<x1; x++)
                    {
                        uiSetting.drawPointInGrid(this, x, y , this.sectionParams.color);
                        MF[(y-miny)*n+x-minx] = true;
                    }
                }
                else if(x0 == x1)//垂直边
                {
                    x = x0;
                    if(y0>y1)
                    {
                        temp = y0;
                        y0 = y1;
                        y1 = temp;
                    }
                    for(y=y0; y<y1; y++)
                    {
                        uiSetting.drawPointInGrid(this, x, y , this.sectionParams.color);
                        MF[(y-miny)*n+x-minx] = true;
                    }

                }
                else//非水平和垂直边
                {
                    dy = (y1-y0)/(x1-x0);
                    dx = 1/dy;

                    if(dy>-1 && dy<1)
                    {
                        if(x0>x1)
                        {
                            temp = x0;
                            x0 = x1;
                            x1 = temp;
                            temp = y0;
                            y0 = y1;
                            y1 = temp;
                        }
                        ty = y0;
                        for(x=x0; x<=x1; x++)
                        {
                            y = Math.floor(ty+0.5);
                            uiSetting.drawPointInGrid(this, x, y , this.sectionParams.color);
                            MF[(y-miny)*n+x-minx] = true;
                            ty += dy;
                        }
                    }
                    else
                    {
                        if(y0>y1)
                        {
                            temp = x0;
                            x0 = x1;
                            x1 = temp;
                            temp = y0;
                            y0 = y1;
                            y1 = temp;
                        }
                        tx = x0;
                        for(y=y0; y<=y1; y++)
                        {
                            x = Math.floor(tx+0.5);
                            uiSetting.drawPointInGrid(this, x, y , this.sectionParams.color);
                            MF[(y-miny)*n+x-minx] = true;
                            tx += dx;
                        }
                    }
                }
            }

            //种子点压栈，压栈像素标志置为true
            let stack = [];
            stack.push(seed);
            MF[(seed.y-miny)*n + seed.x-minx] = true;
            //当栈不为空时，退栈，绘制像素点
            //对当前退栈元素的左上右下点进行检查，若标志为false，压栈，并将压栈像素标志置为true
            let ps;
            p0 = {x:0,y:0}
            while(stack.length)
            {
                let temp = stack.pop();
                ps = {x:temp.x,y:temp.y};
                uiSetting.drawPointInGrid(this, ps.x, ps.y , this.sectionParams.color);


                p0 = {x: ps.x - 1, y: ps.y}
                if(!MF[(p0.y-miny)*n + p0.x-minx])
                {
                    stack.push(p0);
                    MF[(p0.y-miny)*n + p0.x-minx] = true;
                }

                p0 = {x: ps.x + 1, y: ps.y}
                if(!MF[(p0.y-miny)*n + p0.x-minx])
                {
                    stack.push(p0);
                    MF[(p0.y-miny)*n + p0.x-minx] = true;
                }

                p0 = {x: ps.x, y: ps.y-1}
                if(!MF[(p0.y-miny)*n + p0.x-minx])
                {
                    stack.push(p0);
                    MF[(p0.y-miny)*n + p0.x-minx] = true;
                }

                p0 = {x: ps.x, y: ps.y+1}
                if(!MF[(p0.y-miny)*n + p0.x-minx])
                {   
                    stack.push(p0);
                    MF[(p0.y-miny)*n + p0.x-minx] = true;
                }

            }

       
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
