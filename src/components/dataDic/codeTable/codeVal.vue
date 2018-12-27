<template>
    <div id="content">
        <el-col :span="11">
            <el-form :inline="true">
            	<el-form-item label="码值名称：">
                    <el-input placeholder="请输入码值名称" v-model="queryJson.params.valName" clearable></el-input>
                </el-form-item>
                <el-form-item label="码值编号：">
                    <el-input placeholder="请输入码值编号" v-model="queryJson.params.valCode" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getQuery">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="2" :offset="11" class="text-right">
            <!--<el-button type="primary" @click="toAdd" v-if="isAdd">+新增</el-button>-->
            <el-button type="primary" @click="toAdd">+新增</el-button>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="num" label="序号"></el-table-column>
            <el-table-column align="center" prop="typeCode" label="码类"></el-table-column>
            <el-table-column align="center" prop="valName" label="码值名称"></el-table-column>
            <el-table-column align="center" prop="valCode" label="码值编码"></el-table-column>
            <el-table-column align="center" prop="stateNeme" label="启用" :formatter="formatStat"></el-table-column>
            <el-table-column align="center" prop="remark" label="备注"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <!--<router-link :to="{path:'/codeType/addVal',query:{id:scope.row.id}}" class="link" v-if="isEdit">编辑</router-link>-->
                    <a class="link" @click="editVal(scope)" v-if="isEdit">编辑</a>
                    <a class="link" @click="del(scope)" v-if="isDel">删除</a>
                    <!--<router-link :to="{path:'/codeType/codeVal/addVal',query:{id:scope.row.id,typeCode:scope.row.typeCode}}" class="link">编辑</router-link>-->
                     <!--<a class="link" @click="editVal(scope)">编辑</a>
                    <a class="link" @click="del(scope)">删除</a>-->
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
        
        <el-dialog class="autoDialog" :title="title" :visible.sync="addValView" width="560px">
            <el-form label-width="80px" :model="valJson" :rules="rules" ref="valJson">
            	<el-col :span="11">
            		<el-form-item label="码值名称" prop="valName">
                        <el-input placeholder="码值名称" v-model="valJson.valName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="码值编码" prop="valCode">
                        <el-input placeholder="码值编码" v-model="valJson.valCode" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="1">
                    <el-form-item label="所属码类" prop="typeCode">
                        <el-input placeholder="所属码类" v-model="valJson.typeCode" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用" prop="status">
                        <el-radio v-model="valJson.status" label="13900001">是</el-radio>
  						<el-radio v-model="valJson.status" label="13900002">否</el-radio>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="备注">
                        <el-input type="textarea" :rows="3" placeholder="备注" v-model="valJson.remark" clearable></el-input>
                    </el-form-item>
                </el-col>        
            </el-form>
            <div slot="footer" class="text-center">
                <el-button type="primary" @click="submit('valJson')">确定</el-button>
                <el-button @click="addValView = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getBtnAuth } from '@/assets/js/utils.js'

export default {
    data() {
        return {
//			id:this.$route.query.id,
			queryJson:{
                params: {},
                pageNo: 1,
                pageSize: 10
            },
            dataJson: {
            	"id": "",	//码值ID
				"valName": "",	//码值名称
				"valCode": "",	//码值编码
				"typeCode": "", //码类编码
            },
            valJson: {
            	valName: '',//码值名称；必须
                valCode: '',//码值编码；必须
                status: '', //状态；必须；码值：13900001-是，13900001-否
                typeCode: '',//码类编码；必须
                remark: ''//备注
            },
            rules: {
            	valName: [
                    { required: true, message: '请输入码值名称', trigger: 'blur' }
                ],
                valCode: [
                    { required: true, message: '请输入码值编号', trigger: 'blur' }
                ],
                typeCode: [
                    { required: true, message: '请输入所属码类编号', trigger: 'blur' }
                ],
                status:[
                	{ required: true, message: '请选择是否启用', trigger: 'blur' }
                ]
            },
            listData:{},
            tableData: [],
            title: '',
            addValView: false
        };
    },
    computed:{
        isAdd(){
            return getBtnAuth("syst:aSysCodeInfo:addCodeInfo")
        },
        isEdit(){
            return getBtnAuth("syst:aSysCodeInfo:editCodeInfo")
        },
        isDel(){
            return getBtnAuth("syst:aSysCodeInfo:delCodeInfo")
        }
    },
    mounted() {
    	console.log(this.$route.meta)
    	if(this.$route.query.typeCode){
    		this.dataJson.typeCode = this.$route.query.typeCode
    		this.valJson.typeCode = this.$route.query.typeCode
    	}
        this.getQueryList()
        
//      if(this.valJson.id){
        	this.$route.meta.title = "码值管理"
        	document.title = "码值管理"
//      }else{
//      	this.$route.meta.title = "新增码值"
//      	document.title = "新增码值"
//      }
    },
    methods: {
    	formatStat(row){
            return row.status == '13900001' ? '是' : '否'
        },
        getQueryList: function(){
        	this.queryJson.params = this.dataJson
            this.$axios.post("/api/bycx-syst-service/aSysCodeInfo/queryList", this.queryJson)
            .then(res => {
//              	console.log(res)
                if (res.data.code == "0000") {
                    this.listData = res.data;
                    this.tableData = res.data.result;
                    for(let i=0;i<this.tableData.length;i++){
                    	this.tableData[i].num = i+1
                    }
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
        	for(let item in this.valJson){
                this.valJson[item] = ''
            }
        	this.valJson.typeCode = this.$route.query.typeCode
            this.title = "新增码值"
        	this.addValView = true
        },
        editVal(scope){
        	for(let item in this.valJson){
                this.valJson[item] = ''
            }
        	this.valJson.id = scope.row.id
//      	this.valJson.typeCode = scope.row.typeCode
        	this.queryJson.params = this.valJson
        	this.$axios.post("/api/bycx-syst-service/aSysCodeInfo/queryList", this.queryJson)
            .then(res => {
                	console.log(res)
                if (res.data.code == "0000") {
                    this.valJson = res.data.result[0]
                    this.title = "编辑码值"
                    this.addValView = true
                }else{
                    this.$message.error(res.data.msg)
                }
            });
        },
        submit(formName){
            let url = '/api/bycx-syst-service/aSysCodeInfo/addCodeInfo'
            if(this.valJson.id){
                url = '/api/bycx-syst-service/aSysCodeInfo/editCodeInfo'
            }
            console.log(this.valJson)
			this.$refs[formName].validate((valid) => {
	            if (valid) {
	            	this.$axios.post(url,{params: this.valJson})
		            .then(res => {
		                if(res.data.code == '0000'){
		                	this.addValView = false
		                	this.getQueryList()
//		                	this.$router.push({path:'/codeType/codeVal',query:{typeCode:this.$route.query.typeCode}})
		                }else{
		                    this.$message.error(res.data.msg)
		                }
		            })
	            }
	        })
            
        },
        resetForm() {
            this.queryJson.params.valName = ''
            this.queryJson.params.valCode = ''
            this.getQueryList()
        },
        del(scope){
        	console.log(scope)
            this.$confirm(`确认删除码值 [ ${scope.row.valName} ]？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-syst-service/aSysCodeInfo/delCodeInfo',{params: {
                    codeIds:scope.row.id
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
