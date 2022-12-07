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
    name:"DAA",
    buttonContent:"查看源码",
    title:"DAA画线",
    content:"Digital Differential Analyzer."
}
/*
    @author:haruluya
    @des: Ex02 daa.
*/

export default {
    name: "DAA",
    data() {
        return {
            canvas: null,
            ctx: null,
            // component data.
            desData,
            // params of page.
            sectionParams: {
                beginPoint: { x: 1, y: 1 },
                endPoint: { x: 100, y: 20 },
                color: "#0bc6e3",
                girdSize: 10,
                debugContent:null,
                screenTransform:{x:0,y:0,scale:100},
            }
        };
    },
    computed: {
        //uiSetter.
        uiSetter() {
            let sectionParams = this.sectionParams;
            return [
                { type: "slider-vector", id: "beginPoint", value: sectionParams.beginPoint, min: { x: 0, y: 0 }, max: { x: 500, y: 500 }, callback: uiSetting.globalUiCallbacks.updatePoint(this, "beginPoint") },
                { type: "slider-vector", id: "endPoint", value: sectionParams.endPoint, min: { x: 0, y: 0 }, max: { x: 500, y: 500 }, callback: uiSetting.globalUiCallbacks.updatePoint(this, "endPoint") },
                { type: "slider", id: "girdSize", value: sectionParams.girdSize, min: 1, max: 100, callback: uiSetting.globalUiCallbacks.updateValue(this, "girdSize")},
                { type: "color",id: "color",default: sectionParams.color, callback: uiSetting.globalUiCallbacks.updateValue(this, "color")}
            ];
        },
    },
    methods: {
        Init() {
            this.$refs.page.Init();

            this.canvas = this.$refs.page.getCanvas();
            this.ctx = canvas.getContext("2d");
            this.$refs.page.setViewer(this.sectionParams.screenTransform,this.Render);

            this.Render();
        },
        Render() {
            this.$refs.page.Render();

            const ctx = this.ctx;
            const sectionParams = this.sectionParams;
            const gridx = parseInt(this.canvas.width / this.sectionParams.girdSize) - 1;
            const gridy = parseInt(this.canvas.height / this.sectionParams.girdSize) - 1;
            
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.sectionParams.girdSize += this.$refs.page.girdSize;

            uiSetting.drawGrid(this);
            if(this.sectionParams.girdSize  <= 0) {
                    this.sectionParams.girdSize = 1
            }
            this.sectionParams.debugContent = [{
                    title: "grid",
                    content: "The number of cells in the x direction: " + gridx + "\nThe number of cells in the y direction: " + gridy,
                }];
                
            ctx.fillStyle = sectionParams.color;


            let beginPoint = sectionParams.beginPoint;
            let endPoint = sectionParams.endPoint;
            //DAA.
            let temp = null;
            let m, tx, ty, x, y = 0;
            //Horizontal line.
            if (beginPoint.y === endPoint.y) {
                if (beginPoint.x > endPoint.x) {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                for (let gridx = beginPoint.x; gridx < endPoint.x; gridx++)
                    uiSetting.drawPointInGrid(this, gridx, beginPoint.y,sectionParams.color);
            }
            //Vertical line.
            else if (beginPoint.x === endPoint.x) {
                if (beginPoint.y > endPoint.y) {
                    temp = beginPoint;
                    beginPoint = endPoint;
                    endPoint = temp;
                }
                for (let gridy = beginPoint.y; gridy < endPoint.y; gridy++)
                    uiSetting.drawPointInGrid(this, beginPoint.x, gridy,sectionParams.color);
            }
            else {
                m = (endPoint.y - beginPoint.y) / (endPoint.x - beginPoint.x);
                // -45 < K < 45.
                if (m > -1 && m < 1) {
                    if (beginPoint.x > endPoint.x) {
                        temp = beginPoint;
                        beginPoint = endPoint;
                        endPoint = temp;
                    }
                    ty = beginPoint.y;
                    for (x = beginPoint.x; x < endPoint.x; x++) {
                        y = parseInt(ty + 0.5);
                        uiSetting.drawPointInGrid(this, x, y,sectionParams.color);
                        ty += m;
                    }
                }
                // k > 45.
                else {
                    if (beginPoint.y > endPoint.y) {
                        temp = beginPoint;
                        beginPoint = endPoint;
                        endPoint = temp;
                    }
                    tx = beginPoint.x;
                    for (y = beginPoint.y; y < endPoint.y; y++) {
                        x = parseInt(tx + 0.5);
                        uiSetting.drawPointInGrid(this, x, y,sectionParams.color);
                        tx += 1 / m;
                    }
                }
            }
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
