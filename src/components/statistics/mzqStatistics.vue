<style lang="less">
.output{
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
    font-size: 16px;
    cursor: pointer;
    margin: 0 5px;
}

</style>

<template>
    <div id="content">
        <el-form :inline="true">
            <el-col :span="6">
              <el-form-item label="渠道编号">
                 <el-select v-model="query.params.chanNo" placeholder="请选择渠道编号">
                    <el-option
                      v-for="item in mzqProdChanNoOptions"
                    :key="item.id"
                    :label="item.valName"
                    :value="item.valCode">
                    </el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="6">   <el-form-item label="产品二级编号">
                 <el-select v-model="query.params.prodTwoType" placeholder="请选择产品二级编号">
                    <el-option
                     v-for="item in productTypeOptions"
                    :key="item.id"
                    :label="item.valName"
                    :value="item.valCode">
                    </el-option>
                </el-select>
            </el-form-item></el-col>
             <el-col :span="6">
                <el-form-item label="起始日期">
                    <el-date-picker
                    v-model="query.params.beginTime"
                    type="datetime"
                    @change="startChoose"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                </el-col>
                <el-col :span="6">
                <el-form-item label="结束日期">
                   <el-date-picker
                    v-model="query.params.endTime"
                    type="datetime"
                    @change="endChoose"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                </el-col>
        </el-form>
      
        <el-col :offset="1" clsss="pb20">
            <el-button type="primary"  @click="outputExcel" ><i class="mr5">+</i>导出</el-button>
            <el-button type="primary" @click="getQuery">查询</el-button>
            <el-button type="primary" @click="resetForm">重置 </el-button>
            <a></a>
        </el-col>
        <el-table :data="tableData">
            <el-table-column align="center" prop="prodNo" label="产品ID"></el-table-column>
            <el-table-column align="center" prop="prodName" label="产品名称"></el-table-column>
            <el-table-column align="center" prop="pvCount" label="浏览次数"></el-table-column>
            <el-table-column align="center" prop="uvCount" label="点击次数"></el-table-column>
            <el-table-column align="center" prop="uvHit" label="点击人数"></el-table-column>
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
import fileDownload from 'js-file-download';
export default {
  data() {
    return {
        query: {
            "pageNo": 1,  // 当前页码
            "pageSize": 10, // 分页条数
            "params":{
                "beginTime":"", // 查询开始时间
                "endTime":"", // 查询结束时间
                "chanNo":"", // 渠道编号|
                "prodTwoType":'' // 产品二级编号
            }
        },
      codeParam:{
         "list": [
              {
                  "type": "Product_Type" // 产品二级类型码表
              }, 
              {
                  "type": "Mzq_Prod_ChanNo" // 渠道编号 码表
              }
          ]
      },
      productTypeOptions:[], // 产品二级类型下拉菜单
      mzqProdChanNoOptions:[], // 渠道编号下拉菜单
      btnAuth: this.$route.meta.btnAuth,
      listData: {}, // 分页信息
      tableData: [] // 表格信息
    };
  },
  computed: {
    isOutPut() {
      return getBtnAuth("syst:aSysRole:addRole");
    },
    isQuery(){
        return getBtnAuth("syst:aSysRole:addRole");
    }
  },
  mounted() {
    this.getQuery();
    this.getCodeList();
  },
  methods: {
    getQuery() {
      this.$axios
        .post("/api/bycx-drainage-service/bMarketVisitRecord/visitRecordList", this.query)
        .then(res => {
          let {code,msg,result} = res.data
          if (code == "0000") {
            this.listData = res.data;
            this.tableData = result;
          }else{
            if(msg)this.$message.error(msg)
          }
        });
    },
    getCodeList(){
      this.$axios.post('/api/bycx-rece-service/api/sys/code/mobile/query',{params:this.codeParam})
      .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {
            let {Product_Type,Mzq_Prod_ChanNo} = result;
            this.productTypeOptions = Product_Type;
            this.mzqProdChanNoOptions = Mzq_Prod_ChanNo;
           }else{
              if(msg) this.$message.error(msg)
           }
      })
    },
    startChoose(val) {
        this.query.params.beginTime = val || "";
    },
    endChoose(val){
         this.query.params.endTime = val || "";
    },
    handleSizeChange: function(val) {
      this.query.pageSize = val;
      this.getQuery();
    },
    handleCurrentChange: function(val) {
      this.query.pageNo = val;
      this.getQuery();
    },
    resetForm() {
      for(let key in this.query.params) {
          this.query.params[key] = "";
      }
      this.getQuery();
    },
    outputExcel(){
       
        this.$axios.post('/api/bycx-drainage-service/bMarketVisitRecord/export',this.query,{responseType: 'arraybuffer'})
        .then(res => {
         
            let fileName = res.headers['content-disposition'].match(/attachment; filename=(.+)\.xls/)[0]
           
            fileDownload(res.data,fileName); 
        })
        .catch(res => {})
        
    }
}
}
</script>
