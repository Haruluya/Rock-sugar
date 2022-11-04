<template>
    <div class="CompContainer" ref="container">
        <div class="label"> 
            <span>{{prop_label}}</span>
        </div>
        <div class="sliders">
            <div class="sliderItem" v-for="(item,index) in prop_data" :key="index" 
                @mousedown="grab(item,$event)"
                @dblclick="inputValue(index,$event)"
            >
                <div class="inputContainer"> 
                    <input ref="input" 
                        @blur="inputFinish(index)" 
                        :style="{caretColor: inputing === index? 'gold' : 'transparent', readonly: inputing !== index}"
                    />
                </div>
                <span class="value"
                    :style="{opacity: inputing === index ? 0 : 1}"
                    >{{item.name}}:{{value[item.name]}}
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import AnimEvent from "_plugins/anim-event/anim-event.min.js"
export default {
    name:"nano_param_slider_vectorn",
    data() {
        return {
            grabPosition:{
                x:0,y:0
            },
            value:{},
            sliderVectorChangeEvent:null,
            inputing:-1,
        }
    },
    computed:{
    },
    mounted() {
        this.prop_data.forEach(element=>{
            this.value[element.name] = element.value; 
        })
        //creat event.
        const sliderValue = this.value;
        this.sliderVectorChangeEvent = new CustomEvent("slider_vector_change",{
            detail:{sliderValue,}
        })
    },
    props:{
        prop_data:{
            type:Array,
            default:[
            ],
            required:true
        },
        prop_color:{
            type:String,
            default:"#20324d",
            required:true,
        },
        prop_label:{
            type:String,
            default:"None",
            required:true,
        }
    },
    methods: {
        grab(item,e){
            const grabPosition = this.grabPosition;
            grabPosition.x = e.clientX;
            grabPosition.y = e.clientY;
            document.onmousemove = AnimEvent.add((e) => {
                const evt = e || event;
                const offsetX = evt.clientX - grabPosition.x;
                if (this.value[item.name] + offsetX > item.max ||
                    this.value[item.name] + offsetX < item.min){
                        return;
                    }

                this.value[item.name] += 
                        offsetX * (item.max - item.min) / 100;
                this.value[item.name] = this.clamp(this.value[item.name],item.min, item.max);

                this.$refs.container.dispatchEvent(this.sliderVectorChangeEvent);

                grabPosition.x = evt.clientX;
                grabPosition.y = evt.clientY;
            });
            document.onmouseup = () => {
                
                document.onmousemove = null;
            };
        },
        inputValue(index){
            this.inputing = index;
            this.$refs.input[index].value = this.value[this.prop_data[index].name];
            this.$refs.input[index].focus();
        },
        inputFinish(index){
            // sometime mistake?
            if (!this.$refs.input[index].value){
                return;
            }
            this.inputing= -1;

 

            this.value[this.prop_data[index].name] = this.clamp(
                    parseInt(this.$refs.input[index].value), this.prop_data[index].min,this.prop_data[index].max
            );
            this.$refs.container.dispatchEvent(this.sliderVectorChangeEvent);
            this.$refs.input[index].value = null;
        },
        clamp(value,min,max){
            return  (value < min ? min : value) > max ? max : (value < min ? min : value);
        }
    },
}
</script>
<style lang="less" scoped>
@import "./nano_param_slider_vectorn.less";
</style>