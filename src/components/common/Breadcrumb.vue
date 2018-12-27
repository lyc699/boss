<style lang="less">

</style>

<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="!isMain" v-for="(item, index) in breadcrumb" :key="index" :to="{path:item.path}" :class="{'overlay':item.path == '/keep'}">{{item.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    data () {
        return {
            isMain:false,
            breadcrumb:this.$store.getters.getBreadList
        }
    },
    mounted () {
    },
    watch: {
        $route () {
            this.breadcrumb = this.$store.getters.getBreadList

            if(this.$route.path == '/main'){
                this.isMain = true
            }else{
                this.isMain = false
            }
        }
    },
    methods: {
    
    }
}
</script>