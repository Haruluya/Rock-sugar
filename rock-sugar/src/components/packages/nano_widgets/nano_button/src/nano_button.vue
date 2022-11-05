<template>
    <div class="compContainer" >
        <div :class="{'nanoButton':true,
                    'nanoButton_quad_border': prop_border === 'Quad', 
                    
                    } " 
            @click="handleClick"
            :style="{
                    padding:this.prop_size_height*2 + 'vh ' + this.prop_size_width*2 + 'vh'
                     
                }">
                <div 
                :class="{
                    'background':true,
                    'nanoButton_hover_effect': true  
                }"
                :style="{
                    backgroundColor:this.prop_color   
                }">
                </div>
                <span>{{this.prop_content}}</span>
        </div>
    </div>

</template>
<script>
export default {
    name: "nano_button",
    
    mounted() {

    },
    props: {
            
        prop_content:{
            type:String,
            default:"None",
            required:false
        },
        prop_type:{
            type:String,
            default:"Blue",
            required:false
        },
        prop_border:{
            type:String,
            default:"Quad",
            required:false
        },
        prop_size_width:{
            type:Number,
            default:2.5,
            required:false
        },
        prop_size_height:{
            type:Number,
            default:0.8,
            required:false
        },
        prop_color:{
            type:String,
            default:"#0bc6e3",
            required:false,
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
@import "./nano_button.less";
</style>
