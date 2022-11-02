<template >
    <div class="CompContainer">
        <div class="panelTitle">
            <img :src="logo"/>
            <span>{{prop_title}}</span>
        </div>
        <div class="slot">
            <div id="nano-panel-slot-2">
            </div>
        </div>
        <div :class="{'contentContainer': true, 'active': showContent}" >
            <dvi class="title" @click="ShowContent" >
                <svg t="1667261923908" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2961" width="16" height="16"><path d="M512 947.2c-12.8 0-19.2-6.4-25.6-12.8L6.4 233.6C0 224 0 211.2 6.4 201.6c6.4-9.6 16-16 28.8-16H992c19.2 0 32 12.8 32 32s-12.8 32-32 32H96L515.2 864l291.2-368c9.6-12.8 32-16 44.8-6.4s16 32 6.4 44.8l-320 403.2c-6.4 6.4-16 9.6-25.6 9.6z" fill="#ffffff" p-id="2962"></path></svg>
                <span>{{prop_title}}</span>
            </dvi>
 
            <div class="content" v-if="showContent">
                <div class="contentItem" v-for="(item, index) in prop_content" :key="index">
                    <span class="itemTitle">{{item.title}}</span>
                    <span class="itemContent">{{item.content}}</span>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import logo from '_assets/images/Logo.png'



export default {
    name:"nano_param_output_panel",
    data() {
        return {
            logo,
            showContent:false,
        }
    },
    props:{
        prop_title:{
            type:String,
            default:"None",
            required:true,
        },
        prop_content:{
            type:Array,
            default:[],
            required:true,
        }
    },
    methods: {
        ShowContent(){
            this.showContent = !this.showContent;
        }
    },
}
</script>
<style lang="less" scoped>
@import "./nano_param_output_panel.less";
</style>