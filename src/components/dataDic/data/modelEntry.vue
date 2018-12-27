<template>
    <div id="content">
        <el-table :data="tableData">
            <el-table-column align="center" prop="valName" label="模式名称"></el-table-column>
            <el-table-column align="center" prop="entryNum" label="进件项"></el-table-column>
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
            	<el-checkbox-group v-model="checkList">
				    <el-checkbox :label="item.valName" :disabled="isDisabled" v-for="(item,index) in itemData" :key="index"></el-checkbox>
			    </el-checkbox-group>
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
				"entryCode":""
            },
            ruleForm: {  //召回业务模式进件配置提交参数
            	"valCode": "",
            	"entryCode": ""
            },
            title: '',
            isDisabled: false,
            itemData: [],
            checkList: [],
            valueList: [],
            configView: false
        };
    },
    computed:{
        isQuery(){
        	return getBtnAuth("syst:aSysCodeInfo:queryList")
        },
        isEdit(){
            return getBtnAuth("syst:aSysModeConf:saveEntryConf")
        }
    },
    mounted() {
        this.getQueryList()
    },
    methods: {
        getQueryList: function(){
            this.$axios.post("/api/bycx-syst-service/aSysModeConf/queryModeEntryList", {"params":{}})
            .then(res => {
                if (res.data.code == "0000") {
                    this.listData = res.data
                    this.tableData = res.data.result
                    for(let i=0;i<this.tableData.length;i++){
                    	this.tableData[i].entryNum = this.tableData[i].num + "个"
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
        toQuery(scope){
        	this.isDisabled = true
        	this.getConfigItem(scope)
        },
        toConfig(scope){
        	this.isDisabled = false
        	this.getConfigItem(scope)
        },
        getConfigItem(scope){
        	this.configJson.entryCode = scope.row.entryCode
        	this.configJson.typeCode = "Entry_Item"
        	this.ruleForm.valCode = scope.row.valCode
        	this.title = scope.row.valName + "模式进件配置"
        	this.$axios.post("/api/bycx-syst-service/aSysCodeInfo/findList", {params:this.configJson})
            .then(res => {
                if (res.data.code == "0000") {
                	this.itemData = res.data.result
                	this.checkList = scope.row.entryName.split(",")
                    this.configView = true
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleSelectionChange(val) {
	        this.multipleSelection = val;
	    },
        submit(){
        	this.valueList = []
        	for(let i=0;i<this.checkList.length;i++){
        		for(let j=0;j<this.itemData.length;j++){
        			if(this.itemData[j].valName == this.checkList[i]){
        				console.log(this.checkList[i])
        				console.log(this.itemData[j])
        				this.valueList.push(this.itemData[j].valCode)
        			}
        		}
        	}
            this.ruleForm.entryCode = this.valueList.join(",")
        	this.$axios.post('/api/bycx-syst-service/aSysModeConf/saveEntryConf',{params: this.ruleForm})
            .then(res => {
                if(res.data.code == '0000'){
                	this.configView = false
                	this.$message({
			            message: this.title + '成功',
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