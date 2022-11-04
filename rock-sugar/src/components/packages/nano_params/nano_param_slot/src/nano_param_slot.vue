<template>
    <div class="CompContainer">
        <div :id="prop_id" class="slot"
            :style="{backgroundColor:prop_color}"
        ></div>
    </div>
</template>
<script>
export default {
    name:"nano_param_slot",
    props:{
        prop_id:{
            type:String,
            default:null,
            required:true
        },
        prop_color:{
            type:String,
            default:"#ffffff",
            required:true
        }
    }
}
</script>
<style lang="less" scoped>
@import "./nano_param_slot.less";
</style>