<style lang="less">
</style>

<template>
    <div>
        <el-col :span="2" :offset="22" class="text-right">
            <el-button type="primary" @click="toAdd" v-if="isAdd" icon="el-icon-plus">新增</el-button>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="sendNaem" label="机构/公司名称"></el-table-column>
            <el-table-column align="center" prop="mid" label="开发者编号"></el-table-column>
            <el-table-column align="center" prop="privateKey" label="私钥" :formatter="formatKey"></el-table-column>
            <el-table-column align="center" prop="sendEmail" label="注册账号（email）"></el-table-column>
            <el-table-column align="center" prop="sendMobile" label="注册手机号"></el-table-column>
            <el-table-column align="center" prop="sxDays" label="合同有效期"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <a class="link" @click="openEdit(scope)" v-if="isEdit">编辑</a>
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

        <el-dialog class="autoDialog" :title="title" :visible.sync="addConfigView" width="560px">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="70px">
            	<el-col :span="23">
                	<el-form-item label="账户名" prop="sendNaem">
                        <el-select placeholder="请选择" v-model="ruleForm.sendNaem" @change="nameChange" style="width: 100%;">
                        	<el-option v-for="item in nameOptions"
                        	  :key="item.value"
						      :label="item.name"
						      :value="item.name">
						    </el-option>
                        </el-select>
                   </el-form-item>
            	</el-col>
                <el-col :span="11">
                    <el-form-item label="账号" prop="sendEmail">
                        <el-input v-model="ruleForm.sendEmail" placeholder="账号" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="1">
                    <el-form-item label="手机号" prop="sendMobile">
                        <el-input v-model="ruleForm.sendMobile" placeholder="手机号" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="公钥" prop="mid">
                        <el-input v-model="ruleForm.mid" placeholder="公钥" clearable></el-input>
                    </el-form-item>
            	</el-col>
            	<el-col :span="23">
                	<el-form-item label="私钥" prop="privateKey">
                        <el-input type="textarea" :rows="6" v-model="ruleForm.privateKey" placeholder="私钥" clearable></el-input>
                    </el-form-item>
            	</el-col>
            	<el-col :span="11">
                    <el-form-item label="有效期" prop="sxDays">
                        <el-input v-model="ruleForm.sxDays" placeholder="有效期" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
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
                    sendEmail: "",
			        sendNaem: "",
			        sendMobile: ""
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
                "mid": "",//上上签公钥
                "privateKey": "",//上上签私钥
                "sendNaem": "",//上上签账户名
                "sendEmail": "",//上上签账户
                "sendMobile": "",//注册手机号
                "sxDays": ""//有效期
            },
            rules: {
                mid: [
                    { required: true, message: '请输入公钥', trigger: 'blur' }
                ],
                privateKey: [
                    { required: true, message: '请输入私钥', trigger: 'blur' }
                ],
                sendNaem: [
                    { required: true, message: '请选择账户名', trigger: 'change' }
                ],
                sendEmail: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type:'email', message: '格式不正确', trigger: 'blur' }
                ],
                sendMobile: [
                    { required: true,validator:checkPhone, trigger: 'blur' }
                ],
                sxDays: [
                    { required: true, message: '请输入有效期', trigger: 'blur' },
                ]
            },
            listData:{},
            tableData: [],
            contract_Type:[],
            nameOptions:[],
//          date:'',
            title: '',
            addConfigView:false,
            activeName:'info'
        };
    },
    computed:{
        isAdd(){
            return getBtnAuth("syst:aSysSsqConf:ssqConfSave")
        },
        isDel(){
            return getBtnAuth("syst:aSysSsqConf:deleteById")
        },
        isEdit(){
            return getBtnAuth("syst:aSysSsqConf:ssqConfSave")
        }
    },
    mounted() {
        this.getQuery()
    },
    methods: {
        formatKey(row){
            return row.privateKey.substr(0,20) + '...'
        },
        getQuery(){
        	this.query.params.sendNaem = ''
        	this.query.params.sendEmail = ''
        	this.query.params.sendMobile = ''
            this.$axios.post("/api/bycx-contract-service/aSysSsqConf/getList", this.query)
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
        toAdd(){
            for(let item in this.ruleForm){
                this.ruleForm[item] = ''
            }
            this.title = "新增机构/个人配置"
            this.addConfigView = true
            this.getName()
        },
        getName() {
        	this.nameQuery.params.userType = '38200002'
            this.$axios.post("/api/bycx-contract-service/aSysSsqAccount/getList", this.nameQuery)
            .then(res => {
                if (res.data.code == "0000") {
                	this.nameOptions = res.data.result
                }else{
                    this.$message.error(res.data.msg)
                }
            });
      	},
        nameChange() {
      		this.nameQuery.params.userName = this.ruleForm.sendNaem
      		this.nameQuery.params.userType = '38200002'
            this.$axios.post("/api/bycx-contract-service/aSysSsqAccount/getList", this.nameQuery)
            .then(res => {
                if (res.data.code == "0000") {
                	this.ruleForm.sendEmail = res.data.result[0].email
        			this.ruleForm.sendMobile = res.data.result[0].linkMobile
                }else{
                    this.$message.error(res.data.msg)
                }
            });
      	},
        openEdit(scope){
        	this.query.params.sendNaem = scope.row.sendNaem
        	this.query.params.sendEmail = scope.row.sendEmail
        	this.query.params.sendMobile = scope.row.sendMobile
            this.$axios.post("/api/bycx-contract-service/aSysSsqConf/getList", this.query)
            .then(res => {
                if (res.data.code == "0000") {
                    this.ruleForm = res.data.result[0]
                    this.title = "编辑机构/个人配置"
                    this.addConfigView = true
                }
            });
        },
        uploadSign(scope){
            this.$axios.post('/api/bycx-contract-service/aSysChanSsq/uploadSign',{params: scope.row}).then(res => {
                
            })
        },
        del(scope){
            this.$confirm(`确认删除该配置？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-contract-service/aSysSsqConf/deleteById',{params: {
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
        submit(formName){
        	this.$refs[formName].validate((valid) => {
	            if (valid) {
	            	this.$axios.post('/api/bycx-contract-service/aSysSsqConf/ssqConfSave',{params: this.ruleForm})
	            	.then(res => {
	                    if (res.data.code == "0000") {
	                        this.addConfigView = false
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
