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
            <el-table-column align="center" prop="drainChan" label="引流渠道"></el-table-column>
            <el-table-column align="center" prop="instDate" label="录入时间"></el-table-column>
            <el-table-column align="center" prop="instUserNo" label="录入员工"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <router-link :to="{path:'/platform/scan',query:{drainNo:scope.row.drainNo}}" class="link" v-if="isScan">查看</router-link>
                    <router-link :to="{path:'/platform/add',query:{drainNo:scope.row.drainNo, id:scope.row.id}}" class="link" v-if="isEdit">编辑</router-link>
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
                params: {
                    drainNo:'',
                    drainName:'',
                    isPage:true,
                    pageNo: 1,
                    pageSize: 10,
                    order:"instDate",
                    orderDesc:"desc"
                }
            },
            listData:{},
            tableData: [],
        };
    },
    mounted() {
        this.getQuery()
    },
    computed:{
        isAdd(){
            return getBtnAuth("syst:aSysDrainPlatform:saveDrainPlatform")
        },
        isScan(){
            return getBtnAuth("syst:aSysDrainPlatform:queryPlatform")
        },
        isDel(){
            return getBtnAuth("syst:aSysDrainPlatform:delDrainPlatform")
        },
        isEdit(){
            return getBtnAuth("syst:aSysDrainPlatform:updateDrainPlatform")
        }
    },
    methods: {
        getQuery(isIntPage){
            if(isIntPage==='init'){
                this.query.pageNo = 1
            }
            this.$axios
                .post("/api/bycx-syst-service/aSysDrainPlatform/getPlatformList", this.query)
                .then(res => {
                    if (res.data.code == "0000") {
                        this.listData = res.data;
                        this.tableData = res.data.result;
                        for(let i = 0; i < res.data.result.length; i++){
                            this.tableData[i].instDate = this.arrFormDate(this.tableData[i].instDate)
                        }
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
            this.$router.push('/platform/add')
        },
        toDel(scope){
            this.$confirm(`引流平台下有引流渠道，删除引流平台将同步删除所有对应的引流渠道，确认删除吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-syst-service/aSysDrainPlatform/delDrainPlatform',{params: {
                    drainNo: scope.row.drainNo
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
            this.query.params.drainNo = ''
            this.query.params.drainName = ''
            this.getQuery()
        },
        arrFormDate (value) {
            let date = new Date(value);
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
    },
};
</script>
