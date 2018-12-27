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

      <el-col :span="11" v-for="(item, index) in mList" :key="item" :offset="(index==0||index==2||index==4) ? 0 : 2">
        <el-card :body-style="{ padding: '15px' }" class="card_top">
          <img src="../../../assets/image/default_pdf.png" class="image"/>
          <div style="padding: 14px;">
            <span>视频{{index+1}}</span>
            <div class="bottom clearfix">
              <!--<time class="time">{{ currentDate }}</time>-->
              <el-button type="text" class="button_left" >查看</el-button>
              <el-button type="text" class="button" @click="downPic(item.attType)">下载</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'videoDetail',
    data () {
      return {
        currentDate: new Date(),
        query: {
          params: {
            fileType: 'VIDEO',
            loanNo: '',
          },
        },
        mList: [],
      }
    },
    mounted () {
      this.query.params.loanNo = this.$route.query.loanNo
      this.queryList()
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

      },
      downPic (val) {
        const url = '/api/bycx-dfs-service/aSysFileAtt/downLoadAtt'
        // const url = '/api/aSysFileAtt/downLoadAtt'
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
        var params = new FormData()
        params.append('fileType', 'VIDEO')
        params.append('attType', val)
        params.append('loanNo', this.query.params.loanNo)
        this.$axios.post(url, params, config).then(res => {
          if (res.headers['content-type'].search('application/json;charset=UTF-8') != -1) {
            this.$message({
              type: 'error',
              message: res.data.msg,
            })
            return
          }
          const content = res
          const blob = new Blob([content])
          const fileName = this.createFile()+'.mp4'
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
      createFile(){
        var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var res = "";
        for(var ia = 0; ia < 18 ; ia ++) {
          var id = Math.ceil(Math.random()*35);
          res += chars[id];
        }
        return res;
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
