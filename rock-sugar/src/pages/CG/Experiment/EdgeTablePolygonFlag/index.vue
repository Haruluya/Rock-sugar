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
    title: "多边形有序边表",
    content: "Edge table polygon."
}


/*
    @author:haruluya
    @des: Ex07 EdgeTablePolygon.
*/

export default {
    name: "EdgeTablePolygon",
    data() {
        return {
            canvas: null,
            ctx: null,
            // component data.
            desData,
            // params of page.
            sectionParams: {
                points: [{ x: 20, y: 20 }, { x: 20, y: 70 }, { x: 50, y: 50 }, { x: 110, y: 60 }, { x: 110, y: 30 }, { x: 50, y: 10 }],
                // points:[{x:125,y:125},{x:250,y:43},{x:0,y:43}],
                color:'#0bc6e3',
                debugContent: null,
                girdSize: 5,
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
                { type: "color",id: "color",default: sectionParams.color, callback: uiSetting.globalUiCallbacks.updateValue(this, "color")}
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

            //showPolygonInEdgeFlag.
            const points = new Polygon(this.sectionParams.points);
            if(points.size()<3)
                return;

            //获取多边形最小包围盒
            let minx, maxx, miny, maxy;
            minx = points.minPointX();
            maxx = points.maxPointX();
            miny = points.minPointY();
            maxy = points.maxPointY();

            //设置一个标志矩阵
            let m = maxy - miny;
            let n = maxx - minx;
            let MF = [];
            let i,j;
            for(i=0; i<m; i++)
                for(j=0; j<n; j++)
                    MF[i*n+j] = false;

            //对于多边形每一条边，从这条边向右直到包围盒右边界进行扫描
            let p0, p1, temp;
            let dx, tx;
            let x;
            let k;
            let vertics = points.size();

            for(k=0; k<vertics; k++)
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

                if(p0.y>p1.y)//将p0设为边的起点坐标，y坐标较小
                {
                    temp = p0;
                    p0 = p1;
                    p1 = temp;
                }

                //对于一条边，从左至右对标志位求反
                if(p0.y != p1.y)//非水平边
                {
                    dx = (p1.x-p0.x)/(p1.y-p0.y);
                    //对于一条边，y每次递增1,x每次递增dx
                    x = p0.x;
                    tx = x;
                    for(i=p0.y; i<p1.y; i++)
                    {
                        x = Math.floor(tx);
                        for(j=x; j<maxx; j++)
                            MF[(i-miny)*n+j-minx] = !MF[(i-miny)*n + j-minx];
                        tx = tx+dx;
                    }
                }
            }
            //对整个包围盒扫描，为true，用前景色绘制
            for(i=0; i<m; i++)
                for(j=0; j<n; j++)
                    if(MF[i*n+j])
                        uiSetting.drawPointInGrid(this, j+minx, i+miny , this.sectionParams.color);
         
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
