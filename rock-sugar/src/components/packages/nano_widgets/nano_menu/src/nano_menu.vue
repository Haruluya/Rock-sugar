<template lang="html">
    <div class="compContainer" >
        <nav :class="{'nav':true, 'active':active}" ref="nav">
            <div class="container">
              <img :src="logo" id="logo"/>
              <div class="title">
                <router-link to="/">
                    <span>NanoCG</span>
                </router-link>
                <div class="dropdown" @click="dropdownBtclick">
                    <span>
                        <svg t="1667465895911" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2510" width="24" height="24"><path d="M828.996915 430.121165l0 111.544469L717.447882 541.665634l0 111.542422L605.898842 653.208056l0 111.544469L494.350827 764.752525 494.350827 653.208069 382.801787 653.208069 382.801787 541.665647 271.253771 541.665647 271.253771 430.121178 159.704732 430.121178 159.704732 207.033263l111.549039 0 0 111.543446 111.548016 0 0 111.544469 111.549039 0 0 111.544469 111.548016 0L605.898842 430.121178l111.549039 0L717.447882 318.576709l111.549039 0L828.996921 207.033263l111.549039 0 0 223.087914L828.996921 430.121178z" p-id="2511" fill="#ffffff"></path></svg>
                    </span>
                </div>
             </div>
              <ul>
                <li v-for="(item,index) in prop_menu_data " :key="index">
                    <router-link :to="item.link" :class="{'current': current === index}" @click="current = index"><span>{{item.name}}</span></router-link>
                </li>
             </ul>
             <div class="iconBt" @click="mobileMenuBtclick">
                <svg t="1667546877533" class="icon" viewBox="0 0 1113 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2515" width="32" height="32"><path d="M1080.416196 582.353412l-471.874476 208.616691c-45.178335 19.339264-63.160692 19.339264-104.86223 0L31.805014 582.353412C6.760067 569.287063 0 520.867722 0 494.430277c31.500266 17.704302 75.793275 37.423944 74.149415 36.420723l481.962302 218.519889 481.960077-218.519889c0.843062-0.186853 43.799184-21.488071 74.149415-36.420723C1112.218985 521.477218 1103.69049 571.689456 1080.416196 582.353412zM1080.416196 363.833523l-471.874476 208.62114c-45.178335 19.33259-63.160692 19.33259-104.86223 0L31.805014 363.833523c-37.06581-19.343713-35.909102-80.257722 0-103.011498L503.67949 15.789061c41.701539-20.4804 67.794196-21.614864 104.86223 0l471.874476 245.032965C1116.323074 280.165738 1115.164141 347.906548 1080.416196 363.833523zM556.111717 57.383826 74.149415 312.328887l481.962302 199.743408 481.960077-199.743408L556.111717 57.383826zM556.111717 57.383826M556.111717 967.89745l481.960077-218.526562c0.843062-0.186853 43.799184-21.488071 74.149415-36.418498 0 27.049166-8.53072 77.25918-31.805014 87.929809l-471.874476 208.607793c-45.178335 19.345937-63.160692 19.345937-104.86223 0l-471.874476-208.607793C6.760067 787.809176 0 739.394284 0 712.954614c31.500266 17.710975 75.793275 37.423944 74.149415 36.418498L556.111717 967.89745z" p-id="2516" fill="#1296db"></path></svg>
             </div> 

            </div>
        </nav>
        <div class="dropdownMenu" v-show="showDropdown">
            <div class="logo">
                <img :src="logo" />
                <span>NanoCore</span>
                <div class="dropdown" @click="dropdownBtclick">
                    <span>
                        <svg t="1667471930555" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2511" width="24" height="24"><path d="M828.996915 430.121165l0 111.544469L717.447882 541.665634l0 111.542422L605.898842 653.208056l0 111.544469L494.350827 764.752525 494.350827 653.208069 382.801787 653.208069 382.801787 541.665647 271.253771 541.665647 271.253771 430.121178 159.704732 430.121178 159.704732 207.033263l111.549039 0 0 111.543446 111.548016 0 0 111.544469 111.549039 0 0 111.544469 111.548016 0L605.898842 430.121178l111.549039 0L717.447882 318.576709l111.549039 0L828.996921 207.033263l111.549039 0 0 223.087914L828.996921 430.121178z" p-id="2512"></path></svg>
                    </span>
                </div>
            </div>
            <div class="menuTabs"> 
                <div class="menuTabItem"
                    v-for="(item, index) in prop_dropdown_nav_data" 
                    :key="index">
                    <div class="title">
                        <span>{{item.title}}</span>
                    </div>
                    <div class="menuItems">
                        <div class="item" 
                            v-for="(menuItem, menuIndex) in item.content" 
                            :key="menuIndex">
                            <router-link  @click="dropdownBtclick"
                                :to="menuItem.link"><span>{{menuItem.name}}</span></router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mobileMenu" v-show="showMobileMenu">
            <div class="logo">
                <img :src="logo" />
                <span>NanoCore</span>
                <div class="close" @click="mobileMenuBtclick">
                    <svg t="1667549487814" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2905" width="32" height="32"><path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m0-572.330667L300.629333 240.213333a42.538667 42.538667 0 0 0-60.16 0.213334 42.410667 42.410667 0 0 0-0.213333 60.16L451.669333 512 240.213333 723.370667a42.538667 42.538667 0 0 0 0.213334 60.16 42.410667 42.410667 0 0 0 60.16 0.213333L512 572.330667l211.370667 211.413333a42.538667 42.538667 0 0 0 60.16-0.213333 42.410667 42.410667 0 0 0 0.213333-60.16L572.330667 512l211.413333-211.370667a42.538667 42.538667 0 0 0-0.213333-60.16 42.410667 42.410667 0 0 0-60.16-0.213333L512 451.669333z" fill="#ffffff" p-id="2906"></path></svg>
                </div>
            </div>
            <div class="menuItems" >
                <div class="item" v-for="(item,index) in prop_menu_data" :key="index">
                    <router-link :to="item.link" @click="()=>{mobileMenuBtclick(); current = index}"><span>{{item.name}}</span></router-link>
                </div>
            </div>
            <div class="footer">
                <span>Copyright © 2022 Haruluya. All rights reserved.</span>
            </div>
            </div>
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
            current: 0,
            showDropdown:false,
            showMobileMenu:false
        }
    },

    props: {
        prop_dropdown_nav_data:{
            type:Array,
            default:[],
            required:true,
        },
        prop_menu_data:{
            type:Array,
            default:[],
            required:true,
        }
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
        },
        dropdownBtclick(){
            console.log('xxx')
            this.showDropdown = !this.showDropdown;
            if (this.showDropdown){
                document.body.style.overflow = 'hidden'
            }else{
                document.body.style.overflow = 'visible'
            }
        },
        mobileMenuBtclick(){
            this.showMobileMenu = !this.showMobileMenu;
        }
    },
}
</script>
<style lang="less" scoped>
@import "./nano_menu.less";
</style>