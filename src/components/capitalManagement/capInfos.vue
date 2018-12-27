<style lang="less" scoped>
.danger {
  color: #f56c6c;
}
</style>

<template>
    <div id="content">
        <el-form :inline="true"  :model="query.params" ref="ruleForm">
            <el-col :span="6">
              <el-form-item label="资方编号" prop="fundsNo">
                <el-input v-model="query.params.fundsNo" placeholder="请输入资方编号"></el-input>
            </el-form-item>
            </el-col>
             <el-col :span="6">
              <el-form-item label="资方名称" prop="fundsName">
                <el-input v-model="query.params.fundsName" placeholder="请输入资方名称"></el-input>
            </el-form-item>
            </el-col>           
            <el-button type="primary" @click="getData('init')">查询</el-button>
            <el-button type="primary" @click="resetForm('ruleForm')">重置 </el-button>
        </el-form>
      
        <el-col clsss="pb20" v-if="isAdd">
            <el-button type="primary"  @click="add" ><i class="el-icon-plus">新增</i></el-button>
            <a></a>
        </el-col>
        <el-table :data="tableData" index>
            <el-table-column align="center" prop="fundsName" label="资方名称"></el-table-column>
            <el-table-column align="center" prop="fundsNo" label="资方编号"></el-table-column>
            <el-table-column align="center" prop="hasBiz" label="包含业务"></el-table-column>
            <el-table-column align="center" prop="totalAmt" label="日放款量"></el-table-column>
             <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <router-link :to="{path:'/capInfos/edit',query:{fundsNo:scope.row.fundsNo}}" class="link" v-if="isEdit">编辑</router-link>
                    <a class="link" @click="del(scope)" v-if="isDel">删除</a>
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
import { getBtnAuth } from "@/assets/js/utils.js";
import _ from "underscore";
export default {
  data() {
    return {
      query: {
        pageNo: 1, // 当前页码
        pageSize: 10, // 分页条数
        params: {
          fundsNo: "", // 资方编号
          fundsName: "", // 资方名称
          signAssets: "", // 包含业务
          totalAmt: "" // 日放款量
        }
      },
      btnAuth: this.$route.meta.btnAuth,
      listData: {}, // 分页信息
      tableData: [], // 表格信息
      assetsOptions:[]//签约资产方
    };
  },
  computed: {
    isAdd() {
      return getBtnAuth("fund:fund:chan:addChanInfo");
    },
    isEdit() {
      return getBtnAuth("fund:fund:updateFundInfo");
    },
    isDel() {
      return getBtnAuth("fund:fund:deleteFundInfo");
    }
  },
  mounted() {
    this.getAssets()
  },
  methods: {
    getData(isIntPage) {
      if(isIntPage==='init'){
        this.query.pageNo = 1
      }
      this.$axios
        .post("/api/bycx-fund-service/fund/getAllFunds", this.query)
        .then(res => {
          let { code, msg, result } = res.data;
          if (code == "0000") {
            this.listData = res.data;
            this.tableData = result;
          } else {
            if (msg) this.$message.error(msg);
          }
        });
    },
    getAssets(){
        this.$axios.post('/api/bycx-fund-service/assets/getList',{})
        .then(res => {
            let {code,msg,result} = res.data
            if (code == "0000") {
                this.assetsOptions = result 
                this.getData()
            }else{
                if(msg) this.$message.error(msg)
            }
        })
    },
    handleSizeChange(val) {
      this.query.pageNo = 1
      this.query.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.query.pageNo = val;
      this.getData();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getData();
    },
    add() {
      this.$router.push("/capInfos/add");
    },
    del(val) {
      let that = this;
      that
        .$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          that.$axios
            .post("/api/bycx-fund-service/fund/deleteFundInfo", {
              id: val.row.id
            })
            .then(res => {
              let { code, msg, result } = res.data;
              if (code === "0000") {
                this.tableData.splice(val.$index, 1);
                that.$message({
                  message: "删除成功",
                  type: "success"
                });
              } else {
                if (msg) that.$message.error(msg);
              }
            });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
