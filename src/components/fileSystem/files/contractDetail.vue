<template>
  <div id="content">
    <el-card :body-style="{ padding: '15px' }" class="card_top">
      <el-form :inline="true" label-width="120px">
        <el-col :span="16" class="mg">
          <el-form-item label="贷款编号：">
            <div>
              {{query.params.loanNo}}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="text-right">
          <el-form-item>
            <el-button type="primary" @click="downAll">一键下载</el-button>
          </el-form-item>
        </el-col>
      </el-form>

      <el-col :span="11" v-for="(item, index) in mList" :key="index" :offset="getOffset(index)">
        <el-card :body-style="{ padding: '15px' }" class="card_top">
          <img src="../../../assets/image/default_pdf.png" class="image"/>
          <div style="padding: 14px;">
            <span>【合同】{{item.attName}}</span>
            <div class="bottom clearfix">
              <!--<time class="time">{{ currentDate }}</time>-->
              <el-button type="text" class="button_left" @click="OpenPDF(item.id)">查看</el-button>
              <el-button type="text" class="button" @click="downPic(item.id)">下载</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-card>
  </div>
</template>

<script>
  let Base64 = require('js-base64').Base64

  export default {
    name: 'contractDetail',
    data () {
      return {
        currentDate: new Date(),
        query: {
          params: {
            fileType: 'CONTR',
            loanNo: '',
            certNo:''
          },
        },
        mList: [],
        url: '',
      }
    },
    mounted () {
      this.query.params.loanNo = this.$route.query.loanNo
      this.query.params.certNo = this.$route.query.certNo
      this.queryList()
      // this.downPic()
      // this.downAll()

    },
    methods: {
      queryList () {
        let that = this
        const url = '/api/bycx-dfs-service/aSysFileAtt/getList'
        // const url = '/api/aSysFileAtt/getList'
        this.$axios.post(url, this.query).then(res => {
          if (res.data.code == '0000') {
            this.mList = res.data.result
            console.log(this.mList)
          }
        }).catch(err => {

        })
      },
      downAll () {

        var param=new FormData();
        param.append('fileType','CONTR');
        param.append('loanNo',this.query.params.loanNo);

        // this.$axios.post('/api/bycx-dfs-service/aSysFileAtt/downBathFile',param,config)
        this.$axios({ // 用axios发送post请求
          method: 'post',
          url: '/api/bycx-dfs-service/aSysFileAtt/downBathFile', // 请求地址
          data: param, // 参数
          responseType: 'blob', // 表明返回服务器返回的数据类型
          'Content-Type': 'multipart/form-data'
        })
        .then(res => {
          const content = res.data
          const blob = new Blob([content])
          const fileName = this.createFile()+'.zip'
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        }).catch(err => {

        })
      },
      downPic (val) {
        const url = '/api/bycx-dfs-service/aSysFileAtt/downLoadAtt'
        const params='?id='+val+'&time='+Math.random()
        this.url=url+params
        // window.open(url+params)
        // const url = '/api/bycx-dfs-service/aSysFileAtt/downLoadAtt'
        // var params = '?fileType=ATT&attType=' + val + '&loanNo=' + this.query.params.loanNo + '&certNo=' +
        //   this.query.params.certNo

        this.$axios({
          method:'get',
          url:url+params,
          responseType:'blob',
        }).then(data => {
          const  fileName=data.headers['content-disposition'].split('=')[1]
          if (!data) {
            return
          }
          let url = window.URL.createObjectURL(data.data)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
        }).catch(err => {

        })
      },
      OpenPDF (val) {
        const url = '/api/bycx-dfs-service/aSysFileAtt/downLoadAtt'
        const params='?id='+val+'&time='+Math.random()
        this.url=url+params
        this.$router.push({path: '/files/pdf', query: {url: Base64.encode(this.url)}})
      },
      createFile(){
        var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var res = "";
          for(var ia = 0; ia < 18 ; ia ++) {
            var id = Math.ceil(Math.random()*35);
            res += chars[id];
          }
          return res;
      },
      getOffset(val){
        if (val==0){
          return 0
        }else if (val%2==0){
          return 0
        }else {
          return 2
        }

      }
    },
  }
</script>

<style scoped>
  .card_top {
    margin-bottom: 24px;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .button_left {
    padding: 0;
    float: left;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
