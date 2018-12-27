<style lang="less" scoped>
.el-select,.el-cascader{
    width: 100%;
}
</style>

<template>
    <div id="content">
        <el-col :span="13">
            <el-form label-width="100px" :model="valJson" :rules="rules" ref="valJson">
            	<el-col :span="12">
            		<el-form-item label="码值名称：" prop="valName">
                        <el-input placeholder="码值名称" v-model="valJson.valName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="码值编码：" prop="valCode">
                        <el-input placeholder="码值编码" v-model="valJson.valCode" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="所属码类：" prop="typeCode">
                        <el-input placeholder="所属码类" v-model="valJson.typeCode" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用：" prop="status">
                        <el-radio v-model="valJson.status" label="13900001">是</el-radio>
  						<el-radio v-model="valJson.status" label="13900002">否</el-radio>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注：">
                        <el-input type="textarea" placeholder="备注" v-model="valJson.remark" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit('valJson')">确定</el-button>
                        <el-button @click="back">取消</el-button>
                    </el-form-item>
                </el-col>        
            </el-form>
        </el-col>
    </div>
</template>

<script>
export default {
    data() {
        return {
            id:this.$route.query.id,
            valJson: {
            	valName: '',//码值名称；必须
                valCode: '',//码值编码；必须
                status: '', //状态；必须；码值：13900001-是，13900001-否
                typeCode: this.$route.query.typeCode,//码类编码；必须
                remark: ''//备注
            },
            codeJson:{
                params: {},
                pageNo: 1,
                pageSize: 10
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
            }
        };
    },
    mounted() {
        if(this.id){
            this.getQuery()
            this.valJson.id = this.$route.query.id
        }
    },
    methods: {
        getQuery(){        	
        	this.codeJson.params = this.valJson
        	console.log(this.codeJson)
        	this.$axios.post("/api/bycx-syst-service/aSysCodeInfo/queryList", this.codeJson)
            .then(res => {
                	console.log(res)
                if (res.data.code == "0000") {
                    this.valJson = res.data.result[0]
                }
            });
        }, 
        back(){
            this.$router.back()
        },
        submit(formName){
            let url = '/api/bycx-syst-service/aSysCodeInfo/addCodeInfo'
            if(this.id){
                url = '/api/bycx-syst-service/aSysCodeInfo/editCodeInfo'
            }
            console.log(this.valJson)
			this.$refs[formName].validate((valid) => {
	            if (valid) {
	            	this.$axios.post(url,{params: this.valJson})
		            .then(res => {
		            	
		                if(res.data.code == '0000'){
		                	this.$router.push({path:'/codeType/codeVal',query:{typeCode:this.$route.query.typeCode}})
		                }else{
		                    this.$message.error(res.data.msg)
		                }
		            })
	            } else {
	            	return false;
	            }
	        })
            
        }
    }
};
</script>