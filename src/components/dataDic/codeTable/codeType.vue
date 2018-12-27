<template>
    <div id="content">
        <el-col :span="11">
            <el-form :inline="true">
            	<el-form-item label="码类名称：">
                    <el-input placeholder="请输入码类名称" v-model="queryJson.typeName" clearable></el-input>
                </el-form-item>
                <el-form-item label="码类编码：">
                    <el-input placeholder="请输入码类编码" v-model="queryJson.typeCode" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getQuery">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="2" :offset="11" class="text-right">
            <el-button type="primary" @click="toAdd" v-if="isAdd">+新增</el-button>
        </el-col>
        <el-table :data="tableData">
        	<el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column align="center" prop="typeName" label="码类名称"></el-table-column>
            <el-table-column align="center" prop="typeCode" label="码类编码"></el-table-column>
            <el-table-column align="center" prop="remark" label="备注"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <router-link :to="{path:'/codeType/codeVal',query:{typeCode:scope.row.typeCode}}" class="link" v-if="isQuery">查看</router-link>
                    <!--<router-link :to="{path:'/codeType/addType',query:{id:scope.row.id}}" class="link" v-if="isEdit">编辑</router-link>-->
                    <a class="link" @click="editType(scope)" v-if="isEdit">编辑</a>
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
        
        <el-dialog class="autoDialog" :title="title" :visible.sync="addTypeView" width="560px">
            <el-form label-width="80px" :model="codeJson" :rules="rules" ref="codeJson">
                <el-col :span="11">
                    <el-form-item label="码类名称" prop="typeName">
                        <el-input placeholder="码类名称" v-model="codeJson.typeName" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="1">
                    <el-form-item label="码类编码" prop="typeCode">
                        <el-input placeholder="码类编码" v-model="codeJson.typeCode" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="备注">
                        <el-input type="textarea" :rows="3" placeholder="备注" v-model="codeJson.remark" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
            <div slot="footer" class="text-center">
                <el-button type="primary" @click="submit('codeJson')">确定</el-button>
                <el-button @click="addTypeView = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getBtnAuth } from '@/assets/js/utils.js'

export default {
    data() {
        return {
            queryJson:{
            	"isPage":true, //是否分页，true表示分页，false不分页	必填
	            "pageNo": 1,//当前页码	必填
	            "pageSize":10,//每页展示条数	必填
	            "order":"instDate",//排序字段	必填
	            "orderDesc":"desc",//排序方式，desc表示降序，asc表示升序	必填
	            "typeName":"",//码类名称
	            "typeCode":"",//码类编码
	            "id":""//id
            },
            rules: {
            	typeCode: [
                    { required: true, message: '请输入码类编号', trigger: 'blur' }
                ],
                typeName: [
                    { required: true, message: '请输入码类名称', trigger: 'blur' }
                ]
            },
            listData:{},
            tableData: [],
            codeJson:{
                typeName: '',//码类名称；必须
                typeCode: '',//码类编码；必须
                status: '13900001',
                remark: ''//备注
            },
            title: '',
            addTypeView: false
        };
    },
    computed:{
        isAdd(){
            return getBtnAuth("syst:aSysCodeType:saveCodeType")
        },
        isQuery(){
        	return getBtnAuth("syst:aSysCodeInfo:queryList")
        },
        isEdit(){
            return getBtnAuth("syst:aSysCodeType:updateCodeType")
        },
        isDel(){
            return getBtnAuth("syst:aSysCodeType:delCodeTypeByIds")
        }
    },
    mounted() {
    	console.log(this.$route.meta)
        this.getQueryList()
    },
    methods: {
        getQueryList: function(){
            this.$axios.post("/api/bycx-syst-service/aSysCodeType/codeTypeList", {"params":this.queryJson})
            .then(res => {
//              	console.log(res)
                if (res.data.code == "0000") {
                    this.listData = res.data;
                    this.tableData = res.data.result;
                }else{
                    this.$message.error(res.data.msg)
                }
            });
        },
        getQuery: function(){
        	this.getQueryList()
        },
        handleSizeChange: function (val) {
            this.queryJson.pageSize = val
            this.getQueryList()
        },
        handleCurrentChange: function (val) {
            this.queryJson.pageNo = val
            this.getQueryList()
        },
        toAdd(){
        	for(let item in this.codeJson){
                this.codeJson[item] = ''
            }
        	this.codeJson.status = '13900001'
            this.title = "新增码类"
        	this.addTypeView = true
        },
        editType(scope){
//      	this.id = scope.row.id
        	this.$axios.post("/api/bycx-syst-service/aSysCodeType/getCodeTypeById", {params:{id:scope.row.id}})
            .then(res => {
            	console.log(res)
                if (res.data.code == "0000") {
                    this.codeJson = res.data.result
                    this.title = "编辑码类"
                    this.addTypeView = true
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        submit(formName){
        	let url = '/api/bycx-syst-service/aSysCodeType/saveCodeType'
            if(this.codeJson.id){
                url = '/api/bycx-syst-service/aSysCodeType/updateCodeType'
            }
           
			this.$refs[formName].validate((valid) => {
				 console.log(this.$refs[formName])
	            if (valid) {
	            	this.$axios.post(url,{params: this.codeJson})
		            .then(res => {
		            	
		                if(res.data.code == '0000'){
		                	this.addTypeView = false
		                    this.getQueryList()
		                }else{
		                    this.$message.error(res.data.msg)
		                }
		            })
	            }
	        })
        },
        resetForm() {
            this.queryJson.typeName = ''
            this.queryJson.typeCode = ''
            this.getQueryList()
        },
        del(scope){
            this.$confirm(`确认删除码类 [ ${scope.row.typeName} ]？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-syst-service/aSysCodeType/delCodeTypeByIds',{params: {
                    id:scope.row.id
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.tableData.splice(this.tableData.findIndex(item => item.id === scope.row.id), 1)
                        this.getQueryList()
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            })
        }
    }
};
</script>
