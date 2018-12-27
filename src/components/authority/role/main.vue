<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="16">
            <el-form :inline="true">
                <el-form-item label="角色名称：">
                    <el-input placeholder="请输入角色名称" v-model="query.params.roleName"></el-input>
                </el-form-item>
                <el-form-item label="创建时间：">
                    <el-date-picker 
                        type="daterange" 
                        v-model="date" 
                        @change="dateChange" 
                        value-format="yyyy-MM-dd" 
                        range-separator="至" 
                        start-placeholder="开始日期" 
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getQuery">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="2" :offset="6" class="text-right">
            <el-button type="primary" @click="toAdd"  icon="el-icon-plus" v-if="isAdd">新增</el-button>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="roleName" label="角色名称"></el-table-column>
            <el-table-column align="center" prop="remark" label="描述"></el-table-column>
            <el-table-column align="center" prop="instDate" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <router-link :to="{path:'/role/edit',query:{id:scope.row.id}}" class="link" v-if="isEdit">编辑</router-link>
                    <a class="link" v-if="isDel" @click="delRole(scope)">删除</a>
                    <router-link :to="{path:'/role/staff',query:{id:scope.row.id}}" class="link" v-if="isManger">员工管理</router-link>
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
import { getBtnAuth } from '@/assets/js/utils.js'

export default {
    data() {
        return {
            query:{
                params: {
                    roleName:'',
                    instDateMin:'',
                    instDateMax:'',
                },
                pageNo: 1,
                pageSize: 10
            },
            listData:{},
            tableData: [],
            date:''
        };
    },
    computed:{
        isAdd(){
            return getBtnAuth("syst:aSysRole:addRole")
        },
        isDel(){
            return getBtnAuth("syst:aSysRole:delRoles")
        },
        isEdit(){
            return getBtnAuth("syst:aSysRole:editRole")
        },
        isManger(){
            return getBtnAuth("syst:aSysUser:userList")
        }
    },
    mounted() {
        this.getQuery()
    },
    methods: {
        getQuery(v){
            this.$axios
                .post("/api/bycx-syst-service/aSysRole/queryList", this.query)
                .then(res => {
                    if (res.data.code == "0000") {
                        this.listData = res.data;
                        this.tableData = res.data.result;
                    }
                });
        },
        dateChange(val){
            if(val){
                this.query.params.instDateMin = val[0]
                this.query.params.instDateMax = val[1]
            }else{
                this.query.params.instDateMin = ''
                this.query.params.instDateMax = ''              
            }
        },
        handleSizeChange (val) {
            this.query.pageSize = val
            this.getQuery()
            
        },
        handleCurrentChange (val) {
            this.query.pageNo = val

            //sizeChange触发currentChange回调，数据被清空bug
            setTimeout(() => {
                this.getQuery()
            },100)
            
        },
        toAdd(){
            this.$router.push('/role/edit')
        },
        resetForm() {
            for(let item in this.query.params){
                this.query.params[item] = ''
            }
            this.date = ''
            this.getQuery()
        },
        delRole(scope){
            this.$confirm(`确认删除[${scope.row.roleName}]角色？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-syst-service/aSysRole/delRoles',{params: {
                    ids:scope.row.id
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.tableData.splice(this.tableData.findIndex(item => item.id === scope.row.id), 1)
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            })
        }
    }
};
</script>
