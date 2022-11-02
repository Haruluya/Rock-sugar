<template>
    <div class="compContainer" >

    </div>
</template>
<script>
export default {
    name: "nano_items_menu",
    

    props: {

    },
    methods: {
        toWebglPage(page){
            this.$router.push('/webgl_demo/' + page)
            console.log(page)
        }
    },
};
</script>

<style lang="less" scoped>
@import "./nano_items_menu.less";
</style>
