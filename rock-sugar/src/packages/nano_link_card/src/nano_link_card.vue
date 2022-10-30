<template>
    <div class="compContainer" >
        <div class="cardContainer">
            <div class="cardImg"
                >
                <img :src="this.prop_img" />
            
            </div>
            <div class="cardText">
                <div id="cardDes">
                    <span>{{this.prop_des}}</span>
                </div>
                <div id="cardTitle">
                    <span>{{this.prop_title}}</span>
                </div>
                <div id="cardContent">
                    <span>{{this.prop_content}}</span>
                </div>
            </div>
            <div class="Logo">

            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "nano_link_card",
    

    props: {
        prop_des:{
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
        prop_img:{
            type:String,
            default:"None",
            required:true
        }
    },

};
</script>

<style lang="less" scoped>
@import "./nano_link_card.less";
</style>
