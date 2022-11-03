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
            // params of page.
            sectionParams:{
                beginPoint:{x:130,y:130},
                endPoint:{x:300, y:300},
                color:'#ffffff',
                debugContent:null
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
            this.$refs.page.Init();

            this.canvas = this.$refs.page.getCanvas();
            this.ctx = canvas.getContext('2d');

            this.Render();
        },
        Render() {
            this.$refs.page.Render();
           
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
            this.$refs.page.SetUI();
            this.sectionParams.debugContent = [{title:"Debug",content:"Nothing to debug."}];
            uiSetting.setDefaultUI(this);
        },

    },
    mounted() {
        this.Init();
        this.SetUI();
    },
};




</script>
