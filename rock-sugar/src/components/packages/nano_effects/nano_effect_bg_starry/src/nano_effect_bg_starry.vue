<template>
    <div class="CompContainer">
        <canvas id="canvas" ref="canvas"></canvas>
    </div>
</template>
<script>
export default {
    name: "nano_effect_bg_starry",
    data() {
        return {
            Star:null,
            ctx:null,
            params:{
                beginHSL:this.prop_begin_hsl,
                endHSL:this.prop_end_hsl,
                stars:[],
                count:0,
                maxStars:this.prop_star_count,
            },
            resize:()=>{ 
            },
        }
    },
    mounted() {
        this.Init();
    },
    methods: {
        Init(){
            console.log(this.params)
            const ctx = this.$refs.canvas.getContext('2d'); 
            this.ctx = ctx;
            this.$refs.canvas.width = window.innerWidth + 300;
            this.$refs.canvas.height = window.innerHeight + 300;  
            const canvas2 = document.createElement('canvas'),
            ctx2 = canvas2.getContext('2d');
            canvas2.width = 100;
            canvas2.height = 100;
            let half = canvas2.width / 2,
            gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
            gradient2.addColorStop(0.025, '#fff');
            gradient2.addColorStop(0.1, 'hsl(' + this.params.beginHSL[0] +","+ this.params.beginHSL[1]+"%," + this.params.beginHSL[2]+'%)');
            gradient2.addColorStop(0.25, 'hsl(' + this.params.endHSL[0] + ","+ this.params.endHSL[1]+"%,"+ this.params.endHSL[2]+'%)');
            gradient2.addColorStop(1, 'transparent');
            ctx2.fillStyle = gradient2;
            ctx2.beginPath();
            ctx2.arc(half, half, half, 0, Math.PI * 2);
            ctx2.fill();
            const width = this.$refs.canvas.width;
            const height = this.$refs.canvas.height;
            const maxStars = this.params.maxStars;
            const stars = this.params.stars;
            const random = this.random;
            const maxOrbit = this.maxOrbit;
            let count = this.params.count;
            //Params setting.
            let Star = function(){
                this.orbitRadius = random(maxOrbit(width, height));
                this.radius = random(60, this.orbitRadius) / 12;
                this.orbitX = width / 2;
                this.orbitY = height / 2;
                this.timePassed = random(0, maxStars);
                this.speed = random(this.orbitRadius) / 900000;
                this.alpha = random(2, 10) / 10;
                count++;
                stars[count] = this;
            }
            Star.prototype.draw = function() {
                var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
                    y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
                    twinkle = random(10);
                if (twinkle === 1 && this.alpha > 0) {
                    this.alpha -= 0.05;
                } else if (twinkle === 2 && this.alpha < 1) {
                    this.alpha += 0.05;
                }
                ctx.globalAlpha = this.alpha;
                ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
                this.timePassed += this.speed;
            }
            for (var i = 0; i < maxStars; i++) {
                new Star();
            }
            this.Star = Star;
            this.Draw();
            window.addEventListener("resize",this.resize);
        },
        Draw(){
            const ctx = this.ctx;
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = 'hsla(' + this.params.hue + ', 60%, 6%, 0.1)';
            ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
            ctx.globalCompositeOperation = 'lighter';
            for (var i = 1, l = this.params.stars.length; i < l; i++) {
                this.params.stars[i].draw();
            };
            window.requestAnimationFrame(this.Draw);
        },
        random(min, max){
            if (arguments.length < 2) { max = min; min = 0;}
            if (min > max) {let temp = min; min = max; max = temp}
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        maxOrbit(x,y){
            return Math.round(Math.sqrt(2 * Math.pow(Math.max(x, y),2))) / 2;
        },
    },
    props:{
        prop_star_count:{
            type:Number,
            default:1000,
            required:false
        },
        prop_begin_hsl:{
            type:Array,
            default:[1,60,30],
            required:false
        },
        prop_end_hsl:{
            type:Array,
            default:[1,60,6],
            required:false
        }
    },
    beforeDestroy() {
        window.removeEventListener("resize",this.resize);
    },
}
</script>
<style lang="less" scoped>
@import "./nano_effect_bg_starry.less";
</style>