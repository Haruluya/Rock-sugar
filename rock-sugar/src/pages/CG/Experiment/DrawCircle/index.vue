<template lang="html">
    <nano_cg_experiment_page
        :prop_des_data="desData"
        :prop_ui_setter="uiSetter"
        :prop_section_params="sectionParams"
        ref="page"
    />
</template>
<script>



import uiSetting from "../ui-setting"

const desData = {
    category:"Experiment",
    name:"DrawCircle",
    buttonContent:"查看源码",
    title:"绘制圆",
    content:"Draw a circle without pi."
}
/*
    @author:haruluya
    @des: Ex05 Draw a circle.
*/

export default {
    name: "DrawCircle",
    data() {
        return {
            canvas:null,
            ctx:null,
            // component data.
            desData,
            // params of page.
            sectionParams:{
                circleCenter:{x:30,y:18},
                radius:10,
                color:'#0bc6e3',
                girdSize:10,
                debugContent:null,
                screenTransform:{x:0,y:0,scale:100}
            }
        };
    },

    computed:{
        //uiSetter.
        uiSetter(){
            let sectionParams = this.sectionParams;
            return [
                { type: "slider-vector", id: "circleCenter", value: sectionParams.circleCenter, min: { x: 0, y: 0 }, max: { x: 500, y: 500 }, callback: uiSetting.globalUiCallbacks.updatePoint(this, "circleCenter") },
                {type:"slider", id:"radius", value: sectionParams.radius, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updateValue(this,"radius")
                },
                {type:"slider", id:"girdSize", value: sectionParams.girdSize, min:1, max:100, 
                    callback:uiSetting.globalUiCallbacks.updateValue(this,"girdSize")
                },
                { type: "color",id: "color",default: sectionParams.color, callback: uiSetting.globalUiCallbacks.updateValue(this, "color")}
            ]
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
            const sectionParams = this.sectionParams;
            const gridx = parseInt(this.canvas.width / this.sectionParams.girdSize) - 1;
            const gridy = parseInt(this.canvas.height / this.sectionParams.girdSize) - 1;

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            uiSetting.drawGrid(this);
            this.sectionParams.girdSize = this.$refs.page.girdSize;

            this.sectionParams.debugContent = [{
                title:"grid",content:"The number of cells in the x direction: " + gridx + "\nThe number of cells in the y direction: " + gridy,
            }];

            ctx.fillStyle = sectionParams.color;

            const r = this.sectionParams.radius;

            // radius < 1;
            if(r<1)
                return;
            let x, y;
            let e=1-r;
            x=0;
            y=r;
            const circleCenter = this.sectionParams.circleCenter
            while(x<y)
            {

                //draw point.
                const p = {x,y}; 
                uiSetting.drawPointInGrid(this,p.x +circleCenter.x,p.y+circleCenter.y,sectionParams.color);
                uiSetting.drawPointInGrid(this,p.x +circleCenter.x, p.y+circleCenter.y,sectionParams.color);
                uiSetting.drawPointInGrid(this,p.y +circleCenter.x, p.x+circleCenter.y,sectionParams.color);
                uiSetting.drawPointInGrid(this,-p.y+circleCenter.x, p.x+circleCenter.y,sectionParams.color);
                uiSetting.drawPointInGrid(this,-p.x+circleCenter.x, p.y+circleCenter.y,sectionParams.color);
                uiSetting.drawPointInGrid(this,p.y +circleCenter.x,-p.x+circleCenter.y,sectionParams.color);
                uiSetting.drawPointInGrid(this,p.x +circleCenter.x,-p.y+circleCenter.y,sectionParams.color);
                uiSetting.drawPointInGrid(this,-p.x+circleCenter.x,-p.y+circleCenter.y,sectionParams.color);
                uiSetting.drawPointInGrid(this,-p.y+circleCenter.x,-p.x+circleCenter.y,sectionParams.color);

                if(e<=0)
                    e=e+2*x+3;
                else
                {
                    e=e+2*x-2*y+5;
                    y--;
                }
                x++;
            }
        },
        SetUI(){
            this.$refs.page.SetUI();
        },
    },
    mounted() {
        this.Init();
        this.SetUI();
    },
  
};
</script>
