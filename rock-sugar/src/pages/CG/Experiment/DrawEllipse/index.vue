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
    name:"DrawEllipse",
    buttonContent:"查看源码",
    title:"绘制椭圆",
    content:"Draw an ellipse."
}

/*
    @author:haruluya
    @des: Ex06 Draw an ellipse.
*/

export default {
    name: "DrawEllipse",
    data() {
        return {
            canvas:null,
            ctx:null,
            // component data.
            desData,

            // params of page.
            sectionParams:{
                circleCenter:{x:30,y:18},
                radiusA:20,
                radiusB:10,
                color:'#0bc6e3',
                girdSize:10,
                debugContent:null,
            }
        };
    },

    computed:{
        //uiSetter.
        uiSetter(){
            let sectionParams = this.sectionParams;
            return [
                {type:"slider", id:"circleCenterX", value: sectionParams.circleCenter.x, min:0, max:500, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"circleCenter",'x')
                },
                {type:"slider", id:"circleCenterY", value: sectionParams.circleCenter.y, min:0, max:500, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"circleCenter",'y')
                },
                {type:"slider", id:"radiusA", value: sectionParams.radiusA, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updateValue(this,"radiusA")
                },
                {type:"slider", id:"radiusB", value: sectionParams.radiusB, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updateValue(this,"radiusB")
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
            
            this.sectionParams.debugContent = [{
                title:"grid",content:"The number of cells in the x direction: " + gridx + "\nThe number of cells in the y direction: " + gridy,
            }];

            ctx.fillStyle = sectionParams.color;
            
            // invalide.
            const radiusA = this.sectionParams.radiusA;
            const radiusB = this.sectionParams.radiusB;
            const circleCenter = this.sectionParams.circleCenter;
            if(radiusA==0 || radiusB==0)
                return;
            let d;
            let x,y;
            x = 0; y = radiusB;
            d = 4*radiusB*radiusB - 4*radiusA*radiusA*radiusB + radiusA*radiusA;
            while((radiusA*radiusA*(2*y-1))>=2*(radiusB*radiusB*(x+1)))
            {
                uiSetting.drawPointInGrid(this,x + circleCenter.x,  y + circleCenter.y);
                uiSetting.drawPointInGrid(this,-x+ circleCenter.x,  y + circleCenter.y);
                uiSetting.drawPointInGrid(this,x + circleCenter.x,  -y+ circleCenter.y);
                uiSetting.drawPointInGrid(this,-x+ circleCenter.x,  -y+ circleCenter.y);

                if(d<0)
                    d=d+4*radiusB*radiusB*(2*x+3);
                else{
                    d=d+4*radiusB*radiusB*(2*x+3)-8*radiusA*radiusA*(y-1);
                    y--;
                }
                x++;
            }
            x = radiusA; y = 0;
            d = 4*radiusA*radiusA - 4*radiusA*radiusB*radiusB + radiusB*radiusB;
            while((radiusB*radiusB*(2*x-1))>2*(radiusA*radiusA*(y-1)))
            {
                uiSetting.drawPointInGrid(this,x + circleCenter.x,  y + circleCenter.y);
                uiSetting.drawPointInGrid(this,-x+ circleCenter.x,  y + circleCenter.y);
                uiSetting.drawPointInGrid(this,x + circleCenter.x,  -y+ circleCenter.y);
                uiSetting.drawPointInGrid(this,-x+ circleCenter.x,  -y+ circleCenter.y);

                if(d<0)
                    d=d+4*radiusA*radiusA*(2*y+3);
                else{
                    d=d+4*radiusA*radiusA*(2*y+3)-8*radiusB*radiusB*(x-1);
                    x--;
                }
                y++;
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
