<style lang="less" scoped>
 .danger{
     color:#F56C6C;
 }

</style>

<template>
    <div id="content">
        <p>资方编号：{{params.fundsNo}}<br><br></p>        
        <el-form :inline="true" :model="params" ref="ruleForm">
            <el-form-item label="资方名称" prop="fundsName">
                <el-input v-model="params.fundsName" :disabled="disAbleChange" placeholder="请输入资方名称"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="fundsAddr">
                <el-input v-model="params.fundsAddr" :disabled="disAbleChange" placeholder="请输入资方地址"></el-input>
            </el-form-item>
            <el-form-item label="资方类型" prop="fundsType">
                <el-select v-model="params.fundsType" :disabled="disAbleChange" placeholder="请选择资方类型">
                    <el-option
                     v-for="item in accTypeOptions"
                    :key="item.id"
                    :label="item.valName"
                    :value="item.valCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="签约资产方" prop="signAssets">
                <el-select v-model="params.signAssets" :disabled="disAbleChange" placeholder="请输入签约资产方">
                    <el-option
                     v-for="item in assetsOptions"
                    :key="item.assetsNo"
                    :label="item.assetsName"
                    :value="item.assetsNo">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item>
                <el-button type="primary" @click="editInfo" :disabled="!isChange">编辑</el-button>
                <el-button type="primary" @click="changeInfo" :disabled="isChange">提交</el-button>
            </el-form-item>
        </el-form>
        <h3 class="mt40">合作业务<el-button type="primary" class="right" @click="addDialogVisible=true" v-if="isAdd">新增</el-button></h3>        
        <el-table :data="tableData" index>
            <el-table-column align="center" prop="bizName" label="业务名称"></el-table-column>
            <!-- <el-table-column align="center" prop="bizNo" label="业务编号"></el-table-column> -->
            <el-table-column align="center" prop="chanNo" label="资金渠道编号"></el-table-column>
            <el-table-column align="center" prop="bizType" label="业务类型" :formatter="filterBizTypeOptions"></el-table-column>
            <el-table-column align="center" prop="isOpen" label="是否开通" :formatter="filterisOpenOptions"></el-table-column>
            <el-table-column align="center" prop="dayPosition" label="日放款量"></el-table-column>
            <el-table-column align="center" prop="openType" label="开户类型" :formatter="filterOpenTypeOptions"></el-table-column>
            <el-table-column align="center" prop="openNode" label="开户环节" :formatter="filterOpenNodeOptions"></el-table-column>
            <el-table-column align="center" prop="signMode" label="签章模式" :formatter="filterSignModeOptions"></el-table-column>
            <el-table-column align="center" prop="isSplit" label="是否分账" :formatter="filterisSplitOptions"></el-table-column>
            <el-table-column align="center" prop="openDate" label="开通时间" :formatter="filterFormDate"></el-table-column>
             <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <a class="link" @click="changeIsOpen(scope)">{{scope.row.isOpen==='13900001'?'关闭':'开通'}}</a>
                    <router-link :to="{path:'/capChannel/add',query:{id: scope.row.id}}" class="link" v-if="isEdit">查看</router-link>
                    <a class="link" @click="toDel(scope)" v-if="isDel">删除</a>
                </template>
            </el-table-column>
        </el-table>
        <div class="pag-index">
            <el-pagination 
                style="margin-top:20px;" 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" 
                :current-page="listData.pageNo" 
                :page-sizes="[10, 20, 30, 50]" 
                :page-size="listData.pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="listData.totalSize"
            >
            </el-pagination>
        </div>
        <el-dialog title="新增业务" :visible.sync="addDialogVisible" center width="40%" style="padding: 0px 10px">
            <el-form :model="addForm" style="padding: 0px 10px" :rules="rules" ref="addForm" label-width="120px">
                <el-form-item label="所属资方" prop="fundsName">
                    <el-input type="text" v-model="params.fundsName" placeholder="所属资方" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="业务名称" prop="bizName">
                    <el-input type="text" v-model="addForm.bizName" placeholder="业务名称"></el-input>
                </el-form-item>
                <el-form-item label="业务类型" prop="bizType">
                    <el-select v-model="addForm.bizType" placeholder="请选择业务类型">
                        <el-option
                            v-for="item in bizTypeOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资金渠道编号" prop="chanNo">
                    <el-input type="text" v-model="addForm.chanNo" placeholder="资金渠道编号"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addChannel">提 交</el-button>
                <el-button @click='$refs["addForm"].resetFields();addDialogVisible=false'>取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getBtnAuth } from "@/assets/js/utils.js";
