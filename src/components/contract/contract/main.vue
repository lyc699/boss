<style lang="less" scoped>
.el-select {
    width: 100%;
}
.preview{
    .el-input{
        width: 100%;
    }
}
</style>

<template>
    <div id="content">
        <el-col :span="20">
            <el-form :inline="true">
                <el-form-item label="合同名称">
                    <el-input placeholder="请输入合同名称" v-model="query.params.fileAliasName"></el-input>
                </el-form-item>
                <el-form-item label="合同主体">
                    <el-select placeholder="请选择" v-model="query.params.contrAffili">
                        <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in acc_type" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合同类型">
                    <el-select placeholder="请选择" v-model="query.params.tmplType">
                        <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in tmpl_type" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联业务">
                    <el-select placeholder="请选择" v-model="query.params.applyChan">
                        <el-option :label="item.chanName" :value="item.chanNo" v-for="(item, index) in chan_type" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getQuery">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="2" :offset="2" class="text-right">
            <el-button type="primary" @click="toAdd" icon="el-icon-plus">新增</el-button>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="templateNo" label="合同ID"></el-table-column>
            <el-table-column align="center" prop="fileAliasName" label="合同名称"></el-table-column>
            <el-table-column align="center" prop="fileName" label="模板名称"></el-table-column>
            <el-table-column align="center" prop="tmplType" label="合同类型" :formatter="formatTmplType"></el-table-column>
            <el-table-column align="center" prop="contrAffili" label="合同主体" :formatter="formatActType"></el-table-column>
            <el-table-column align="center" prop="applyChan" label="关联业务" :formatter="formatApplyChan"></el-table-column>
            <el-table-column align="center" prop="totalPage" label="总页数"></el-table-column>
            <el-table-column align="center" prop="elecSignType" label="电子签章" :formatter="formatElecSignType"></el-table-column>
            <el-table-column align="center" prop="stat" label="是否启用" :formatter="formatStat"></el-table-column>
            <el-table-column align="center" label="操作" width="250px">
                <template slot-scope="scope">
                    <a class="link" @click="preview(scope)" v-if="isPreview">预览</a>
                    <a class="link" @click="changeStatus(scope)" v-if="isSave">{{scope.row.stat == '13900001' ? '禁用' : '启用'}}</a>
                    <a class="link" @click="toEdit(scope.row.templateNo)" v-if="isSave">编辑</a>
                    <a class="link" @click="del(scope)" v-if="isDel">删除</a>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination style="margin-top:20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listData.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="listData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listData.totalSize">
        </el-pagination>

        <el-dialog title="新增合同" :visible.sync="showModel" width="40%" class="autoDialog">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="90px">
                <el-col :span="24">
                    <el-form-item label="" label-width="25px">
                        <el-upload class="uploadSeal box" :data="uploadJson" :headers="headerConfig" action="/api/bycx-contract-service/aSysContrFile/upload/ContrFile" :on-success="resUpload" :limit="1" :file-list="fileList">
                            <el-button size="medium" type="primary">上传模版</el-button>
                        </el-upload>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合同名称" prop="fileAliasName">
                        <el-input v-model="ruleForm.fileAliasName" placeholder="合同名称"></el-input>
                    </el-form-item>
                    <el-form-item label="合同类型" prop="tmplType">
                        <el-select placeholder="请选择" v-model="ruleForm.tmplType">
                            <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in tmpl_type" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业务类型" prop="bizType">
                        <el-select placeholder="请选择" v-model="ruleForm.bizType">
                            <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in biz_type" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否启用" prop="stat">
                        <el-select placeholder="是否启用" v-model="ruleForm.stat">
                            <el-option label="是" value="13900001"></el-option>
                            <el-option label="否" value="13900002"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="总页数" prop="totalPage">
                        <el-input v-model="ruleForm.totalPage" placeholder="总页数"></el-input>
                    </el-form-item>
                    <el-form-item label="合同主体" prop="contrAffili">
                        <el-select placeholder="请选择" v-model="ruleForm.contrAffili">
                            <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in acc_type" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关联业务" prop="applyChan">
                        <el-select placeholder="请选择" v-model="ruleForm.applyChan">
                            <el-option :label="item.chanName" :value="item.chanNo" v-for="(item, index) in chan_type" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form>
            <div slot="footer" class="text-center">
                <el-button type="primary" @click="submit">确 定</el-button>
                <el-button @click="showModel = false">取 消</el-button>
            </div>
        </el-dialog>
        
        <preview :id="templateNo" :show.sync="showPreview"></preview>
        
    </div>
</template>

<script>
import { getBtnAuth, checkPhone } from "@/assets/js/utils.js";
import Preview from './Preview'

