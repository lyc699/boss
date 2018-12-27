<style lang="less" scoped>
 .danger{
     color:#F56C6C;
 }

</style>

<template>
    <div id="content">        
        <el-form :inline="true" :model="query.params" ref="ruleForm">
            <el-form-item label="资方名称" prop="fundsName">
                <el-input v-model="query.params.fundsName" placeholder="请输入资方名称"></el-input>
            </el-form-item>
              <el-form-item label="业务名称" prop="bizName">
                <el-input v-model="query.params.bizName" placeholder="请输入业务名称"></el-input>
            </el-form-item>
            <el-form-item label="资金渠道编号" prop="chanNo">
                <el-input v-model="query.params.chanNo" placeholder="请输入资金渠道编号"></el-input>
            </el-form-item>
            <el-form-item label="业务类型" prop="bizType">
                <el-select v-model="query.params.bizType" placeholder="请选择业务类型">
                    <el-option
                    v-for="item in bizTypeOptions"
                    :key="item.id"
                    :label="item.valName"
                    :value="item.valCode">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item>
                <el-button type="primary" @click="getData('init')">查询</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" index>
            <el-table-column align="center" prop="fundsName" label="资方名称"></el-table-column>
            <el-table-column align="center" prop="bizName" label="业务名称"></el-table-column>
            <!-- <el-table-column align="center" prop="bizNo" label="业务编号"></el-table-column> -->
            <el-table-column align="center" prop="chanNo" label="资金渠道编号"></el-table-column>
            <el-table-column align="center" prop="bizType" label="业务类型" :formatter="filterBizTypeOptions"></el-table-column>
            <el-table-column align="center" prop="isOpen" label="是否开通" :formatter="filterisOpenOptions"></el-table-column>
            <el-table-column align="center" prop="dayPosition" label="日放款量"></el-table-column>
            <el-table-column align="center" prop="openType" label="开户类型" :formatter="filterOpenTypeOptions"></el-table-column>
            <el-table-column align="center" prop="openNode" label="开户环节" :formatter="filterOpenNodeOptions"></el-table-column>
            <el-table-column align="center" prop="signMode" label="签章模式" :formatter="filterSignModeOptions"></el-table-column>
            <el-table-column align="center" prop="wayPri" label="路由权重">
                <template slot-scope="scope">
                    <span v-if="!scope.row.editFlag">{{ scope.row.wayPri }}</span>
                    <el-input v-else v-model="weightData.wayPri" placeholder="请输入路由权重"></el-input>            
                </template>
            </el-table-column>
            <el-table-column align="center" prop="isMustWay" label="路由必选">
                <template slot-scope="scope">
                    <span v-if="!scope.row.editFlag">{{ filterisMustWayOptions(scope.row)}}</span>
                    <el-select v-else v-model="weightData.isMustWay" placeholder="请选择路由必选">
                        <el-option
                        v-for="item in isNoOptions"
                        :key="item.valCode"
                        :label="item.valName"
                        :value="item.valCode">
                        </el-option>
                    </el-select>           
                </template>
            </el-table-column>
            <el-table-column align="center" prop="openDate" label="开通时间" :formatter="filterFormDate"></el-table-column>
             <el-table-column align="center" label="操作" fixed="right">
                <template slot-scope="scope">
                    <a class="link" @click="changeIsOpen(scope)">{{scope.row.isOpen==='13900001'?'关闭':'开通'}}</a>
                    <router-link v-if="isEdit" :to="{path:'/capChannel/add',query:{id: scope.row.id}}" class="link">查看</router-link>
                    <a class="link" v-if="isDel" @click="toDel(scope)">删除</a>
                    <a class="link" v-if='!scope.row.editFlag' @click="editWeight(scope)">权重设置</a>
                    <a class="link" v-else @click="closeEditWeight(scope)">保存权重</a>
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
import _ from 'underscore';
export default {
  data() {
    return {
        query: {
            pageNo: 1,  // 当前页码
            pageSize: 10, // 分页条数
            params:{}
        },
      codeParam:{
        list: [              
            {
                type: "Goods_Type"// 业务类型码表
            },
            {
                type: "Is_No"//是否
            },
            {
                type: "Open_Acct_Mode"//开户类型
            },
            {
                type: "Open_Acct_Node"//开户环节
            }, 
            {
                type: "Sign_Mode"//签章模式
            },                           
          ]
      },
      bizTypeOptions:[],//业务类型
      isNoOptions:[],//是否
      openTypeOptions:[],//开户类型
      openNodeOptions:[],//开户环节
      signModeOptions:[],//签章模式
      btnAuth: this.$route.meta.btnAuth,
      listData: {}, // 分页信息
      tableData: [], // 表格信息
      weightData:{
        id:'',
        wayPri:'',
        isMustWay:''
      }
    };
  },
  computed: {
    isEdit(){
        return getBtnAuth("fund:fund:chan:editChanInfo");
    },
    isDel(){
         return getBtnAuth("fund:fund:chan:deleteChanInfo");
    }
  },
  mounted() {
    this.getCodeList();
  },
  methods: {
    getData(isIntPage) {
        if(isIntPage==='init'){
            this.query.pageNo = 1
        }
      this.$axios
        .post("/api/bycx-fund-service/fund/chan/getChanInfos", this.query)
        .then(res => {
          let {code,msg,result} = res.data
          if (code == "0000") {
            this.tableData = _.each(result, (item) => 
                item.editFlag = false
            )
            this.listData = res.data;
          }else{
            if(msg)this.$message.error(msg)
          }
        });
    },
    getCodeList(){
      this.$axios.post('/api/bycx-drainage-service/aSysAtt/mobile/query',{params:this.codeParam})
      .then(res => {
          let {code,msg,result} = res.data
           if (code == "0000") {
            let {Goods_Type, Is_No, Open_Acct_Mode, Open_Acct_Node, Sign_Mode} = result;
            this.bizTypeOptions = Goods_Type 
            this.isNoOptions = Is_No
            this.openTypeOptions = Open_Acct_Mode
            this.openNodeOptions = Open_Acct_Node
            this.signModeOptions = Sign_Mode    
            this.getData()
           }else{
              if(msg) this.$message.error(msg)
           }
      })
    },
    changeIsOpen(scope){
        this.$axios.post('/api/bycx-fund-service/fund/chan/updateOpenStat',{
            id: scope.row.id,
            isOpen: scope.row.isOpen === '13900001'?'13900002':'13900001'
        }).then(res => {
            if (res.data.code == "0000") {
                this.$message.success(res.data.msg)
                this.getData()
            }else{
                this.$message.error(res.data.msg)
            }
        })
    },    
    closeEditWeight(scope){
        let temporaryData = {
            wayPri:scope.row.wayPri,
            isMustWay:scope.row.isMustWay
        }
        scope.row.wayPri = this.weightData.wayPri
        scope.row.isMustWay = this.weightData.isMustWay

        //限制正整数
        const num = Number(scope.row.wayPri)

        if(num > 0 && Number.isInteger(num)){
            this.$axios.post('/api/bycx-fund-service/fund/chan/updateOpenStat',this.weightData)
            .then(res => {
                scope.row.editFlag = false
                delete this.weightData.id
                if (res.data.code == "0000") {
                    this.$message.success('修改成功')                
                }else{
                    _.extend(scope.row,temporaryData)
                    this.$message.error(res.data.msg)
                }
            })
        }else{
            this.$message.error('请输入正整数')
        }

    },
    editWeight(scope){
        if(!this.weightData.id){
            this.weightData.id = scope.row.id
            this.weightData.wayPri = scope.row.wayPri
            this.weightData.isMustWay = scope.row.isMustWay
            scope.row.editFlag = true
        }else{
            this.$message.error("请先保存")
        }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getData();
    },
    toAdd(){
        this.$router.push('/capChannel/add');
    },
    toDel(scope){
        this.$confirm(`确认删除？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$axios.post('/api/bycx-fund-service/fund/chan/deleteChanInfo',{
                id: scope.row.id
            }).then(res => {
                if (res.data.code == "0000") {
                    this.tableData.splice(scope.$index,1)
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }else{
                    this.$message.error(res.data.msg)
                }
            })
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
    filterBizTypeOptions(row){
        return _.filter(this.bizTypeOptions, (item) => { return (item.valCode === row.bizType)})[0].valName
    },  
    filterisOpenOptions(row){
        if(row.isOpen){
            return _.filter(this.isNoOptions, (item) => { return (item.valCode === row.isOpen)})[0].valName
        }
    },
    filterOpenTypeOptions(row){
        if(row.openType){
            return _.filter(this.openTypeOptions, (item) => { return (item.valCode === row.openType)})[0].valName
        }
    }, 
    filterOpenNodeOptions(row){
        if(row.openNode){
            return _.filter(this.openNodeOptions, (item) => { return (item.valCode === row.openNode)})[0].valName
        }
    },
    filterSignModeOptions(row){
        if(row.signMode){
            return _.filter(this.signModeOptions, (item) => { return (item.valCode === row.signMode)})[0].valName
        }
    },
    filterisMustWayOptions(row){
        if(row.isMustWay){
            return _.filter(this.isNoOptions, (item) => { return (item.valCode === row.isMustWay)})[0].valName
        }
    },
    filterFormDate (row) {
        if(row.openDate){
            let date = new Date(row.openDate);
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
}
</script>
