<template>
  <div id="content">
    <el-form :inline="true" label-width="120px">
      <el-col :span="11">

        <el-form-item label="订单编号：" style="text-align: left">
          <el-input placeholder="请输入订单编号" v-model="query.params.loanNo"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="身份证号码：">
          <el-input placeholder="请输入身份证号码" v-model="query.params.certNo"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6" class="text-right">
        <el-form-item>
          <el-button type="primary" @click="queryRecord">日志记录</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item label="订单生成时间：">
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
      <el-col :span="7">
        <el-form-item label="手机号码：">
          <el-input placeholder="请输入手机号码" v-model="query.params.phoneNo"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="6" class="text-right">
        <el-form-item>
          <el-button type="primary" @click="restQuery">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <el-table :data="tableData">
      <el-table-column align="center" label="订单编号" prop="loanNo"></el-table-column>
      <el-table-column align="center" label="产品名称" width="96px">
        <template slot-scope="scope">
          {{showProd(scope.row.prodNo)}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单生成时间" width="120px">
        <template slot-scope="scope">
          <span>{{getDate(scope.row.instDate)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="custName" label="用户姓名" width="96px"></el-table-column>
      <el-table-column align="center" prop="certNo" label="身份证号码"></el-table-column>
      <el-table-column align="center" label="合同/协议" width="96px">
        <template slot-scope="scope">
          <a class="link" v-if="showOrHide(scope.row.isContr)" @click="turnToPage(scope.row,'isContr')">查看/下载</a>
          <span v-if="!showOrHide(scope.row.isContr)">无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="流水单号" width="96px">
        <template slot-scope="scope">
          <a class="link" v-if="showOrHide(scope.row.isOrder)" @click="turnToPage(scope.row,'isOrder')">查看/下载</a>
          <span v-if="!showOrHide(scope.row.isOrder)">无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="对公凭证" width="96px">
        <template slot-scope="scope">
          <a class="link" v-if="showOrHide(scope.row.isPublic)" @click="turnToPage(scope.row,'isPublic')">查看/下载</a>
          <span v-if="!showOrHide(scope.row.isPublic)">无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="附件" width="96px">
        <template slot-scope="scope">
          <a class="link" v-if="showOrHide(scope.row.isAtt)" @click="turnToPage(scope.row,'isAtt')">查看/下载</a>
          <span v-if="!showOrHide(scope.row.isAtt)">无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="视频" width="96px">
        <template slot-scope="scope">
          <a class="link" v-if="showOrHide(scope.row.isVideo)" @click="turnToPage(scope.row,'isVideo')">查看/下载</a>
          <span v-if="!showOrHide(scope.row.isVideo)">无</span>
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
    name: 'files',
    data () {
      return {
        query: {
          params: {
            loanNo: '',
            certNo: '',
            phoneNo: '',
            pageNo: 1,
            pageSize: 10,
            isPage: true,
            startDate:'',
            endDate:''
          },
        },
        query_code: {
          params: {
            list: [
              {
                'type': 'Prod_Type',
              }],
          },
        },
        repayDate: '',
        listData: {},
        tableData: [],
        codes: [],
      }
    },
    mounted () {
      this.queryList()
      this.queryCodes()
    },
    methods: {
      queryRecord () {
        this.$router.push({path: '/files/record', query: {type: '0'}})
      },
      restQuery () {
        this.query.params.loanNo = ''
        this.query.params.certNo = ''
        this.repayDate = ''
        this.query.params.phoneNo = ''
        this.queryList()

      },
      queryList () {
        console.log(this.repayDate)
        this.query.params.startDate=this.repayDate[0]
        this.query.params.endDate=this.repayDate[1]
        const url = '/api/bycx-dfs-service/aSysFile/getList'
        // const url = '/api/aSysFile/getList'
        let that = this
        this.$axios.post(url, this.query).then(res => {
          if (res.data.code == '0000') {
            that.listData = res.data
            that.tableData = res.data.result
          }
        }).catch(err => {

        })
      },
      queryCodes () {
        const url = '/api/bycx-rece-service/api/sys/code/mobile/query'
        let that = this
        this.$axios.post(url, this.query_code).then(res => {
          if (res.data.code == '0000') {
            that.codes = res.data.result.Prod_Type
          }
        }).catch(err => {

        })
      },
      showProd (val) {
        var temp = ''
        for (var i = 0; i < this.codes.length; i++) {
          if (val == this.codes[i].valCode) {
            temp = this.codes[i].valName
          }
        }
        if (val == '6100000')
          temp = '未分配产品'
        if (temp == '')
          temp = '未分配产品'
        return temp
      },
      getDate (val) {
        return getFormatDateByLong(val, 'yyyy-MM-dd')
      },
      showOrHide (val) {
        if (val == '13900001') {
          return true
        } else {
          return false
        }
      },
      turnToPage (obj,val) {
        switch (val) {
          case 'isContr':
            this.$router.push({path: '/files/contractDetail', query: {loanNo: obj.loanNo,certNo:obj.certNo}})
            break
          case 'isOrder':
            // this.$router.push({path: '/files/flowsheetDetails', query: {loanNo: obj.loanNo}})
            this.$message.error('该版本暂不支持')
            break
          case 'isPublic':
            // this.$router.push({path: '/files/toPublicDetail', query: {loanNo: obj.loanNo}})
            this.$message.error('该版本暂不支持')
            break
          case 'isAtt':
            this.$router.push({path: '/files/attachmentDetial', query: {loanNo: obj.loanNo,certNo:obj.certNo}})
            break
          case 'isVideo':
            // this.$router.push({path: '/files/videoDetail', query: {loanNo: obj.loanNo}})
            this.$message.error('该版本暂不支持')
            break
          default:
            console.log(val)
            break
        }
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.queryList()
      },
      handleCurrentChange (val) {
        this.query.pageNo = val
        this.queryList()
      },
    },
  }
</script>

