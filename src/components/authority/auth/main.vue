<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="11">
            <el-form :inline="true">
                <el-form-item label="权限名称：">
                    <el-input placeholder="请输入权限名称" v-model="query.params.menuName"></el-input>
                </el-form-item>
                <el-form-item label="权限类型">
                    <el-select placeholder="权限类型" v-model="query.params.menuType">
                        <el-option label="目录" value="20400001"></el-option>
                        <el-option label="页面" value="20400002"></el-option>
                        <el-option label="功能" value="20400004"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" type="primary" @click="getQuery">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="2" :offset="11" class="text-right">
            <el-button type="primary" @click="toAdd"  icon="el-icon-plus" v-if="isAdd">新增</el-button>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="menuName" label="权限名称"></el-table-column>
            <el-table-column align="center" prop="menuType" label="权限类型" :formatter="formatType"></el-table-column>
            <el-table-column align="center" prop="byOrder" label="顺序"></el-table-column>
            <el-table-column align="center" prop="menuCode" label="权限许可"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <router-link :to="{path:'/auth/edit',query:{id:scope.row.id}}" class="link" v-if="isEdit">编辑</router-link>
                    <a class="link" v-if="isDel" @click="del(scope)">删除</a>
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
                    menuName:'',
                    menuType:'',
                },
                pageNo: 1,
                pageSize: 10
            },
            listData:{},
            tableData: []
        };
    },
    computed:{
        isAdd(){
            return getBtnAuth("syst:aSysMenu:addMenu")
        },
        isDel(){
            return getBtnAuth("syst:aSysMenu:delMenu")
        },
        isEdit(){
            return getBtnAuth("syst:aSysMenu:editMenu")
        }
    },
    mounted() {
        this.getQuery()
    },
    methods: {
        getQuery(){
            this.$axios
                .post("/api/bycx-syst-service/aSysMenu/queryList", this.query)
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

            //sizeChange触发currentChange回调，数据被清空bug
            setTimeout(() => {
                this.getQuery()
            },100)
        },
        formatType(row){
            switch(row.menuType){
                case '20400001':
                return '目录';
                break;
                case '20400002':
                return '页面';
                break;
                case '20400004':
                return '功能';
                break;
            }
        },
        del(scope){
            this.$confirm(`确认删除权限[${scope.row.menuName}]？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-syst-service/aSysMenu/delMenu',{params: {
                    menuIds:scope.row.id
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
            this.$router.push('/auth/edit')
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
