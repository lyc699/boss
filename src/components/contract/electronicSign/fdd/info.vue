<style lang="less" scoped>
.el-select,.el-cascader{
    width: 100%
}
</style>

<template>
    <div>
        <el-col :span="2" :offset="22" class="text-right">
            <el-button type="primary" @click="toAdd" v-if="isAdd" icon="el-icon-plus">新增</el-button>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="name" label="机构/个人名称"></el-table-column>
            <el-table-column align="center" prop="email" label="注册账号（email）"></el-table-column>
            <el-table-column align="center" prop="linkMobile" label="注册手机号"></el-table-column>
            <el-table-column align="center" prop="linkMan" label="联系人姓名"></el-table-column>
            <el-table-column align="center" prop="userType" label="用户类型" :formatter="formatType"></el-table-column>
            <el-table-column align="center" prop="cerNo" label="证书号"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <a class="link" @click="openEdit(scope)" v-if="isEdit">编辑</a>
                    <!--<a class="link" @click="uploadSign(scope)">删除</a>-->
                </template>
            </el-table-column>
			
        </el-table>
		<img :src="img" />
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

        <el-dialog class="autoDialog" :title="title" :visible.sync="addActView" width="560px">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="115px">
                <el-col :span="12">
                    <el-form-item label="用户类型" prop="userType">
                        <el-select placeholder="请选择" v-model="ruleForm.userType" @change="typeChange">
                        	<el-option v-for="item in actOptions"
						      :key="item.valCode"
						      :label="item.valName"
						      :value="item.valCode">
						    </el-option>
                            <!--<el-option label="个人" value="38200001"></el-option>
                            <el-option label="机构" value="38200002"></el-option>-->
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                	 <el-form-item label="使用证书密码" prop="password">
                        <el-input v-model="ruleForm.password" placeholder="使用证书密码" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                	<el-form-item label="机构/个人名称" prop="name">
                        <el-select placeholder="请选择" v-model="ruleForm.name" @change="nameChange" @focus="selectName">
                        	<el-option v-for="item in nameOptions"
                        	  :key="item.value"
						      :label="item.name"
						      :value="item.name">
						    </el-option>
                        </el-select>
                   </el-form-item>
            	</el-col>
            	<el-col :span="12">
            		<el-form-item label="注册账号" prop="email">
                        <el-input v-model="ruleForm.email" placeholder="注册账号" clearable></el-input>
                   </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号" prop="linkMobile">
                        <el-input v-model="ruleForm.linkMobile" placeholder="手机号" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                	<el-form-item label="身份证号" prop="linkIdCode">
                        <el-input v-model="ruleForm.linkIdCode" placeholder="身份证号" clearable></el-input>
                    </el-form-item>
            	</el-col>
                <el-col :span="12">
                    <el-form-item label="工商注册号" prop="icCode">
                        <el-input v-model="ruleForm.icCode" placeholder="工商注册号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="税务登记证号" prop="taxCode">
                        <el-input v-model="ruleForm.taxCode" placeholder="税务登记证号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="省份" prop="province">
                        <el-input v-model="ruleForm.province" placeholder="省份" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                	<el-form-item label="组织机构代码" prop="orgCode">
                        <el-input v-model="ruleForm.orgCode" placeholder="组织机构代码" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="联系人姓名" prop="linkMan">
                        <el-input v-model="ruleForm.linkMan" placeholder="联系人姓名" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="城市" prop="city">
                        <el-input v-model="ruleForm.city" placeholder="城市" clearable></el-input>
                    </el-form-item>
                </el-col>
                <!--<el-col :span="24">
                	<el-form-item label="省/市/区" prop="city">
                        <el-cascader :options="adressOptions" separator="-" :props="props" v-model="selectedOptions2" @change="handleChange"></el-cascader>
                    </el-form-item>
            	</el-col>-->
                <el-col :span="24">
                	<el-form-item label="详细地址" prop="address">
                        <el-input v-model="ruleForm.address" placeholder="详细地址" clearable></el-input>
                    </el-form-item>
            	</el-col>
            </el-form>
            <div slot="footer" class="text-center">
                <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
                <el-button @click="addActView = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getBtnAuth,checkPhone,checkIdCard } from '@/assets/js/utils.js'
import address from '@/data/address.json'

