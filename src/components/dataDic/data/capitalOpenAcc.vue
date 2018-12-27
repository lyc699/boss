<template>
    <div id="content">
        <el-table :data="tableData">
            <el-table-column align="center" prop="valName" label="资方"></el-table-column>
            <el-table-column align="center" prop="entryName" label="关联资产方"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <a class="link" @click="toQuery(scope)">查看</a>
                    <a class="link" @click="toConfig(scope)" v-if="isEdit">配置</a>
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
        
        <el-dialog :title="title" class="autoDialog" :visible.sync="configView" width="560px">
            <el-form label-width="80px" :model="ruleForm" ref="ruleForm">
            	<el-radio-group v-model="radioCheck">
    				<el-radio :label="item.valCode" :disabled="isDisabled" v-for="(item,index) in itemData" :key="index" @click.native.prevent="clickitem(item.valCode)">{{item.valName}}</el-radio>
    			</el-radio-group>
            </el-form>
            <div slot="footer" class="text-center">
            	<el-button type="primary" @click="configView = false" v-if="isDisabled">确定</el-button>
                <el-button type="primary" @click="submit()" v-else>确定</el-button>
                <el-button @click="configView = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getBtnAuth } from '@/assets/js/utils.js'

export default {
    data() {
        return {
            listData:{},
            tableData: [],
            configJson: {  //召回业务模式进件配置回显请求参数
            	"typeCode":"",
				"accountCode":""
            },
            ruleForm: {  //召回业务模式进件配置提交参数
            	"valCode": "",
            	"accountCode": ""
            },
            title: '',
            isDisabled: false,
            itemData: [],
            radioCheck: '',
            configView: false
        };
    },
    computed:{
        isQuery(){
        	return getBtnAuth("syst:aSysCodeInfo:queryList")
        },
        isEdit(){
            return getBtnAuth("syst:aSysCapitalConf:saveCapitalConf")
        }
    },
    mounted() {
        this.getQueryList()
    },
    methods: {
        getQueryList: function(){
            this.$axios.post("/api/bycx-syst-service/aSysCapitalConf/queryCapitalList", {"params":{}})
            .then(res => {
                if (res.data.code == "0000") {
                    this.listData = res.data
                    this.tableData = res.data.result
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
        toQuery(scope){
        	this.isDisabled = true
        	this.getConfigItem(scope)
        },
        toConfig(scope){
        	this.isDisabled = false
        	this.getConfigItem(scope)
        },
        getConfigItem(scope){
        	this.configJson.accountCode = scope.row.entryCode
        	this.configJson.typeCode = "Open_Acct_Node"
        	this.ruleForm.valCode = scope.row.valCode
        	this.title = scope.row.valName + "--资产方配置"
        	this.$axios.post("/api/bycx-syst-service/aSysCodeInfo/findList", {params:this.configJson})
            .then(res => {
                if (res.data.code == "0000") {
                	this.itemData = res.data.result
                	this.radioCheck = scope.row.entryCode
                    this.configView = true
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleSelectionChange(val) {
	        this.multipleSelection = val;
	    },
	    clickitem (e) {
			e === this.radioCheck ? this.radioCheck = 'empty' : this.radioCheck = e
			console.log(this.radioCheck)
	    },
        submit(){
            this.ruleForm.accountCode = this.radioCheck
        	console.log(this.ruleForm)
        	this.$axios.post('/api/bycx-syst-service/aSysCapitalConf/saveCapitalConf',{params: this.ruleForm})
            .then(res => {
                if(res.data.code == '0000'){
                	this.configView = false
                	this.$message({
			            message: this.title.replace('--',"") + '成功',
			            type: 'success'
			        })
                	this.getQueryList()
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        }
    }
};
</script>