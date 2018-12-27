<style lang="less">
</style>

<template>
    <div id="content">
        <el-form :inline="true">
            <el-form-item label="姓名">
                <el-input placeholder="姓名" v-model="query.params.userName"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input placeholder="手机号" v-model="query.params.mobile"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input placeholder="用户名" v-model="query.params.loginName"></el-input>
            </el-form-item>
            <el-form-item label="最后登录时间">
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
        </el-form>
        <el-col :span="15">
            <el-form :inline="true">
                <el-form-item label="状态">
                    <el-select placeholder="请选择状态" v-model="query.params.status">
                        <el-option label="正常" value="13900001"></el-option>
                        <el-option label="停用" value="13900002"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getQuery">查询</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="2" :offset="7">
            <el-button type="primary" @click="toAdd" v-if="isAdd" icon="el-icon-plus">新增员工</el-button>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="userName" label="姓名"></el-table-column>
            <el-table-column align="center" prop="loginName" label="用户名"></el-table-column>
            <el-table-column align="center" prop="mobile" label="手机号" :formatter="formatPhone"></el-table-column>
            <el-table-column align="center" prop="status" label="状态" :formatter="formatStatus"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <router-link :to="{path:'/staff/edit',query:{id:scope.row.id}}" class="link" v-if="isEdit">编辑</router-link>
                    <a class="link" @click="delUser(scope)" v-if="isDel">删除</a>
                    <a class="link" @click="changeStatus(scope)" v-if="isStatus">{{scope.row.status == '13900001' ? '停用' : '启用'}}</a>
                    <router-link :to="{path:'/staff/resetPwd',query:{id:scope.row.id}}" v-if="isResetPwd" class="link">修改密码</router-link>
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
                    userName:'',
                    mobile:'',
                    loginName:'',
                    status:'',
                    lastLoginDateMin:'',
                    lastLoginDateMax:'',
                    orgCode:'',
                    position:'',
                    roleId:'',
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
            return getBtnAuth("syst:aSysUser:addUser")
        },
        isDel(){
            return getBtnAuth("syst:aSysUser:delUser")
        },
        isEdit(){
            return getBtnAuth("syst:aSysUser:editUser")
        },
        isStatus(){
            return getBtnAuth("syst:aSysUser:changeStatus")
        },
        isResetPwd(){
            return getBtnAuth("syst:aSysUser:changePwd")
        }
    },
    mounted() {
        this.getQuery()
    },
    methods: {
        getQuery(){
            this.$axios
                .post("/api/bycx-syst-service/aSysUser/userList", this.query)
                .then(res => {
                    if (res.data.code == "0000") {
                        this.listData = res.data;
                        this.tableData = res.data.result;
                    }
                });
        },
        formatPhone(row) {
            if(row.mobile){
                return row.mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
            }else{
                return '';
            }
        },
        formatStatus(row){
            switch(row.status){
                case '13900001':
                return '启用';
                break;
                case '13900002':
                return '停用';
                break;
            }
        },
        dateChange(val){            
            if(val){
                this.query.params.lastLoginDateMin = val[0]
                this.query.params.lastLoginDateMax = val[1]
            }else{
                this.query.params.lastLoginDateMin = ''
                this.query.params.lastLoginDateMax = ''              
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
            this.$router.push('/staff/edit')
        },
        delUser(scope){
            this.$confirm(`确认删除员工[${scope.row.userName}]？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-syst-service/aSysUser/delUser',{params: {
                    userIds:scope.row.id
                }}).then(res => {
                    if (res.data.code == "0000") {
                        this.tableData.splice(this.tableData.findIndex(item => item.id === scope.row.id), 1)
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        changeStatus(scope){
            let {id,status} = scope.row

            this.$axios.post('/api/bycx-syst-service/aSysUser/changeStatus',{params: {
                id:id,
                status:status == '13900001' ? '13900002' : '13900001'
            }}).then(res => {
                if (res.data.code == "0000") {
                    scope.row.status = status == '13900001' ? '13900002' : '13900001'
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        resetForm() {
            for(let item in this.query.params){
                this.query.params[item] = ''
            }  
            this.date = ''
            this.getQuery()
        }
    }
};
</script>