export default {
    data() {
        return {
            address: address,
            area: [],
            adressOptions:[],
            props: {
                value: 'value',
                label: 'name',
                children: 'children',
            },
            query:{
                params: {
                    userName:'',
                    userType:''
//                  type:''
                },
                isPage:true,
                pageNo: 1,
                pageSize: 10
            },
            actOptions: [
//	            {
//			        value: '38200001',
//			        label: '个人'
//		        }, {
//		            value: '38200002',
//		            label: '机构'
//		        }
	        ],
	        nameOptions: [],
            ruleForm:{
                "userType": "",//用户类型 （38200001个人，38200002机构 ）
                "name": "",//机构(个人)名称
                "email": "",//邮箱
                "linkMobile": "",//手机号
                "password": "",//使用证书密码6-20位
                "linkIdCode": "",//身份证号
                "icCode": "",//工商注册号(企业用户必填)
                "linkMan": "",//联系人姓名(企业用户必填)
                "orgCode": "",//组织机构代码(企业用户必填)
                "taxCode": "",//税务登记证号(企业用户必填)
                "province": "",//省份
                "city": "",//城市
				"address": "",//详细地址
				"id": ""
            },
            rules: {
                userType: [
                    { required: true, message: '请选择用户类型', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请选择机构(个人)名称', trigger: 'change' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type:'email', message: '格式不正确', trigger: 'blur' }
                ],
                linkMobile: [
                    { required: true,validator:checkPhone, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入使用证书密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6-20位', trigger: 'blur' }
                ],
                linkIdCode: [
                    { required: true, validator:checkIdCard, trigger: 'blur' }
                ],
                icCode: [
                    { required: true, message: '请输入工商注册号', trigger: 'blur' }
                ],
                linkMan: [
                    { required: true, message: '请输入联系人姓名', trigger: 'blur' }
                ],
                orgCode: [
                    { required: true, message: '请输入组织机构代码', trigger: 'blur' }
                ],
                taxCode: [
                    { required: true, message: '请输入税务登记证号', trigger: 'blur' }
                ],
                province: [
                    { required: true, message: '请输入省份', trigger: 'blur' },
                ],
                city: [
                    { required: true, message: '请输入城市', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                ]
            },
            listData:{},
            tableData: [],
//          contract_Type:[],
            selectedOptions2:[],
//          date:'',
            addActView:false,
            title: "",
            img: ''
        };
    },
    computed:{
        isAdd(){
            return getBtnAuth("syst:apply:CA.int")
        },
//      isDel(){
//          return getBtnAuth("syst:aSysRole:editRole")
//      },
        isEdit(){
            return getBtnAuth("syst:apply:CA.int")
        }
    },
    mounted() {
    	this.codeQuery()
        this.getQuery()
        this.initAreasData()
        this.img = ''
    },
    methods: {
        codeQuery(){
            this.$axios.post('/api/bycx-rece-service/api/sys/code/mobile/query',{params: {
                 "list": [
                    {
                        "type": "Ssq_Account_Type"
                    }
                ]
            }}).then(res => {
                if (res.data.code == "0000") {
                    this.actOptions = res.data.result.Ssq_Account_Type;
                }
            })
        },
        formatType(row){
            return row.userType == '38200001' ? '个人' : '机构' 
        },
        getQuery(){
        	this.query.params = {
        		userType: '',
        		userName:''
        	}
            this.$axios.post("/api/bycx-contract-service/aSysSsqAccount/getList", this.query)
                .then(res => {
                	console.log(res)
                    if (res.data.code == "0000") {
                    	this.listData = res.data;
                        this.tableData = res.data.result;
                    }else{
	                    this.$message.error(res.data.msg)
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
        	this.title = "新增账户"
        	this.addActView = true
        },
        typeChange() {
//      	this.query.params.userType = this.ruleForm.userType.slice(-1)
        	this.query.params.userType = this.ruleForm.userType
            this.$axios.post("/api/bycx-contract-service/aSysSsqAccount/getList", this.query)
            .then(res => {
                if (res.data.code == "0000") {
                	this.nameOptions = res.data.result
                }else{
                    this.$message.error(res.data.msg)
                }
            });
      	},
      	selectName() {
      		if(this.nameOptions.length === 0){
      			this.$message.error("请先选择用户类型")
      		}
      	},
      	nameChange() {
      		this.query.params.userName = this.ruleForm.name
      		this.query.params.userType = this.ruleForm.userType
            this.$axios.post("/api/bycx-contract-service/aSysSsqAccount/getList", this.query)
            .then(res => {
                if (res.data.code == "0000") {
                	this.ruleForm.email = res.data.result[0].email
        			this.ruleForm.linkMobile = res.data.result[0].linkMobile
                }else{
                    this.$message.error(res.data.msg)
                }
            });
      	},
        openEdit(scope){
        	this.query.params.userType = scope.row.userType
        	this.query.params.id = scope.row.id
            this.$axios.post("/api/bycx-contract-service/aSysSsqAccount/getList", this.query)
            .then(res => {
                if (res.data.code == "0000") {
                    this.ruleForm = res.data.result[0]
                    this.title = "编辑账户信息"
            		this.addActView = true
            		this.query.params.id = ''
            		this.typeChange()
                }else{
                    this.$message.error(res.data.msg)
                }
            });
        },
        initAreasData () {
            this.address.map(stepOne => {
                if (stepOne.parent === '0') {
                    stepOne.children = []

                    this.address.map(stepTwo => {
                        if (stepTwo.parent === stepOne.value) {
                            stepTwo.children = []
                            
                            this.address.map(stepThree => {
                                if (stepThree.parent === stepTwo.value) {
                                    stepTwo.children.push(stepThree)
                                }
                            })
                            stepOne.children.push(stepTwo)
                        }
                    })
                    this.adressOptions.push(stepOne)
                }
            })
        },
        submit(formName){
        	console.log(this.ruleForm)
        	this.$refs[formName].validate((valid) => {
	            if (valid) {
	            	this.$axios.post('/api/bycx-contract-service/aSysSsqAccount/apply/CA.int',{params: this.ruleForm})
	            	.then(res => {
	                    if (res.data.code == "0000") {
	                        this.addActView = false
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
