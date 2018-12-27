<style lang="less">
.protocol-edit{
    .el-select{
        width: 100%;
    }
    .ql-editor{
        height:400px;
    }
    .ql-editor.ql-blank::before {
        font-style: normal!important;
    }
    .ql-snow .ql-picker-label::before {
        vertical-align: top;
    }
    .ql-snow .ql-color-picker .ql-picker-label svg, .ql-snow .ql-icon-picker .ql-picker-label svg {
        vertical-align: top;
    }
}
</style>

<template>
    <div id="content">
        <el-col :span="18" class="protocol-edit">
            <el-form :model="params" :rules="rules" ref="ruleForm" label-width="80px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="协议名称" prop="agreeName">
                            <el-input placeholder="请输入协议名称" v-model="params.agreeName"></el-input>
                        </el-form-item>
                        <el-form-item label="协议类型" prop="tmplType">
                            <el-select placeholder="请选择协议类型" v-model="params.tmplType">
                                <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in tmpl_type" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="协议主体" prop="chan">
                            <el-select placeholder="请选择协议主体" v-model="params.chan">
                                <el-option :label="item.chanName" :value="item.chanNo" v-for="(item, index) in chan_type" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="协议状态" prop="stat">
                            <el-select placeholder="是否启用" v-model="params.stat">
                                <el-option label="启用" value="13900001"></el-option>
                                <el-option label="禁用" value="13900002"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="协议标题" prop="agreeTitle">
                            <el-input placeholder="协议标题" v-model="params.agreeTitle"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <quill-editor v-model="params.content" :options="editorOption"></quill-editor>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">保存</el-button>
                    <el-button @click="back">取消</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </div>
</template>

<script>
import {checkPhone} from '@/assets/js/utils.js'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
    components:{
        quillEditor
    },
    data() {
        return {
            id:this.$route.query.id,
            params:{
                agreeNo:"",
                content:"",
                agreeName:"",
                agreeTitle:"",
                tmplType:"",
                chan:"",
                stat:""
            },
            editorOption: {
                placeholder: "请输入协议内容"
            },
            tmpl_type:[],
            chan_type:[],
            rules: {
                agreeName: [
                    { required: true, message: '请输入协议名称', trigger: 'blur' },
                    { type: 'string',min: 4, max: 30, message: '请输入4~30个字符', trigger: 'blur' }
                ],
                tmplType: [
                    { required: true, message: "请选择协议类型",trigger: "change"}
                ],
                chan: [
                    { required: true, message: "请选择协议主体",trigger: "change"}
                ],
                stat: [
                    { required: true, message: "请选择协议状态",trigger: "change"}
                ],
                agreeTitle: [
                    { required: true, message: '请输入协议标题', trigger: 'blur' },
                    { type: 'string',min: 4, max: 30, message: '请输入4~30个字符', trigger: 'blur' }
                ],
            },
        };
    },
    mounted() {
        if(this.id){
            this.$route.meta.title = '编辑协议'
            document.title = '新增协议'
        }else{
            this.$route.meta.title = '新增协议'
            document.title = '新增协议'
        }

        this.$axios.all([this.getChanType(),this.codeQuery()]).then(this.$axios.spread((res1, res2)=>{
            this.chan_type = res1.data.result
            this.tmpl_type = res2.data.result.Tmpl_Type

            if(this.id){
                this.getQueryList()
            }
        }))
        
    },
    methods: {
        codeQuery() {
            return this.$axios
                .post("/api/bycx-rece-service/api/sys/code/mobile/query", {
                    params: {
                        list: [
                            {
                                type: "Tmpl_Type"
                            }
                        ]
                    }
                })
        },
        getChanType(){
            return this.$axios.post('/api/bycx-fund-service/fund/chan/getChanInfosByChanNoAndChanName',{params: {}})
        },
        checkPwd(rule,value,callback){
            let reg = /^\w{6,16}$/

            if(this.id){
                callback()
                return false;
            }

            if (value === "") {
                callback(new Error("请输入密码"))
            }else if(!reg.test(value)){
                callback(new Error("请输入6-16位密码"))
            }else{
                callback()
            }
        },
        getQueryList(){
            this.$axios
                .post("/api/bycx-contract-service/aSysAgreementTemplate/getById", {params:{
                    agreeNo:this.id
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.params = res.data.result
                    }
                });
        },
        back(){
            this.$router.back()
        },
        submit(){
            this.$refs.ruleForm.validate(valid => {
                if(valid){
                    this.$axios.post('/api/bycx-contract-service/aSysAgreementTemplate/save',{params: this.params}).then(res => {
                        if(res.data.code == '0000'){
                            this.$router.push('/protocol')
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        }
    }
};
</script>