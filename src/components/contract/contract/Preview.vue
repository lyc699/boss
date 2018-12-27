<style lang="less">

</style>

<template>
    <el-dialog title="预览合同" :visible="show" class="preview" @update:visible="handlerShowChange">
        <el-row style="height:400px;overflow-y:auto;">
            <el-form label-width="160px">
                <el-col :span="11">
                    <el-form-item label="客户姓名">
                        <el-input v-model="params.custName"></el-input>
                    </el-form-item>
                    <el-form-item label="授信额度">
                        <el-input v-model="params.creditLimit"></el-input>
                    </el-form-item>
                    <el-form-item label="分期期数">
                        <el-input v-model="params.instNum"></el-input>
                    </el-form-item>
                    <el-form-item label="户名">
                        <el-input v-model="params.acctName"></el-input>
                    </el-form-item>
                    <el-form-item label="开户行">
                        <el-input v-model="params.openOrg"></el-input>
                    </el-form-item>
                    <el-form-item label="贷款编号">
                        <el-input v-model="params.loanNo"></el-input>
                    </el-form-item>
                    <el-form-item label="还款方式">
                        <el-input v-model="params.repayKind"></el-input>
                    </el-form-item>
                    <el-form-item label="贷款用途">
                        <el-input v-model="params.loanUse"></el-input>
                    </el-form-item>
                    <el-form-item label="大写审批金额">
                        <el-input v-model="params.capitaleckAmt"></el-input>
                    </el-form-item>
                    <el-form-item label="总的审批金额">
                        <el-input v-model="params.totalEndAmt"></el-input>
                    </el-form-item>
                    <el-form-item label="居住详细地址">
                        <el-input v-model="params.regAddr"></el-input>
                    </el-form-item>
                    <el-form-item label="合同签订月">
                        <el-input v-model="params.applyMth"></el-input>
                    </el-form-item>
                    <el-form-item label="商品类型1">
                        <el-input v-model="params.goodsType1"></el-input>
                    </el-form-item>
                    <el-form-item label="商品品牌及型号">
                        <el-input v-model="params.brandQue1"></el-input>
                    </el-form-item>
                    <el-form-item label="首付金额">
                        <el-input v-model="params.fstPayAmt"></el-input>
                    </el-form-item>
                    <el-form-item label="邮政编码">
                        <el-input v-model="params.postalcode"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名拼音">
                        <el-input v-model="params.custNamPy"></el-input>
                    </el-form-item>
                    <el-form-item label="计划还款日结束：年">
                        <el-input v-model="params.peYear"></el-input>
                    </el-form-item>
                    <el-form-item label="首付金额加上贷款金额">
                        <el-input v-model="params.loanAmt"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="身份证号">
                        <el-input v-model="params.certNo"></el-input>
                    </el-form-item>
                    <el-form-item label="审批金额">
                        <el-input v-model="params.aprvEndAmt"></el-input>
                    </el-form-item>
                    <el-form-item label="月还款金额">
                        <el-input v-model="params.mthRepayAmt"></el-input>
                    </el-form-item>
                    <el-form-item label="网点名称">
                        <el-input v-model="params.branchName"></el-input>
                    </el-form-item>
                    <el-form-item label="账户">
                        <el-input v-model="params.acctNo"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="params.phoneNo"></el-input>
                    </el-form-item>
                    <el-form-item label="合同签约年月日">
                        <el-input v-model="params.signDate"></el-input>
                    </el-form-item>
                    <el-form-item label="首金合同编号">
                        <el-input v-model="params.sjjkloansNo"></el-input>
                    </el-form-item>
                    <el-form-item label="年利率">
                        <el-input v-model="params.rateByYear"></el-input>
                    </el-form-item>
                    <el-form-item label="大写的总审批金额">
                        <el-input v-model="params.capitalEndAmt"></el-input>
                    </el-form-item>
                    <el-form-item label="合同签订年">
                        <el-input v-model="params.applyYear"></el-input>
                    </el-form-item>
                    <el-form-item label="合同签订日">
                        <el-input v-model="params.applyDay"></el-input>
                    </el-form-item>
                    <el-form-item label="总价">
                        <el-input v-model="params.totlPric"></el-input>
                    </el-form-item>
                    <el-form-item label="单价">
                        <el-input v-model="params.pric1"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="params.email"></el-input>
                    </el-form-item>
                    <el-form-item label="商户账号">
                        <el-input v-model="params.branchNo"></el-input>
                    </el-form-item>
                    <el-form-item label="计划还款日结束：月">
                        <el-input v-model="params.peMth"></el-input>
                    </el-form-item>
                    <el-form-item label="计划还款日结束：日">
                        <el-input v-model="params.peDay"></el-input>
                    </el-form-item>
                    <el-form-item label="首金协议编号">
                        <el-input v-model="params.sjfxloansNo"></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <el-row slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sendContract">生成合同</el-button>
            <el-button @click="handlerShowChange">取消</el-button>
        </el-row>
    </el-dialog>
</template>

<script>
export default {
    props:{
        show:{
            type: Boolean,
            default: false
        },
        id:{
            type: String,
            default: ''
        }
    },
    watch:{
        id(val){
            this.params.templateNo = val
        }
    },
    data () {
        return {
            params:{
                templateNo:this.id,
                custName:'',
                certNo:'',
                creditLimit:'',
                aprvEndAmt:'',
                instNum:'',
                mthRepayAmt:'',
                branchName:'',
                acctName:'',
                acctNo:'',
                openOrg:'',
                phoneNo:'',
                loanNo:'',
                signDate:'',
                repayKind:'',
                sjjkloansNo:'',
                loanUse:'',
                rateByYear:'',
                capitaleckAmt:'',
                checkAmt:'',
                totalEndAmt:'',
                capitalEndAmt:'',
                regAddr:'',
                applyYear:'',
                applyMth:'',
                applyDay:'',
                goodsType1:'',
                totlPric:'',
                brandQue1:'',
                pric1:'',
                fstPayAmt:'',
                email:'',
                postalcode:'',
                custNamPy:'',
                branchNo:'',
                peYear:'',
                peMth:'',
                peDay:'',
                sjfxloansNo:'',
                loanAmt:'',
                rateByYearTwo:'',
            }
        }
    },
    mounted () {

    },
    methods: {
        sendContract(){
            //防止被浏览器拦截，先打开一个空白窗口，再重定向地址
            var newWid = window.open();

            this.$axios.post('/api/bycx-contract-service/bLoLoanSign/loanPreviewPDF',this.params).then(res => {
                if (!res.data.msg) {
                    newWid.location = res.data;
                } else {
                    newWid.close()
                    this.$message.error(res.data.msg);
                }
            })
        },
        handlerShowChange(){
            this.$emit('update:show', false)
        }
    }
}
</script>