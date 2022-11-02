<template>
    <div class="CompContainer" >
        <div class="webgl-slider-outer">

            <div class="inputContainer">
                <input class="webgl-slider-slider" 
                type="range" :min="prop_min" :max="prop_max" 
                :value="prop_value" 
                ref="sliderSlider" 
                :style="{  background:'linear-gradient(to right, #ffd900d3 0%, #ffd900d3 '+ currentPer+'%,#eee '+ currentPer +'%, #eee)' }"
                />
                <div class="webgl-slider-absolute">
                    <div class="webgl-slider-value" 
                    ref="sliderValue"
                    :style="{left:this.currentPer-12+'%'}"
                    >
                        {{prop_value}}
                    </div>
                </div>
                
            </div>
            <div class="webgl-slider-label">{{prop_id}}</div>
            


        </div>
    </div>  
</template>
<script>
export default {
    name:"nano_param_slider",
    props:{
        prop_id:{
            type:String,
            default:"none",
            required:true,
        },
        prop_value:{
            type:Number,
            default:0,
            required:true,
        },
        prop_min:{
            type:Number,
            default:0,
            required:true,
        },
        prop_max:{
            type:Number,
            default:0,
            required:true,
        },
        prop_color:{
            type:String,
            default:"#3a86e1",
            required:false,
        }
    },
    computed:{
        currentPer(){
            return (this.prop_value - this.prop_min) / (this.prop_max - this.prop_min) * 100; 
        }
    },
    mounted(){
    },

}
</script>
<style lang="less" scoped>
@import "./nano_param_slider.less";
</style>