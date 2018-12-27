<style lang="less">
</style>

<template>
    <div id="content">
        <el-tabs v-model="activeName">
            <el-tab-pane label="上上签" name="ssq">
                <ssq></ssq>
            </el-tab-pane>
            <el-tab-pane label="发大大" name="fdd">
                <fdd></fdd>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Ssq from './ssq/main'
import Fdd from './fdd/main'

export default {
    components:{
        Ssq,
        Fdd
    },
    data() {
        return {
            activeName:'ssq'
        };
    },
    computed:{

    },
    mounted() {
        
    },
    methods: {
    }
};
</script>
