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
                <el-form-item label="密码" prop="password" v-if="!id ? true : false">
                    <el-input placeholder="密码" v-model="params.password"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input placeholder="手机号" v-model.number="params.mobile"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="userName">
                    <el-input placeholder="真实姓名" v-model="params.userName"></el-input>
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
                password:'',
                mobile:'',
                userName:''
            },
            rules: {
                loginName: [
                    { required: true, message: '请输入登录名', trigger: 'blur' },
                    { type: 'string',min: 6, max: 16, message: '请输入6-16个字符', trigger: 'blur' }
                ],
                password: [
                    { validator:this.checkPwd, trigger: 'blur' }
                ],
                mobile: [
                    { validator:checkPhone, trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                    { min: 2, max: 12, message: '长度在2-12个字符', trigger: 'blur' }
                ]
            },
        };
    },
    mounted() {
        if(this.id){
            this.getQueryList()
            this.$route.meta.title = '编辑员工'
            document.title = '编辑员工'
        }else{
            this.$route.meta.title = '新增员工'
            document.title = '新增员工'
        }
    },
    methods: {
        checkPwd(rule,value,callback){
            let reg = /^\w{6,16}$/

            if(this.id){
                callback()
                return false;
            }

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
            let url = '/api/bycx-syst-service/aSysUser/addUser'
            if(this.params.id){
                url = '/api/bycx-syst-service/aSysUser/editUser'
            }
            this.$refs.ruleForm.validate(valid => {
                if(valid){
                    this.$axios.post(url,{params: this.params}).then(res => {
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