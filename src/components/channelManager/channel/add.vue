<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="8">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="80px">
                <el-form-item label="引流平台码值" prop='drainNo'>
                    <el-input v-model="ruleForm.drainNo" disabled></el-input>
                </el-form-item>
                <el-form-item label="引流平台" prop='drainName'>
                    <el-select v-model="ruleForm.drainName" placeholder="请选择" @change="getDrainNo">    
                        <el-option
                        v-for="item in drainNameList"
                        :key="item.drainNo"
                        :label="item.drainName"
                        :value="item.drainName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道码值" prop='chanNo'>
                    <el-input v-model="ruleForm.chanNo" disabled></el-input>
                </el-form-item>
                <el-form-item label="渠道名称" prop='chanName'>
                    <el-input v-model="ruleForm.chanName"></el-input>
                </el-form-item>
                <el-form-item label="渠道简称" prop='chanShort'>
                    <el-input v-model="ruleForm.chanShort"></el-input>
                </el-form-item>
                <el-form-item label="渠道状态" prop='chanState'>
                    <el-select v-model="ruleForm.chanState" placeholder="请选择">    
                        <el-option
                        v-for="item in chanStateList"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="接入品牌" prop='brand'>
                    <el-select v-model="ruleForm.brand" placeholder="请选择">    
                        <el-option
                        v-for="item in brandList"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道合作方式" prop='coopMethod'>
                    <el-select v-model="ruleForm.coopMethod" placeholder="请选择" @change="getChanLink">    
                        <el-option
                        v-for="item in coopMethodList"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道链接" prop='chanLink'>
                    <el-input v-model="ruleForm.chanLink" disabled></el-input>
                </el-form-item>
                <el-form-item label="结算方式" prop='balanceMethod'>
                    <el-select v-model="ruleForm.balanceMethod" placeholder="请选择">    
                        <el-option
                        v-for="item in balanceMethodList"
                        :key="item.value"
                        :label="item.valName"
                        :value="item.valName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="CPA" prop='cpa'>
                    <el-input v-model="ruleForm.cpa"></el-input>
                </el-form-item>
                <el-form-item label="CPS" prop='cps'>
                    <el-input v-model="ruleForm.cps"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click.native="updateData('ruleForm')" v-if="isUpdate">修改</el-button>
                    <el-button class="ml20" type="primary" @click.native="saveData('ruleForm')" v-else>保存</el-button>
                    <router-link :to="{path:'/channel'}"><el-button>取消</el-button></router-link>
                </el-form-item>
            </el-form>
        </el-col>
    </div>
</template>

