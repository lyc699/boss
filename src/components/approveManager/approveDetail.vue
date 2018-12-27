<style lang="less">
    .infoTitle{
        margin: 20px 0;
        border-top: 1px solid #e3e3e3;
        padding-top: 10px
    }
</style>

<template>
    <div id="content">
        <el-tabs v-model="activeName" type="card" class="mt30" @tab-click="handleClick">
            <el-tab-pane label="贷款基本信息" name="first">
                            
            </el-tab-pane>
            <el-tab-pane label="客户信息" name="second">
                <div>
                    <h3 class="infoTitle">1.身份信息</h3>
                    <el-row>
                        <el-col :span='8'>姓名：{{userInfo.acctName}}</el-col>
                        <el-col :span='8'>性别：{{filterSexOptions(userInfo.sex)}}</el-col>
                        <el-col :span='8'>发证机关：{{userInfo.certOrg}}</el-col>
                    </el-row>
                    <br>
                    <el-row>
                        <el-col :span='8'>民族：{{filterNationOptions(userInfo.ethnic)}}</el-col>
                        <el-col :span='8'>身份证号码：{{userInfo.certNo}}</el-col>
                        <el-col :span='8'>有效期：{{userInfo.certValidDate}}</el-col>
                    </el-row>
                </div>
                <div>
                    <h3 class="infoTitle">2.基础信息</h3>
                    <el-row>
                        <el-col :span='8'>婚姻状况：{{filterMarriageStatusOptions(userInfo.marriage)}}</el-col>
                        <el-col :span='8'>QQ：{{userInfo.qq}}</el-col>
                        <el-col :span='8'>学历：{{filterEducationOptions(userInfo.edu)}}</el-col>
                    </el-row>
                    <br>
                    <el-row>
                        <el-col :span='8'>职业：{{filterWorkJobOptions(userInfo.workJob)}}</el-col>
                        <el-col :span='8'>邮政编码：{{userInfo.postAlCode}}</el-col>
                        <el-col :span='8'>手机号码：{{userInfo.phoneNo}}</el-col>
                    </el-row>
                    <br>
                    <el-row>
                        <el-col :span='8'>省市区：{{userInfo.liveProv}}{{userInfo.liveProv}}{{userInfo.liveCity}}{{userInfo.liveArea}}</el-col>
                        <el-col :span='8'>居住地：{{userInfo.liveAddr}}</el-col>
                    </el-row>
                </div>
                <div>
                    <h3 class="infoTitle">3.公司信息</h3>
                    <el-row>
                        <el-col :span='8'>公司名称：{{userInfo.workUnit}}</el-col>
                        <el-col :span='8'>公司行业：{{filterIndustryOptions(userInfo.industry)}}</el-col>
                        <el-col :span='8'>公司电话：{{userInfo.unitTel}}</el-col>
                    </el-row>
                    <br>
                    <el-row>
                        <el-col :span='8'>公司地址：{{userInfo.unitAddr}}</el-col>
                    </el-row>
                </div>
                <div>
                    <h3 class="infoTitle">4.联系人信息</h3>
                    <el-row>
                        <el-col :span='8'>联系人1：{{userInfo.contactName_1}}</el-col>
                        <el-col :span='8'>联系人2：{{userInfo.contactName_2}}</el-col>
                    </el-row>
                    <br>
                    <el-row>
                        <el-col :span='8'>关系：{{filterRelationOptions(userInfo.contactRel_1)}}</el-col>
                        <el-col :span='8'>关系：{{filterRelationOptions(userInfo.contactRel_2)}}</el-col>
                    </el-row>
                    <br>
                    <el-row>
                        <el-col :span='8'>电话：{{userInfo.contactTel_1}}</el-col>
                        <el-col :span='8'>电话：{{userInfo.contactTel_2}}</el-col>
                    </el-row>
                </div>
                <div>
                    <h3 class="infoTitle">5.银行卡信息</h3>
                    <el-row>
                        <el-col :span='8'>银行卡号：{{userInfo.acctNo}}</el-col>
                        <el-col :span='8'>开户行：{{filterOpenOrgOptions(userInfo.openOrg)}}</el-col>
                        <el-col :span='8'>开户地区：{{userInfo.openAddr}}</el-col>
                    </el-row>
                    <br>
                    <el-row>
                        <el-col :span='8'>账号名称：{{userInfo.acctName}}</el-col>
                    </el-row>
                </div>                
            </el-tab-pane>
            <el-tab-pane label="附件图片" name="third">
                <div align="center">
                    <h3 class="infoTitle">1.身份证正反面照片</h3>
                    <el-row>
                        <el-col :span="8">
                            <img src="@/assets/image/face_examples_front.png" alt=""> 
                            <p>正面</p>  
                            <el-button class="mt20" type="primary" @click.native="getImg('20800004')">下载</el-button>
                        </el-col>
                        <el-col :span="8">
                            <img src="@/assets/image/face_examples_back.png" alt=""> 
                            <p>反面</p>  
                            <el-button class="mt20" type="primary" @click.native="getImg('20800005')">下载</el-button>
                        </el-col>
                    </el-row>
                </div> 
                <div align="center">
                    <h3 class="infoTitle">2.储蓄卡正反面照片</h3>
                    <el-row>
                        <el-col :span="8">
                            <img src="@/assets/image/bank_examples_front.png" alt=""> 
                            <p>正面</p>  
                            <el-button class="mt20" type="primary" @click.native="getImg('20800002')">下载</el-button>
                        </el-col>
                        <el-col :span="8">
                            <img src="@/assets/image/bank_examples_back.png" alt=""> 
                            <p>反面</p>  
                            <el-button class="mt20" type="primary" @click.native="getImg('20800003')">下载</el-button>
                        </el-col>
                    </el-row>
                </div> 
                <div align="center">
                    <h3 class="infoTitle">3.人脸识别照片</h3>
                    <el-row>
                        <el-col :span="8">
                            <img src="@/assets/image/bank_examples_front.png" alt=""> 
                            <el-button class="mt20" type="primary">下载</el-button>
                        </el-col>
                        <el-col :span="8">
                            <img src="@/assets/image/bank_examples_back.png" alt=""> 
                            <el-button class="mt20" type="primary">下载</el-button>
                        </el-col>
                    </el-row>
                </div> 
            </el-tab-pane>
           <el-tab-pane label="经办信息" name="fourth">
                 <el-table :data="actionTableData">
                    <el-table-column align="center" prop="handDate" label="处理时间" :formatter="filterHandDateOptions"></el-table-column>
                    <el-table-column align="center" prop="typ" label="经办类型" :formatter="filterHandleTypeOptions"></el-table-column>
                    <el-table-column align="center" prop="handPersonName" label="处理人"></el-table-column>
                    <el-table-column align="center" prop="handPersonNo" label="处理人编号"></el-table-column>
                    <el-table-column align="center" prop="remark" label="备注"></el-table-column>
                </el-table>

                <div class="pag-index">
                    <el-pagination 
                        style="margin-top:20px;" 
                        @size-change="handleSizeChange" 
                        @current-change="handleCurrentChange" 
                        :current-page="actionListData.pageNo" 
                        :page-sizes="[10, 20, 30, 50]" 
                        :page-size="actionListData.pageSize" 
                        layout="total, sizes, prev, pager, next, jumper" 
                        :total="actionListData.totalSize"
                    >
                    </el-pagination>
                </div>
            </el-tab-pane>
           <el-tab-pane label="风控信息" name="fifth">
                 
            </el-tab-pane>
            <el-tab-pane label="关联贷款信息" name="sixth">
                 <div>
                    <h3 class="infoTitle">1.关联单_身份证号码<el-button class="right" type="primary" @click.native="getTable('tableId')">查询</el-button></h3>
                    <iframe :src="tableId" frameborder="0" v-if="tableId?true:false"></iframe>
                 </div>
                 <div>
                    <h3 class="infoTitle">2.关联单_银行卡<el-button class="right" type="primary" @click.native="getTable('tableBank')">查询</el-button></h3>
                    <iframe :src="tableBank" frameborder="0" width="100%" v-if="tableBank?true:false"></iframe>
                 </div>
                 <div>
                    <h3 class="infoTitle">3.关联单_手机号码<el-button class="right" type="primary" @click.native="getTable('tablePhone')">查询</el-button></h3>
                    <iframe :src="tablePhone" frameborder="0" width="100%" v-if="tablePhone?true:false"></iframe>
                 </div>
                 <div>
                    <h3 class="infoTitle">3.关联单_单位名称<el-button class="right" type="primary" @click.native="getTable('tableUnit')">查询</el-button></h3>
                    <iframe :src="tableUnit" frameborder="0" width="100%" v-if="tableUnit?true:false"></iframe>
                 </div>
                 
            </el-tab-pane>
            
        </el-tabs>
        <el-form :model="approveJson" :rules="approveRules" ref="approveJson" :inline="true" class="mt30 pt20" style="border-top: 1px solid #e3e3e3">
            <el-form-item label="审批结果" prop="approvResult">
                <el-select v-model="approveJson.approvResult" placeholder="请选择">    
                    <el-option
                    v-for="item in approveResultOptions"
                    :key="item.id"
                    :label="item.valName"
                    :value="item.valCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <template v-if="approveJson.approvResult==='31000023'">            
                <el-form-item label="决策原因" prop="passReason">
                    <el-select v-model="approveJson.passReason" placeholder="请选择">    
                        <el-option
                        v-for="item in recheckPassOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审批额度" prop="approveAmt">
                    <el-input placeholder="请输入" v-model="approveJson.approveAmt"></el-input>
                </el-form-item>
                <el-form-item label="是否收费通过" prop="isChargePass">
                    <el-select v-model="approveJson.isChargePass" placeholder="请选择">    
                        <el-option
                        v-for="item in isNoOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-row>
                    <el-form-item label="诉讼联系人1">
                        <el-input placeholder="请输入" v-model="approveJson.litigantList[0].litigantName"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人电话">
                        <el-input placeholder="请输入" v-model="approveJson.litigantList[0].phoneNo"></el-input>
                    </el-form-item>
                    <el-form-item label="关系" prop="chanNo">
                        <el-select v-model="approveJson.litigantList[0].chanNo" placeholder="请选择">    
                            <el-option
                            v-for="item in relationOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="诉讼联系人2">
                        <el-input placeholder="请输入" v-model="approveJson.litigantList[1].litigantName"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人电话">
                        <el-input placeholder="请输入" v-model="approveJson.litigantList[1].phoneNo"></el-input>
                    </el-form-item>
                    <el-form-item label="关系" prop="chanNo">
                        <el-select v-model="approveJson.litigantList[1].chanNo" placeholder="请选择">    
                            <el-option
                            v-for="item in relationOptions"
                            :key="item.id"
                            :label="item.valName"
                            :value="item.valCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-form-item label="处理备注" prop="remark">
                    <el-input type="textarea" style="width:400px" placeholder="处理备注" v-model="approveJson.remark"></el-input>
                </el-form-item>
            </template>    
            <template v-else-if="approveJson.approvResult==='31000024'">            
                <el-form-item label="决策原因" prop="rejectReason">
                    <el-select v-model="approveJson.rejectReason" placeholder="请选择">    
                        <el-option
                        v-for="item in rxyDecOptions"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-row>
                    <el-form-item label="处理备注" prop="remark">
                        <el-input type="textarea" style="width:400px" placeholder="处理备注" v-model="approveJson.remark"></el-input>
                    </el-form-item>
                </el-row>
            </template>   
            <template v-else-if="approveJson.approvResult==='31000006'">            
                <el-row>
                    <el-form-item label="处理备注" prop="remark">
                        <el-input type="textarea" style="width:400px" placeholder="处理备注" v-model="approveJson.remark"></el-input>
                    </el-form-item>
                </el-row>
            </template> 
            <el-row class="mt30" style="text-align: center;">   
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="approvConfirm">提交处理结果</el-button>
                    <el-button class="ml20" type="primary" @click="approvConfirm">挂单</el-button>
                    <el-button class="ml20" type="primary" @click="back">取消</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import { getBtnAuth } from '@/assets/js/utils.js'
