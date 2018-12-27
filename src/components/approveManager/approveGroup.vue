<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="24">
            <el-form :inline="true">
                <el-form-item label="审批组编号">
                    <el-input placeholder="请输入" v-model="query.params.groupNo"></el-input>
                </el-form-item>
                <el-form-item label="审批组名称">
                    <el-input placeholder="请输入" v-model="query.params.groupName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getQuery('init')">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col clsss="pb20">
            <el-button type="primary" @click="toAdd(false)"><i class="el-icon-plus">新增</i></el-button>
            <a></a>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="groupNo" label="审批组编号"></el-table-column>
            <el-table-column align="center" prop="groupName" label="审批组名称"></el-table-column>
            <el-table-column align="center" prop="functionMode" label="业务模式" :formatter="filterModelOptions"></el-table-column>
            <el-table-column align="center" prop="remark" label="备注"></el-table-column>
            <el-table-column align="center" prop="updtDate" label="最后修改时间" :formatter="filterUpdtDateOptions"></el-table-column>
            <el-table-column align="center" label="操作"  fixed="right" :show-overflow-tooltip="true" min-width='150px'>
                <template slot-scope="scope">
                    <router-link class="link" :to="{path:'/approveGroup/userManager',query:{groupNo:scope.row.groupNo,groupName:scope.row.groupName}}">用户管理</router-link>
                    <a class="link" @click="toAdd(scope)" >编辑</a>
                    <a class="link" @click="toDel(scope)">删除</a>
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" center width="40%" style="padding: 0px 10px">
            <el-form :model="updateJson" style="padding: 0px 10px" :rules="rules" ref="updateJson" label-width="120px">
                <el-form-item label="组编号" prop="groupName">
                    <el-input type="text" v-model="updateJson.groupName"></el-input>
                </el-form-item>
                <el-form-item label="组名称" prop="groupNo">
                    <el-input type="text" v-model="updateJson.groupNo"></el-input>
                </el-form-item>
                <el-form-item label="业务模式" prop="functionMode">
                    <el-select v-model="updateJson.functionMode" placeholder="请选择">    
                        <el-option
                        v-for="item in modelOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="stat">
                    <el-select v-model="updateJson.stat" placeholder="请选择">    
                        <el-option
                        v-for="item in isNoOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="text" v-model="updateJson.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmForm">保存</el-button>
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
            modelOptions: [],
            isNoOptions: [],
            codeParam:{
                list: [              
                    {
                        type: "Product_Function_Model"//功能模式
                    },
                    {
                        type: "Is_No"//是否启用
                    }
                ]
            },
            dialogVisible: false,
            updateJson:{
                groupNo:'',
                groupName:'',
                functionMode:'',
                remark:'',
                stat:''
            },
            dialogTitle:'',
            rules:{
                groupNo: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                groupName: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                functionMode: [
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                stat: [
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
                    groupNo:'',
                    groupName:'',
                    functionMode:'',
                    remark:'',
                    updtDate:''
                }
            }  
            this.getQuery()
        },  
        getCodeList(){
            this.$axios.post('/api/bycx-drainage-service/aSysAtt/mobile/query',{params:this.codeParam})
            .then(res => {
                let {code,msg,result} = res.data
                if (code == "0000") {
                    let {Product_Function_Model, Is_No} = result;
                    this.modelOptions = Product_Function_Model 
                    this.isNoOptions = Is_No
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
            .post("/api/bycx-appr-service/aSysUserGroup/getList", this.query)
            .then(res => {
                if (res.data.code == "0000") {
                    this.listData = res.data;
                    this.tableData = res.data.result;
                }
            });
        },
        confirmForm(){
            this.$refs['updateJson'].validate((valid) => {
                if (valid) {
                    this.$axios
                    .post("/api/bycx-appr-service/aSysUserGroup/save", {params: this.updateJson})
                    .then(res => {
                        if (res.data.code == "0000") {
                            let msg = this.updateJson.id?'修改成功':'新增成功'
                            this.$message.success(msg)
                            this.getQuery('init')
                            this.dialogVisible = false
                        }
                    });
                }
            });
        },
        toAdd(scope){
            this.updateJson = {
                groupNo:'',
                groupName:'',
                functionMode:'',
                remark:'',
                stat:''
            },
            this.dialogTitle = scope?'修改':'新增'
            if(scope){
                this.$axios
                .post("/api/bycx-appr-service/aSysUserGroup/getOne", {params: {groupNo:scope.row.groupNo}})
                .then(res => {
                    if (res.data.code == "0000") {
                        this.updateJson = _.pick(res.data.result,'id','groupNo','groupName','functionMode','remark','stat');
                    }
                });
            }
            this.dialogVisible = true
        },
        toDel(scope){
            this.$confirm(`确认删除该用户组？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-appr-service/aSysUserGroup/deleteById',{params: {
                    id: scope.row.id
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.tableData.splice(this.tableData.findIndex(item => item.id === scope.row.id), 1)
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            })
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
        resetForm() {
            this.initData()
        },
        filterModelOptions(row){
            if(row.functionMode){
                return _.filter(this.modelOptions, (item) => { return (item.valCode === row.functionMode)})[0].valName
            }
        },
        filterUpdtDateOptions(row){
            if(row.updtDate){
                let date = new Date(row.updtDate);
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
};
</script>
