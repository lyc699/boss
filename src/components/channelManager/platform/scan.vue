<style lang="less">
</style>

<template>
    <div id="content">
        <el-col :span="16">
            <h2>卡牛平台</h2>
            <p>平台码值：{{query.params.drainNo}}</p>
             <br>
        </el-col>
        <el-col :span="16">
            <h2>平台渠道</h2>           
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="chanNo" label="渠道码值"></el-table-column>
            <el-table-column align="center" prop="chanName" label="渠道名称"></el-table-column>
            <el-table-column align="center" prop="chanState" label="渠道状态"></el-table-column>
            <el-table-column align="center" prop="chanShort" label="渠道简称"></el-table-column>
            <el-table-column align="center" prop="brand" label="接入产品"></el-table-column>
            <el-table-column align="center" prop="coopMethod" label="渠道合作方式"></el-table-column>
            <el-table-column align="center" prop="cpa" label="CPA/元"></el-table-column>
            <el-table-column align="center" prop="cps" label="CPS/元"></el-table-column>
            <el-table-column align="center" prop="balanceMethod" label="结算"></el-table-column>
            <!-- <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <router-link :to="{path:'/platform/edit',query:{drainNo:scope.row.drainNo}}" class="link">修改</router-link>
                    <a class="link">删除</a>
                </template>
            </el-table-column> -->

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

export default {
    data() {
        return {
            query:{
                params: {
                    drainNo: this.$route.query.drainNo
                }
            },
            listData:{},
            tableData: [],
        };
    },
    mounted() {
        this.getQuery()
    },
    methods: {
        getQuery(){
            this.$axios
                .post("/api/bycx-syst-service/aSysDrainPlatform/queryPlatform", this.query)
                .then(res => {
                    if (res.data.code == "0000") {
                        this.listData = res.data;
                        this.tableData = res.data.result;
                    }
                });
        },
        handleSizeChange: function (val) {
            this.query.pageSize = val
            this.getQuery()
        },
        handleCurrentChange: function (val) {
            this.query.pageNo = val
            this.getQuery()
        },
        // chanState(row){
        //     return this.CHAN_STATE[row.chanState]
        // }
    }
};
</script>
