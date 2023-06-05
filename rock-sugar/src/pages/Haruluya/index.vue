<template>
    <div class="haruluya">
        <div class="mainBorder">
            <div class="headTitle">
                <div class="pic">
                    <img :src="head"/>
                </div>
                <div class="info">
                    <div class="name">Haruluya</div>
                    <div class="des">一个热爱CG的学生</div>
                </div>
                <img class="sdu" :src="sdu"/>
                <div class="picBorder"></div>
            </div>
            <div class="content line">
                <div class="school line">
                    <div class="star">★</div>
                    山东大学-计算机科学与技术
                </div>
                <div class="concat line">
                    <div class="star">★</div>
                    邮箱:2198645565@qq.com
                </div>
                <div class="zhihu line">
                    <div class="star">★</div>
                    知乎:https://www.zhihu.com/people/saber-82-51
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import head from './head.jpg'
import sdu from './sdu.png'
export default {
    name: "Haruluya",
    data() {
        return {
            head,
            sdu
        }
    }

}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>