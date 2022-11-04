<template lang="html">
    <div class="compContainer" 
        :style="{backgroundImage: 'url('+SliderBG+')', backgroundSize: 'cover' }">
        <div class="sliderContainer">
            <div v-for="(img,index) in this.prop_img_data" 
                :key="index" 
                :class="{'slide':true,'active': activeIndex === index}"
            >
              <img :src="img"  />
            </div>
        </div>
        <div class="silderContainerBorder"></div>
      <div class="arrowContainer">
        <div class="arrow left-arrow" id="left"  @click="leftClick"
        >
        <img :src="arrow" class="fas fa-arrow-left"/>
      </div>

      <div class="arrow right-arrow" id="right"  @click="rightClick">
        <img :src="arrow" class="fas fa-arrow-right"/>
      </div>
      </div>
    </div>
</template>
<script>
import ImgResource from '@/utils/ImgResource';

export default {
    name:"nano_slider",
    data() {
      return {
        activeIndex:0,
        arrow: ImgResource.arrow,
        SliderBG:""
      }
    },
    props:{
      prop_img_data:{
        type:Array,
        default:[],
        required:true
      }
    },
    methods: {
      leftClick(){
        this.activeIndex--;
        if (this.activeIndex < 0) {
          this.activeIndex = 0
        }
      },
      rightClick(){
        this.activeIndex++;
        if (this.activeIndex > 3) {
          this.activeIndex = 0
        }
      }
    },
}
</script>
<style lang="less" scoped>
@import "./nano_slider.less";
</style>