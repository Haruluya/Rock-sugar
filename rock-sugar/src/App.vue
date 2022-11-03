<template>

  <div class="app">
    <div class="app-menu">
        <nano_menu
            :prop_dropdown_nav_data="navData"
        />
    </div>
    <div class="app-content">
        <nano_totop_button/>
        <router-view>
        </router-view>
    </div>
    <div class="app-footer">
        <nano_footer></nano_footer>
    </div>
  </div>
</template>

<script>
import navData from "_router/navData"



export default {
    name: "App",
    data() {
        return {
            navData,
        }
    },
}
</script>

<style lang="less">

html{
    overflow-x: hidden;
}

/*app */
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    .app-menu{

    }
    
    .app-content{
        margin-top: 6vw;

    }
    .app-footer{
        height: 20vw;
    }
}














@import "./styles/webglAnimationKey.less";
@import "./styles/global.less";
</style>
