<template>
  <div id="content">
    <el-form :inline="true" label-width="120px">
      <!--<el-col :span="10">-->

        <!--<el-form-item label="订单编号：" style="text-align: left">-->
          <!--<el-input placeholder="请输入订单编号" v-model="orderNo"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-col>-->
      <el-col :span="11">
        <div class="el-form-item" style="text-align: left">
          <el-tooltip  placement="top" offset="-50">
            <div slot="content">呼入时：主叫号码是客户号码<br/>呼出时：主叫号码为我们号码</div>
            <label class="el-form-item__label" style="width: 120px;"> 主叫号码 <i class="el-icon-question"></i></label>
          </el-tooltip>
          <div class="el-form-item__content">
            <el-input placeholder="请输入主叫号码" v-model="callingNum"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="el-form-item" style="text-align: left">
          <el-tooltip  placement="top" offset="-50">
            <div slot="content">呼入时：被叫号码是我们号码<br/>呼出时：被叫号码为客户号码</div>
            <label class="el-form-item__label" style="width: 120px;"> 被叫号码 <i class="el-icon-question"></i></label>
          </el-tooltip>
          <div class="el-form-item__content">
            <el-input placeholder="请输入被叫号码" v-model="calledNum"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="text-right">
        <el-form-item>
          <el-button type="primary" @click="queryRecord">日志记录</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item label="呼叫时间：">
          <el-date-picker
            v-model="repayDate"
            type="daterange"
            range-separator="到"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="7">

        <el-form-item label="呼叫方向：">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="6" class="text-right">
        <el-form-item>
          <el-button type="primary" @click="restQuery">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <el-table :data="tableData">
      <el-table-column align="center" label="呼叫时间"></el-table-column>
      <el-table-column align="center" prop="loanNo" label="用户姓名"></el-table-column>
      <el-table-column align="center" prop="subLoanNo" label="主叫号码"></el-table-column>
      <el-table-column align="center" prop="chanName" label="被叫号码"></el-table-column>
      <el-table-column align="center" prop="chanNo" label="呼叫方向"></el-table-column>
      <el-table-column align="center" label="语音文件"></el-table-column>
    </el-table>


    <el-pagination
      style="margin-top:20px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listData.pageNo"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="listData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listData.total"
    >
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'voices',
    data () {
      return {
        orderNo: '',
        callingNum: '',
        calledNum: '',
        repayDate: '',
        listData: {},
        tableData: [],
        options: [{
          value: '选项1',
          label: '全部'
        }, {
          value: '选项2',
          label: '呼入'
        }, {
          value: '选项3',
          label: '呼出'
        }],
        value: '全部'
      }
    },
    methods: {
      queryRecord () {
        this.$router.push({path: '/voices/record', query: {type: '1'}})
      },
      restQuery () {
        this.orderNo = ''
        this.callingNum = ''
        this.repayDate = ''
        this.calledNum = ''
        this.query()
      },
      query () {

      },
      handleSizeChange () {

      },
      handleCurrentChange () {

      },
    },
  }
</script>

<style scoped>

</style>