import _ from 'underscore'
export default {
    data() {
        return {
            activeName:'second',
            userInfo:{},
            actionTableData:[],
            actionListData:{},
            codeParam:{
                list: [              
                    {
                        type: "Handle_Type"//经办类型
                    },
                    {
                        type: "Sex"//性别
                    },
                    {
                        type: "Nation"//民族
                    },
                    {
                        type: "Marriage_Status"//婚姻状况
                    },
                    {
                        type: "Education"//学历
                    },
                    {
                        type: "Work_Job"//职业
                    },
                    {
                        type: "Industry"//行业
                    },
                    {
                        type: "Relation"//关系
                    },
                    {
                        type: "Open_Org"//开户行
                    },
                    {
                        type: "Atta_Type"//附件类型
                    },
                    {
                        type: "Recheck_Pass"//审批决策原因
                    },
                    {
                        type: "Rxy_Dec_Cause"//审批不通过决策原因
                    },
                    {
                        type: "Is_No"//是否
                    },
                    
                ]
            },
            handleTypeOptions:[],
            sexOptions:[],
            nationOptions:[],
            marriageStatusOptions:[],
            educationOptions:[],
            workJobOptions:[],
            industryOptions:[],
            relationOptions:[],
            openOrgOptions:[],
            attTypeOptions:[],
            approveResultOptions:[
                {
                    id:0,
                    valCode:'31000023',
                    valName:'人工审核通过'
                },
                {
                    id:1,
                    valCode:'31000024',
                    valName:'人工审核不通过'
                },
                {
                    id:2,
                    valCode:'31000006',
                    valName:'人工驳回'
                }
            ],
            recheckPassOptions:[],  
            rxyDecOptions:[],
            isNoOptions:[], 
            approveJson:{
                loanNo: this.$route.query.loanNo,
                passReason:'',
                rejectReason:'',
                approveAmt:'',
                isChargePass:'13900002',
                remark:'',
                approvResult:'',
                litigantList:[{
                    litigantName:'',
                    phoneNo:'',
                    chanNo:''
                },{
                    litigantName:'',
                    phoneNo:'',
                    chanNo:''
                }]
            },
            approveRules:{
                remark: [
                    { required: true, message: '请输入备注', trigger: 'blur' },
                ],
                approvResult:[
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                approveAmt:[
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                passReason:[
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                rejectReason:[
                    { required: true, message: '请选择', trigger: 'blur' }
                ]
            },
            tableId:'',
            tableBank:'',
            tablePhone:'',
            tableUnit:''
        };
    },
    mounted() {
        this.getCodeList()
    },
    methods: {
        getCodeList(){
            this.$axios.post('/api/bycx-drainage-service/aSysAtt/mobile/query',{params:this.codeParam})
            .then(res => {
                let {code,msg,result} = res.data
                if (code == "0000") {
                    let {Handle_Type, Sex, Nation, Marriage_Status, Education, Work_Job,
                        Industry, Relation, Open_Org, Atta_Type, Recheck_Pass, Rxy_Dec_Cause, Is_No} = result;
                    this.handleTypeOptions = Handle_Type 
                    this.nationOptions = Nation
                    this.sexOptions = Sex
                    this.marriageStatusOptions = Marriage_Status
                    this.educationOptions = Education
                    this.workJobOptions = Work_Job
                    this.industryOptions = Industry
                    this.relationOptions = Relation
                    this.openOrgOptions = Open_Org
                    this.attTypeOptions = Atta_Type
                    this.recheckPassOptions = Recheck_Pass
                    this.rxyDecOptions = Rxy_Dec_Cause
                    this.isNoOptions = Is_No   
                    this.handleClick({index:'1'})                   
                }else{
                    if(msg) this.$message.error(msg)
                }
            })
        }, 
        getImg(attTyp){
            let data = {
                busiNo: this.$route.query.loanNo,
                attTyp:attTyp,
                queryType: 'TEMP'
            }
            this.$axios.post('/api/bycx-rece-service/tempSysAtt/load/downlowd/base64',data)
            .then(res => {
                let {code,msg,result} = res.data
                if (code == "0000") {

                }else{
                    if(msg) this.$message.error(msg)
                }
            })
        },  
        getTable(tableName){
            switch(tableName){
                case 'tableId':
                    this.tableId = `http://report.boyacx.com:8080/Byreport/ReportServer?reportlet=interface_report/cert_no_info.cpt&__bypagesize__=false&loan_no=${this.$route.query.loanNo}&cust_no=${this.$route.query.loanNo}`;
                    break;
                case 'tableBank':
                    this.tableBank = `http://report.boyacx.com:8080/Byreport/ReportServer?reportlet=interface_report/acct_info.cpt&__bypagesize__=false&loan_no=${this.$route.query.loanNo}`;
                    break;
                case 'tablePhone':
                    this.tablePhone = `http://report.boyacx.com:8080/Byreport/ReportServer?reportlet=interface_report/phone_info.cpt&__bypagesize__=false&loan_no=${this.$route.query.loanNo}&cust_no=${this.$route.query.loanNo}`;
                    break;
                case 'tableUnit':
                    this.tableUnit = `http://report.boyacx.com:8080/Byreport/ReportServer?reportlet=interface_report/workunit_info.cpt&__bypagesize__=false&loan_no=${this.$route.query.loanNo}&cust_no=${this.$route.query.loanNo}`;
                    break;
            }
        },
        approvConfirm(){
            this.$refs['approveJson'].validate((valid) => {
                if (valid) {
                    this.$axios.post('/api/bycx-appr-service/cApApprPushRecord/apprOperat',{params: this.approveJson})
                    .then(res => {
                        let {code,msg,result} = res.data
                        if (code == "0000") {
                            this.$message.success(msg)
                            this.back()
                        }else{
                            if(msg) {
                                this.$message.error(msg)
                            }
                        }
                    })
                }
            })
        },
        back(){
            this.$router.go(-1)
        },
        handleClick(tab, event){
            if(tab.index === '1'){
                this.$axios.post('/api/bycx-appr-service/bLoCustInfo/getLoanCustInfo',{params: {
                    loanNo: this.$route.query.loanNo
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.userInfo = res.data.result
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            }
            else if(tab.index === '3'){
                let data = {
                    pageNo : 1,
                    pageSize : 10,
                    isPage: true,
                    params:{
                        loanNo: this.$route.query.loanNo
                    }
                }
                this.$axios.post('/api/bycx-appr-service/bLoLoanHand/getList',data).then(res => {
                    if (res.data.code == "0000") {
                        this.actionTableData = res.data.result
                        this.actionListData = res.data
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },
        handleSizeChange(val) {
            this.query.pageNo = 1
            this.query.pageSize = val
            this.getQuery()
        },
        handleCurrentChange(val) {
            this.query.pageNo = val
            this.getQuery()
        },
        filterOpenOrgOptions(openOrg){
            if(openOrg){
                return _.filter(this.openOrgOptions, (item) => { return (item.valCode === openOrg)})[0].valName
            }
        },
        filterRelationOptions(relation){
            if(relation){
                return _.filter(this.relationOptions, (item) => { return (item.valCode === relation)})[0].valName
            }
        },
        filterIndustryOptions(industry){
            if(industry){
                return _.filter(this.industryOptions, (item) => { return (item.valCode === industry)})[0].valName
            }
        },
        filterWorkJobOptions(workJob){
            if(workJob){
                return _.filter(this.workJobOptions, (item) => { return (item.valCode === workJob)})[0].valName
            }
        },
        filterEducationOptions(education){
            if(education){
                return _.filter(this.educationOptions, (item) => { return (item.valCode === education)})[0].valName
            }
        },
        filterMarriageStatusOptions(marriageStatus){
            if(marriageStatus){
                return _.filter(this.marriageStatusOptions, (item) => { return (item.valCode === marriageStatus)})[0].valName
            }
        },
        filterSexOptions(sex){
            if(sex){
                return _.filter(this.sexOptions, (item) => { return (item.valCode === sex)})[0].valName
            }
        },
        filterNationOptions(nation){
            if(nation){
                return _.filter(this.nationOptions, (item) => { return (item.valCode === nation)})[0].valName
            }
        },
        filterHandleTypeOptions(row){
            if(row.typ){
                return _.filter(this.handleTypeOptions, (item) => { return (item.valCode === row.typ)})[0].valName
            }
        },
        filterHandDateOptions(row){
            if(row.handDate){
                let date = new Date(row.handDate);
                return this.formDate(date)
            }
        },
        formDate(date){
            let year = date.getFullYear();
            let month = this.padDate(date.getMonth() + 1);
            let day = this.padDate(date.getDate());
            let hours = this.padDate(date.getHours());
            let minutes = this.padDate(date.getMinutes());
            //返回整理好的数据
            return year + '-' + month + '-' + day + '  ' + hours + ':' + minutes;
        },
        padDate (value) {
            return value < 10 ? '0' + value : value;
        }  
    }
};
</script>
