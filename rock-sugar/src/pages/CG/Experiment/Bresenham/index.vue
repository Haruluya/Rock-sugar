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
    name:"Bresenham",
    buttonContent:"查看源码",
    title:"Bresenham画线",
    content:"Bresenham's line algorithm."
}



/*
    @author:haruluya
    @des: Ex02 daa.
*/

export default {
    name: "Bresenham",
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
                beginPoint:{x:1,y:1},
                endPoint:{x:100, y:20},
                color:'#ffffff',
                girdSize:10,
            }
        };
    },

    computed:{
        //uiSetter.
        uiSetter(){
            let sectionParams = this.sectionParams;
            return [
                {type:"slider", id:"beginX", value: sectionParams.beginPoint.x, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"beginPoint",'x')
                },
                {type:"slider", id:"beginY", value: sectionParams.beginPoint.y, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"beginPoint",'y')
                },
                {type:"slider", id:"endX", value: sectionParams.endPoint.x, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"endPoint",'x')
                },
                {type:"slider", id:"endY", value: sectionParams.endPoint.y, min:0, max:100, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"endPoint",'y')
                },
                {type:"slider", id:"girdSize",value:sectionParams.girdSize,min:1,max:100,
                    callback:uiSetting.globalUiCallbacks.updateValue(this,"girdSize")
                }
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

            let beginPoint = sectionParams.beginPoint;
            let endPoint = sectionParams.endPoint;

            let temp = null;
            let m, x, y = 0;
            let e = -0.5;

            //Horizontal line.
            if(beginPoint.y == endPoint.y)
            {
                if(beginPoint.x>endPoint.x)
                {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                for(x=beginPoint.x; x<endPoint.x; x++)
                    uiSetting.drawPointInGrid(this,x, beginPoint.y);
                return;
            }
            //Vertical line.
            if(beginPoint.x == endPoint.x)
            {
                if(beginPoint.y>endPoint.y)
                {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                for(y=beginPoint.y; y<endPoint.y; y++)
                    uiSetting.drawPointInGrid(this,beginPoint.x, y);
                return;
            }

            m = (endPoint.y-beginPoint.y)/(endPoint.x-beginPoint.x);
            if(m>0 && m<=1)
            {
                if(beginPoint.x>endPoint.x)
                {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                e=-0.5;
                x = beginPoint.x;
                y = beginPoint.y;
                while(x<endPoint.x)
                {
                    uiSetting.drawPointInGrid(this,x,y);
                    e=e+m;
                    if(e>0)
                    {
                        y++;
                        e=e-1;
                    }
                    x++;
                }
            }
            else if(m>=-1 && m<0)
            {
                if(beginPoint.x>endPoint.x)
                {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                e=0.5;
                x = beginPoint.x;
                y = beginPoint.y;
                while(x<endPoint.x)
                {
                    uiSetting.drawPointInGrid(this,x,y);
                    e=e+m;
                    if(e<0)
                    {
                        y--;
                        e=e+1;
                    }
                    x++;
                }
            }
            else if(m>1)
            {
                if(beginPoint.y>endPoint.y)
                {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                e=-0.5;
                x = beginPoint.x;
                y = beginPoint.y;
                while(y<endPoint.y)
                {
                    uiSetting.drawPointInGrid(this,x,y);
                    e=e+1/m;
                    if(e>0)
                    {
                        x=x+1;
                        e=e-1;
                    }
                    y++;
                }
            }
            else
            {
                if(beginPoint.y>endPoint.y)
                {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                e=0.5;
                x = beginPoint.x;
                y = beginPoint.y;
                while(y<endPoint.y)
                {
                    uiSetting.drawPointInGrid(this,x,y);
                    e=e+1/m;
                    if(e<0)
                    {
                        x--;
                        e=e+1;
                    }
                    y++;
                }
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
                        "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/CG/Experiment/Bresenham/index.vue";
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