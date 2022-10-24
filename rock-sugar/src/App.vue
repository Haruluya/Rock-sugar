<template>
  <!-- <iframe src="https://webglfundamentals.org/webgl/background.html" id='globalBackground'></iframe> -->
  <div class="app">
    <div><nano_menu></nano_menu></div>
    <div class="content">
        <router-view>


        </router-view>
    </div>
  </div>
</template>

<script>
import nano_menu from '_packages/nano_menu/index.js'

export default {
  name: 'App',
  components: {
    nano_menu
  }
}
</script>

<style lang="css">
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

.content{
    margin-top: 80px;
}
a {
	text-decoration: none; 
	outline: none;	
	color: #000;	
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

/*create runtime*/

input[type=range] {
    -webkit-appearance: none;
    border-radius: 10px; 
    background: -webkit-linear-gradient(gold, gold) no-repeat;
    background-size: 0% 100%;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
}    
input[type=range]::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: 10px; 
    box-shadow: 0 1px 1px gold, inset 0 .1em .1em #c8c8c8; 
}
input[type=range]:focus {
    outline: none;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 15px;
    width: 15px;
    margin-top: -5px; 
    background: #ffffff; 
    border-radius: 50%; 
    border: solid 0.125em rgba(232, 229, 62, 0.5); 
    box-shadow: 0 .125em .125em #3b4547; 
}
.title{
    margin: 20px 0px;
    text-align: center;
    font-size: 25px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color:#016bff;
    font-weight: bold;
}
body{
    margin: 0;
}


#uiContainer{
    position: absolute;
    top: 100px;
    left: 1100px;
}
.webgl-slider-outer{
    display: flex;
    margin-top: 8px;
}
.webgl-slider-label{
    margin-right: 20px;
    font-size: 16px;
    color: #3ba9ed;
    font-weight: bold;
}
.webgl-slider-value{
    margin-left: 20px;
    font-size: 16px;
    color: #3ba9ed;
    font-weight: bold;
}
.webgl-slider-slider{
}
.webgl-dropdownbox{
    font-size: 16px;
    color: #3ba9ed;
    font-weight: bold;
    border: solid 2px #999;
    border-radius: 5px;
    height: 30px;
    line-height: 40px;
    cursor: default;
}
.webgl-dropdownbox:focus{
    outline: none;
    transform: scale(1.02);
}
.webgl-input-color{
    font-size: 16px;
    color: #3ba9ed;
    font-weight: bold;
    height: 30px;
    line-height: 40px;
    cursor: default;
    
}
.webgl-Input-colorlabel{
    margin-right: 20px;
}


</style>
