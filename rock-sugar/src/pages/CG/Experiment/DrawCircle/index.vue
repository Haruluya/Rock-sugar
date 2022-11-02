<template lang="html">
    <div class="pageContainer">
        <div class="webglContainer" id="canvasSlot">
            <nano_canvas ref="nanoCanvas"/>
        </div>
        <div class="desPanel">
            <nano_webgl_des_panel
            :prop_category="desData.category"
            :prop_name="desData.name"
            :prop_button_content="desData.buttonContent"
            :prop_title="desData.title"
            :prop_content="desData.content"
            @handleClick="pageCallback().handleClick"
            />
        </div>

        <div class="sidePanel" ref="sidePanel"
            >
            <div class="mainPanel"
                :style="{left:sidePanelPos.mainPanel.x + 'px',top:sidePanelPos.mainPanel.y + 'px'}"
                @mousedown="uiSetting.panelDrag(this,'mainPanel',$event)" >
                <nano_param_panel
                :prop_ui_setter="uiSetter"
                @showDebug="pageCallback().showDebugPanel"
                @updateSlot="uiSetting.updateSlot"
                />
            </div>
            <transition name="debugPanelTransition">
                <div class="debugPanel"
                    v-show="showDebug"
                    :style="{left:sidePanelPos.debugPanel.x + 'px',top:sidePanelPos.debugPanel.y + 'px'}"
                    @mousedown="uiSetting.panelDrag(this,'debugPanel',$event)">
                    <nano_param_output_panel
                        prop_title="Debug"
                        :prop_content="debugContent"
                    />
                </div>
            </transition>
        </div>
    </div>
</template>
<script>



import uiSetting from "../ui-setting"

const desData = {
    category:"Experiment",
    name:"DrawCircle",
    buttonContent:"查看源码",
    title:"绘制圆",
    content:"Begin cg by draw a line."
}



/*
    @author:haruluya
    @des: Ex02 daa.
*/

export default {
    name: "DrawCircle",
    data() {
        return {
            canvas:null,
            ctx:null,
            // component data.
            desData,
            uiSetting,
   
            //vue watching data.
            sidePanelPos:{
                mainPanel:{ x: 1050, y: 150 },
                debugPanel:{x:1200, y:400}
            },
            showDebug:false,
            debugContent:null,

            // params of page.
            sectionParams:{
                circleCenter:{x:30,y:18},
                radius:10,
                color:'#d4ba2f',
                girdSize:10,
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
                {type:"slider", id:"radius", value: sectionParams.radius, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updateValue(this,"radius")
                },
                {type:"slider", id:"girdSize", value: sectionParams.girdSize, min:1, max:100, 
                    callback:uiSetting.globalUiCallbacks.updateValue(this,"girdSize")
                },
            ]
        },
    },
    methods: {
        Init() {
            this.canvas = this.$refs.nanoCanvas.$refs.canvas;
            this.ctx = canvas.getContext('2d');
            this.Render();
        },
        Render() {
            haruluya_webgl_utils.resizeCanvasToDisplaySize(this.canvas);
            const ctx = this.ctx;
            const sectionParams = this.sectionParams;
            const gridx = parseInt(this.canvas.width / this.sectionParams.girdSize) - 1;
            const gridy = parseInt(this.canvas.height / this.sectionParams.girdSize) - 1;

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            uiSetting.drawGrid(this);
            
            this.debugContent = [{
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
                uiSetting.drawPointInGrid(this,p.x +circleCenter.x,p.y+circleCenter.y);
                uiSetting.drawPointInGrid(this,p.x +circleCenter.x, p.y+circleCenter.y);
                uiSetting.drawPointInGrid(this,p.y +circleCenter.x, p.x+circleCenter.y);
                uiSetting.drawPointInGrid(this,-p.y+circleCenter.x, p.x+circleCenter.y);
                uiSetting.drawPointInGrid(this,-p.x+circleCenter.x, p.y+circleCenter.y);
                uiSetting.drawPointInGrid(this,p.y +circleCenter.x,-p.x+circleCenter.y);
                uiSetting.drawPointInGrid(this,p.x +circleCenter.x,-p.y+circleCenter.y);
                uiSetting.drawPointInGrid(this,-p.x+circleCenter.x,-p.y+circleCenter.y);
                uiSetting.drawPointInGrid(this,-p.y+circleCenter.x,-p.x+circleCenter.y);

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
            uiSetting.setDefaultUI(this);
            uiSetting.drawGrid(this);
        },
        Destory() {
            console.log("WBBGL DESTORY!!!");
            uiSetting.destroy();
        },

        pageCallback(){
            return{
                handleClick:()=>{
                    window.location.href = 
                        "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/CG/Experiment/DrawLine/index.vue";
                },
                showDebugPanel:()=>{
                    this.showDebug = !this.showDebug;
                    if (this.showDebug){
                        this.$nextTick(()=>{
                            uiSetting.setDebugPanelCon(this);
                            uiSetting.nodeLines.debugPanelLine.show('draw')
                        })
                    }else{
                        uiSetting.nodeLines.debugPanelLine.hide('draw');
                        uiSetting.nodeLines.debugPanelLine.remove();
                        uiSetting.nodeLines.debugPanelLine = null;
                    }
                },
            }
        }
    },
    mounted() {
        this.Init();
        this.SetUI();
    },
    destroyed() {
        this.Destory();
    },
  
};




</script>
<style lang="less" scoped>
@import "../index.less";
</style>