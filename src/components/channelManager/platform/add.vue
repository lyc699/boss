<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="8">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="80px">
                <el-form-item label="引流平台码值">
                    <el-input v-model="ruleForm.drainNo" disabled></el-input>
                </el-form-item>
                <el-form-item label="引流平台" prop='drainName'>
                    <el-input v-model="ruleForm.drainName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="saveData('ruleForm')">保存</el-button>
                    <router-link :to="{path:'/platform'}"><el-button>取消</el-button></router-link>
                </el-form-item>
            </el-form>
        </el-col>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rules: {
                drainName: [
                    { required: true, message: '引流平台', trigger: 'blur' },
                    { max: 50, message: '长度不超过50个字符', trigger: 'blur' },
                ]
            },
            ruleForm: {
                id:'',
                drainNo:'',
                drainName: "",
                instUserNo: localStorage.loginName
            }
        };
    },
    mounted() {
        this.ruleForm.id = this.$route.query.id
        if(this.ruleForm.id){
            this.ruleForm.drainNo = this.$route.query.drainNo
            this.getData()
        }else{
            this.getDrainNo()
        }
    },
    methods: {
        getDrainNo(){
            this.$axios.post('/api/bycx-syst-service/aSysDrainPlatform/getDrainNoMax',{})
            .then(res => {
                this.ruleForm.drainNo = res.data + ''
            })
        }, 
        getData(){
            this.$axios.post('/api/bycx-syst-service/aSysDrainPlatform/findPlatformList',{params: {drainNo: this.ruleForm.drainNo}})
            .then(res => {
                if (res.data.code == "0000") {
                    this.ruleForm.drainName = res.data.result[0].drainName
                }
            })
        },   
        saveData(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let url = ''
                    if(this.ruleForm.id){
                        url = 'updateDrainPlatform'
                    }else{
                        url = 'saveDrainPlatform'
                    }
                    this.$axios.post(`/api/bycx-syst-service/aSysDrainPlatform/${url}`,{params: this.ruleForm})
                    .then(res => {
                        if (res.data.code == "0000") {
                            this.$router.push('/platform')
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                } else {
                    return false;
                }
            });
        }     
    }
};
</script>