import _ from "underscore";
export default {
    data() {
        return {
            params:{
                fundsNo:this.$route.query.fundsNo,
                fundsName:'',
                fundsAddr:'',
                fundsType:'',
                signAssets:'',
                isOpen:'13900001'//默认开通
            },
            codeParam:{
                list: [              
                    {
                        type: "Acc_Type"//签约资产方
                    },
                    {
                        type: "Goods_Type"//业务类型
                    },
                    {
                        type: "Is_No"//是否
                    },
                    {
                        type: "Open_Acct_Mode"//开户类型
                    },
                    {
                        type: "Open_Acct_Node"//开户环节
                    },
                    {
                        type: "Sign_Mode"//签章模式
                    },
                                                     
                ]
            },
            btnAuth: this.$route.meta.btnAuth,
            listData: {}, // 分页信息
            tableData: [], // 表格信息
            assetsOptions:[],//签约资产方
            accTypeOptions:[],//资方类型
            bizTypeOptions:[],//业务类型
            isNoOptions:[],//是否
            openTypeOptions:[],//开户类型
            openNodeOptions:[],//开户环节
            signModeOptions:[],//签章模式
            disAbleChange: true,
            isChange: true,
            addDialogVisible: false,
            addForm: {
                bizName:'',
                chanNo:'',
                bizType:'',
            },
            rules:{
                bizName: [
                    { required: true, message: '请输入业务名称', trigger: 'blur' },
                    { max: 10, message: '长度不超过10个字符', trigger: 'blur' }
                ],
                bizType:[
                    { required: true, message: '请选择业务类型', trigger: 'blur' }
                ],
                chanNo:[
                    { required: true, message: '请输入资金渠道编号', trigger: 'blur' }
                ]
            },
            temporaryData:{}
        }
    },
    computed: {
        isAdd(){
            return getBtnAuth("fund:fund:chan:addChanInfo"); 
        },
        isEdit(){
            return getBtnAuth("fund:fund:chan:updateChanInfo");
        },
        isDel(){
            return getBtnAuth("fund:fund:chan:deleteChanInfo");
        }
    },
    mounted() {
        this.getCodeList()
    },
    methods: {  
        initData(){
            this.getTable() 
            this.getAssets()
            this.getData()               
        },
        getData(){
            this.$axios.post("/api/bycx-fund-service/fund/getFundInfo", {fundsNo:this.$route.query.fundsNo})
            .then(res => {
            let {code,msg,data} = res.data
            if (code == "0000") {
                this.params = data
            }else{
                if(msg)this.$message.error(msg)
            }
            });
        },
        getTable(){
            this.$axios.post("/api/bycx-fund-service/fund/chan/getChanInfos", {params:{fundsNo:this.params.fundsNo}})
            .then(res => {
            let {code,msg,result} = res.data
            if (code == "0000") {
                this.listData = res.data;
                this.tableData = result;
            }else{
                if(msg)this.$message.error(msg)
            }
            });
        },
        getCodeList(){
            this.$axios.post('/api/bycx-drainage-service/aSysAtt/mobile/query',{params:this.codeParam})
            .then(res => {
                let {code,msg,result} = res.data
                if (code == "0000") {
                    let {Acc_Type, Goods_Type, Is_No, Open_Acct_Mode, Open_Acct_Node, Sign_Mode} = result;
                    this.accTypeOptions = Acc_Type 
                    this.bizTypeOptions = Goods_Type 
                    this.isNoOptions = Is_No
                    this.openTypeOptions = Open_Acct_Mode
                    this.openNodeOptions = Open_Acct_Node
                    this.signModeOptions = Sign_Mode 
                    this.initData()                   
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
        editInfo(){
            this.disAbleChange=false;
            this.isChange=false
            this.temporaryData = _.clone(this.params) 
        },
        changeInfo(){
            this.$axios.post('/api/bycx-fund-service/fund/updateFundInfo',this.params)
            .then(res => {
                let {code,msg,result} = res.data
                this.isChange=true
                this.disAbleChange=true
                if (code == "0000") {
                    this.$message.success(msg)
                }else{
                    this.params = this.temporaryData
                    if(msg) {
                        this.$message.error(msg)
                    }
                }
            })
        },
        addChannel(){
            this.$refs['addForm'].validate((valid) => {
                if (valid) {
                    this.addForm.fundsNo = this.params.fundsNo
                    this.$axios.post('/api/bycx-fund-service/fund/chan/addChanInfo',this.addForm)
                    .then(res => {
                        let {code,msg,result} = res.data
                        if (code == "0000") {
                            this.$message.success(msg)
                            this.addDialogVisible = false
                            this.getTable()
                            this.$refs["addForm"].resetFields()
                        }else{
                            if(msg) {
                                this.$message.error(msg)
                            }
                        }
                    })
                }
            })
        },
        toDel(scope){
            this.$confirm(`确认删除？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-fund-service/fund/chan/deleteChanInfo',{
                    id: scope.row.id
                }).then(res => {
                    if (res.data.code == "0000") {
                        this.tableData.splice(scope.$index,1)
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        changeIsOpen(scope){
            this.$axios.post('/api/bycx-fund-service/fund/chan/updateOpenStat',{
                id: scope.row.id,
                isOpen: scope.row.isOpen === '13900001'?'13900002':'13900001'
            }).then(res => {
                if (res.data.code == "0000") {
                    this.$message.success('开通成功')
                    this.getTable()
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleSizeChange(val) {
            this.query.pageSize = val;
            this.getQuery();
        },
        handleCurrentChange(val) {
            this.query.pageNo = val;
            this.getQuery();
        },  
        filterBizTypeOptions(row){
            return _.filter(this.bizTypeOptions, (item) => { return (item.valCode === row.bizType)})[0].valName
        },  
        filterisOpenOptions(row){
            if(row.isOpen){
                return _.filter(this.isNoOptions, (item) => { return (item.valCode === row.isOpen)})[0].valName
            }
        },    
        filterOpenTypeOptions(row){
            if(row.openType){
                return _.filter(this.openTypeOptions, (item) => { return (item.valCode === row.openType)})[0].valName
            }
        },
        filterOpenNodeOptions(row){
            if(row.openNode){
                return _.filter(this.openNodeOptions, (item) => { return (item.valCode === row.openNode)})[0].valName
            }
        },
        filterSignModeOptions(row){
            if(row.signMode){
                return _.filter(this.signModeOptions, (item) => { return (item.valCode === row.signMode)})[0].valName
            }
        }, 
        filterisSplitOptions(row){
            if(row.isSplit){
                return _.filter(this.isNoOptions, (item) => { return (item.valCode === row.isSplit)})[0].valName
            }
        },
        filterFormDate (row) {
            if(row.openDate){
                let date = new Date(row.openDate);
                let year = date.getFullYear();
                let month = this.padDate(date.getMonth() + 1);
                let day = this.padDate(date.getDate());
                let hours = this.padDate(date.getHours());
                let minutes = this.padDate(date.getMinutes());
                //返回整理好的数据
                return year + '-' + month + '-' + day + '  ' + hours + ':' + minutes;
            }
        },
        padDate (value) {
            return value < 10 ? '0' + value : value;
        }        
    }
}
</script>
