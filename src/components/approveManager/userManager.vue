<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="24">
            <el-form :inline="true">
                <el-form-item label="用户姓名">
                    <el-input placeholder="请输入" v-model="query.params.userName"></el-input>
                </el-form-item>
                <el-form-item label="登录名">
                    <el-input placeholder="请输入" v-model="query.params.loginName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getQuery('init')">查询</el-button>
                    <el-button @click="resetForm(initData)">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col clsss="pb20">
            <el-button type="primary" @click="toAdd"><i class="el-icon-plus">新增</i></el-button>
            <el-button type="primary" @click="toDel"><i class="el-icon-delete">删除</i></el-button>
        </el-col>
        <el-table :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column align="center" prop="userName" label="用户姓名"></el-table-column>
            <el-table-column align="center" prop="loginName" label="登录名"></el-table-column>
        </el-table>

        <div class="pag-index">
            <el-pagination 
                style="margin-top:20px;" 
                @size-change="handleSizeChange(listData,initData,$event)" 
                @current-change="handleCurrentChange(listData,initData,$event)" 
                :current-page="listData.pageNo" 
                :page-sizes="[10, 20, 30, 50]" 
                :page-size="listData.pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="listData.totalSize"
            >
            </el-pagination>
        </div>
        <el-dialog title="添加组员" :visible.sync="dialogVisible" center width="80%" style="padding: 0px 10px">
            <el-form :inline="true">
                <el-form-item label="用户姓名">
                    <el-input placeholder="请输入" v-model="allData.userName"></el-input>
                </el-form-item>
                <el-form-item label="登录名">
                    <el-input placeholder="请输入" v-model="allData.loginName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getAllQuery('init')">查询</el-button>
                    <el-button @click="resetForm(getAllQuery,true)">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="allTableData" index ref="multipleTable" @selection-change="handleSelectionUser">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column align="center" prop="userName" label="用户姓名"></el-table-column>
                <el-table-column align="center" prop="loginName" label="登录名"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addUser">添 加</el-button>
                <el-button @click='dialogVisible=false'>取 消</el-button>
            </div>
            <div class="pag-index">
                <el-pagination 
                    style="margin-top:20px;" 
                    @size-change="handleSizeChange(allListData,getAllQuery,$event)" 
                    @current-change="handleCurrentChange(allListData,getAllQuery,$event)" 
                    :current-page="allListData.pageNo" 
                    :page-sizes="[10, 20, 30, 50]" 
                    :page-size="allListData.pageSize" 
                    layout="total, sizes, prev, pager, next, jumper" 
                    :total="allListData.totalSize"
                >
                </el-pagination>
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
            guideChannelOptions:[],
            multipleSelection: [],
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
            dialogVisible: false,
            rules:{},
            allTableData:[],
            allListData:{},
            selectionUser:[],
            allData:{
                userName:'',
                loginName:''
            }
        };
    },
    mounted() {
        this.initData()
    },
    methods: {
        initData(){
            this.query={
                isPage:true,
                pageNo: this.listData.pageNo||1,
                pageSize: this.listData.pageSize||10,
                params:{
                    groupNo: this.$route.query.groupNo,
                    currentLoginName:localStorage.userNo
                }
            }  
            this.getQuery()
        },    
        getQuery(isIntPage){
            if(isIntPage==='init'){
                this.query.pageNo = 1
            }
            this.$axios
            .post("/api/bycx-appr-service/aSysUserOrg/getList", this.query)
            .then(res => {
                if (res.data.code == "0000") {
                    this.listData = res.data;
                    this.tableData = res.data.result;
                }
            });
        },
        getAllQuery(isIntPage){
            if(isIntPage==='init'){
                this.allListData.pageNo = 1
            }
            let query={
                isPage:true,
                pageNo: this.allListData.pageNo||1,
                pageSize: this.allListData.pageSize||10,
                params:{
                    currentLoginName:localStorage.userNo,
                    userName: this.allData.userName,
                    loginName: this.allData.loginName
                }
            }  
            this.$axios
            .post("/api/bycx-appr-service/aSysUserOrg/getList", query)
            .then(res => {
                if (res.data.code == "0000") {
                    this.allListData = res.data;
                    this.allTableData = res.data.result;
                }
            });
        },
        toAdd(){
            this.allListData.pageNo = 1
            this.allListData.pageSize = 10
            this.getAllQuery()
            this.dialogVisible = true
        },
        toDel(){
            if(this.multipleSelection.length){
                this.$confirm(`确认删除该用户？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let loginNameList = _.map(this.multipleSelection,item=>{
                        return item.userId
                    })
                    let data = {
                        groupNo: this.$route.query.groupNo,
                        loginNameList: loginNameList.join(',')
                    }
                    this.$axios.post('/api/bycx-appr-service/aSysGroupUser/removeUserFromGroup',{params: data}).then(res => {
                        if (res.data.code == "0000") {
                            this.getQuery('init')
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                })
            }else{
                this.$message.error('请选择用户')
            }
        },
        addUser(){
            if(this.selectionUser.length){
                let loginNameList = _.map(this.selectionUser,item=>{
                    return item.userId
                })
                let data = {
                    groupNo: this.$route.query.groupNo,
                    groupName: this.$route.query.groupName,
                    loginNameList: loginNameList.join(',')
                }
                this.$axios.post('/api/bycx-appr-service/aSysGroupUser/save',{params: data})
                .then(res => {
                    if (res.data.code == "0000") {
                        this.dialogVisible = false
                        this.getQuery('init')
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            }else{
                this.$message.error('请选择用户')
            }
        },
        handleSizeChange(listName, methodName, val) {
            listName.pageNo = 1
            listName.pageSize = val
            methodName()
        },
        handleCurrentChange(listName, methodName, val) {
            listName.pageNo = val
            methodName()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSelectionUser(val) {
            this.selectionUser = val;
        },
        resetForm(methodName,isClear) {
            if(isClear){
                this.allData.userName = ''
                this.allData.loginName = ''
            }
            methodName()
        }
    }
};
</script>
