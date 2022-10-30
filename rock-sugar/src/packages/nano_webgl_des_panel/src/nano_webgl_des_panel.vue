<template>
    <div class="compContainer" >
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
            <div class="menu">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "nano_webgl_des_panel",
    

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
