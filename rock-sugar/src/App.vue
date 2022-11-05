<template>
  <div class="app">
    <div class="app-menu">
        <nano_menu
            :prop_menu_data="mainMenu"
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
import mainMenu from "_router/mainMenu"


export default {
    name: "App",
    data() {
        return {
            navData,
            mainMenu
        }
    },
}
</script>

<style lang="less">

html{
    overflow-x: hidden !important; 
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
        margin-top: 10vh;

    }
    .app-footer{
        height: 40vh;
    }
}














@import "./styles/webglAnimationKey.less";
@import "./styles/global.less";
</style>
