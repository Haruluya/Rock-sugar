<template>
    <div class="CompContainer" >
        <div class="desContainer">
            <div class="des">
                <div class="title">
                    <span id="category">{{prop_category}}</span>
                    <span id="name">{{prop_name}}</span>
                </div>
                <div class="codeLink">
                    <nano_button @handleClick="handleClick" :prop_content="prop_button_content"></nano_button>
                </div>
            </div>
            <div class="conclusion">
                <span class="title"><span id="conTitle">{{prop_title}}</span></span>
                <span class="content">{{prop_content}}</span>
            </div>
            <div class="core">
                <img :src="coreImg"/>
                <div class="slot">
                    <nano_param_slot
                        :prop_id="prop_core_slot_id"
                        prop_color="gold"
                     />
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import coreImg from "_assets/images/logos/CoreWidget.png" 

export default {
    name: "nano_webgl_des_panel",
    data() {
        return {
            coreImg,
        }
    },

    props: {
        prop_category:{
            type:String,
            default:"None",
            required:true
        },
        prop_name:{
            type:String,
            default:"None",
            required:true
        },
        prop_button_content:{
            type:String,
            default:"None",
            required:true
        },
        prop_title:{
            type:String,
            default:"None",
            required:true
        },
        prop_content:{
            type:String,
            default:"None",
            required:true
        },
        prop_core_slot_id:{
            type:Number,
            default:-1,
            required:true
        }

    },
    methods: {
        handleClick(evt) {
            this.$emit("handleClick", evt);
        },
    },
};
</script>

<style lang="less" scoped>
@import "./nano_webgl_des_panel.less";
</style>
