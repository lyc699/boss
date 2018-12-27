<style lang="less">
.user-list{
    li{
        padding:  10px;cursor: pointer;
        &:hover{
            background: #efefef;
            i{
                color: red
            }
        }
    }
}
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
            <el-button type="primary" @click="addStaffDiglog = true">新增员工</el-button>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="userName" label="姓名"></el-table-column>
            <el-table-column align="center" prop="loginName" label="用户名"></el-table-column>
            <el-table-column align="center" prop="mobile" label="手机号"></el-table-column>
            <el-table-column align="center" prop="status" label="状态" :formatter="formatStatus"></el-table-column>
            <!-- <el-table-column align="center" prop="roleName" label="角色" :formatter="formatRole"></el-table-column> -->
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <a class="link" @click="removeUser(scope)">移出</a>
                    <!-- <a class="link" @click="changeStatus(scope)" v-if="isStatus">{{scope.row.status == '13900001' ? '停用' : '启用'}}</a> -->
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
        <el-dialog title="添加员工" :visible.sync="addStaffDiglog" width="40%">
            <el-input v-model="userQuery.params.loginName" placeholder="请输入登录名" @keyup.enter.native="getUser"></el-input>
            <el-row>
                <el-col :span="12" style="height: 425px;overflow-y: auto;">
                    <ul class="user-list">
                        <li v-for="(item, index) in userData.result" :key="index" @click="chooseUser(item)">{{item.userName}}</li>
                    </ul>
                    <el-pagination
                        @size-change="userHandleSizeChange" 
                        @current-change="userHandleCurrentChange" 
                        :current-page="userData.pageNo" 
                        layout="prev, pager, next"
                        :total="userData.totalSize">
                    </el-pagination>
                </el-col>
                <el-col :span="12" style="height: 425px;overflow-y: auto;">
                    <h3 class="p10">已添加 {{selectedUser.length}} 人</h3>
                    <el-col :span="24">
                        <ul class="user-list">
                            <li v-for="(item, index) in selectedUser" :key="index"><span>{{item.userName}}</span><i @click="delUser(index)" class="el-icon-close right" style="margin-top:3px"></i></li>
                        </ul>
                    </el-col>
                </el-col>
            </el-row>
            <div slot="footer" class="text-center">
                <el-button type="primary" @click="addUserToRole">确 定</el-button>
                <el-button @click="addStaffDiglog = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getBtnAuth } from '@/assets/js/utils.js'

export default {
    data() {
        return {
            id:this.$route.query.id,
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
                    roleId:this.$route.query.id,
                },
                pageNo: 1,
                pageSize: 10
            },
            userQuery:{
                params: {
                    loginName:''
                },
                pageNo: 1,
                pageSize: 10
            },
            listData:{},
            tableData: [],
            date:'',
            addStaffDiglog:false,
            userData:{},
            selectedUser:[]
        };
    },
    computed:{
        isStatus(){
            return getBtnAuth("syst:aSysUser:changeStatus")
        },
        isDel(){
            return getBtnAuth("syst:aSysRoleUser:delRoleUser")
        }
    },
    mounted() {
        this.getQuery()
        this.getUser()
    },
    methods: {
        getUser(){
            this.$axios.post('/api/bycx-syst-service/aSysUser/userList',this.userQuery).then(res => {
                if (res.data.code == "0000") {
                    this.userData = res.data
                }
            })
        },
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
        formatRole(row){
            return row.roleList.map(item => item.roleName).join('/')
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
            this.getQuery()
        },
        userHandleSizeChange (val) {
            this.userQuery.pageSize = val
            this.getUser()
        },
        userHandleCurrentChange (val) {
            this.userQuery.pageNo = val
            this.getUser()
        },
        toAdd(){
            this.$router.push('/staff/edit')
        },
        resetForm() {
            for (let item in this.query.params) {
                this.query.params[item] = "";
            }
            this.date = ''
            this.getQuery();
        },
        chooseUser(item){
            for(let el of this.selectedUser){
                if(el.id == item.id) return false;
            }
            
            this.selectedUser.push(item)
        },
        delUser(index){
            this.selectedUser.splice(index,1)
        },
        removeUser(scope){
            this.$confirm(`确认移出员工[${scope.row.userName}]？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/bycx-syst-service/aSysRoleUser/delRoleUser',{params: {
                    roleId:this.id,
                    userId:scope.row.id
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
        addUserToRole(){
            let userIds = this.selectedUser.map(item => item.id).join(',')

            if(!this.selectedUser.length){
                this.$message.error('请先添加员工');
                return false;
            }
            
            this.$axios.post('/api/bycx-syst-service/aSysRoleUser/addUserToRole',{params: {
                roleId:this.id,
                userIds
            }}).then(res => {
                if (res.data.code == "0000") {
                    this.getQuery()
                    this.addStaffDiglog = false
                }else{
                    this.$message.error(res.data.msg)
                }
                
            })
        }
    }
};
</script>
