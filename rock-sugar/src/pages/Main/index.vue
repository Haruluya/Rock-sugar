<template>
    <div class="pageContainer">
        <div class="slider">
            <nano_slider
                :prop_img_data="sliderImgs"
            >
            </nano_slider>
            <div id="githubButton">
                <nano_button 
                    prop_content="HARULUYA" 
                    prop_border="Quad" 
                    prop_type="Blue" 
                    prop_size_width=2
                    prop_size_height=1
                    prop_color="#ffda16"
                    >
                </nano_button>
            </div>
            <div class="background">
                <nano_effect_bg_starry
                    :prop_star_count=2500
                    :prop_begin_hsl=[55,100,30]
                    :prop_end_hsl=[55,100,4]
                />
            </div>
        </div>
        <div class="webglLink">
            <div class="desContainer">
                
                <div class="des">
                    <span>HARULUYA</span>
                </div>
                <div class="title">
                    <span>WEBGL DEMOS</span>
                </div>
                <div class="content">
                    Browse through some examples of webgl to feel the beauty of rendering. 
                </div>
                <div class="link">
                    <nano_button
                        prop_content="Begin" 
                        prop_border="Quad" 
                        prop_type="Blue" 
                        prop_size_width=3.5
                        prop_size_height=0.8
                        @handleClick="toWebgl"
                        >
                    </nano_button>
                </div>
            </div>
            <div class="contentContainer">
                <div class="steps">
                    <nano_process_button_line
                        :prop_category="default"
                        :prop_item_title="['BASIC','LIGHT','SCENE','SHADOW','TIPS','PBR']"
                    />
                </div>
                <div class="show">
                    
                </div>
            </div>
        </div>
        <!-- <nano_transition_line></nano_transition_line> -->
        <div class="gameEngine">
            <div class="videoContainer">
                <div class="videoBorder">
                </div>
                <div class="videoContent">
                </div>
            </div>
            <div class="desContainer">
                
                <div class="des">
                    <span>HARULUYA</span>
                </div>
                <div class="title">
                    <span>GAME ENGINE</span>
                </div>
                <div class="content">
                    Self-developed game engine. 
                </div>
                <div class="link">
                    <nano_button
                        prop_content="Begin" 
                        prop_border="Quad" 
                        prop_color="#d0a85c"
                        prop_size_width=2
                        prop_size_height=0.6
                        >
                    </nano_button>
                </div>
            </div>

        </div>
        <div class="nanoCore">
 
            <div class="desContainer">
                
                <div class="des">
                    <span>HARULUYA</span>
                </div>
                <div class="title">
                    <span>NANOCORE</span>
                </div>
                <div class="content">
                    Show the nanocore world! 
                </div>
                <div class="linkContainer">

                    <div class="video">
                        <nano_effect_bg_video
                            :prop_video_source="nanocorePv3"
                        />
                        <div class="link">
                            <nano_button
                            prop_content="Come" 
                            prop_border="Quad" 
                            prop_color="#65f9fd"
                            prop_size_width=4
                            prop_size_height=1
                            >
                        </nano_button> 
                        </div>
                        <border class="videoBorder"></border>
                    </div>

                </div>

            </div>
            <div class="charContainer">
                <div class="charName">
                    <span>{{mechaShowDatas[charCurrentIndex].name}}</span>
                </div>
                <div class="charImgContainer">
                    <div class="charImgBg">
                    </div>
                    <div class="charImg" v-for="(item,index) in mechaShowDatas" :key="index">
                        <img :src="item.mechaImg" v-if="index === charCurrentIndex" />
                    </div>
                    <div class="charBorder"></div>
                </div>
                <div class="arrow">
                    <div class="left-arrow" id="left"  @click="leftClick"></div>
                    <div class="des"><span>{{mechaShowDatas[charCurrentIndex].des}}</span></div>
                    <div class="right-arrow" id="right"  @click="rightClick"></div>
                </div>
            </div>
        </div>
        <div class="projects" 
                >
            <div class="mask" :style="{backgroundImage: 'url('+ homeBg + ')'}">
            </div>
            <div class="title">
                <span>ANOTHER PROJECTS</span>
            </div>
            <div class="linkItem" v-for="(item,index) in proLinkDatas" key="index" @click="linkJump(item)">
                <nano_link_card :prop_des="item.prop_des" 
                                :prop_title="item.prop_title"
                                :prop_content="item.prop_content"
                                :prop_img="item.prop_img">
                </nano_link_card>
            </div>

        </div>




    </div>
