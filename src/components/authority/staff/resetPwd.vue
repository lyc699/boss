<style lang="less" scoped>
.el-select{
    width: 100%;
}
</style>

<template>
    <div id="content">
        <el-col :span="5">
            <el-form :model="params" :rules="rules" ref="ruleForm" label-position="top" label-width="80px">
                <el-form-item label="登录名" prop="loginName">
                    <el-input placeholder="登录名" v-model="params.loginName" :disabled="id ? true : false"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input placeholder="新密码" v-model="params.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">保存</el-button>
                    <el-button @click="back">取消</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </div>
</template>

<script>
import {checkPhone} from '@/assets/js/utils.js'
export default {
    data() {
        return {
            id:this.$route.query.id,
            params:{
                loginName:'',
                password:''
            },
            rules: {
                loginName: [
                    { required: true, message: '请输入登录名', trigger: 'blur' },
                    { type: 'string',min: 6, max: 16, message: '请输入6-16个字符', trigger: 'blur' }
                ],
                password: [
                    { validator:this.checkPwd, trigger: 'blur' }
                ]
            },
        };
    },
    mounted() {
        this.getQueryList()
    },
    methods: {
        checkPwd(rule,value,callback){
            let reg = /^\w{6,16}$/

            if (value === "") {
                callback(new Error("请输入密码"))
            }else if(!reg.test(value)){
                callback(new Error("请输入6-16位密码，不要输入特殊字符！"))
            }else{
                callback()
            }
        },
        getQueryList(){
            this.$axios
                .post("/api/bycx-syst-service/aSysUser/userList", {params:{
                    id:this.id
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.params = res.data.result[0]
                    }
                });
        },
        back(){
            this.$router.back()
        },
        submit(){
            this.$refs.ruleForm.validate(valid => {
                if(valid){
                    this.$axios.post('/api/bycx-syst-service/aSysUser/changePwd',{params: this.params}).then(res => {
                        if(res.data.code == '0000'){
                            this.$router.push('/staff')
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        }
    }
};
</script>