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
    name:"DrawLine",
    buttonContent:"查看源码",
    title:"绘制直线",
    content:"Begin cg by draw a line."
}



/*
    @author:haruluya
    @des: Ex01 simple drawLine.
*/

export default {
    name: "DrawLine",
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
                beginPoint:{x:130,y:130},
                endPoint:{x:300, y:300},
                color:'#ffffff'
            }
        };
    },

    computed:{
        //uiSetter.
        uiSetter(){
            let sectionParams = this.sectionParams;
            return [
                {type:"slider", id:"beginX", value: sectionParams.beginPoint.x, min:0, max:400, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"beginPoint",'x')
                },
                {type:"slider", id:"beginY", value: sectionParams.beginPoint.y, min:0, max:400, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"beginPoint",'y')
                },
                {type:"slider", id:"endX", value: sectionParams.endPoint.x, min:0, max:400, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"endPoint",'x')
                },
                {type:"slider", id:"endY", value: sectionParams.endPoint.y, min:0, max:400, 
                    callback:uiSetting.globalUiCallbacks.updatePoint(this,"endPoint",'y')
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
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            ctx.beginPath();
            ctx.moveTo(sectionParams.beginPoint.x,sectionParams.beginPoint.y);
            ctx.lineTo(sectionParams.endPoint.x,sectionParams.endPoint.y);
            ctx.strokeStyle = sectionParams.color;
            ctx.stroke();
            ctx.closePath();
        },
        SetUI(){
            this.debugContent = [{title:"Debug",content:"Nothing to debug."}];
            uiSetting.setDefaultUI(this);
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