<style lang="less">
</style>

<template>
    <div>
        <el-col :span="2" :offset="22" class="text-right">
            <el-button type="primary" @click="toAdd" v-if="isSave" icon="el-icon-plus">新增</el-button>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="appId" label="AppID"></el-table-column>
            <el-table-column align="center" prop="secret" label="AppSecret"></el-table-column>
            <el-table-column align="center" prop="version" label="版本号"></el-table-column>
            <el-table-column align="center" prop="httpUrl" label="请求地址"></el-table-column>
            <el-table-column align="center" prop="customerNo" label="客户编号"></el-table-column>
            <el-table-column align="center" prop="sendEmail" label="账户"></el-table-column>
            <el-table-column align="center" prop="sendName" label="账户名"></el-table-column>
            <el-table-column align="center" prop="sendMobile" label="管理手机号"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <a class="link" @click="openEdit(scope)" v-if="isSave">编辑</a>
                    <a class="link" @click="del(scope)" v-if="isDel">删除</a>
                </template>
            </el-table-column>

        </el-table>

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

        <el-dialog :title="title" :visible.sync="addConfigView" width="45%">
            <el-row>
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
                    <el-col :span="11">
                        <el-form-item label="AppId" prop="appId">
                            <el-input v-model="ruleForm.appId" placeholder="AppId" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="1">
                        <el-form-item label="AppSecret" prop="secret">
                            <el-input v-model="ruleForm.secret" placeholder="AppSecret" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="版本号" prop="version">
                            <el-input v-model="ruleForm.version" placeholder="版本号" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="1">
                        <el-form-item label="请求地址" prop="httpUrl">
                            <el-input v-model="ruleForm.httpUrl" placeholder="请求地址" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="客户编号" prop="customerNo">
                            <el-input v-model="ruleForm.customerNo" placeholder="客户编号" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="1">
                        <el-form-item label="账户" prop="sendEmail">
                            <el-input v-model="ruleForm.sendEmail" placeholder="账户" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="账户名" prop="sendName">
                            <el-input v-model="ruleForm.sendName" placeholder="账户名" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="1">
                        <el-form-item label="管理手机号" prop="sendMobile">
                            <el-input v-model="ruleForm.sendMobile" placeholder="管理手机号" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div slot="footer" class="text-center">
                <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
                <el-button @click="addConfigView = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getBtnAuth,checkPhone } from '@/assets/js/utils.js'

export default {
    data() {
        return {
            query:{
                params: {
                    id: ""
                },
                isPage:true,
                pageNo: 1,
                pageSize: 10
            },
            nameQuery:{
                params: {
                    userName:'',
                    userType:''
                },
                isPage:true,
                pageNo: 1,
                pageSize: 10
            },
            ruleForm:{
                appId:'',//平台id
                secret:'',//AppSecret
                version:'',//法大大版本号（默认2.0）
                httpUrl:'',//法大大请求地址
                customerNo:'',//客户编号（非常重要）
                sendEmail:'',//法大大账户
                sendName:'',//法大大账户名
                sendMobile:'',//法大大管理手机号
            },
            rules: {
                appId: [
                    { required: true, message: '请输入appId', trigger: 'blur' }
                ],
                secret: [
                    { required: true, message: '请输入AppSecret', trigger: 'blur' }
                ],
                version: [
                    { required: true, message: '请选择版本号', trigger: 'blur' }
                ],
                httpUrl: [
                    { required: true, message: '请输入请求地址', trigger: 'blur' }
                ],
                customerNo: [
                    { required: true, message: '请输入客户编号', trigger: 'blur' }
                ],
                sendEmail: [
                    { required: true, message: '请输入账户', trigger: 'blur' },
                    { type:'email', message: '邮箱格式不正确', trigger: 'blur' }
                ],
                sendName: [
                    { required: true, message: '请输入帐户名', trigger: 'blur' }
                ],
                sendMobile: [
                    { required: true,validator:checkPhone, trigger: 'blur' }
                ]
            },
            listData:{},
            tableData: [],
            contract_Type:[],
            nameOptions:[],
            title: '',
            addConfigView:false,
            activeName:'info'
        };
    },
    computed:{
        isSave(){
            return getBtnAuth("syst:aSysFddConf:save")
        },
        isDel(){
            return getBtnAuth("syst:aSysFddConf:deleteById")
        }
    },
    mounted() {
        this.getQuery()
    },
    methods: {
        getQuery(){
            this.$axios.post("/api/bycx-contract-service/aSysFddConf/getList", this.query)
                .then(res => {
                    if (res.data.code == "0000") {
                		this.listData = res.data
                    	this.tableData = res.data.result
                    }
                });
        },
        handleSizeChange (val) {
            this.query.pageSize = val
            this.getQuery()
        },
        handleCurrentChange (val) {
            this.query.pageNo = val
            this.getQuery()
        },
        del(scope){
            this.$confirm(`确认删除该配置？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-contract-service/aSysFddConf/deleteById',{params: {
                    id:scope.row.id
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.tableData.splice(this.tableData.findIndex(item => item.id === scope.row.id), 1)
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        toAdd(){
            for(let item in this.ruleForm){
                this.ruleForm[item] = ''
            }
            this.title = "新增配置"
            this.addConfigView = true
        },
        openEdit(scope){
            this.query.params.id = scope.row.id
            this.$axios.post("/api/bycx-contract-service/aSysFddConf/getList", this.query)
            .then(res => {
                if (res.data.code == "0000") {
                    this.ruleForm = res.data.result[0]
                    this.title = "编辑配置"
                    this.addConfigView = true
                }
            });
        },
        submit(formName){
        	this.$refs[formName].validate((valid) => {
	            if (valid) {
	            	this.$axios.post('/api/bycx-contract-service/aSysFddConf/save',{params: this.ruleForm})
	            	.then(res => {
	                    if (res.data.code == "0000") {
	                        this.addConfigView = false
                            this.query.params.id = ''
	                        this.getQuery()
	                    }else{
	                        this.$message.error(res.data.msg)
	                    }
	                    
	                })
	            }
	        })
        }
    }
};
</script>
