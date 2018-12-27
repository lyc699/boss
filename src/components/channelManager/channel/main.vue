<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="24">
            <el-form :inline="true">
                <el-form-item label="引流平台码值">
                    <el-input placeholder="请输入引流平台码值" v-model="query.params.drainNo"></el-input>
                </el-form-item>
                <el-form-item label="引流平台">
                    <el-input placeholder="请输入引流平台" v-model="query.params.drainName"></el-input>
                </el-form-item>
                <el-form-item label="渠道码值">
                    <el-input placeholder="请输入渠道码值" v-model="query.params.chanNo"></el-input>
                </el-form-item>
                <el-form-item label="渠道名称">
                    <el-input placeholder="请输入渠道名称" v-model="query.params.chanName"></el-input>
                </el-form-item>
                <el-form-item label="渠道状态">
                    <el-select v-model="query.params.chanState" placeholder="请选择渠道状态">    
                        <el-option
                        v-for="item in chanStateList"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="接入品牌">
                    <el-select v-model="query.params.brand" placeholder="请选择接入品牌">    
                        <el-option
                        v-for="item in brandList"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道合作方式">
                    <el-select v-model="query.params.coopMethod" placeholder="请选择渠道合作方式">    
                        <el-option
                        v-for="item in coopMethodList"
                        :key="item.id"
                        :label="item.valName"
                        :value="item.valName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结算方式">
                    <el-select v-model="query.params.balanceMethod" placeholder="请选择结算方式">    
                        <el-option
                        v-for="item in balanceMethodList"
                        :key="item.value"
                        :label="item.valName"
                        :value="item.valName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getQuery('init')">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24">
            <el-button type="primary" @click="toAdd" v-if="isAdd">+新增</el-button>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="drainNo" label="引流平台码值"></el-table-column>
            <el-table-column align="center" prop="drainName" label="引流平台"></el-table-column>
            <el-table-column align="center" prop="chanNo" label="渠道码值"></el-table-column>
            <el-table-column align="center" prop="chanName" label="渠道名称"></el-table-column>
            <el-table-column align="center" prop="chanShort" label="渠道简称"></el-table-column>
            <el-table-column align="center" prop="chanState" label="渠道状态"></el-table-column>
            <el-table-column align="center" prop="brand" label="接入产品"></el-table-column>
            <el-table-column align="center" prop="coopMethod" label="渠道合作方式"></el-table-column>
            <el-table-column align="center" prop="cpa" label="CPA/元"></el-table-column>
            <el-table-column align="center" prop="cps" label="CPS/元"></el-table-column>
            <el-table-column align="center" prop="balanceMethod" label="结算方式"></el-table-column>
            <el-table-column align="center" label="操作"  fixed="right" :show-overflow-tooltip="true" min-width='150px'>
                <template slot-scope="scope">
                    <router-link :to="{path:'/channel/add',query:{id:scope.row.id}}" class="link" v-if="isEdit">编辑</router-link>
                    <a class="link" @click="toDel(scope)" v-if="isDel">删除</a>
                </template>
            </el-table-column>

        </el-table>

        <div class="pag-index">
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
    </div>
</template>

<script>
import { getBtnAuth } from '@/assets/js/utils.js'
export default {
    data() {
        return {
            query:{
                params:{}
            },
            listData:{},
            tableData: [],
            chanStateList: [
                {
                    valCode: "13000001",
                    valName: "启用"
                },
                {
                    valCode: "13000002",
                    valName: "未启用"
                }
            ],
            brandList:[],
            coopMethodList: [],
            balanceMethodList: [],
        };
    },
    mounted() {
        this.initData()   
        this.getBrand()
    },
    computed:{
        isAdd(){
            return getBtnAuth("syst:aSysDrainChan:saveDrainChan")
        },
        isDel(){
            return getBtnAuth("syst:aSysDrainChan:delDrainChan")
        },
        isEdit(){
            return getBtnAuth("syst:aSysDrainChan:getDrainChanList")
        }
    },
    methods: {
        initData(){
            this.query.params={
                drainNo:'',
                drainName:'',
                isPage:true,
                pageNo: 1,
                pageSize: 10,
                order:"instDate",
                orderDesc:"desc",
                chanNo: '',
                chanName: '',
                chanState: '',
                brand: '',
                coopMethod: '',
                balanceMethod: ''
            }  
            this.getQuery()
        },
        getBrand(){
            this.$axios.post('/api/bycx-syst-service/aSysCodeInfo/findList',{params:{typeCode:"Access_Brand",status:"13900001"}})
            .then(res => {
                if (res.data.code == "0000") {
                    this.brandList = res.data.result;
                    this.getCoopMethod()    
                }
            })
        },    
        getCoopMethod(){
            this.$axios.post('/api/bycx-syst-service/aSysCodeInfo/findList',{params:{typeCode:"Coop_Method",status:"13900001"}})
            .then(res => {
                if (res.data.code == "0000") {
                    this.coopMethodList = res.data.result;
                    this.getBalanceMethod()
                }
            })
        },
        getBalanceMethod(){
            this.$axios.post('/api/bycx-syst-service/aSysCodeInfo/findList',{params:{typeCode:"Account_Method",status:"13900001"}})
            .then(res => {
                if (res.data.code == "0000") {
                    this.balanceMethodList = res.data.result;
                }
            })
        },           
        getQuery(isIntPage){
            if(isIntPage==='init'){
                this.query.pageNo = 1
            }
            this.$axios
                .post("/api/bycx-syst-service/aSysDrainChan/getDrainChanList", this.query)
                .then(res => {
                    if (res.data.code == "0000") {
                        this.listData = res.data;
                        this.tableData = res.data.result;
                    }
                });
        },
        handleSizeChange: function (val) {
            this.query.pageNo = 1
            this.query.params.pageSize = val
            this.getQuery()
        },
        handleCurrentChange: function (val) {
            this.query.params.pageNo = val
            this.getQuery()
        },
        toAdd(){
            this.$router.push('/channel/add')
        },
        toDel(scope){
            this.$confirm(`确认删除？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-syst-service/aSysDrainChan/delDrainChan',{params: {
                    chanNo: scope.row.chanNo
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.tableData.splice(this.tableData.findIndex(item => item.id === scope.row.id), 1)
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        resetForm() {
            this.initData()
        }
    }
};
</script>
