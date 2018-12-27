<style lang="less">
</style>

<template>
    <div id="content">
        <el-form :inline="true">
          <el-col :span="24">
              <!-- <el-form-item label="产品归属">
                 <el-select v-model="query.params.productApp" placeholder="请选择产品归属" disabled>
                    <el-option
                      v-for="item in sendAppOptions"
                    :key="item.id"
                    :label="item.valName"
                    :value="item.valCode">
                    </el-option>
                </el-select>
              </el-form-item> -->
            <el-form-item label="产品编号">
                <el-input v-model="query.params.pid"></el-input>
            </el-form-item>
             <el-form-item label="产品名称">
                <el-input v-model="query.params.productName"></el-input>
            </el-form-item>
           <el-form-item label="功能模式">
                 <el-select v-model="query.params.functionMode" placeholder="请选择功能模式">
                    <el-option
                     v-for="item in productFunctionOptions"
                    :key="item.id"
                    :label="item.valName"
                    :value="item.valCode">
                    </el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="24">
             <el-form-item label="业务模式">
                 <el-select v-model="query.params.professionMode" placeholder="请选择业务模式">
                    <el-option
                     v-for="item in goodsTypeOptions"
                    :key="item.id"
                    :label="item.valName"
                    :value="item.valCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="金额">
                <el-col :span="11">
                  <el-input v-model="query.params.minMoney"></el-input>
                </el-col>
                <el-col :span="2" align="center">至</el-col>
                <el-col :span="11">
                  <el-input v-model="query.params.maxMoney"></el-input>
                </el-col>
            </el-form-item>
             <el-form-item label="支持期数">
                  <el-select v-model="query.params.dateNum" placeholder="请选择期数">
                    <el-option
                    v-for="item in dateNumOptions"
                    :key="item.valCode"
                    :label="item.valName"
                    :value="item.valCode">
                    </el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="24">
             <el-form-item label="产品类型">
                  <el-select v-model="query.params.productType" placeholder="请选择产品类型">
                    <el-option
                    v-for="item in productTypeOptions"
                    :key="item.id"
                    :label="item.valName"
                    :value="item.valCode">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="引流平台">
                <el-select v-model="query.params.sourcePlatform" placeholder="请选择引流平台">
                    <el-option
                    v-for="item in sourceOsTypeOptions"
                    :key="item.id"
                    :label="item.valName"
                    :value="item.valCode">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="产品状态">
                <el-select v-model="query.params.productStatus" placeholder="请选择产品状态">
                    <el-option
                    v-for="item in isNoOptions"
                    :key="item.id"
                    :label="item.valName==='是'?'上架': '下架'"
                    :value="item.valCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getQuery('init')">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>   
        </el-form>   
        <el-col clsss="pb20">
            <el-button type="primary" @click="toAdd" v-if="isAdd">新增</el-button>            
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="pid" label="产品编号" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="productName" label="产品名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="functionMode" label="功能模式" :formatter="filterFunctionMode" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" prop="professionMode" label="业务模式" :formatter="filterProfessionMode" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="minMoney" label="最小金额" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="maxMoney" label="最大金额" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="dateNum" label="支持期数" :formatter="filterDateNum" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="productType" label="产品类型" :formatter="filterProductType" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="sourcePlatform" label="引流平台" :formatter="filterSourcePlatform" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="productStatus" label="产品状态" :formatter="filterProductStatus" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="productApp" label="产品归属" :formatter="filterProductApp" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column align="center" prop="instDate" label="插入时间" :formatter="filterFormDate" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="instUser" label="插入人员" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="instUserNo" label="插入人员编号" show-overflow-tooltip></el-table-column> -->
            <el-table-column align="center" prop="updtDate" label="更新时间" :formatter="filterFormDate" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="updtUser" label="更新人员" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" v-if="isDel||isEdit||isAdd" fixed="right" width="120">
                <template slot-scope="scope">
                    <router-link :to="{path:'/rxy/add',query:{pid:scope.row.pid}}" class="link" v-if="isEdit">编辑</router-link>
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
import { getBtnAuth } from "@/assets/js/utils.js";
import _ from 'underscore'
export default {
  data() {
    return {
      query: {
        pageNo: 1,
        pageSize: 10,
        params: {}
      },
      codeParam: {
        list: [
          {
            type: "Mode_Name" // 功能模式码表
          },
          {
            type: "Goods_Type" // 业务模式码表
          },
          {
            type: "Product_Type" // 产品类型码表
          },
          {
            type: "Source_Os_Type" // 引流平台码表
          },
          {
            type: "Is_No" // 产品状态码表
          },
          {
            type: "Send_App" // 产品归属
          }
        ]
      },
      sendAppOptions: [], // 产品归属下拉列表
      productFunctionOptions: [], // 功能模式下拉列表
      goodsTypeOptions: [], // 业务模式下拉列表
      productTypeOptions: [], // 产品类型下拉列表
      sourceOsTypeOptions: [], // 引流平台下拉列表
      isNoOptions: [], // 产品状态下拉列表
      dateNumOptions: [
        {
          valCode: 3,
          valName: "3期"
        },
        {
          valCode: 6,
          valName: "6期"
        },
        {
          valCode: 9,
          valName: "9期"
        },
        {
          valCode: 12,
          valName: "12期"
        },
        {
          valCode: 24,
          valName: "24期"
        },
        {
          valCode: 36,
          valName: "36期"
        }
      ],
      btnAuth: this.$route.meta.btnAuth,
      listData: {},
      tableData: [],
      date: ""
    };
  },
  computed: {
    isAdd() {
      return getBtnAuth("fund:product:addProductInfo");
    },
    isDel() {
        return getBtnAuth("fund:product:deleteProductInfo");
    },
    isEdit() {
      return getBtnAuth("fund:product:updateProductInfo");
    }
  },
  mounted() {
    this.getCodeList();  
  },
  methods: {
    initData() {
      this.query.params = {
        productApp: "41800019",
        pid: "",
        productName: "",
        professionMode: "",
        minMoney: "",
        maxMoney: "",
        dateNum: ""
      };
      this.getQuery();
    },
    getQuery(isIntPage) {
      if(isIntPage==='init'){
        this.query.pageNo = 1
      }
      this.$axios
        .post("/api/bycx-fund-service/product/getProductList", this.query)
        .then(res => {
          let { code, msg } = res.data;
          if (code == "0000") {
            this.listData = res.data;
            this.tableData = res.data.result;
          } else {
            if (msg) this.$message.error(msg);
          }
        });
    },
    getCodeList() {
      this.$axios
        .post("/api/bycx-rece-service/api/sys/code/mobile/query", {
          params: this.codeParam
        })
        .then(res => {
          let { code, msg, result } = res.data;
          if (code == "0000") {
            let {
              Send_App,
              Mode_Name,
              Goods_Type,
              Product_Type,
              Source_Os_Type,
              Is_No
            } = result;
            this.sendAppOptions = Send_App;
            this.productFunctionOptions = Mode_Name;
            this.goodsTypeOptions = Goods_Type;
            this.productTypeOptions = Product_Type;
            this.sourceOsTypeOptions = Source_Os_Type;
            this.isNoOptions = Is_No;
            this.initData()
          } else {
            if (msg) this.$message.error(msg);
          }
        });
    },
    dateChange(val) {
      if (val) {
        this.query.params.instDateMin = val[0];
        this.query.params.instDateMax = val[1];
      } else {
        this.query.params.instDateMin = "";
        this.query.params.instDateMax = "";
      }
    },
    handleSizeChange: function(val) {
      this.query.pageNo = 1
      this.query.pageSize = val;
      this.getQuery();
    },
    handleCurrentChange: function(val) {
      this.query.pageNo = val;
      this.getQuery();
    },
    toAdd() {
      this.$router.push("/rxy/add");
    },
    toDel(scope){
        this.$confirm(`确认删除？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$axios.post('/api/bycx-fund-service/product/deleteProductInfo',{id: scope.row.id})
            .then(res => {
                if (res.data.code == "0000") {
                    this.tableData.splice(this.tableData.findIndex(item => item.id === scope.row.id), 1)
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        })
    },
    resetForm() {
      this.initData();
    },
    filterDateNum(row){
      return row.dateNum.replace(/,/g,'期,').replace(/$/,'期')
    },
    filterFunctionMode(...list){
        return this.filterData('productFunctionOptions',list[2])
    },
    filterProductType(...list) {
        return this.filterData('productTypeOptions',list[2])
    },
    filterProfessionMode(...list){
       return this.filterData('goodsTypeOptions',list[2])
    },
    filterSourcePlatform(...list){
        return this.filterData('sourceOsTypeOptions',list[2])
    },
    filterProductStatus(row){
        return row.productStatus === '13900001' ? '上架' : '下架';
    },
    filterProductApp(...list){
        return this.filterData('sendAppOptions',list[2])
    },
    filterData(optionName,prodValue){
         return _.findWhere(this[optionName],{valCode:prodValue}) && _.findWhere(this[optionName],{valCode:prodValue}).valName;
    },
    filterFormDate (row) {
      if(row.instDate){
        let date = new Date(row.instDate);
        let year = date.getFullYear();
        let month = this.padDate(date.getMonth() + 1);
        let day = this.padDate(date.getDate());
        let hours = this.padDate(date.getHours());
        let minutes = this.padDate(date.getMinutes());
        //返回整理好的数据
        return year + '-' + month + '-' + day + '  ' + hours + ':' + minutes;
      }
    },
    padDate (value) {
        return value < 10 ? '0' + value : value;
    }
  }
};
</script>
