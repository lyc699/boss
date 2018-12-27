<style lang="less" scoped>
.el-select{
    width: 100%
}
</style>

<template>
    <div id="content">
        <el-col :span="16">
            <el-form :inline="true">
                <el-form-item label="公章名称：">
                    <el-input placeholder="请输入公章名称" v-model="query.params.userName"></el-input>
                </el-form-item>
                <el-form-item label="公章归属：">
                    <el-select placeholder="请选择" v-model="query.params.type">
                        <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in contract_Type" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电子签章渠道">
                    <el-select placeholder="请选择" v-model="query.params.elecSignType">
                        <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in elec_sing_type" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getQuery">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="2" :offset="6" class="text-right">
            <el-button type="primary" @click="toAdd" v-if="isSave" icon="el-icon-plus">新增</el-button>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="userName" label="公章名称"></el-table-column>
            <el-table-column align="center" prop="type" label="公章归属" :formatter="formatType"></el-table-column>
            <el-table-column align="center" prop="email" label="关联邮箱"></el-table-column>
            <el-table-column align="center" prop="phoneNo" label="关联手机号"></el-table-column>
            <el-table-column align="center" prop="imgType" label="图片类型"></el-table-column>
            <el-table-column align="center" prop="imgName" label="图片名称"></el-table-column>
            <el-table-column align="center" prop="elecSignType" label="电子签章渠道" :formatter="formatElecType"></el-table-column>
            <el-table-column align="center" prop="stat" label="渠道上传" :formatter="formatStat"></el-table-column>
            <el-table-column align="center" prop="isNo" label="是否启用" :formatter="formatIsNo"></el-table-column>
            <el-table-column align="center" label="操作" width="250px">
                <template slot-scope="scope">
                    <a class="link" @click="openEdit(scope)" v-if="isSave">修改</a>
                    <a class="link" @click="changeStatus(scope)" v-if="isSave">{{scope.row.isNo == '13900001' ? '禁用' : '启用'}}</a>
                    <a class="link" @click="uploadSign(scope)" v-if="scope.row.stat == '13900002' && isUpload">公章上传</a>
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

        <el-dialog :title="title" :visible.sync="showAddSign" width="40%" class="autoDialog">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
                <el-col :span="24"> 
                	<el-form-item>
                	<el-upload
					  class="uploadSeal box"
					  :data="uploadJson"
					  :headers="headerConfig"
					  action="/api/bycx-contract-service/aSysContrFile/upload/ContrFile"
					  :on-success="resUpload"
					  :limit="1"
					  :file-list="fileList">
					  <el-button size="medium" type="primary">上传公章图片</el-button>
                      <p>{{uploadName}}</p>
					</el-upload>
					</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="签章名称" prop="userName">
                        <el-input v-model="ruleForm.userName" placeholder="签章名称"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="ruleForm.email" placeholder="邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="电子签章渠道" prop="elecSignType">
                    	<el-select placeholder="请选择" v-model="ruleForm.elecSignType">
                            <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in elec_sing_type" :key="index"></el-option>
                       </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="公章归属" prop="type">
                        <el-select placeholder="请选择" v-model="ruleForm.type">
                            <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in contract_Type" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phoneNo">
                        <el-input v-model="ruleForm.phoneNo" placeholder="手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用" prop="isNo">
                        <el-select placeholder="是否启用" v-model="ruleForm.isNo">
                            <el-option label="启用" value="13900001"></el-option>
                            <el-option label="禁用" value="13900002"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form>
            <div slot="footer" class="text-center">
                <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
                <el-button @click="showAddSign = false">取 消</el-button>
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
                    userName:'',
                    type:'',
                    elecSignType:''
                },
                isPage:true,
                pageNo: 1,
                pageSize: 10
            },
            ruleForm:{
                "userName": "",//名称
                "type": "", //类型(码类：Contract_Type)
                "email": "",//邮箱
                "phoneNo": "",//手机号
                "imgType": "",//图片类型 （png,jpg）
                "imgName": "", //图片名称
                "userType": "",//用户类型
                "fileId": "", //公章文件ID
                "isNo": "", //是否启用
                "elecSignType": "", //签约类型 30700003 发大大；30700001 上上签
                "id": "" //公章id
            },
            rules: {
                userName: [
                    { required: true, message: '请输入公章名称', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择公章归属', trigger: 'change' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type:'email', message: '格式不正确', trigger: 'blur' }
                ],
                phoneNo: [
                    { required: true, validator:checkPhone, trigger: 'blur' }
                ],
                elecSignType: [
                    { required: true, message: '请选择电子签章渠道', trigger: 'change' }
                ],
                isNo: [
                    {required: true,message: "请选择是否启用",trigger: "change"}
                ]
            },
            listData:{},
            tableData: [],
            contract_Type:[],
            elec_sing_type:[],
            title: '',
            showAddSign:false,
            uploadJson:{
            	"useType": "SIGNAT",//文件使用类型：签章：SIGNAT ；合同：CONTRACT 必传
            	"fileId": ""//上传文件id(当更新时必传) 非传
            },
            headerConfig: {
            	Authorization: localStorage.getItem('token')
            },
            fileList: [],
            uploadName:''
        };
    },
    computed:{
        isUpload(){
            return getBtnAuth("syst:aSysOfficialSeal:uploadSign")
        },
        isSave(){
            return getBtnAuth("syst:aSysOfficialSeal:save")
        }
    },
    mounted() {
        this.codeQuery()
    },
    methods: {
        codeQuery(){
            this.$axios.post('/api/bycx-rece-service/api/sys/code/mobile/query',{params: {
                 "list": [
                    {
                        "type": "Contract_Type"
                    },
                    {
                        "type": "ELEC_SIGN_TYPE"
                    }
                ]
            }}).then(res => {
                if (res.data.code == "0000") {
                    this.contract_Type = res.data.result.Contract_Type;
                    this.elec_sing_type = res.data.result.ELEC_SIGN_TYPE;
                    this.getQuery()
                }
            })
        },
        formatType(row){
            for(let item of this.contract_Type){
                if(item.valCode == row.type){
                    return item.valName
                }
            }
        },
        getQuery(){
            this.$axios
                .post("/api/bycx-contract-service/aSysOfficialSeal/getList", this.query)
                .then(res => {
                    if (res.data.code == "0000") {
                        this.listData = res.data;
                        this.tableData = res.data.result;
                    }
                });
        },
        formatStat(row){
            return row.stat == '13900001' ? '是' : '否'
        },
        formatIsNo(row){
            return row.isNo == '13900001' ? '启用' : '禁用'
        },
        formatElecType(row){
        	for(let item of this.elec_sing_type){
                if(item.valCode == row.elecSignType){
                    return item.valName
                }
            }
        },
        dateChange(val){            
            if(val){
                this.query.params.instDateMin = val[0]
                this.query.params.instDateMax = val[1]
            }else{
                this.query.params.instDateMin = ''
                this.query.params.instDateMax = ''              
            }
        },
        handleSizeChange (val) {
            this.query.pageSize = val
            this.getQuery()
        },
        handleCurrentChange (val) {
            this.query.pageNo = val
            this.getQuery()
        },
        resetForm() {
            for(let item in this.query.params){
                this.query.params[item] = ''
            }
            this.getQuery()
        },
        toAdd(){
            for(let item in this.ruleForm){
                this.ruleForm[item] = ''
            }
            this.fileList = []
            this.uploadName = ''
            this.title = "新增公章"
            this.showAddSign = true
        },
        openEdit(scope){
            this.ruleForm = JSON.parse(JSON.stringify(scope.row));
            this.title = "编辑公章信息"
            this.fileList = []
            this.uploadName = this.ruleForm.imgName
            this.showAddSign = true
        },
        uploadSign(scope){
            this.$axios.post('/api/bycx-contract-service/aSysOfficialSeal/uploadSign',{params: scope.row})
            .then(res => {
                if(res.data.code == '0000'){
                	this.$message({
			            message: '公章上传成功',
			            type: 'success'
                    })
                    scope.row.stat = '13900001'
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        resUpload(res) {
            if (res.code == 200) {
                this.ruleForm.imgType = res.data.fileType
                this.ruleForm.imgName = res.data.fileName
                this.ruleForm.fileId = res.data.fileId
            } else {
                this.fileList = []
                this.$message.error(res.msg);
            }
        },
        changeStatus(scope) {
            let params = JSON.parse(JSON.stringify(scope.row));

            params.isNo = params.isNo == "13900001" ? "13900002" : "13900001";

            this.$axios
                .post(
                    "/api/bycx-contract-service/aSysOfficialSeal/save",
                    { params: params }
                )
                .then(res => {
                    if (res.data.code == "0000") {
                        this.tableData.map(
                            item =>
                                item.id == params.id
                                    ? (item.isNo = params.isNo)
                                    : ""
                        );
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
        },
        submit(formName){
        	this.$refs[formName].validate((valid) => {
	            if (valid) {
	            	if(!this.ruleForm.imgName){
	            		this.$message.error("请上传公章图片")
	            		return false
	            	}
	            	this.$axios.post('/api/bycx-contract-service/aSysOfficialSeal/save',{params: this.ruleForm})
		            .then(res => {
		            	
		                if(res.data.code == '0000'){
                            this.fileList = []
		                	this.showAddSign = false
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
