<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="22">
            <el-form :inline="true">
                <el-form-item label="协议名称">
                    <el-input placeholder="请输入协议名称" v-model="query.params.agreeName"></el-input>
                </el-form-item>
                <el-form-item label="协议类型">
                    <el-select placeholder="请选择协议类型" v-model="query.params.tmplType">
                        <el-option :label="item.valName" :value="item.valCode" v-for="(item, index) in tmpl_type" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="协议主体">
                    <el-select placeholder="请选择协议主体" v-model="query.params.chan">
                        <el-option :label="item.chanName" :value="item.chanNo" v-for="(item, index) in chan_type" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="协议状态">
                    <el-select placeholder="请选择协议状态" v-model="query.params.stat">
                        <el-option label="启用" value="13900001"></el-option>
                        <el-option label="禁用" value="13900002"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getQuery">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="2" class="text-right">
            <el-button type="primary" @click="toAdd" icon="el-icon-plus" v-if="isSave">新增</el-button>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="agreeNo" label="协议编号"></el-table-column>
            <el-table-column align="center" prop="agreeName" label="协议名称"></el-table-column>
            <el-table-column align="center" prop="agreeTitle" label="协议标题"></el-table-column>
            <el-table-column align="center" prop="tmplType" label="协议类型" :formatter="formatTmplType"></el-table-column>
            <el-table-column align="center" prop="chan" label="协议主体" :formatter="formatChan"></el-table-column>
            <el-table-column align="center" prop="stat" label="协议状态" :formatter="formatStat"></el-table-column>
            <el-table-column align="center" prop="updtDate" label="修改时间" :formatter="formatDate"></el-table-column>
            <el-table-column align="center" prop="instUserNo" label="修改人"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <router-link :to="{path:'/protocol/edit',query:{id:scope.row.agreeNo}}" class="link" v-if="isSave">编辑</router-link>
                    <a class="link" @click="del(scope)" v-if="isDel">删除</a>
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
    </div>
</template>

<script>
import { getBtnAuth,getFormatDateByLong } from '@/assets/js/utils.js'

export default {
    data() {
        return {
            query:{
                params: {
                    agreeNo:"",
                    agreeName:"",
                    tmplType:"",
                    chan:"",
                    stat:""
                },
                pageNo: 1,
                pageSize: 10
            },
            tmpl_type:[],
            chan_type:[],
            listData:{},
            tableData: []
        };
    },
    computed:{
        isSave(){
            return getBtnAuth("syst:aSysAgreementTemplate:save")
        },
        isDel(){
            return getBtnAuth("syst:aSysAgreementTemplate:deleteById")
        }
    },
    mounted() {
         this.$axios.all([this.getChanType(),this.codeQuery()]).then(this.$axios.spread((res1, res2)=>{
            this.chan_type = res1.data.result
            this.tmpl_type = res2.data.result.Tmpl_Type

            this.getQuery()
            
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
        getQuery(){
            this.$axios
                .post("/api/bycx-contract-service/aSysAgreementTemplate/getList", this.query)
                .then(res => {
                    if (res.data.code == "0000") {
                        this.listData = res.data;
                        this.tableData = res.data.result;
                    }
                });
        },
        handleSizeChange (val) {
            this.query.pageSize = val
            this.getQuery()
        },
        handleCurrentChange (val) {
            this.query.pageNo = val
            this.getQuery()
        },
        formatTmplType(row) {
            return row.tmplType
                ? this.tmpl_type.find(item => item.valCode == row.tmplType)
                      .valName
                : row.tmplType;
        },
        formatStat(row) {
            return row.stat == "13900001" ? "启用" : "禁用";
        },
        formatDate(row){
            if(!row.updtDate) return '';

            return getFormatDateByLong(row.updtDate)
        },            
        formatChan(row) {
            const data = this.chan_type.find(item => item.chanNo == row.chan)

            return data ? data.chanName : row.chan
        },
        del(scope){
            this.$confirm(`确认删除协议[${scope.row.agreeName}]？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-contract-service/aSysAgreementTemplate/deleteById',{params: {
                    agreeNo:scope.row.agreeNo
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.tableData.splice(this.tableData.findIndex(item => item.id === scope.row.id), 1)
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        toAdd(){
            this.$router.push('/protocol/edit')
        },
        resetForm() {
            for(let item in this.query.params){
                this.query.params[item] = ''
            }
            this.getQuery()
        }
    }
};
</script>
