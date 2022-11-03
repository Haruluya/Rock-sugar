<template>
    <div class="pageContainer">
        <div class="webglContainer" id="canvasSlot">
            <nano_canvas ref="nanoCanvas"/>
        </div>
        <div class="desPanel">
            <nano_webgl_des_panel
            :prop_category="prop_des_data.category"
            :prop_name="prop_des_data.name"
            :prop_button_content="prop_des_data.buttonContent"
            :prop_title="prop_des_data.title"
            :prop_content="prop_des_data.content"
            @handleClick="pageCallback().handleClick"
            />
        </div>

        <div class="sidePanel" ref="sidePanel"
            >
            <div class="mainPanel"
                :style="{left:sidePanelPos.mainPanel.x + 'px',top:sidePanelPos.mainPanel.y + 'px'}"
                @mousedown="uiSetting.panelDrag(this.sidePanelPos,'mainPanel',$event)" >
                <nano_param_panel
                :prop_ui_setter="prop_ui_setter"
                @showDebug="pageCallback().showDebugPanel"
                @updateSlot="uiSetting.updateSlot"
                />
            </div>
            <transition name="debugPanelTransition">
                <div class="debugPanel"
                    v-show="showDebug"
                    :style="{left:sidePanelPos.debugPanel.x + 'px',top:sidePanelPos.debugPanel.y + 'px'}"
                    @mousedown="uiSetting.panelDrag(this.sidePanelPos,'debugPanel',$event)">
                    <nano_param_output_panel
                        prop_title="Debug"
                        :prop_content="prop_section_params.debugContent"
                    />
                </div>
            </transition>
        </div>
    </div>
</template>
<script>

/*
    @author:haruluya.
    @des:This component is used to make the source code more concise.
*/
import uiSetting from "./ui-setting"
export default {

    name:"nano_cg_experiment_page",
    data() {
        return {
            uiSetting,
   
            //vue watching data.
            sidePanelPos:{
                mainPanel:{ x: 1050, y: 150 },
                debugPanel:{x:1200, y:400}
            },
            showDebug:false,
            debugContent:null,
            }
    },

    props:{
        prop_des_data:{
            type:Object,
            default:{
                category:"None",
                name:"None",
                buttonContent:"None",
                title:"None",
                content:"None"
            },
            required:true
        },
        prop_ui_setter:{
            type:Array,
            default:[],
            required:true
        },
        prop_section_params:{
            type:Object,
            default:{
            },
            required:true
        }
    },
    methods:{
        Init(){

        },
        Render(){
            haruluya_webgl_utils.resizeCanvasToDisplaySize(this.getCanvas());
        },
        Destory() {
            console.log("WBBGL DESTORY!!!");
            uiSetting.destroy();
        },
        SetUI(){
            uiSetting.setDefaultUI();
        },
        getCanvas(){
            return this.$refs.nanoCanvas.$refs.canvas;
        },
        pageCallback() {
            return {
                handleClick: () => {
                    window.location.href =
                        "https://github.com/Haruluya/Rock-sugar/blob/master/rock-sugar/src/pages/CG/Experiment/"+this.prop_des_data.name+"/index.vue";
                },
                showDebugPanel: () => {
                    this.showDebug = !this.showDebug;
                    if (this.showDebug) {
                        this.$nextTick(() => {
                            uiSetting.setDebugPanelCon(this);
                            uiSetting.nodeLines.debugPanelLine.show("draw");
                        });
                    }
                    else {
                        uiSetting.nodeLines.debugPanelLine.hide("draw");
                        uiSetting.nodeLines.debugPanelLine.remove();
                        uiSetting.nodeLines.debugPanelLine = null;
                    }
                },
            };
        }
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>