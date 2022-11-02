<template>
    <div class="compContainer" @click="gotoTop(0)">
        <a href="#"  class="totop" v-show="show"></a>
    </div>
</template>
<script>
export default {
    name:"nano_totop_button",
    data() {
        return {
            show:false
        }
    },
    computed:{

    },
    mounted () {
	    window.addEventListener('scroll', this.showNav)
    },
    destroyed () {
        window.removeEventListener('scroll', this.showNav)
    },
    methods: {
        showNav(){
            if(document.documentElement.scrollTop > 350) {
                this.show =true
            } else {
                this.show = false
            }
        },
        gotoTop(position) {
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function (cb) {
                return setTimeout(cb, 17);
                };
            }
            // 当前滚动高度
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            // step
            var step = function () {
                var distance = position - scrollTop;
                scrollTop = scrollTop + distance / 5;
                if (Math.abs(distance) < 1) {
                window.scrollTo(0, position);
                } else {
                window.scrollTo(0, scrollTop);
                requestAnimationFrame(step);
                }
            };
            step();
        },
    }

}
</script>
<style lang="less" scoped>
@import './nano_totop_button.less';
</style>