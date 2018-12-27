<style lang="less" scoped>
.el-select,.el-cascader{
    width: 100%;
}
</style>

<template>
    <div id="content">
        <el-col :span="13">
            <el-form label-width="100px" :model="codeJson" :rules="rules" ref="codeJson">
            	<el-col :span="12">
                    <el-form-item label="码类名称：" prop="typeName">
                        <el-input placeholder="码类名称" v-model="codeJson.typeName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="码类编号：" prop="typeCode">
                        <el-input placeholder="码类编号" v-model="codeJson.typeCode" clearable></el-input>
                    </el-form-item>
                </el-col>
                <!--<el-col :span="11">
                    
                </el-col>-->
                <el-col :span="24">
                    <el-form-item label="备注：">
                        <el-input type="textarea" placeholder="备注" v-model="codeJson.remark" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit('codeJson')">确定</el-button>
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
            codeJson:{
                typeName: '',//码类名称；必须
                typeCode: '',//码类编码；必须
//              id: '',
//              remark: ''//备注
            },
            rules: {
            	typeCode: [
                    { required: true, message: '请输入码类编号', trigger: 'blur' }
                ],
                typeName: [
                    { required: true, message: '请输入码类名称', trigger: 'blur' }
                ]
            }
        };
    },
    mounted() {
        if(this.id){
            this.getQuery()
            this.codeJson.id = this.$route.query.id
        }
    },
    methods: {
        getQuery(){
            this.$axios.post("/api/bycx-syst-service/aSysCodeType/getCodeTypeById", {params:{id:this.id}})
            .then(res => {
            	console.log(res)
                if (res.data.code == "0000") {
                    this.codeJson = res.data.result
                }
            });
        }, 
        back(){
            this.$router.back()
        },
        submit(formName){
            let url = '/api/bycx-syst-service/aSysCodeType/saveCodeType'
            if(this.id){
                url = '/api/bycx-syst-service/aSysCodeType/updateCodeType'
            }
           
			this.$refs[formName].validate((valid) => {
				 console.log(this.$refs[formName])
	            if (valid) {
	            	this.$axios.post(url,{params: this.codeJson})
		            .then(res => {
		            	
		                if(res.data.code == '0000'){
		                    this.$router.push('/codeType')
		                }else{
		                    this.$message.error(res.data.msg)
		                }
		            })
	            }
	        })
	            
//          })
        }
    }
};
</script>