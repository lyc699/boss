
<style lang="less" scoped>
.login-container {
    margin-top: 10%;
    .login-box {
        margin-top: 50px;
        border-radius: 5px;
        width: 350px;
        padding: 65px 35px 15px 35px;
        background: #fff;
        position: relative;
        .title {
            margin: 10px auto 20px auto;
            text-align: center;
            color: #505458;
        }
        .login-icon {
            width: 120px;
            height: 120px;
            border: 5px solid #93defe;
            border-radius: 100px;
            background: #fff;
            text-align: center;
            line-height: 110px;
            position: absolute;
            top: -65px;
            right: 110px;
            img{
                width: 60px
            }
        }
    }
}
</style>
<template>
    <el-row class="login-container">
        <el-col :span="8" :offset="6">
            <div class="login-bg">
                <img src="@/assets/image/login_bg.png" alt="">
            </div>
        </el-col>
        <el-col :span="5">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" status-icon label-width="0px" class="login-box">
                <h3 class="title">BOSS系统登录</h3>
                <el-form-item prop="loginName">
                    <el-input type="text" v-model="ruleForm.loginName" placeholder="账号" @keyup.enter.native="submit"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" placeholder="密码" @keyup.enter.native="submit"></el-input>
                </el-form-item>
                <el-form-item prop="verificationCode" v-if="showCaptcha">
                    <el-row>
                        <el-col :span="13">
                            <el-input type="text" v-model="ruleForm.verificationCode" placeholder="验证码" @keyup.enter.native="getSmsCaptcha"></el-input>
                        </el-col>
                        <el-col :span="10" :offset="1" class="pointer">
                            <img :src="captchaSrc" @click="getCaptcha" style="width:100%" alt="">
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item prop="smsCode" v-if="showCaptcha">
                    <el-row>
                        <el-col :span="13">
                            <el-input type="text" v-model="ruleForm.smsCode" placeholder="短信验证码" @keyup.enter.native="submit"></el-input>
                        </el-col>
                        <el-col :span="10" :offset="1" class="pointer">
                            <el-button type="primary" @click="getSmsCaptcha" v-if="!disabledSms">获取验证码</el-button>
                            <el-button disabled v-else>{{timeNumSms}}s 后重发</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item style="width:100%;">
                    <el-button type="primary" style="width:100%;" @click="submit" :loading="loading">登录</el-button>
                </el-form-item>
                <div class="login-icon">
                    <img src="@/assets/image/login_icon.png" alt="">
                </div>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
import routes from '../../routesAll.js'
import { filterRouter } from '../../assets/js/utils.js'

export default {
    data() {
        return {
            ruleForm:{
                loginName:'',
                password:'',
                verificationCode:'',
                smsCode:''
            },
            sendSmsParams:{
                phone:'',
                sourceOsType:'30500005',
                verificationCode:''
            },
            rules: {
                loginName: [
                    { validator:this.checkLoginName, trigger: 'blur' }
                ],
                password: [
                    { validator:this.checkLoginPwd, trigger: 'blur' }
                ],
                verificationCode: [
                    { required: true, message: '请输入图形验证码', trigger: 'blur' },
                    { type: 'string',min: 4, max: 4, message: '请输入4位图形验证码', trigger: 'blur' }
                ],
                smsCode: [
                    { required: true, message: '请输入短信验证码', trigger: 'blur' },
                    { type: 'string',min: 6, max: 6, message: '请输入6位短信验证码', trigger: 'blur' }
                ]
            },
            loading:false,
            showCaptcha:false,
            captchaSrc:'',
            disabledSms: false, //禁用短信验证码
            smsTimer: null, //短信验证码定时器
            timeNumSms: 60, //短信验证码倒计时
        };
    },
    mounted () {
        document.querySelector('body').style.background = '#93defe'

    },
    beforeDestroy(){
        document.querySelector('body').style.background = '#fff'
    },
    methods: {
        checkLoginName(rule,value,callback){
            let reg = /^\w{6,16}$/

            if (value === "") {
                callback(new Error("请输入帐号"))
            }else if(!reg.test(value)){
                callback(new Error("请输入6-16位账号"))
            }else{
                if(this.ruleForm.password){
                    this.getUserPhone()
                }
                callback()
            }
        },
        checkLoginPwd(rule,value,callback){
            let reg = /^\w{6,10}$/

            if (value === "") {
                callback(new Error("请输入密码"))
            }else if(!reg.test(value)){
                callback(new Error("请输入6-10位密码"))
            }else{
                if(this.ruleForm.loginName){
                    this.getUserPhone()
                }
                callback()
            }
        },
        getCaptcha(){
            this.captchaSrc = `/api/bycx-rece-service/aSysMsgCaptcha/getCodeImg?phoneNo=${this.sendSmsParams.phone}&ts=${new Date().getTime()}`
        },
        getSmsCaptcha(){
            this.$refs.ruleForm.validateField('verificationCode',vaild => {
                if(!vaild){
                    this.sendSmsParams.verificationCode = this.ruleForm.verificationCode

                    this.$axios.post('/api/bycx-rece-service/aSysMsgCaptcha/sendSms',{params: this.sendSmsParams}).then(res => {
                        if(res.data.code == '0000'){
                            this.sendSmsCode();
                        }else{
                            this.getCaptcha()
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        },
        sendSmsCode() {
            let that = this;

            that.disabledSms = true;

            that.smsTimer = window.setInterval(() => {
                if (that.timeNumSms-- <= 1) {
                    window.clearInterval(that.smsTimer);
                    that.timeNumSms = 60;
                    that.disabledSms = false;
                }
            }, 1000);
        },
        getUserPhone(){
            this.$axios.post('/api/bycx-syst-service/aSysUser/getPhoneNo',{params: {
                loginName:this.ruleForm.loginName,
                password:this.ruleForm.password,
            }}).then(res => {
                if(res.data.code == '0000'){
                    this.sendSmsParams.phone = res.data.result.phoneNo
                    this.showCaptcha = true
                    this.getCaptcha()
                }else{
                    this.showCaptcha = false
                    this.$message.error(res.data.msg)
                }
            })
        },
        submit() {
            this.$refs.ruleForm.validate(valid => {
                if(valid && this.showCaptcha){
                    this.loading = true
                    
                    this.$axios.post('/api/bycx-syst-service/aSysUser/userLogin',{params: this.ruleForm}).then(res => {
                        if(res.data.code == '0000'){
                            let { menuTree,user,permissionList } = res.data.result
                            localStorage.setItem('menuTree',JSON.stringify(menuTree))
                            localStorage.setItem('permissionList',JSON.stringify(permissionList))
        
                            this.$router.addRoutes(filterRouter(routes,menuTree))

                            localStorage.setItem('loginName',user.userName)
                            localStorage.setItem('userNo',user.loginName)

                            setTimeout(() => {
                                this.$router.push('/main')
                            },2000)
                        }else{
                            this.loading = false
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            });

        },
    }
};
</script>
