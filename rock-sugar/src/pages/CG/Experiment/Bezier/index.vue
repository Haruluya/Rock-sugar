<template lang="html">
    <nano_cg_experiment_page :prop_des_data="desData" :prop_ui_setter="uiSetter" :prop_section_params="sectionParams"
        ref="page" />
</template>
<script>

import uiSetting from "../ui-setting"
import { Point} from "../Interfaces"

const desData = {
    category: "Experiment",
    name: "Bezier",
    buttonContent: "查看源码",
    title: "Bezier",
    content: "Bezier."
}

/*
    @author:haruluya
    @des: Ex20 Bezier.
*/
const INTERAL = 500;
export default {
    name: "Bezier",
    data() {
        return {
            canvas: null,
            ctx: null,
            // component data.
            desData,
            // params of page.
            sectionParams: {
                point : [new Point(100,550),new Point(230,200),new Point(590,120),new Point(700,500)], //控制点
                auxPoint : [], //辅助点
                tem : new Point(0,0), //移动控制点时用的临时点
                bezier : [], //贝塞尔曲线
                isMoving : false,
                // QTimer timer; //定时器
                order : 0, //移动的是第几个控制点
                t : (INTERAL) /2 , //插值公式的t*INTERAL
                debugContent: null,
                girdSize: 1,
                screenTransform:{x:0,y:0,scale:50}
            }
        };
    },
    computed: {
        //uiSetter.
        uiSetter() {
            let sectionParams = this.sectionParams;
            let setter = [
                {type:"slider", id:"t", value: sectionParams.t, min:0, max:INTERAL, 
                    callback:uiSetting.globalUiCallbacks.updateValue(this,"t")
                },
                {
                    type: "slider", id: "girdSize", value: sectionParams.girdSize, min: 1, max: 100,
                    callback: uiSetting.globalUiCallbacks.updateValue(this, "girdSize")
                },
            ];
            for (let i= 0; i < this.sectionParams.point.length; i++){
                setter.push(
                 { type: "slider-vector", id: "point"+i , value: sectionParams.point[i], min: { x: 0, y: 0 }, max: { x: 1000, y: 1000 }, callback: uiSetting.globalUiCallbacks.updatePointArray(this, "point", i) },
                )
            }

            return setter;
        },
    },
    mounted() {
        this.Init();
        this.SetUI();
    },
    methods: {
        Init() {
            this.$refs.page.Init();
            
            this.canvas = this.$refs.page.getCanvas();
            this.ctx = canvas.getContext('2d');
            this.$refs.page.setViewer(this.sectionParams.screenTransform,this.Render);

            this.Render();
        },
        Render() {
            this.$refs.page.Render();
           
            const ctx = this.ctx;
            const gridx = parseInt(this.canvas.width / this.sectionParams.girdSize) - 1;
            const gridy = parseInt(this.canvas.height / this.sectionParams.girdSize) - 1;

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.sectionParams.girdSize += this.$refs.page.girdSize;
            uiSetting.drawGrid(this);

            if(this.sectionParams.girdSize  <= 0) {
                    this.sectionParams.girdSize = 1
            }
            this.sectionParams.debugContent = [{
                title: "grid", content: "The number of cells in the x direction: " + gridx + "\nThe number of cells in the y direction: " + gridy,
            }];
            uiSetting.setScreenTransform(this.sectionParams.screenTransform);

            
            //Bezier.
            this.sectionParams.bezier = [];
            this.sectionParams.auxPoint = [];
            for(let i = 0; i < this.sectionParams.t; i++){
                this.nextPoint(i);
            }
            let bezier = this.sectionParams.bezier;
            let point = this.sectionParams.point;
            let auxPoint = this.sectionParams.auxPoint;
            let tem = this.sectionParams.tem;
            let order = this.sectionParams.order;

            uiSetting.drawLineInGrid(this,point[0],point[1],"blue");
            uiSetting.drawLineInGrid(this,point[1],point[2],"blue");
            uiSetting.drawLineInGrid(this,point[2],point[3],"blue");
            
            for(let i=0;i<bezier.length;++i){
                uiSetting.drawEllipseInGrid(this,bezier[i].x,bezier[i].y,1,1,"red");
            }

            uiSetting.drawLineInGrid(this,auxPoint[0],auxPoint[1],"green");
            uiSetting.drawLineInGrid(this,auxPoint[1],auxPoint[2],"green");
            uiSetting.drawLineInGrid(this,auxPoint[3],auxPoint[4],"yellow");
            for(let i=0;i<4;++i)
                uiSetting.drawEllipseInGrid(this,point[i].x-5,point[i].y-5,10,10,"black");
            for(let i=0;i<6;++i)
                uiSetting.drawEllipseInGrid(this,auxPoint[i].x-5,auxPoint[i].y-5,10,10);
            if(this.sectionParams.isMoving) {//如果点被移动，在被移动的点和鼠标当前位置画一条虚线
                uiSetting.drawEllipseInGrid(this,tem.x-5,tem.y-5,10,10);
                uiSetting.drawLineInGrid(this,tem,point[order]);
            }
        },
        SetUI() {
            this.$refs.page.SetUI();
        },
        nextPoint(t){
            let bezier = this.sectionParams.bezier;
            let auxPoint = this.sectionParams.auxPoint;
            let point = this.sectionParams.point;
            //用插值公式生成负责点坐标
            auxPoint[0]=new Point((point[0].x*t+point[1].x*(INTERAL-t))/INTERAL,(point[0].y*t+point[1].y*(INTERAL-t))/INTERAL);
            auxPoint[1]=new Point((point[1].x*t+point[2].x*(INTERAL-t))/INTERAL,(point[1].y*t+point[2].y*(INTERAL-t))/INTERAL);
            auxPoint[2]=new Point((point[2].x*t+point[3].x*(INTERAL-t))/INTERAL,(point[2].y*t+point[3].y*(INTERAL-t))/INTERAL);
            auxPoint[3]=new Point((auxPoint[0].x*t+auxPoint[1].x*(INTERAL-t))/INTERAL,(auxPoint[0].y*t+auxPoint[1].y*(INTERAL-t))/INTERAL);
            auxPoint[4]=new Point((auxPoint[1].x*t+auxPoint[2].x*(INTERAL-t))/INTERAL,(auxPoint[1].y*t+auxPoint[2].y*(INTERAL-t))/INTERAL);
            auxPoint[5]=new Point((auxPoint[3].x*t+auxPoint[4].x*(INTERAL-t))/INTERAL,(auxPoint[3].y*t+auxPoint[4].y*(INTERAL-t))/INTERAL);
            bezier.push(auxPoint[5])
        }
    }
}

</script>