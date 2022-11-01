<template>

  <div class="app">
    <div class="menu"><nano_menu></nano_menu></div>
    <div class="content">
        <nano_totop_button/>
        <router-view>
        </router-view>
    </div>
    <div class="footer">
        <nano_footer></nano_footer>
    </div>
  </div>
</template>

<script>
import { nano_footer, nano_totop_button } from './packages';



export default {
    name: "App",
    components: { nano_footer, nano_totop_button }
}
</script>

<style lang="less">



/*app */
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    .menu{

    }
    
    .content{
        margin-top: 6.4vw;
    }
    .footer{
        height: 20vw;
    }
}














@import "./styles/webglAnimationKey.less";
@import "./styles/global.less";
</style>
