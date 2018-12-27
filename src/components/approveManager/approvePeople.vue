<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="24">
            <el-form :inline="true">
                <el-form-item label="审批组名称">
                    <el-input placeholder="请输入" v-model="query.params.groupName"></el-input>
                </el-form-item>
                <el-form-item label="审批组编号">
                    <el-input placeholder="请输入" v-model="query.params.groupNo"></el-input>
                </el-form-item>
                <el-form-item label="员工编号">
                    <el-input placeholder="请输入" v-model="query.params.loginName"></el-input>
                </el-form-item>
                <el-form-item label="员工名称">
                    <el-input placeholder="请输入" v-model="query.params.userName"></el-input>
                </el-form-item>
                <el-form-item label="在线状态">
                    <el-select v-model="query.params.apprStat" placeholder="请选择">    
                        <el-option
                        v-for="item in apprStatOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getQuery('init')">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="loginName" label="员工编号"></el-table-column>
            <el-table-column align="center" prop="userName" label="员工名称"></el-table-column>
            <el-table-column align="center" prop="apprStat" label="在线状态" :formatter="filterApprStatOptions"></el-table-column>
            <el-table-column align="center" prop="groupName" label="所在审批组"></el-table-column>
            <el-table-column align="center" prop="groupNo" label="审批组编号"></el-table-column>
            <el-table-column align="center" prop="instDate" label="插入时间" :formatter="filterInstDateOptions"></el-table-column>
            <el-table-column align="center" prop="updtDate" label="最近签到时间" :formatter="filterUpdtDateOptions"></el-table-column>
            <el-table-column align="center" label="操作"  fixed="right" :show-overflow-tooltip="true" min-width='150px'>
                <template slot-scope="scope">
                    <a class="link" @click="updateForm(scope.row)">编辑</a>
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
        <el-dialog title="修改人员状态" :visible.sync="dialogVisible" center width="40%" style="padding: 0px 10px">
            <el-form :model="updateJson" style="padding: 0px 10px" :rules="rules" ref="updateJson" label-width="120px">
                <el-form-item label="员工编号" prop="loginName">
                    <el-input type="text" v-model="updateJson.loginName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="员工名称" prop="userName">
                    <el-input type="text" v-model="updateJson.userName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="在线状态" prop="apprStat">
                    <el-select v-model="updateJson.apprStat" placeholder="请选择">    
                        <el-option
                        v-for="item in apprStatOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmForm">保存修改</el-button>
                <el-button @click='$refs["updateJson"].resetFields();dialogVisible=false'>取 消</el-button>
            </div>
        </el-dialog>
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
            codeParam:{
                list: [              
                    {
                        type: "Appr_Stat"//审批状态
                    }
                ]
            },
            dialogVisible: false,
            updateJson:{
                loginName:'',
                userName:'',
                apprStat:''
            },
            rules: {
                apprStat: [
                    { required: true, message: '请选择', trigger: 'blur' },
                ]
            }
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
                    groupName:'',
                    groupNo:'',
                    loginName:'',
                    userName:'',
                    apprStat:''
                }
            }  
            this.getQuery()
        },  
        getCodeList(){
            this.$axios.post('/api/bycx-drainage-service/aSysAtt/mobile/query',{params:this.codeParam})
            .then(res => {
                let {code,msg,result} = res.data
                if (code == "0000") {
                    let {Appr_Stat} = result;
                    this.apprStatOptions = Appr_Stat 
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
            .post("/api/bycx-appr-service/cApApprStaffMsg/getApprSignMsgList", this.query)
            .then(res => {
                if (res.data.code == "0000") {
                    this.listData = res.data;
                    this.tableData = res.data.result;
                }
            });
        },
        updateForm(row){
            this.$axios
            .post("/api/bycx-appr-service/cApApprStaffMsg/getApprSignMsgList", {params:{loginName:row.loginName}})
            .then(res => {
                if (res.data.code == "0000") {
                    this.updateJson = res.data.result[0];
                    this.dialogVisible = true
                }
            });
        },
        confirmForm(){
            this.$refs['updateJson'].validate((valid) => {
                if (valid) {
                    this.$axios
                    .post("/api/bycx-appr-service/cApApprStaffMsg/save", {params:this.updateJson})
                    .then(res => {
                        if (res.data.code == "0000") {
                            this.dialogVisible = false
                            this.getQuery('init')
                        }
                    });
                }
            });
        },
        resetForm() {
            this.initData()
        },
        handleSizeChange: function (val) {
            this.query.pageNo = 1
            this.query.pageSize = val
            this.getQuery()
        },
        handleCurrentChange: function (val) {
            this.query.pageNo = val
            this.getQuery()
        },
        filterApprStatOptions(row){
            if(row.apprStat){
                return _.filter(this.apprStatOptions, (item) => { return (item.valCode === row.apprStat)})[0].valName
            }
        },
        filterInstDateOptions (row) {
            if(row.instDate){
                let date = new Date(row.instDate);
                return this.formDate(date)
            }
        },
        filterUpdtDateOptions(row){
            if(row.updtDate){
                let date = new Date(row.updtDate);
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
