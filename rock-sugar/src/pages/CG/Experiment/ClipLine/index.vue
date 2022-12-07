<template lang="html">
    <nano_cg_experiment_page :prop_des_data="desData" :prop_ui_setter="uiSetter" :prop_section_params="sectionParams"
        ref="page" />
</template>
<script>

import uiSetting from "../ui-setting"
import { Point,Rect} from "../Interfaces"

const desData = {
    category: "Experiment",
    name: "ClipLine",
    buttonContent: "查看源码",
    title: "直线裁剪",
    content: "clip line."
}



/*
    @author:haruluya
    @des: Ex10 ClipLine.
*/

export default {
    name: "ClipLine",
    data() {
        return {
            canvas: null,
            ctx: null,
            // component data.
            desData,
            // params of page.
            sectionParams: {
                beginPoint:new Point(10,10),
                endPoint:new Point(100,100),
                clipRect:new Rect(20,80,20,80),
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
                { type: "slider-vector", id: "beginPoint" , value: sectionParams.beginPoint, min: { x: 0, y: 0 }, max: { x: 500, y: 500 }, 
                callback: uiSetting.globalUiCallbacks.updatePoint(this, "beginPoint") },
                { type: "slider-vector", id: "endPoint" , value: sectionParams.endPoint, min: { x: 0, y: 0 }, max: { x: 500, y: 500 }, 
                callback: uiSetting.globalUiCallbacks.updatePoint(this, "endPoint") },
            ];

            return setter;
        },

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
          

            //clip line.
            //draw clip frame.
            const clipRect = this.sectionParams.clipRect;
            uiSetting.drawRectInGrid(this,clipRect,this.sectionParams.clipColor);

            uiSetting.drawLineInGrid(this, this.sectionParams.beginPoint, this.sectionParams.endPoint , this.sectionParams.outerColor);
            const {accept,p0,p1} = this.ClipLine(this.sectionParams.beginPoint,this.sectionParams.endPoint,clipRect);
            if (accept){
                uiSetting.drawLineInGrid(this, p0, p1 , this.sectionParams.innerColor);
            }  
       
        },
        ClipLine(p0,p1,rt){
            let accept, done;
            let c0, c1, code;
            let x0, y0, x1, y1, x, y;
            let m;
            accept = false;//线段可见标志
            done = false;//裁剪完成标志
            x0 = p0.x;
            y0 = p0.y;
            x1 = p1.x;
            y1 = p1.y;
            c0 = this.GetCSCode(x0, y0, rt);//返回线段起点的编码
            c1 = this.GetCSCode(x1, y1, rt);//返回线段终点的编码
            while (!done)
            {
                if (!c0 && !c1){//线段完全可见
                    p0 = new Point(x0,y0);
                    p1 = new Point(x1,y1);
                    accept = true;
                    done = true;
                }
                else if (c0&c1){//线段完全不可见
                    p0 = new Point(0,0);
                    p1 = new Point(0,0);
                    accept = false;
                    done = true;
                }
                else{//处理非完全可见又非显然不可见的情况
                    if (c0){//p0不可见
                        code = c0;
                    }
                    else{////p0可见，则p1一定不可见
                        code = c1;
                    }
                    if (code & 0x01){//线段与窗口的左边有交
                        x = rt.Left();
                        m = (y1 - y0) / (x1 - x0);
                        y = y0 + Math.floor((x - x0)*m);
                    }
                    else if (code & 0x08){//线段与窗口的下边有交
                        y = rt.Bottom();
                        m = (x1 - x0) / (y1 - y0);
                        x = x0 + Math.floor((y - y0)*m);
                    }
                    else if (code & 0x02){//线段与窗口的右边有交
                        x = rt.Right();
                        m = (y1 - y0) / (x1 - x0);
                        y = y0 + Math.floor((x - x0)*m);
                    }
                    else if (code & 0x04){//线段与窗口的上边有交
                        y = rt.Top();
                        m = (x1 - x0) / (y1 - y0);
                        x = x0 + Math.floor((y - y0)*m);
                    }
                    if (code == c0){
                        x0 = x;		y0 = y;
                        c0 = this.GetCSCode(x0, y0, rt);
                    }
                    else{
                        x1 = x;		y1 = y;
                        c1 = this.GetCSCode(x1, y1, rt);
                    }
                }
            }
            return {accept,p0,p1};
        },
        GetCSCode(x,y,rt){
            let code=0;
            if(x<rt.Left())//编码为***1,最后一位置1
                code=code|0x01;
            else//编码为***0，最后一位置0
                code=code&0xfe;
            if(x>rt.Right())//编码为**1*
                code=code|0x02;
            else//编码为**0*
                code=code&0xfd;
            if(y<rt.Top())//编码为*1**
                code=code|0x04;
            else//编码为*0**
                code=code&0xfb;
            if(y>rt.Bottom())//编码为1***
                code=code|0x08;
            else//编码为0***
                code=code&0xf7;
            return code;
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
