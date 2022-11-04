<template>
    <div class="compContainer" >
        <div class="canvesContainer">
            <canvas id="canvas" ref="canvas">
                <div id="vertex-shader">
                    {{prop_vertex_shader_source}}
                </div>
                <div id="fragment-shader">
                    {{prop_fragment_shader_source}}
                </div>
            </canvas>
        </div>
    </div>
</template>
<script>
export default {
    name: "nano_canvas",
    props: {
        prop_vertex_shader_source:{
            type:String,
            default:"None",
            required:true,
        },
        prop_fragment_shader_source:{
            type:String,
            default:"None",
            required:true,
        }
    },
    methods: {

    },
};
</script>

<style lang="less" scoped>
@import "./nano_canvas.less";
</style>
