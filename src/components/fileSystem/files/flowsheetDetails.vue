<template>
    <div id="content">
      <el-table :data="tableData">
        <el-table-column align="center" label="实还流水id"  width="120px"></el-table-column>
        <el-table-column align="center" prop="loanNo" label="主贷款编号"  width="120px"></el-table-column>
        <el-table-column align="center" prop="subLoanNo" label="子贷款编号"  width="120px"></el-table-column>
        <el-table-column align="center" prop="chanName" label="资方" width="120px"></el-table-column>
        <el-table-column align="center" prop="chanNo" label="资金渠道" width="120px"></el-table-column>
        <el-table-column align="center" label="还款方式" width="120px"></el-table-column>
        <el-table-column align="center" label="交易渠道" width="120px"></el-table-column>
        <el-table-column align="center" label="入账账户" width="120px"></el-table-column>
        <el-table-column align="center" label="入账户名" width="120px"></el-table-column>
        <el-table-column align="center" label="商户号" width="120px"></el-table-column>
        <el-table-column align="center" label="交易账户" width="120px"></el-table-column>
        <el-table-column align="center" label="交易户名" width="120px"></el-table-column>
        <el-table-column align="center" label="入账时间" width="120px"></el-table-column>
        <el-table-column align="center" label="入账金额" width="120px"></el-table-column>
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
    name: 'flowsheetDetails',
    data () {
      return {
        listData: {},
        tableData: [],
      }
    }
  }
</script>

<style scoped>

</style>