</template>
<script>



import { nano_effect_bg_starry, nano_footer, nano_process_button_line } from "@/packages";
import ImgResource from "_utils/ImgResource.js"
import nanocorePv3 from "../../assets/videos/pv3.mp4"


const proLinkDatas = [
    {
        prop_des: "project" ,
        prop_title: "TIFA",
        prop_content: "Simple e-commerce project.",
        prop_img: ImgResource.tifaProjImg,
        link: "https://github.com/Haruluya/tifa"
    },
    {
        prop_des: "project" ,
        prop_title: "AEIRTH",
        prop_content: "Aerith's game Froum.",
        prop_img: ImgResource.aerithProjImg,
        link: "https://github.com/Haruluya/aerith"
    },
    {
        prop_des: "project" ,
        prop_title: "CLOUD",
        prop_content: "Product Recommendation System",
        prop_img: ImgResource.cloudProjImg,
        link:"https://github.com/Haruluya/cloud"
    },
    {
        prop_des: "project" ,
        prop_title: "MIYA",
        prop_content: "Rendering demos based on OpenGL.",
        prop_img: ImgResource.miyaProjImg,
        link:"https://github.com/Haruluya/miya"
    },
    {
        prop_des: "project" ,
        prop_title: "YUFFIE",
        prop_content: "Win32 project.",
        prop_img: ImgResource.yuffieProjImg,
        link:"https://github.com/Haruluya/yuffie"
    },
    {
        prop_des: "project" ,
        prop_title: "JESSIE",
        prop_content: "DeepLearning project.",
        prop_img: ImgResource.jessieProjImg,
        link:"https://github.com/Haruluya/jessie"
    },
    
]

const mechaShowDatas = [
    {
        name:"GA-17",
        mechaImg:ImgResource.badeer,
        des:"巴德尔"
    },
    {
        name:"GA-18",
        mechaImg:ImgResource.heer,
        des:"赫尔"
    },
    {
        name:"PRAMS-BSⅡ ",
        mechaImg:ImgResource.PRAMSBS2,
        des:"杂鱼"
    },
    {
        name:"PRAMS-BSⅡ",
        mechaImg:ImgResource.PRAMSBS2O,
        des:"杂鱼"
    },
    {
        name:"PRAMS-QSⅠ",
        mechaImg:ImgResource.PRAMSQS1,
        des:"杂鱼"
    }
]


export default {
    name: "RSHome",
    data() {
        return {
            proLinkDatas,
            sliderImgs: [ImgResource.slider02, ImgResource.slider03, ImgResource.slider04, ImgResource.slider05],
            homeBg: ImgResource.Bg02,
            ImgResource,
            mechaShowDatas,
            charCurrentIndex:0,
            nanocorePv3,
        };
    },
    mounted() {

    },
    methods: {
        linkJump(item) {
            window.location.href = item.link;
        },
        toWebgl() {
            this.$router.push("/webgl_demo/Triangle");
        },
        leftClick(){
            this.charCurrentIndex--;
            if (this.charCurrentIndex < 0) {
                this.charCurrentIndex = 3
            }

        },
        rightClick(){
            this.charCurrentIndex++;
            if (this.charCurrentIndex > 3) {
                this.charCurrentIndex = 0
            }

        }
    },
    components: { nano_footer, nano_effect_bg_starry, nano_process_button_line }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>