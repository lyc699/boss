<template>
  <div id="content">
    <el-form :inline="true" label-width="120px">
      <el-col :span="12">
        <el-form-item label="操作时间：">
          <el-date-picker
            v-model="repayDate"
            type="datetimerange"
            range-separator="到"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">

        <el-form-item label="操作人：">
          <el-input placeholder="请输入操作人工号" v-model="query.params.instUserNo"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="4" class="text-right">
        <el-form-item>
          <el-button type="primary" @click="init">查询</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <el-table :data="tableData">
      <el-table-column align="center" prop="instUserNo" label="操作人" width="120px"></el-table-column>
      <el-table-column align="center" label="事件">
        <template slot-scope="scope">
          <span>{{getThings(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  label="操作时间"  width="220px">
        <template slot-scope="scope">
          <span>{{getDate(scope.row.instDate)}}</span>
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
  import { getFormatDateByLong } from '@/assets/js/utils.js'

  export default {
    name: 'record',
    data () {
      return {
        repayDate: '',
        operator: '',
        listData: {},
        type: '',
        query: {
          params: {
            pageNo: 1,
            pageSize: 10,
            isPage: true,
            startDate:'',
            endDate:'',
            instUserNo:''
          },
        },
        tableData:[]
      }
    },
    mounted () {
      this.type = this.$route.query.type
      if(this.type==0) {
        this.init()
      }
    },
    methods:{
      init(){
        this.query.params.startDate=this.repayDate[0]
        this.query.params.endDate=this.repayDate[1]
        const url = '/api/bycx-dfs-service/aSysFileDownLog/getList'
        // const url = '/api/aSysFileAtt/getList'
        this.$axios.post(url, this.query).then(res => {
          if (res.data.code=='0000') {
            this.tableData=res.data.result
            this.listData=res.data
          }
        }).catch(err => {

        })
      },
      getDate (val) {
        return getFormatDateByLong(val, 'yyyy-MM-dd hh:mm:ss')
      },
      getThings(val){
        let temp=''
        switch (val.incident){
          case 'CONTR':
            temp='合同'
            break
          case 'ATT':
            temp='附件'
            break
          case 'ORDER':
            temp='流水单'
            break
          case 'PUBLIC':
            temp='对公凭证'
            break
          case 'VIDEO':
           temp= '视频'
            break
          default:
            temp='其他'
            break
        }
        return '下载了订单号为'+val.loanNo+'的'+temp+'文件'
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.init()
      },
      handleCurrentChange (val) {
        this.query.pageNo = val
        this.init()
      },
    }
  }
</script>

<style scoped>

</style>
