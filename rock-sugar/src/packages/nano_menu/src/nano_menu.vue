<template lang="html">
    <div class="compContainer" >
        <nav :class="{'nav':true, 'active':active}" ref="nav">
            <div class="container">
              <img :src="logo" id="logo"/>
              <h1 class="title">
                <a href="/"><span>NanoCG</span></a>
             </h1>
              <ul>
                <li><a href="#" :class="{'current': current === 0}"><span>Main</span></a></li>
                <li><a href="/webgl_demo/Triangle" :class="{'current': current === 1}"><span>Webgl</span></a></li>
                <li><a href="/nanocore" :class="{'current': current === 2}"><span>NanoCore</span></a></li>
                <li><a href="/games" :class="{'current': current === 3}"><span>Games</span></a></li>
                <li><a href="/haruluya" :class="{'current': current === 4}"><span>Haruluya</span></a></li>
              </ul>
              <div class="mobileMenu">
                <div class="iconBt">
                    <svg t="1666836316750" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6229" width="32" height="32"><path d="M263.023308 986.838212m6.452826-7.725709l419.607866-502.379682q6.452825-7.725709 14.178534-1.272884l33.99312 28.392431q7.725709 6.452825 1.272884 14.178534l-419.607866 502.379683q-6.452825 7.725709-14.178535 1.272884l-33.99312-28.392431q-7.725709-6.452825-1.272883-14.178535Z" fill="#ffffff" p-id="6230"></path><path d="M263.020527 37.166141m7.72571-6.452826l33.993119-28.392431q7.725709-6.452825 14.178535 1.272884l419.607866 502.379683q6.452825 7.725709-1.272884 14.178534l-33.993119 28.392431q-7.725709 6.452825-14.178535-1.272884l-419.607866-502.379682q-6.452825-7.725709 1.272884-14.178535Z" fill="#ffffff" p-id="6231"></path></svg>
                </div> 
                <div class="menuItems">
                    
                </div>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
import logo from '_assets/images/Logo.png'
export default {
    name: "nano_menu",
    data() {
        return {
            logo,
            active: false,
            current: 0
        }
    },

    props: {

    },
    mounted () {
	window.addEventListener('scroll', this.fixNavLoc)
    },
    destroyed () {
        window.removeEventListener('scroll', this.fixNavLoc)
    },
    methods: {
        fixNavLoc(){
            if(document.documentElement.scrollTop > 150) {
                this.active =true
            } else {
                this.active = false
            }
        }
    },
}
</script>
<style lang="less" scoped>
@import "./nano_menu.less";
</style>