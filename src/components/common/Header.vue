<style lang="less">

</style>

<template>
    <header id="header">
        <el-row>
            <el-col :span="12">
                <div class="logo">BOSS管理系统</div>
            </el-col>
            <el-col :span="12" style="text-align: right;padding-right: 20px;">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner"><img src="../../assets/image/user.png" />{{loginName}}</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>我的消息</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
    </header>
</template>

<script>
export default {
    data () {
        return {
            loginName:localStorage.getItem('loginName')
        }
    },
    mounted () {

    },
    methods: {
        logout(){
            this.$axios.post('/api/bycx-syst-service/aSysUser/userLogout',{params: {}}).then(res => {
                if(res.data.code == '0000'){
                    localStorage.removeItem('token')
                    //开发环境
                    if(process.env.NODE_ENV == 'development'){
                        window.location.href = `${window.location.origin}/#/login`
                    }else{
                        //生产环境
                        window.location.href = `${window.location.origin}/boss/#/login`
                    }
                }
            })
        }
    }
}
</script>