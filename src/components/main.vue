<style lang="less">

</style>

<template>
    <div>
        首页
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    mounted () {
        this.$axios.post('/api/bycx-syst-service/aSysMenu/queryMenuTree',{params: {}}).then(res => {
            
        })
    },
    methods: {

    }
}
</script>