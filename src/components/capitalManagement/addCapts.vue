<style lang="less" scoped>
#content .el-input{
    width:320px;
}
</style>

<template>
    <div id="content">
        <el-form  :model="query" :rules="rules" ref="ruleForm" :status-icon="true">
            <el-form-item label="资方编号" prop="fundsNo">
                 <el-input v-model="query.fundsNo" placeholder="请输入资方编号"></el-input>
            </el-form-item>
           <el-form-item label="资方名称" prop="fundsName">
                 <el-input v-model="query.fundsName" placeholder="请输入资方名称"></el-input>
            </el-form-item>
          <el-form-item label="资方类型" prop="fundsType">
                <el-select v-model="query.fundsType" placeholder="请选择资方类型">
                    <el-option
                     v-for="item in accTypeOptions"
                    :key="item.id"
                    :label="item.valName"
                    :value="item.valCode">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="资方地址" prop="fundsAddr">
              <el-input v-model="query.fundsAddr" placeholder="请输入资方地址"></el-input>
            </el-form-item>
           
            <el-form-item label="签约资产方" prop="signAssets">
                <el-select v-model="query.signAssets" placeholder="请输入签约资产方">
                    <el-option
                     v-for="item in assetsOptions"
                    :key="item.assetsNo"
                    :label="item.assetsName"
                    :value="item.assetsNo">
                    </el-option>
                </el-select>
            </el-form-item>
           
            <el-col :span="24" class="mt30">
                <el-form-item >
                    <el-button type="primary" @click="submit('ruleForm')">保存</el-button>
                    <router-link :to="{path:'/capInfos'}"><el-button>取消</el-button></router-link>
                </el-form-item>
            </el-col>
        </el-form>
       
    </div>
</template>

<script>
import { getBtnAuth } from "@/assets/js/utils.js";
export default {
    data() {
        return {
            codeParam: {
                list: [
                    {
                        type: "Acc_Type" // 资方类型 码表
                    }
                ]
            },
            query: {
                fundsNo:"",//资方编号
                fundsName:"", // 资方名称
                fundsAddr:"", // 资方地址
                fundsType:"", // 资方类型
                signAssets:'', //签约资产方
                isOpen:'13900001'//是否开通
            },
            api:'',
             rules: {
                fundsNo: [
                    { required: true, message: '请输入资方编号', trigger: 'blur' }
                ],
                fundsName: [
                    { required: true, message: '请输入资方名称', trigger: 'blur' }
                ],
                fundsAddr: [
                    {required: true, message: '请输入资方地址', trigger: 'blur' }
                ],
                fundsType: [
                    {required: true, message: '请选择资方类型', trigger: 'change' }
                ],
                signAssets: [
                    {required: true, message: '请输入签约资产方', trigger: 'blur' }
                ]
            },
            accTypeOptions:[], // 资方类型下拉菜单
            assetsOptions:[], // 签约资产方下拉菜单
        };
    },
    mounted() {
        this.getCodeList()
        this.getAssets()
    },
    methods: {
        getCodeList(){
            this.$axios.post('/api/bycx-drainage-service/aSysAtt/mobile/query',{params:this.codeParam})
            .then(res => {
                let {code,msg,result} = res.data
                if (code == "0000") {
                    let {Acc_Type} = result;
                    this.accTypeOptions = Acc_Type  
                }else{
                    if(msg) this.$message.error(msg)
                }
            })
        },
        getAssets(){
            this.$axios.post('/api/bycx-fund-service/assets/getList',{})
            .then(res => {
                let {code,msg,result} = res.data
                if (code == "0000") {
                    this.assetsOptions = result 
                }else{
                    if(msg) this.$message.error(msg)
                }
            })
        },
        submit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post("/api/bycx-fund-service/fund/addNewFund", this.query)
                    .then(res => {
                        let {code,msg} = res.data
                        if (code == "0000") {
                            this.$router.push('/capInfos')
                        }else{
                            if(msg)this.$message.error(msg)
                        }
                    });
                }else {
                    return false;
                }
            });    
        }
    }
};
</script>
