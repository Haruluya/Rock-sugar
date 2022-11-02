<template>
    <div class="CompContainer-parent" draggable
        ref="panel"
        >

        <div class="panelTitle">
            <img :src="logo"/>
            Param
            <div id="nano-panel-slot-1">
            </div>
        </div>
        <div class="menu">
            <div :class="{'normal':true ,'item':true, 'active': uiContainer}">
                <div class="itemTitle" @click="showUI">
                    <svg t="1667261923908" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2961" width="16" height="16"><path d="M512 947.2c-12.8 0-19.2-6.4-25.6-12.8L6.4 233.6C0 224 0 211.2 6.4 201.6c6.4-9.6 16-16 28.8-16H992c19.2 0 32 12.8 32 32s-12.8 32-32 32H96L515.2 864l291.2-368c9.6-12.8 32-16 44.8-6.4s16 32 6.4 44.8l-320 403.2c-6.4 6.4-16 9.6-25.6 9.6z" fill="#ffffff" p-id="2962"></path></svg>
                    <span>Interface</span>
                </div>
                <div class="itemContent">
                    <div id="uiContainer" v-if="uiContainer" @mousedown="(e)=>{e.stopPropagation();}">
                        <div class="uiItem" v-if="prop_ui_setter" v-for="(item,index) in prop_ui_setter" :key="index">
                            <nano_param_slider       
                                :ref="item.id"
                                :prop_id="item.id"
                                :prop_value="item.value"
                                :prop_min="item.min"
                                :prop_max="item.max"
                                />
                        </div>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="itemTitle">
                    <svg t="1667261923908" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2961" width="16" height="16"><path d="M512 947.2c-12.8 0-19.2-6.4-25.6-12.8L6.4 233.6C0 224 0 211.2 6.4 201.6c6.4-9.6 16-16 28.8-16H992c19.2 0 32 12.8 32 32s-12.8 32-32 32H96L515.2 864l291.2-368c9.6-12.8 32-16 44.8-6.4s16 32 6.4 44.8l-320 403.2c-6.4 6.4-16 9.6-25.6 9.6z" fill="#ffffff" p-id="2962"></path></svg>
                    <span>Uicreate</span>
                </div>
            </div>
            <div :class="{'debug':true ,'item':true, 'active': debug}">
                <div class="itemTitle" @click="showDebug">
                    <svg t="1667261923908" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2961" width="16" height="16"><path d="M512 947.2c-12.8 0-19.2-6.4-25.6-12.8L6.4 233.6C0 224 0 211.2 6.4 201.6c6.4-9.6 16-16 28.8-16H992c19.2 0 32 12.8 32 32s-12.8 32-32 32H96L515.2 864l291.2-368c9.6-12.8 32-16 44.8-6.4s16 32 6.4 44.8l-320 403.2c-6.4 6.4-16 9.6-25.6 9.6z" fill="#ffffff" p-id="2962"></path></svg>
                    <span>Debug</span>
                </div>
                <div class="itemContent" v-if="debug">
                    <div class="createDebugBt">
                        <span>DebugPanel</span>
                    </div>
                    <div id="nano-panel-slot-3">
                    </div>
                </div>

            </div>
        </div>
        

    </div>
</template>
<script>
import nano_param_panel from '..';
import logo from '_assets/images/logo-glod.png'


export default {
    name: "nano_param_panel",
    data() {
        return {
            uiContainer:false,
            debug:false,
            logo
        };
    },
    props: {
        prop_ui_setter: {
            type: Array,
            default: [],
            required: false,
        },

    },
    mounted(){

    },

    methods: {
        showUI(){
            this.uiContainer = !this.uiContainer;

            // Must be nextTick...? They are in target but can`t read.
            this.$nextTick(()=>{
                this.prop_ui_setter.forEach(element => {
                if (element.type === "slider"){
                    haruluya_webgl_utils.setupSlider(
                        this.$refs[element.id][0], 
                        { value: element.value, slide: element.callback, max: element.max, min: element.min }
                    );
                }
                });
                this.$emit("updateSlot");

            })

        },
        showDebug(){
            this.debug = !this.debug;
            this.$nextTick(()=>{
                this.$emit("showDebug");
                this.$emit("updateSlot");
            })

        }
    },
    components: { nano_param_panel }
}
</script>
<style lang="less" scoped>
@import "./nano_param_panel.less";
</style>