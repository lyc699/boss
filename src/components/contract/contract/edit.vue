<style lang="less" scoped>
.el-select {
    width: 100%;
}
.contract-table {
    .ct-head {
        color: #666;
        background: #fbf9f9;
        padding: 10px 0;
    }
    .ct-item {
        margin: 20px 0;
        .el-col {
            padding: 0 20px;
        }
    }
}
</style>

<template>
    <div id="content">
        <h2 class="mb20">基础设置</h2>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="90px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="" label-width="25px" :class="{'overlay':allEdit}">
                        <el-upload class="uploadSeal box" :data="uploadJson" :headers="headerConfig" action="/api/bycx-contract-service/aSysContrFile/upload/ContrFile" :on-success="resUpload" :limit="1" :file-list="fileList">
                            <el-button size="medium" type="primary" :disabled="allEdit">重新上传</el-button>
                            <span v-if="showOldFileName">{{ruleForm.fileName}}</span>
                        </el-upload>
                    </el-form-item>
                </el-col>
                <el-col :span="1" :offset="17">
                    <el-button type="primary" @click="allEdit = false">编辑</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-col :span="8">
                        <el-form-item label="合同名称" prop="fileAliasName">
                            <el-input v-model="ruleForm.fileAliasName" :disabled="allEdit" placeholder="合同名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否启用" prop="stat">
                            <el-select placeholder="是否启用" :disabled="allEdit" v-model="ruleForm.stat">
                                <el-option label="是" value="13900001"></el-option>
                                <el-option label="否" value="13900002"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="总页数" prop="totalPage">
                            <el-input v-model="ruleForm.totalPage" :disabled="allEdit" placeholder="总页数"></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-col :span="6">
                        <el-form-item label="合同类型" prop="tmplType">
                            <el-select placeholder="请选择" v-model="ruleForm.tmplType" :disabled="allEdit">
                                <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in tmpl_type" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务类型" prop="bizType">
                            <el-select placeholder="请选择" v-model="ruleForm.bizType" :disabled="allEdit">
                                <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in biz_type" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="合同主体" prop="contrAffili">
                            <el-select placeholder="请选择" v-model="ruleForm.contrAffili" :disabled="allEdit">
                                <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in acc_type" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="资方渠道" prop="applyChan">
                            <el-select placeholder="请选择" :disabled="allEdit" v-model="ruleForm.applyChan">
                                <el-option :label="item.chanName" :value="item.chanNo" v-for="(item, index) in chan_type" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
        </el-form>
        <el-row class="mt40 mb20">
            <el-col :span="12">
                <h2 class="">签章设置</h2>
            </el-col>
            <el-col :span="12" class="text-right">
                <el-button type="primary" @click="addSignCoord" v-if="!allEdit">添加</el-button>
            </el-col>
        </el-row>
        <el-row class="contract-table">
            <el-row class="ct-head text-center">
                <el-col :span="1">序号</el-col>
                <el-col :span="2">电子签章类型</el-col>
                <el-col :span="3">签约人</el-col>
                <el-col :span="3">是否为发起人</el-col>
                <el-col :span="2">是否签章</el-col>
                <el-col :span="2">签章主体</el-col>
                <el-col :span="2">签章页码</el-col>
                <el-col :span="2">签名坐标X</el-col>
                <el-col :span="2">签名坐标Y</el-col>
                <el-col :span="3">签名类型</el-col>
                <el-col :span="2" v-if="!allEdit">操作</el-col>
            </el-row>
            <p class="text-center gray mt20" v-if="!tableData.length">暂无数据</p>
            <el-row class="ct-item text-center" v-for="(item, index) in tableData" :key="index">
                <el-form ref="signForm" :model="item" :rules="signRules">
                    <el-col :span="1">{{index + 1}}</el-col>
                    <el-col :span="2">
                        <el-form-item prop="elecSignType">
                            <el-select placeholder="请选择" v-model="item.elecSignType" :disabled="index > 0 && ruleForm.stat == '13900001'" v-if="item.isEdit" @change="signerChange(item)">
                                <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in elec_sing_type" :key="index"></el-option>
                            </el-select>
                            <label v-else>{{formatElecSignType(item.elecSignType)}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item prop="signer">
                            <el-select placeholder="请选择" v-model="item.signer" v-if="item.isEdit" :disabled="!signer_type.length && ruleForm.stat == '13900001'">
                                <el-option :label="item.label" :value="item.value" v-for="(item, index) in signer_type" :key="index"></el-option>
                            </el-select>
                            <label v-else>
                                <span>{{signer_type.length ? formatSignerType(item.signer) : item.signer}}</span>
                            </label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item prop="isInitiator">
                            <el-select placeholder="请选择" v-model="item.isInitiator" v-if="item.isEdit">
                                <el-option label="是" value="13900001"></el-option>
                                <el-option label="否" value="13900002"></el-option>
                            </el-select>
                            <label v-else>{{formatIsNo(item.isInitiator)}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item prop="isSignature">
                            <el-select placeholder="请选择" v-model="item.isSignature" v-if="item.isEdit">
                                <el-option label="是" value="13900001"></el-option>
                                <el-option label="否" value="13900002"></el-option>
                            </el-select>
                            <label v-else>{{formatIsNo(item.isSignature)}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item prop="signBody">
                            <el-select placeholder="请选择" v-model="item.signBody" v-if="item.isEdit">
                                <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in sign_body" :key="index"></el-option>
                            </el-select>
                            <label v-else>{{formatSignBody(item.signBody)}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item prop="signPage">
                            <el-input v-if="item.isEdit" v-model="item.signPage"></el-input>
                            <label v-else>{{item.signPage}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item prop="signX">
                            <el-input v-if="item.isEdit" v-model="item.signX"></el-input>
                            <label v-else>{{item.signX}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item prop="signY">
                            <el-input v-if="item.isEdit" v-model="item.signY"></el-input>
                            <label v-else>{{item.signY}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item prop="signType">
                            <el-select placeholder="请选择" v-model="item.signType" v-if="item.isEdit">
                                <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in sign_type" :key="index"></el-option>
                            </el-select>
                            <label v-else>{{formatSignType(item.signType)}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" v-if="!allEdit">
                        <a class="link" @click="editSignCoord(item,index)">{{item.isEdit ? '保存' : '编辑'}}</a>
                        <a class="link" @click="delSignCoord(item,index)">删除</a>
                    </el-col>
                </el-form>
            </el-row>
        </el-row>
        <el-row class="text-center mt50" v-if="!allEdit">
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button @click="back">取消</el-button>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            templateNo: this.$route.query.id,
            tableData: [],
            ruleForm: {
                fileName: "",
                fileId: "",
                fileAliasName: "", //名称
                bizType: "", //业务类型
                tmplType: "", //合同类型
                contrAffili: "", //合同主体
                stat: "", //是否启用
                totalPage: "", //总页数
                applyChan: "25" //针对资方业务
            },
            rules: {
                fileAliasName: [
                    {
                        required: true,
                        message: "请输入合同名称",
                        trigger: "blur"
                    },
                    {
                        min: 3,
                        max: 25,
                        message: "长度在 3 到 25 个字符",
                        trigger: "blur"
                    }
                ],
                bizType: [
                    {
                        required: true,
                        message: "请选择业务类型",
                        trigger: "change"
                    }
                ],
                tmplType: [
                    {
                        required: true,
                        message: "请选择合同类型",
                        trigger: "change"
                    }
                ],
                contrAffili: [
                    {
                        required: true,
                        message: "请选择合同主体",
                        trigger: "change"
                    }
                ],
                applyChan: [
                    {
                        required: true,
                        message: "请选择资方渠道",
                        trigger: "change"
                    }
                ],
                stat: [
                    {
                        required: true,
                        message: "请选择是否启用",
                        trigger: "change"
                    }
                ]
            },
            signRules: {
                elecSignType: [
                    {
                        required: true,
                        message: "请选择电子签章类型",
                        trigger: "change"
                    }
                ],
                signer: [
                    {
                        required: true,
                        message: "请选择签约人",
                        trigger: "change"
                    },
                    {
                        min: 3,
                        max: 30,
                        message: "长度在 3 到 30 个字符",
                        trigger: "blur"
                    }
                ],
                isInitiator: [
                    {
                        required: true,
                        message: "请选择是否为发起人",
                        trigger: "change"
                    }
                ],
                isSignature: [
                    {
                        required: true,
                        message: "请选择是否签章",
                        trigger: "change"
                    }
                ],
                signBody: [
                    {
                        required: true,
                        message: "请选择签章主体",
                        trigger: "change"
                    }
                ],
                signPage: [
                    {
                        required: true,
                        message: "请输入签章页码",
                        trigger: "blur"
                    }
                ],
                signX: [
                    { required: true, message: "请输入坐标X", trigger: "blur" }
                ],
                signY: [
                    { required: true, message: "请输入坐标Y", trigger: "blur" }
                ],
                signType: [
                    {
                        required: true,
                        message: "请选择签名类型",
                        trigger: "change"
                    }
                ]
            },
            tmpl_type: [],
            elec_sing_type: [],
            acc_type: [],
            cont_apply_type: [],
            biz_type: [],
            sign_type: [],
            sign_body: [],
            chan_type: [],//资金渠道
            signer_type: [],//签约人
            uploadJson: {
                useType: "CONTRACT", //文件使用类型：签章：SIGNAT ；合同：CONTRACT 必传
                fileId: "" //上传文件id(当更新时必传) 非传
            },
            headerConfig: {
                Authorization: localStorage.getItem("token")
            },
            fileList: [],
            showOldFileName: true,
            allEdit: true,//所有的编辑状态
            addSignitem : {//添加签章数据模型
                elecSignType: "",
                id: "",
                instDate: "",
                instUserNo: "",
                isInitiator: "",
                isSignature: "",
                signBody: "",
                signKey: "",
                signPage: "",
                signType: "",
                signX: "",
                signY: "",
                signer: "",
                templateNo: "",
                updtDate: "",
                isEdit: true
            }
        };
    },
    mounted() {
        this.codeQuery();
        this.$axios.post('/api/bycx-fund-service/fund/chan/getChanInfosByChanNoAndChanName',{params: {}}).then(res => {
            if (res.data.code == "0000"){
                this.chan_type = res.data.result
            }
        })
    },
    methods: {
        codeQuery() {
            this.$axios
                .post("/api/bycx-rece-service/api/sys/code/mobile/query", {
                    params: {
                        list: [
                            {
                                type: "Elec_Sign_Type"
                            },
                            {
                                type: "Acc_Type"
                            },
                            {
                                type: "Tmpl_Type"
                            },
                            {
                                type: "Cont_Apply_Type"
                            },
                            {
                                type: "Goods_Type"
                            },
                            {
                                type: "Sign_Type"
                            },
                            {
                                type: "Sign_Body"
                            }
                        ]
                    }
                })
                .then(res => {
                    if (res.data.code == "0000") {
                        let {
                            Elec_Sign_Type,
                            Acc_Type,
                            Tmpl_Type,
                            Cont_Apply_Type,
                            Goods_Type,
                            Sign_Type,
                            Sign_Body
                        } = res.data.result;

                        this.tmpl_type = Tmpl_Type;
                        this.elec_sing_type = Elec_Sign_Type;
                        this.acc_type = Acc_Type;
                        this.cont_apply_type = Cont_Apply_Type;
                        this.biz_type = Goods_Type;
                        this.sign_type = Sign_Type;
                        this.sign_body = Sign_Body;

                        this.getQuery();
                    }
                });
        },
        getQuery() {
            this.$axios
                .post(
                    "/api/bycx-contract-service/aSysContractTemplateCg/getList",
                    {
                        params: {
                            templateNo: this.templateNo
                        }
                    }
                )
                .then(res => {
                    if (res.data.code == "0000") {
                        this.ruleForm = res.data.result[0];
                        //获取签章人
                        this.getSigner(this.ruleForm.elecSignType)
                        //获取签章设置
                        this.getSignCoord();
                    }
                });
        },
        getSignCoord() {
            this.$axios
                .post(
                    "/api/bycx-contract-service/aSysContractSignCoordCg/getList",
                    {
                        params: {
                            templateNo: this.templateNo
                        }
                    }
                )
                .then(res => {
                    if (res.data.code == "0000") {
                        let data = res.data.result;
                        data.map(item => (item.isEdit = false));
                        this.tableData = data;
                        
                        //默认新增签章签名人
                        this.addSignitem.elecSignType = this.tableData.length && this.tableData[0].elecSignType
                    }
                });
        },
        resUpload(res) {
            if (res.code == 200) {
                let { fileType, fileName, fileId } = res.data;

                this.ruleForm.fileName = fileName;
                this.ruleForm.fileId = fileId;
                this.showOldFileName = false;
            } else {
                this.fileList = []
                this.$message.error(res.msg);
            }
        },
        formatIsNo(code) {
            return code == "13900001" ? "是" : "否";
        },
        formatSignType(val) {
            if(!this.sign_type.length) return '';

            return this.sign_type.find(item => item.valCode == val).valName;
        },
        formatSignerType(val) {
            const data = this.signer_type.find(item => item.value == val)

            return data ? data.label : val
        },
        formatElecSignType(val) {
            if(!this.elec_sing_type.length) return '';

            return this.elec_sing_type.find(item => item.valCode == val).valName;
        },
        formatSignBody(val) {
            if(!this.sign_body.length) return '';
            
            return this.sign_body.find(item => item.valCode == val).valName;
        },
        editSignCoord(item, index) {
            if (item.isEdit) {
                this.$refs.signForm[index].validate(valid => {
                    if(valid){
                        item.templateNo = this.templateNo;
                        this.$axios
                            .post(
                                "/api/bycx-contract-service/aSysContractSignCoordCg/save",
                                { params: item }
                            )
                            .then(res => {
                                if (res.data.code == "0000") {
                                    item.isEdit = !item.isEdit;
                                } else {
                                    this.$message.error(res.data.msg);
                                }
                            });
                    }
                });
            } else {
                item.isEdit = !item.isEdit;
            }
        },
        addSignCoord() {
            let obj = JSON.parse(JSON.stringify(this.addSignitem))
            this.tableData.push(obj);
        },
        delSignCoord(item,index) {
            if(item.id){
                this.$axios.post('/api/bycx-contract-service/aSysContractSignCoordCg/deleteById',{params: {
                    id:item.id
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.tableData.splice(index, 1);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
            }else{
                this.tableData.splice(index, 1);
            }
        },
        back() {
            this.$router.back();
        },
        signerChange(item){
            this.getSigner(item.elecSignType)

            this.tableData.map(k => k.elecSignType = item.elecSignType)
            this.addSignitem = item.elecSignType
        },
        getSigner(type){
            if(!type) return false;

            this.$axios.post('/api/bycx-contract-service/aSysContractSignCoordCg/config/select',{params: {
                elecSignType:type
            }}).then(res => {
                if (res.data.code == "0000") {
                    this.signer_type = res.data.result
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        submit() {
            let that = this;

            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    if (!this.ruleForm.fileId) {
                        this.$message.error("请上传合同模版");
                        return false;
                    }
                    this.$axios
                        .post(
                            "/api/bycx-contract-service/aSysContractTemplateCg/save",
                            { params: this.ruleForm }
                        )
                        .then(res => {
                            if (res.data.code == "0000") {
                                this.$message({
                                    message: "编辑成功",
                                    type: "success",
                                    onClose() {
                                        that.back();
                                    }
                                });
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        });
                }
            });
        }
    }
};
</script>