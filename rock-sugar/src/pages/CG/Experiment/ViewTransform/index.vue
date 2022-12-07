<template lang="html">
    <nano_cg_experiment_page :prop_des_data="desData" :prop_ui_setter="uiSetter" :prop_section_params="sectionParams"
        ref="page" />
</template>
<script>

import uiSetting from "../ui-setting"
import {Rect} from "../Interfaces"

const desData = {
    category: "Experiment",
    name: "ViewTransform",
    buttonContent: "查看源码",
    title: "视角变换",
    content: "ViewTransform."
}

/*
    @author:haruluya
    @des: Ex13 ViewTransform.
*/

export default {
    name: "ViewTransform",
    data() {
        return {
            canvas: null,
            ctx: null,
            // component data.
            desData,
            // params of page.
            sectionParams: {
                rects:[new Rect(10,50,10,50),new Rect(60,85,50,70),new Rect(8,70,45,90)],
                winRectColor:"#ffffff",
                viewRectColor:"#000000",
                rectsClipColor:"#0bc6e3",
                rectsColor:"#ff0000",
                winRectOffset:{x:0,y:0},
                viewRectOffset:{x:0,y:0},
                showOriginRects:true,
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
                { type: "color",id: "winRectColor",default: sectionParams.winRectColor, callback: uiSetting.globalUiCallbacks.updateValue(this, "winRectColor")},
                { type: "color",id: "viewRectColor",default: sectionParams.viewRectColor, callback: uiSetting.globalUiCallbacks.updateValue(this, "viewRectColor")},
                { type: "color",id: "rectsClipColor",default: sectionParams.rectsClipColor, callback: uiSetting.globalUiCallbacks.updateValue(this, "rectsClipColor")},
                { type: "color",id: "rectsColor",default: sectionParams.rectsColor, callback: uiSetting.globalUiCallbacks.updateValue(this, "rectsColor")},
                {
                    type: "slider", id: "girdSize", value: sectionParams.girdSize, min: 1, max: 100,
                    callback: uiSetting.globalUiCallbacks.updateValue(this, "girdSize")
                },
                { type: "slider-vector", id: "winRectOffset" , value: sectionParams.winRectOffset, min: { x: -100, y: -100 }, max: { x: 500, y: 500 }, callback: uiSetting.globalUiCallbacks.updatePoint(this, "winRectOffset") },
                { type: "slider-vector", id: "viewRectOffset" , value: sectionParams.viewRectOffset, min: { x: -100, y: -100 }, max: { x: 500, y: 500 }, callback: uiSetting.globalUiCallbacks.updatePoint(this, "viewRectOffset") },
            ];

            return setter;
        },
        winRect(){
            const {x,y} = this.sectionParams.winRectOffset;
            return new Rect(5 + x,100+x,5+y,100+y);
        },
        viewRect(){
            const {x,y} = this.sectionParams.viewRectOffset;
            return new Rect(20+x,80+x,20+y,80+y); 
        }

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
            //ViewTransform.

            if(this.sectionParams.showOriginRects){
                this.sectionParams.rects.forEach(rect=>{
                    uiSetting.drawRectInGrid(this,rect,this.sectionParams.rectsColor);
                })
            }
            
            this.Clip().forEach(rect=>{
                uiSetting.drawRectInGrid(this,rect,this.sectionParams.rectsClipColor);
            })

            uiSetting.drawRectInGrid(this,this.winRect,this.sectionParams.winRectColor);
            uiSetting.drawRectInGrid(this,this.viewRect,this.sectionParams.viewRectColor);

        },
        Clip(){
            const clipRects = [];
            this.sectionParams.rects.forEach(rect=>{
                const winClipRect = rect.Intersected(this.winRect);
                const viewClipRect = rect.Intersected(this.viewRect);
                if(!winClipRect || !viewClipRect){
                    return clipRects;
                }
                clipRects.push(winClipRect.Intersected(viewClipRect));
            })
            return clipRects;
        },
        SetUI() {
            this.$refs.page.SetUI();
        },
    }
}

</script>