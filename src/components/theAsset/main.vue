<template>
  <div id="content">
    <el-col :span="18">
      <el-form :inline="true">
        <el-form-item label="资产方编号：">
          <el-input placeholder="请输入资产方编号" v-model="query.params.assetsNo"></el-input>
        </el-form-item>
        <el-form-item label="资产方名称：">
          <el-input placeholder="请输入资方产名称" v-model="query.params.assetsName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="ml20" type="primary" @click="getQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="4" :offset="2" style="text-align: right;padding-right: 10px">
      <el-button type="primary" @click="newAsset">+新增资产方</el-button>
    </el-col>

    <el-table :data="tableData">
      <el-table-column align="center" prop="assetsNo" label="资产方编号"></el-table-column>
      <el-table-column align="center" prop="assetsName" label="资产方名称"></el-table-column>
      <el-table-column align="center" prop="corporation" label="法人姓名"></el-table-column>
      <el-table-column align="center" prop="orgCode" label="组织机构代码"></el-table-column>
      <el-table-column align="center" label="详细地址">
        <template slot-scope="scope">
          <span>{{getAreaFromCode(scope.row,'')+scope.row.detailedAdress}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{getDate(scope.row.instDate)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="启用状态">
        <template slot-scope="scope">
          <span>{{(scope.row.stat == '13900001') ? '启用':'禁用'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="165px">
        <template slot-scope="scope">
          <a class="link" @click="showCheckDialog(scope.row)">查看</a>
          <a class="link" v-if="isEdit" @click="showEditDialog(scope.row)">修改</a>
          <a class="link" v-if="isEdit" @click="showDisableDialog(scope.row)">
            {{(scope.row.stat == '13900001') ?'禁用':'启用'}}</a>
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

    <el-dialog
      title="提示"
      :visible.sync="disabledDialogVisible"
      width="25%"
      center>
      <span style="display: block;margin: 20px;padding:0 10px">{{tipsForDisabledDialog}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="disable">提 交</el-button>
    <el-button @click="disabledDialogVisible = false">取 消</el-button>
  </span>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="addDialogVisible" center width="40%" style="padding: 0px 10px">
      <el-form :model="assetForm" style="padding: 0px 10px" :rules="rules" ref="assetForm"
               :label-width="formLabelWidth">
        <el-form-item label="资产方编号" prop="assetsNo" :style="assetsNoShow">
          <el-input type="text" v-model.trim="assetForm.assetsNo" placeholder="请填写资产方名称" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="资产方名称" prop="assetsName">
          <el-input type="text" v-model.trim="assetForm.assetsName" placeholder="请填写资产方名称"></el-input>
        </el-form-item>
        <el-form-item label="法人姓名" prop="corporation">
          <el-input type="text" v-model.trim="assetForm.corporation" placeholder="请填写法人姓名"></el-input>
        </el-form-item>
        <el-form-item label="组织机构代码" prop="orgCode">
          <el-input type="text" v-model.trim="assetForm.orgCode" placeholder="请填写资产方组织机构代码"></el-input>
        </el-form-item>
        <el-form-item label="所在区域" prop="adress">
          <el-cascader :options="option" v-model.trim="assetForm.temp" :props="props"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailedAdress">
          <el-input type="text" v-model.trim="assetForm.detailedAdress" placeholder="请填写资产方详细地址"></el-input>
        </el-form-item>
        <el-form-item label="对公账户" prop="pubAccount">
          <el-input type="text" v-model.trim="assetForm.pubAccount" placeholder="请填写资产方对公账户号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addAsset">提 交</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看资产方信息" :visible.sync="checkDialogVisible" center width="35%">
      <el-form :model="itemData" :label-width="formLabelWidth">
        <el-form-item label="资产方编号：">
          {{itemData.assetsNo}}
        </el-form-item>
        <el-form-item label="资产方名称：">
          {{itemData.assetsName}}
        </el-form-item>
        <el-form-item label="法人姓名：">
          {{itemData.corporation}}
        </el-form-item>
        <el-form-item label="组织机构代码：">
          {{itemData.orgCode}}
        </el-form-item>
        <el-form-item label="所在区域：">
          {{getAreaFromCode(itemData,'/')}}
        </el-form-item>
        <el-form-item label="详细地址：">
          {{itemData.detailedAdress}}
        </el-form-item>
        <el-form-item label="对公账户：">
          {{itemData.pubAccount}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import areas from '../../data/address'
  import { getBtnAuth, getFormatDateByLong } from '@/assets/js/utils.js'

  export default {
    data () {
      return {
        title: '新增资产方',
        btnAuth: this.$route.meta.btnAuth,
        areasData: areas,
        option: [],
        tipsForDisabledDialog: '',
        itemData: '',
        props: {
          value: 'value',
          label: 'name',
          children: 'children',
        },
        assetsNoShow: 'display:none',
        checkDialogVisible: false,
        addDialogVisible: false,
        disabledDialogVisible: false,
        formLabelWidth: '120px',
        updateItem: {},
        assetForm: {
          assetsNo: '',
          assetsName: '',
          corporation: '',
          orgCode: '',
          temp: [],
          detailedAdress: '',
          pubAccount: '',
          adress: {},
        },
        rules: {
          assetsName: [
            {required: true, trigger: 'blur', message: '资产方名称'},
          ],
          corporation: [
            {required: true, trigger: 'blur', message: '请填写法人姓名'},
          ],
          // orgCode: [
          //   {required: true, trigger: 'blur', message: '请填写资产方组织机构代码'},
          // ],
          adress: [
            {required:true,validator: this.checkAreas, trigger: 'blur'},
          ],
          detailedAdress: [
            {required: true, trigger: 'blur', message: '请填写资产方详细地址'},
          ],
          pubAccount: [
            {required: true, trigger: 'blur', message: '请填写资产方对公账户号'},
          ],

        },
        query: {
          params: {
            assetsNo: '',
            assetsName: '',
          },
          pageNo: 1,
          pageSize: 10,
          isPage: true,
          order: 'assetsNo',
          orderDesc: 'desc',
        },
        listData: {},
        tableData: [],
      }
    },
    created () {
      let that = this
      that.getQuery()
    },
    mounted () {
      let that = this
      that.initAreasData()//计算省市县数据
      console.log(this.btnAuth)
    },
    methods: {
      getQuery () {//查询资产方数据
        let that = this
        this.$axios.post('/api/bycx-fund-service/assets/getList ', this.query).then(res => {
          if (res.data.code == '0000') {
            that.listData = res.data
            that.tableData = res.data.result
          }
        }).catch(err => {

        })
      },
      showDisableDialog (val) {//显示禁用dialog
        let that = this
        if (val.stat == '13900001') {
          that.tipsForDisabledDialog = '禁用后，其余模块关于该资产方的设置将不可用，确认禁用吗？'
        } else {
          that.tipsForDisabledDialog = '是否启用该资产方？'
        }
        that.disabledDialogVisible = true
        that.updateItem = val
      },
      disable () {
        let that = this
        that.disabledDialogVisible = false
        if (that.updateItem.stat == '13900001') {
          that.updateItem.stat = '13900002'
        } else {
          that.updateItem.stat = '13900001'
        }
        that.update()
      },
      newAsset () {
        let that = this
        that.addDialogVisible = true
        that.assetForm = {}
        that.assetsNoShow = 'display:none'
        that.title = '新增资产方'
      },
      addAsset () {//添加或修改资产方
        let that = this
        that.$refs.assetForm.validate(valid => {
          console.log(valid)
          if (valid) {
            that.addItem()
          } else {
            console.log('return false')
            return false
          }
        })
      },
      addItem () {
        let that = this
        that.assetsNoShow = 'display:none'
        that.addDialogVisible = false
        that.updateItem.assetsName = that.assetForm.assetsName
        that.updateItem.corporation = that.assetForm.corporation
        that.updateItem.orgCode = that.assetForm.orgCode
        that.updateItem.detailedAdress = that.assetForm.detailedAdress
        that.updateItem.pubAccount = that.assetForm.pubAccount
        if (that.assetForm.taxAccount === undefined || that.assetForm.taxAccount === null ||
          that.assetForm.taxAccount === '') {
          that.updateItem.taxAccount = ''
        }
        that.updateItem.taxAccount = that.assetForm.taxAccount
        if (that.assetForm.stat === undefined || that.assetForm.stat === null || that.assetForm.stat === '') {
          that.updateItem.stat = '13900001'
        }
        that.updateItem.province = that.assetForm.temp[0]
        that.updateItem.city = that.assetForm.temp[1]
        that.updateItem.area = that.assetForm.temp[2]
        if (that.assetForm.id !== undefined && that.assetForm.stat !== null && that.assetForm.stat !== '') {
          that.updateItem.id = that.assetForm.id
        }
        that.update()
      },
      update () {
        let that = this
        that.$axios.post('/api/bycx-fund-service/assets/save', {params: that.updateItem}).then(res => {
          if (res.data.code == '0000') {
            that.updateItem = {}
            that.resetForm()
            that.getQuery()
          } else {
            that.$message.error(res.data.msg)
          }
        }).catch(err => {
          that.$message.error(err.msg)
        })
      },
      checkAreas (rule, value, callback) {
        let that = this
        if (that.assetForm.temp === undefined || that.assetForm.temp === null) {
          callback(new Error('请选择省市县'))
        }else if (that.assetForm.temp.length === 0) {
          callback(new Error('请选择省市县'))
        } else {
          callback()
        }
      },
      initAreasData () {
        let that = this
        that.areasData.forEach(function (stepOne, index, array) {
          if (stepOne.parent === '0') {
            stepOne.children = []
            that.areasData.forEach(function (stepTwo) {
              if (stepTwo.parent === stepOne.value) {
                stepTwo.children = []
                that.areasData.forEach(function (stepThree) {
                  if (stepThree.parent === stepTwo.value) {
                    stepTwo.children.push(stepThree)
                  }
                })
                stepOne.children.push(stepTwo)
              }
            })
            that.option.push(stepOne)
          }
        })
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.getQuery()
      },
      handleCurrentChange (val) {
        this.query.pageNo = val
        this.getQuery()
      },
      resetForm () {
        let that = this
        that.addDialogVisible = false
        that.$refs.assetForm.resetFields()
      },
      getDate (val) {
        return getFormatDateByLong(val, 'yyyy-MM-dd hh:mm')
      },
      showEditDialog (val) {
        let that = this
        var temp = JSON.parse(JSON.stringify(val))
        that.assetsNoShow = 'display:block'
        that.assetForm = temp
        that.assetForm.temp = []
        that.assetForm.temp[0] = temp.province
        that.assetForm.temp[1] = temp.city
        that.title = '修改资产方信息'
        that.assetForm.temp[2] = temp.area
        that.addDialogVisible = true

      },
      showCheckDialog (val) {
        let that = this
        that.checkDialogVisible = true
        that.itemData = val
      },
      getAreaFromCode (val, patrn) {
        var province = ''
        var city = ''
        var area = ''
        let that = this
        that.areasData.forEach(function (stepOne, index, array) {
          if (stepOne.value === val.province) {
            province = stepOne.name
          }
          if (stepOne.value === val.city) {
            city = stepOne.name
          }
          if (stepOne.value === val.area) {
            area = stepOne.name
          }
        })
        return province + patrn + city + patrn + area
      },
    },
    computed: {
      isEdit () {
        return getBtnAuth('syst:assets:save')
      },
    }
    ,
  }
</script>

<style scoped>

</style>
