<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="24">
            <el-form :inline="true">
                <el-form-item label="贷款编号">
                    <el-input placeholder="请输入" v-model="query.params.loanNo"></el-input>
                </el-form-item>
                <el-form-item label="客户姓名">
                    <el-input placeholder="请输入" v-model="query.params.custName"></el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                    <el-input placeholder="请输入" v-model="query.params.certNo"></el-input>
                </el-form-item>
                <el-form-item label="审批状态">
                    <el-select v-model="query.params.apprStat" placeholder="请选择">    
                        <el-option
                        v-for="item in apprStatOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valName">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="引流渠道">
                    <el-input placeholder="请输入" v-model="query.params.channelCode"></el-input>
                </el-form-item>
                <!-- <el-form-item label="处理人">
                    <el-input placeholder="请输入" v-model="query.params.chanNo"></el-input>
                </el-form-item> -->
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getQuery('init')">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="loanNo" label="贷款编号"></el-table-column>
            <el-table-column align="center" prop="custName" label="客户姓名"></el-table-column>
            <el-table-column align="center" prop="certNo" label="客户身份证号"></el-table-column>
            <el-table-column align="center" prop="applyDate" label="申请时间" :formatter="filterApplyDateOptions"></el-table-column>
            <el-table-column align="center" prop="apprStat" label="审批状态" :formatter="filterApprStatOptions"></el-table-column>
            <el-table-column align="center" prop="channelCode" label="引流渠道" :formatter="filterGuideChannelOptions"></el-table-column>
            <el-table-column align="center" prop="userName" label="处理人"></el-table-column>
            <el-table-column align="center" prop="apprDate" label="审批时间" :formatter="filterApprDateOptions"></el-table-column>
            <el-table-column align="center" prop="remark" label="备注"></el-table-column>
            <el-table-column align="center" label="操作"  fixed="right" :show-overflow-tooltip="true" min-width='150px'>
                <template slot-scope="scope">
                    <router-link :to="{path:'/approveDetail',query:{loanNo:scope.row.loanNo}}" class="link">审批</router-link>
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
    </div>
</template>

<script>
import { getBtnAuth } from '@/assets/js/utils.js'
import _ from 'underscore'
export default {
    data() {
        return {
            query:{
                params:{}
            },
            listData:{},
            tableData: [],
            apprStatOptions: [],
            guideChannelOptions:[],
            codeParam:{
                list: [              
                    {
                        type: "Case_Appr_Stat"//审批状态
                    },
                    {
                        type: "Guide_Channel"//引流渠道
                    }
                ]
            },
        };
    },
    mounted() {
        this.getCodeList()
    },
    methods: {
        initData(){
            this.query={
                isPage:true,
                pageNo: 1,
                pageSize: 10,
                params:{
                    loanNo:'',
                    custName:'',
                    certNo:'',
                    apprStat:'',
                    channelCode:'',
                    userNo: localStorage.userNo
                }
            }  
            this.getQuery()
        },  
        getCodeList(){
            this.$axios.post('/api/bycx-drainage-service/aSysAtt/mobile/query',{params:this.codeParam})
            .then(res => {
                let {code,msg,result} = res.data
                if (code == "0000") {
                    let {Case_Appr_Stat, Guide_Channel} = result;
                    this.apprStatOptions = Case_Appr_Stat 
                    this.guideChannelOptions = Guide_Channel
                    this.initData()                   
                }else{
                    if(msg) this.$message.error(msg)
                }
            })
        },        
        getQuery(isIntPage){
            if(isIntPage==='init'){
                this.query.pageNo = 1
            }
            this.$axios
                .post("/api/bycx-appr-service/cApApprPushRecord/getMyApproveList", this.query)
                .then(res => {
                    if (res.data.code == "0000") {
                        this.listData = res.data;
                        this.tableData = res.data.result;
                    }
                });
        },
        handleSizeChange(val) {
            this.query.pageNo = 1
            this.query.pageSize = val
            this.getQuery()
        },
        handleCurrentChange(val) {
            this.query.pageNo = val
            this.getQuery()
        },
        toAdd(){
            this.$router.push('/channel/add')
        },
        toDel(scope){
            this.$confirm(`确认删除？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-syst-service/aSysDrainChan/delDrainChan',{params: {
                    chanNo: scope.row.chanNo
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.tableData.splice(this.tableData.findIndex(item => item.id === scope.row.id), 1)
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        resetForm() {
            this.initData()
        },
        filterApprStatOptions(row){
            if(row.apprStat){
                return _.filter(this.apprStatOptions, (item) => { return (item.valCode === row.apprStat)})[0].valName
            }
        },
        filterGuideChannelOptions(row){
            if(row.channelCode){
                return _.filter(this.guideChannelOptions, (item) => { return (item.valCode === row.channelCode)})[0].valName
            }
        },
        filterApplyDateOptions (row) {
            if(row.applyDate){
                let date = new Date(row.applyDate);
                return this.formDate(date)
            }
        },
        filterApprDateOptions(row){
            if(row.apprDate){
                let date = new Date(row.apprDate);
                return this.formDate(date)
            }
        },
        formDate(date){
            let year = date.getFullYear();
            let month = this.padDate(date.getMonth() + 1);
            let day = this.padDate(date.getDate());
            let hours = this.padDate(date.getHours());
            let minutes = this.padDate(date.getMinutes());
            //返回整理好的数据
            return year + '-' + month + '-' + day + '  ' + hours + ':' + minutes;
        },
        padDate (value) {
            return value < 10 ? '0' + value : value;
        }  
    }
};
</script>
