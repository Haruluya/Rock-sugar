<template>
    <div class="CompContainer">
        <nano_param_slider  
            v-if="prop_ui_data.type === 'slider'"     
            :prop_id="prop_ui_data.id"
            :prop_value="prop_ui_data.value"
            :prop_min="prop_ui_data.min"
            :prop_max="prop_ui_data.max"
            ref="widget"
        />
        <nano_param_color
            v-if="prop_ui_data.type === 'color'"  
            :prop_id="prop_ui_data.id"
            :prop_default_color="prop_ui_data.default" 
            ref="widget"
        />
        <nano_param_slider_vectorn
            :prop_data="sliderVectorData"
            :prop_label="prop_ui_data.id"
            v-if="prop_ui_data.type === 'slider-vector'"  
            ref="widget"
        />
    </div>
</template>
<script>
import nano_param_color from '../../nano_param_color';
import nano_param_slider_vectorn from '../../nano_param_slider_vectorn';

export default {
    name: "nano_param_widget",
    props: {
        prop_ui_data: {
            type: Object,
            default: {
                type: "None"
            },
            required: true
        }
    },
    computed:{
        sliderVectorData(){
            let dataList = [];
            const prop_ui_data = this.prop_ui_data;
            for (const [key, value] of Object.entries(prop_ui_data.value)) {  
                dataList.push({
                    name:key,value,min:prop_ui_data.min[key],max:prop_ui_data.max[key]
                });
            }
            return dataList;
        }
    },
    mounted() {
        // Must be nextTick...? They are in target but can`t read.
        this.$nextTick(()=>{
            const widget = this.prop_ui_data;
            if (widget.type === "slider"){
                haruluya_webgl_utils.setupSlider(
                    this.$refs.widget, 
                    { value: widget.value, slide: widget.callback, max: widget.max, min: widget.min }
                );
            }else if (widget.type === "color"){
                haruluya_webgl_utils.setupColorInput(
                    this.$refs.widget,
                    {callback:widget.callback}
                )
            }else if (widget.type === "slider-vector"){
                haruluya_webgl_utils.setupSliderVector(
                    this.$refs.widget,
                    {callback:widget.callback}
                )
            }

        })
    },
    methods:{

    },
    components: { nano_param_color, nano_param_slider_vectorn }
}
</script>
<style lang="less" scoped>
@import "./nano_param_widget.less";
</style>