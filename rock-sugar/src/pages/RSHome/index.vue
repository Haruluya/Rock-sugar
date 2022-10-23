<template>
    <div class="PageContainer">
        <nano_menu></nano_menu>
        <div class="Slider">
            <nano_slider></nano_slider>
        </div>
    </div>
</template>
<script>
import nano_menu from '_packages/nano_menu/index.js'
import nano_slider from '@/packages/nano_slider/src/nano_slider.vue';

export default {
    name: "RSHome",
    components:{
        nano_menu,
        nano_slider
    }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>