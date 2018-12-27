<style lang="less">
</style>

<template>
    <div class="p10">
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="配置" name="config">
                <config></config>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { getBtnAuth,checkPhone } from '@/assets/js/utils.js'
import Info from './info'
import Config from './config'

export default {
    components:{
        Info,
        Config
    },
    data() {
        return {
            activeName:'config'
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
