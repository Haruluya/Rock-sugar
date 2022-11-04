<template>
    <div class="CompContainer">
        <div class="webgl-input-color">
            <span class="webgl-Input-colorlabel">
                {{prop_id}}
            </span>
            <input type="color" :value="prop_default_color" ref="input"/>
        </div>
    </div>
</template>
<script>
export default {
    name:"nano_param_color",
    props:{
        prop_default_color:{
            type:String,
            default:"#ffffff",
            required:false
        },
        prop_id:{
            type:String,
            default:"None",
            required:true
        }
    }
}
</script>
<style lang="less" scoped>
@import "./nano_param_color.less";
</style>