export default {
    components:{
        Preview
    },
    data() {
        return {
            query: {
                params: {
                    contrAffili: "",
                    fileAliasName: "",
                    tmplType: "",
                    applyChan:""
                },
                isPage: true,
                pageNo: 1,
                pageSize: 10
            },
            ruleForm: {
                fileName: "",
                fileId: "",
                fileAliasName: "", //名称
                bizType: "", //业务类型
                tmplType: "", //合同类型
                contrAffili: "", //合同主体
                stat: "", //是否启用
                totalPage: "", //总页数
                applyChan: "" //针对资方业务
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
                        max: 15,
                        message: "长度在 3 到 15 个字符",
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
                        message: "请选择关联业务",
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
            btnAuth: this.$route.meta.btnAuth,
            listData: {},
            tableData: [],
            tmpl_type: [],
            elec_sing_type: [],
            acc_type: [],
            cont_apply_type: [],
            biz_type: [],
            chan_type:[],//关联业务
            showModel: false,
            showPreview:false,
            templateNo:'',//预览模版id
            uploadJson: {
                useType: "CONTRACT", //文件使用类型：签章：SIGNAT ；合同：CONTRACT 必传
                fileId: "" //上传文件id(当更新时必传) 非传
            },
            headerConfig: {
                Authorization: localStorage.getItem("token")
            },
            fileList: []
        };
    },
    computed: {
        isDel() {
            return getBtnAuth("syst:aSysContractTemplateCg:deleteTemplate");
        },
        isSave() {
            return getBtnAuth("syst:aSysContractTemplateCg:save");
        },
        isPreview(){
            return getBtnAuth("syst:bLoLoanSign:loanPreviewPDF")
        }
    },
    mounted() {
        this.codeQuery();
    },
    methods: {
        getChanName(){
            this.$axios.post('/api/bycx-fund-service/fund/chan/getChanInfosByChanNoAndChanName',{params: {}}).then(res => {
                if (res.data.code == "0000"){
                    this.chan_type = res.data.result

                    this.getQuery();
                }
            })
        },
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
                            Goods_Type
                        } = res.data.result;

                        this.tmpl_type = Tmpl_Type;
                        this.elec_sing_type = Elec_Sign_Type;
                        this.acc_type = Acc_Type;
                        this.cont_apply_type = Cont_Apply_Type;
                        this.biz_type = Goods_Type;

                        this.getChanName()
                    }
                });
        },
        getQuery() {
            this.$axios
                .post(
                    "/api/bycx-contract-service/aSysContractTemplateCg/getList",
                    this.query
                )
                .then(res => {
                    if (res.data.code == "0000") {
                        this.listData = res.data;
                        this.tableData = res.data.result;
                    }
                });
        },
        formatTmplType(row) {
            return row.tmplType
                ? this.tmpl_type.find(item => item.valCode == row.tmplType)
                      .valName
                : row.tmplType;
        },
        formatContApplyType(row) {
            return row.contApplyType
                ? this.cont_apply_type.find(
                      item => item.valCode == row.contApplyType
                  ).valName
                : row.contApplyType;
        },
        formatElecSignType(row) {
            return row.elecSignType
                ? this.elec_sing_type.find(
                      item => item.valCode == row.elecSignType
                  ).valName
                : row.elecSignType;
        },
        formatActType(row) {
            return row.contrAffili
                ? this.acc_type.find(item => item.valCode == row.contrAffili)
                      .valName
                : row.contrAffili;
        },
        formatApplyChan(row) {
            const data = this.chan_type.find(item => item.chanNo == row.applyChan)

            return data ? data.chanName : row.applyChan
        },
        formatStat(row) {
            return row.stat == "13900001" ? "是" : "否";
        },
        handleSizeChange(val) {
            this.query.pageSize = val;
            this.getQuery();
        },
        handleCurrentChange(val) {
            this.query.pageNo = val;
            this.getQuery();
        },
        resetForm() {
            for (let item in this.query.params) {
                this.query.params[item] = "";
            }
            this.getQuery();
        },
        toAdd() {
            this.showModel = true;
        },
        del(scope) {
            this.$confirm(
                `确认删除合同[${scope.row.fileAliasName}]？`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            ).then(() => {
                this.$axios
                    .post(
                        "/api/bycx-contract-service/aSysContractTemplateCg/deleteTemplate",
                        {
                            params: {
                                templateNo: scope.row.templateNo,
                                fileName: scope.row.fileName
                            }
                        }
                    )
                    .then(res => {
                        if (res.data.code == "0000") {
                            this.tableData.splice(
                                this.tableData.findIndex(
                                    item =>
                                        item.templateNo === scope.row.templateNo
                                ),
                                1
                            );
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
            });
        },
        changeStatus(scope) {
            let params = JSON.parse(JSON.stringify(scope.row));

            params.stat = params.stat == "13900001" ? "13900002" : "13900001";

            this.$axios
                .post(
                    "/api/bycx-contract-service/aSysContractTemplateCg/save",
                    { params: params }
                )
                .then(res => {
                    if (res.data.code == "0000") {
                        this.tableData.map(
                            item =>
                                item.templateNo == params.templateNo
                                    ? (item.stat = params.stat)
                                    : ""
                        );
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
        },
        resUpload(res) {
            if (res.code == 200) {
                let { fileType, fileName, fileId } = res.data;

                this.ruleForm.fileName = fileName;
                this.ruleForm.fileId = fileId;
            } else {
                this.fileList = []
                this.$message.error(res.msg);
            }
        },
        toEdit(id) {
            this.$router.push({ path: "/contract/edit", query: { id: id } });
        },
        preview(scope){
            this.showPreview = true
            this.templateNo = scope.row.templateNo
        },
        colsePreview(val){
            this.showPreview = val
        },
        sendContract(){
            this.$axios.post('/api/bycx-contract-service/bLoLoanSign/loanPreviewPDF',this.preParams).then(res => {
                if (res.data.code == "0000") {
                    
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        submit() {
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
                                this.showModel = false;
                                this.getQuery();
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