<script>
import _ from 'underscore'
export default {
    data() {
        let numberPlus = (rule, value, callback) => {
                if(/^\d+$/.test(value) == false && parseInt(value)<0){
                    callback(new Error("只能输入正数"));
                }else{
                    callback();
                }
        }        
        return {
            rules: {
                drainName: [
                    { required: true, message: '引流平台', trigger: 'blur' },
                ],
                chanNo: [
                    { required: true, message: '渠道码值', trigger: 'blur' },
                ],
                chanName: [
                    { required: true, message: '渠道名称', trigger: 'blur' },
                    { max: 50, message: '长度不超过50个字符', trigger: 'blur' },
                ],
                chanShort: [
                    { required: true, message: '渠道简称', trigger: 'blur' },
                    { max: 50, message: '长度不超过50个字符', trigger: 'blur' },
                ],
                chanState: [
                    { required: true, message: '渠道状态', trigger: 'blur' },
                ],
                brand: [
                    { required: true, message: '接入品牌', trigger: 'blur' },
                ],
                coopMethod: [
                    { required: true, message: '渠道合作方式', trigger: 'blur' },
                ],
                balanceMethod: [
                    { required: true, message: '结算方式', trigger: 'blur' },
                ],
                cpa:[{validator:numberPlus, trigger:'blur'}],
                cps:[{validator:numberPlus, trigger:'blur'}]
            },
            ruleForm: {
                    drainNo:'',
                    drainName: "",
                    chanNo: '',
                    chanName: '',
                    chanShort: '',
                    chanState: '',
                    brand: '',
                    coopMethod: '',
                    balanceMethod: '',
                    cpa: '0',
                    cps: '0',
                    chanLink: ''
            },
            drainNameList:[],
            chanStateList:[
                {
                    valCode: "13000001",
                    valName: "启用"
                },
                {
                    valCode: "13000002",
                    valName: "未启用"
                }
            ],
            coopMethodList: [],
            brandList:[],
            balanceMethodList:[],
            isUpdate: this.$route.query.id?true:false
        };
    },
    mounted() {
        if(this.isUpdate){
            this.getInfo()
        }else{
            this.getChanNo()
        }
        this.getDrainName()    
        this.getBalanceMethod()  
    },
    methods: {
        getChanNo(){
            this.$axios.post('/api/bycx-syst-service/aSysDrainChan/getChanNoMax',{})
            .then(res => {
                this.ruleForm.chanNo = res.data + ''
            })
        }, 
        getInfo(){
            this.$axios.post('/api/bycx-syst-service/aSysDrainChan/getDrainChanList',{params:{id: this.$route.query.id}})
            .then(res => {
                this.ruleForm = res.data.result[0]
            })
        }, 
        getDrainName(){
            this.$axios.post('/api/bycx-syst-service/aSysDrainPlatform/findPlatformList',{params:{drainName: this.ruleForm.drainName}})
            .then(res => {
                if (res.data.code == "0000") {
                    this.drainNameList = res.data.result;
                }
            })
        }, 
        getDrainNo(){
            this.ruleForm.drainNo = ((_.find(this.drainNameList, (item)=>{ return item.drainName === this.ruleForm.drainName })).drainNo)
        },
        getChanLink(){
            this.ruleForm.chanLink = ((_.find(this.coopMethodList, (item)=>{ return item.valName === this.ruleForm.coopMethod })).remark)
        },
        getBalanceMethod(){
            this.$axios.post('/api/bycx-syst-service/aSysCodeInfo/findList',{params:{typeCode:"Account_Method",status:"13900001"}})
            .then(res => {
                if (res.data.code == "0000") {
                    this.balanceMethodList = res.data.result;
                    this.getBrand()    
                }
            })
        },       
        getBrand(){
            this.$axios.post('/api/bycx-syst-service/aSysCodeInfo/findList',{params:{typeCode:"Access_Brand",status:"13900001"}})
            .then(res => {
                if (res.data.code == "0000") {
                    this.brandList = res.data.result;
                    this.getCoopMethod()    
                }
            })
        },    
        getCoopMethod(){
            this.$axios.post('/api/bycx-syst-service/aSysCodeInfo/findList',{params:{typeCode:"Coop_Method",status:"13900001"}})
            .then(res => {
                if (res.data.code == "0000") {
                    this.coopMethodList = res.data.result;
                }
            })
        },     
        saveData(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.ruleForm.chanLink){
                        this.ruleForm.chanLink = this.ruleForm.chanLink + this.ruleForm.chanShort
                    }
                    this.$axios.post('/api/bycx-syst-service/aSysDrainChan/saveDrainChan',{params: this.ruleForm})
                    .then(res => {
                        if (res.data.code == "0000") {
                            this.$router.push('/channel')
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        updateData(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.ruleForm.id = this.$route.query.id
                    this.ruleForm.cpa = this.ruleForm.cpa + ''
                    this.ruleForm.cps = this.ruleForm.cps + ''
                    if(/(\/|=)$/.test(this.ruleForm.chanLink)){
                        this.ruleForm.chanLink = this.ruleForm.chanLink + this.ruleForm.chanShort
                    }else {
                        if(this.ruleForm.chanLink){
                            let chanShort = this.ruleForm.chanLink.match(/.+[\/=]{1}(.+)$/)&&this.ruleForm.chanLink.match(/.+[\/=]{1}(.+)$/)[1]
                            this.ruleForm.chanLink = this.ruleForm.chanLink.replace(chanShort, this.ruleForm.chanShort)
                        }
                    }
                    this.$axios.post('/api/bycx-syst-service/aSysDrainChan/updateDrainChan',{params: this.ruleForm})
                    .then(res => {
                        if (res.data.code == "0000") {
                            this.$router.push('/channel')
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