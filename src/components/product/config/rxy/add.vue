<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="8">
            <el-form ref="params" :model="params" :rules="rules" label-width="100px">
                <el-form-item label="产品归属" prop='productApp'>
                    <el-select v-model="params.productApp" placeholder="请选择产品归属" disabled>
                        <el-option
                        v-for="item in sendAppOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                 </el-form-item>
                <el-form-item label="产品编号" prop='pid'>
                    <el-input v-model="params.pid" :disabled='isUpdate'></el-input>
                </el-form-item>
                <el-form-item label="产品名称" prop='productName'>
                    <el-input  v-model="params.productName"></el-input>
                </el-form-item>
                 <el-form-item label="功能模式" prop='functionMode'>
                    <el-select v-model="params.functionMode" placeholder="请选择功能模式">
                        <el-option
                        v-for="item in productFunctionOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                 </el-form-item>
                 <el-form-item label="业务模式" prop='professionMode'>
                    <el-select v-model="params.professionMode" placeholder="请选择业务模式">
                        <el-option
                        v-for="item in goodsTypeOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                 </el-form-item>
                 
                  <el-form-item label="最小金额" prop='minMoney'>
                    <el-col :span="11">
                         <el-input  v-model="params.minMoney"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="最大金额" prop='maxMoney'>
                    <el-col :span="11">
                         <el-input  v-model="params.maxMoney"></el-input>
                    </el-col>
                </el-form-item>
                 <el-form-item label="支持期数" prop='dateNum'>
                    <el-checkbox-group v-model="checkedDates">
                        <el-checkbox v-for="item of dateNumOptions" :key="item.valCode" :label="item.valName"
                         name="type">
                        </el-checkbox>                        
                    </el-checkbox-group>
                </el-form-item>
                  <el-form-item label="产品类型" prop='productType'>
                    <el-select v-model="params.productType" placeholder="请选择产品类型">
                        <el-option
                        v-for="item in productTypeOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                 </el-form-item>
                   <el-form-item label="引流平台" prop='sourcePlatform'>
                    <el-select v-model="params.sourcePlatform" placeholder="请选择引流平台">
                        <el-option
                        v-for="item in sourceOsTypeOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                 </el-form-item>
                   <el-form-item label="产品状态" prop='productStatus'>
                    <el-select v-model="params.productStatus" placeholder="请选择产品状态">
                        <el-option
                        v-for="item in isNoOptions"
                        :key="item.id"
                        :label="item.valName==='是'?'上架': '下架'"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                 </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit('params')" v-if="!isUpdate">保存</el-button>
                    <el-button type="primary" @click="update('params')" v-else>修改</el-button>
                    <router-link :to="{path:'/rxy'}"><el-button>取消</el-button></router-link>
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
        let maxMoney = (rule,value,callback)=>{
            if(/^\d+$/.test(value) == false){
                callback(new Error("只能输入数字"));
            }else if(value<parseInt(this.params.minMoney)){
                callback(new Error("最大金额必须大于最小金额"));
            }else{
                callback();
            }
        }
        return {
            rules: {
                pid: [
                    { required: true, message: '产品编号', trigger: 'blur' },
                ],
                productName: [
                    { required: true, message: '产品名称', trigger: 'blur' },
                    { max: 10, message: '长度不超过10个字符', trigger: 'blur' }
                ],
                functionMode: [
                    { required: true, message: '功能模式', trigger: 'blur' },
                ],
                professionMode: [
                    { required: true, message: '业务模式', trigger: 'blur' },
                ],
                minMoney: [
                    { required: true, message: '最小金额', trigger: 'blur' },
                    { max: 10, message: '长度不超过10个字符', trigger: 'blur' },
                    {validator:numberPlus, trigger:'blur'}
                ],
                maxMoney: [
                    { required: true, message: '最大金额', trigger: 'blur' },
                    { max: 10, message: '长度不超过10个字符', trigger: 'blur' },
                    {validator:maxMoney, trigger:'blur'}
                ],
                dateNum: [
                    { required: true, message: '支持期数', trigger: 'blur' },
                ],
                productType: [
                    { required: true, message: '产品类型', trigger: 'blur' },
                ],
                sourcePlatform: [
                    { required: true, message: '引流平台', trigger: 'blur' },
                ],
                productStatus: [
                    { required: true, message: '产品状态', trigger: 'blur' },
                ],
                productApp: [
                    { required: true, message: '产品归属', trigger: 'blur' },
                ]
            },
            params: {
                pid: '', // 产品编号
                productName: '', // 产品名称
                functionMode: '', // 功能模式
                professionMode: '', // 业务模式
                minMoney:'', // 最小金额
                maxMoney:'', // 最大金额
                dateNum:'', // 支持期数
                productType:'',// 产品类型
                sourcePlatform:'', // 引流平台
                productStatus:'', // 产品状态
                productApp:'41800019'//产品归属（码类：Send_App）
            },   
            checkedDates:[],
            dateNumOptions:[
                {
                valCode: 3,
                valName: "3期"
                },
                {
                valCode: 6,
                valName: "6期"
                },
                {
                valCode: 9,
                valName: "9期"
                },
                {
                valCode: 12,
                valName: "12期"
                },
                {
                valCode: 24,
                valName: "24期"
                },
                {
                valCode: 36,
                valName: "36期"
                }
            ], 
            sendAppOptions: [], // 产品归属下拉列表     
            productFunctionOptions:[], // 功能模式下拉列表
            goodsTypeOptions:[], // 业务模式下拉列表
            productTypeOptions:[], // 产品类型下拉列表
            sourceOsTypeOptions:[], // 引流平台下拉列表
            isNoOptions:[], // 产品状态下拉列表
            codeParam:{
                list: [
                    {
                        type: "Mode_Name" // 功能模式码表
                    },
                    {
                        type: "Goods_Type" // 业务模式码表
                    },
                    {
                        type: "Product_Type" // 产品类型码表
                    },
                    {
                        type: "Source_Os_Type" // 引流平台码表
                    },
                    {
                        type: "Is_No" // 产品状态码表
                    },
                    {
                        type: "Send_App" // 产品归属
                    }                    
                ]
            },
            isUpdate: this.$route.query.pid?true:false
        };
    },
    mounted() {
        this.getCodeList()
        if(this.isUpdate){
            this.params.pid = this.$route.query.pid
            this.getData()
        }
    },
    methods: {
        getCodeList(){
            this.$axios.post('/api/bycx-rece-service/api/sys/code/mobile/query',{params:this.codeParam})
            .then(res => {
                let {code,msg,result} = res.data
                if (code == "0000") {
                    let {Send_App, Goods_Type, Mode_Name, Product_Type, Source_Os_Type, Is_No} = result;
                    this.sendAppOptions = Send_App;
                    this.goodsTypeOptions = Goods_Type;
                    this.productFunctionOptions = Mode_Name;
                    this.productTypeOptions = Product_Type;
                    this.sourceOsTypeOptions = Source_Os_Type;
                    this.isNoOptions = Is_No;
                }else{
                    if(msg) this.$message.error(msg)
                }
            })
        },
        getData(){
            this.$axios.post('/api/bycx-fund-service/product/getProductInfo',{pid: this.params.pid})
            .then(res => {
                let {code,msg} = res.data
                if (code == "0000") {
                    this.params.productName = res.data.data.productName
                    this.params.functionMode = res.data.data.functionMode
                    this.params.minMoney = res.data.data.minMoney
                    this.params.maxMoney = res.data.data.maxMoney
                    this.params.productType = res.data.data.productType
                    this.params.sourcePlatform = res.data.data.sourcePlatform
                    this.params.productApp = res.data.data.productApp
                    this.params.productStatus = res.data.data.productStatus  
                    this.params.professionMode = res.data.data.professionMode  
                    this.checkedDates = res.data.data.dateNum.replace(/,/g,'期,').replace(/$/,'期').split(',')
                }else{
                    if(msg) this.$message.error(msg)
                }
            })
        },
        submit(formName){
            this.filterDateNum()
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post("/api/bycx-fund-service/product/addProductInfo", this.params)
                    .then(res => {
                        let {code,msg} = res.data
                        if (code == "0000") {
                            this.$router.push('/rxy')
                        }else{
                            if(msg)this.$message.error(msg)
                        }
                    });
                }else {
                    return false;
                }
            });    
        },
        update(formName){
            this.filterDateNum()
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post("/api/bycx-fund-service/product/updateProductInfo", this.params)
                    .then(res => {
                        let {code,msg} = res.data
                        if (code == "0000") {
                            this.$router.push('/rxy')
                        }else{
                            if(msg)this.$message.error(msg)
                        }
                    });
                }else {
                    return false;
                }
            });    
        },
        filterDateNum(){
            let dates = this.checkedDates.join('').split("期").slice(0, this.checkedDates.length)
            this.params.dateNum = dates.join(",")
        }
    }
};
</script>