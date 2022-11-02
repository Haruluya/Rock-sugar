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
import {Edge,Polygon} from "./classes"


const desData = {
    category:"Experiment",
    name:"EdgeTablePolygon",
    buttonContent:"查看源码",
    title:"多边形有序边表",
    content:"Begin cg by draw a line."
}



/*
    @author:haruluya
    @des: Ex02 daa.
*/

export default {
    name: "EdgeTablePolygon",
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
                points:[{x:120,y:120},{x:120,y:170},{x:150,y:150},{x:210,y:160},{x:210,y:130},{x:150,y:110}],
                color:"#e6c202",
            }
        };
    },

    computed:{
        //uiSetter.
        uiSetter(){
            let sectionParams = this.sectionParams;
            return [
            
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


            // EdgeTablePolygon.
            // check amount of point.
            const points = new Polygon(this.sectionParams.points);
            if(points.size()<3)
                return;

            let i, j,x0, x1, y, tx,temp;
            // amount of scanline.
            let scanLines, min, max;

            //edge table.
            let ET = {};
            //active edge table.
            let AET = [];
            //table of intersection point.
            let arr = [];
            //begin point.
            let p0;
            //end point.
            let p1;
            // ptr of node.
            let pNode;

            min = points.minPointY();
            max = points.maxPointY();
            scanLines = max - min;

            //Processing side by side, inserting the information of each edge into the ET.
            for(let i=0; i< points.size(); i++)
            {
                if(i < points.size()-1)
                {
                    p0 = points.indexValue(i);
                    p1 = points.indexValue(i+1);
                }
                else
                {
                    p0 = points.indexValue(i);
                    p1 = points.indexValue(0);
                }

                if(p0.y>p1.y)
                {
                    temp = p0;
                    p0 = p1;
                    p1 = temp;
                }

                if(p0.y != p1.y)
                {
                    pNode = new Edge(p0.x,(p1.x-p0.x)/(p1.y-p0.y),(p1.y-1));
                    if (!ET[p0.y - min]){
                        ET[p0.y - min] = [];
                    }

                    ET[p0.y - min].push(pNode);
                }

            }

            for (let i=0; i < scanLines; i++)
            {

                y = i + min;
                if(ET[i])
                {
                    ET[i].forEach(element => {
                        AET.push(element);
                    });
                    
                }
                ET[i] = null;

                //Dealing with active edge table AET.
                if(AET)
                {
                    for (let i = 0; i < AET.length;) {
                        if (AET[i].getYmax() < y) {
                            AET.splice(i, 1);

                        }else{
                            i++;
                        }
                    }
                }
                //Activate the edge table is not empty, find the intersection, sort, draw a line.
                if(AET)
                {

                    AET.forEach(element => {
                        arr.push(element.getX());
                        element.setX(element.getX() + element.getDx());
                    });

                    arr.sort();

                    for( j=0; j< arr.length; j++)
                    {
                        if(j%2 == 0)
                        {
                            tx = arr[j];
                            if(arr[j]-tx)
                                x0 = tx + 1;
                            else
                                x0 = tx;
                            x1 = arr[j + 1];
                        }
                        
                        uiSetting.drawLine(this.ctx,{x:x0,y:y},{x:x1,y:y},this.sectionParams.color);
                    }
                    arr = [];
                }
            }
            ET = [];
        },
        SetUI(){
            this.debugContent = [{title:"Debug",content:"Nothing to debug."}];
            uiSetting.setDefaultUI(this);
        },
        Destory() {
            uiSetting.destroy();
            uiSetting.drawGrid(this);
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