<template>
  <div id="content">
    <el-card :body-style="{ padding: '15px' }" class="card_top">
      <el-col :span="24" class="text-right">
        <el-button type="primary" @click="downAll">一键下载</el-button>
      </el-col>
      <div style="margin-top: 48px">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="身份证" name="1">
            <template slot="title">
              <span style="font-size: 18px"> 身份证</span>
            </template>
            <el-col :span="11">
              <el-card :body-style="{ padding: '0px' }" class="card_top">
                <img :src="pic.idCard[0]" height="332" width="580"/>
                <div style="padding: 14px;">
                  <span>身份证正面</span>
                  <div class="bottom clearfix">
                    <!--<time class="time">{{ currentDate }}</time>-->
                    <el-button type="text" class="button_left" @click="check('20800004')">查看</el-button>
                    <el-button type="text" class="button" @click="downPic('20800004')">下载</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-card :body-style="{ padding: '0px' }" class="card_top">
                <img :src="pic.idCard[1]" height="332" width="580"/>
                <div style="padding: 14px;">
                  <span>身份证背面</span>
                  <div class="bottom clearfix">
                    <!--<time class="time">{{ currentDate }}</time>-->
                    <el-button type="text" class="button_left" @click="check('20800005')">查看</el-button>
                    <el-button type="text" class="button" @click="downPic('20800005')">下载</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-collapse-item>
          <el-collapse-item title="银行卡" name="2">
            <template slot="title">
              <span style="font-size: 18px"> 银行卡</span>
            </template>
            <el-col :span="11">
              <el-card :body-style="{ padding: '0px' }" class="card_top">
                <img :src="pic.bankCard[0]" height="332" width="580"/>
                <div style="padding: 14px;">
                  <span>银行卡正面</span>
                  <div class="bottom clearfix">
                    <!--<time class="time">{{ currentDate }}</time>-->
                    <el-button type="text" class="button_left" @click="check('20800002')">查看</el-button>
                    <el-button type="text" class="button" @click="downPic('20800002')">下载</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-card :body-style="{ padding: '0px' }" class="card_top">
                <img :src="pic.bankCard[1]" height="332" width="580"/>
                <div style="padding: 14px;">
                  <span>银行卡背面</span>
                  <div class="bottom clearfix">
                    <!--<time class="time">{{ currentDate }}</time>-->
                    <el-button type="text" class="button_left" @click="check('20800003')">查看</el-button>
                    <el-button type="text" class="button" @click="downPic('20800003')">下载</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-collapse-item>
          <el-collapse-item title="用户本人照" name="3">
            <template slot="title">
              <span style="font-size: 18px"> 用户本人照</span>
            </template>
            <el-col :span="11">
              <el-card :body-style="{ padding: '0px' }" class="card_top">
                <img :src="pic.user[0]" height="332" width="580"/>
                <div style="padding: 14px;">
                  <span>现场照</span>
                  <div class="bottom clearfix">
                    <!--<time class="time">{{ currentDate }}</time>-->
                    <el-button type="text" class="button_left" @click="check('20800001')">查看</el-button>
                    <el-button type="text" class="button" @click="downPic('20800001')">下载</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-card :body-style="{ padding: '0px' }" class="card_top">
                <img :src="pic.user[1]" height="332" width="580"/>
                <div style="padding: 14px;">
                  <span>人脸识别活体图片</span>
                  <div class="bottom clearfix">
                    <!--<time class="time">{{ currentDate }}</time>-->
                    <el-button type="text" class="button_left" @click="check('20800022')">查看</el-button>
                    <el-button type="text" class="button" @click="downPic('20800022')">下载</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-collapse-item>
          <el-collapse-item title="信用卡" name="4">
            <template slot="title">
              <span style="font-size: 18px"> 信用卡</span>
            </template>
            <el-col :span="11">
              <el-card :body-style="{ padding: '0px' }" class="card_top">
                <img :src="pic.creCard[0]" height="332" width="580"/>
                <div style="padding: 14px;">
                  <span>信用卡</span>
                  <div class="bottom clearfix">
                    <!--<time class="time">{{ currentDate }}</time>-->
                    <el-button type="text" class="button_left" @click="check('20800019')">查看</el-button>
                    <el-button type="text" class="button" @click="downPic('20800019')">下载</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="11" :offset="2">
              <!--<img src="../../../assets/image/default_pic.png" height="332" width="580"/>-->
              <!--<p class="text_att">信用卡背面</p>-->
            </el-col>
          </el-collapse-item>
          <el-collapse-item title="其他信息" name="5">
            <template slot="title">
              <span style="font-size: 18px"> 其他信息</span>
            </template>
            <el-col :span="11" v-for="(item, index) in pic.other" :key="index"
                    :offset="getOffset(index)">
              <el-card :body-style="{ padding: '0px' }" class="card_top">
                <img :src="item.pic" class="image" height="332" width="580"/>
                <div style="padding: 14px;">
                  <span>{{getName(item.code)}}</span>
                  <div class="bottom clearfix">
                    <!--<time class="time">{{ currentDate }}</time>-->
                    <el-button type="text" class="button_left" @click="check(item.code)">查看</el-button>
                    <el-button type="text" class="button" @click="downPic(item.code)">下载</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>


    <el-dialog
      title="查看图片"
      :visible.sync="dialogVisible"
      width="70%"
       >
      <div style="width: 100%;height: 100%" class="text-center">
        <img :src="picture" width="80%"/>
      </div>

    </el-dialog>
  </div>


</template>

<script>
  import defaultpic from '../../../assets/image/default_pic.png'

  export default {
    name: 'attachmentDetial',
    data () {
      return {
        dialogVisible:false,
        picture:'',
        activeNames: ['1', '2', '3', '4', '5'],
        default_pic: defaultpic,
        pic: {
          idCard: [],
          bankCard: [],
          user: [],
          creCard: [],
          other: [],
        },
        query: {
          params: {
            fileType: 'ATT',
            loanNo: '',
            certNo: '',
          },
        },
        query_code: {
          params: {
            list: [
              {
                'type': 'Atta_Type',
              }],
          },
        },
        mList: [],
        mOther: [],
        codes: [],
        isTure:true
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.query.params.loanNo = this.$route.query.loanNo
      this.query.params.certNo = this.$route.query.certNo
      this.queryCodes()
      this.queryList()
      // this.downPic()
    },
    methods: {
      init () {
        this.pic.idCard[0] = this.default_pic
        this.pic.idCard[1] = this.default_pic
        this.pic.bankCard[0] = this.default_pic
        this.pic.bankCard[1] = this.default_pic
        this.pic.user[0] = this.default_pic
        this.pic.user[1] = this.default_pic
        this.pic.creCard[0] = this.default_pic
        let dftemp = {}
        dftemp.pic = this.default_pic
        dftemp.code = ''
        this.pic.other[0] = dftemp
      },
      queryList () {
        let that=this
        const url = '/api/bycx-dfs-service/aSysFileAtt/getList'
        // const url = '/api/aSysFileAtt/getList'
        that.$axios.post(url, this.query).then(res => {
          if (res.data.code == '0000') {
            that.mList = res.data.result
            let tempIdCard=[]
            let tempBankCard=[]
            let tempUser=[]
            let tempCreCard=[]
            for (var i = 0; i < this.mList.length; i++) {
              let temp = this.mList[i].attType
              const url = '/api/bycx-dfs-service/aSysFileAtt/downLoadAtt'
              const params='?id='+this.mList[i].id+'&time='+Math.random()

              switch (temp) {
                case '20800004'://身份证
                  // this.pic.idCard[0] = '/fds/' + this.mList[i].groupId + '/' + this.mList[i].fdsPath
                  // that.pic.idCard[0] = url+params
                  tempIdCard[0]=url+params
                  break
                case '20800005':
                  tempIdCard[1]=url+params
                  // this.pic.idCard[1] = '/fds/' + this.mList[i].groupId + '/' + this.mList[i].fdsPath
                  break
                case '20800002'://银行
                  tempBankCard[0]=url+params
                  // that.pic.bankCard[0] =  url+params
                  // this.pic.bankCard[0] = '/fds/' + this.mList[i].groupId + '/' + this.mList[i].fdsPath
                  break
                case '20800003':
                  tempBankCard[1]=url+params
                  // that.pic.bankCard[1]= url+params
                  // this.pic.bankCard[1] = '/fds/' + this.mList[i].groupId + '/' + this.mList[i].fdsPath
                  break
                case '20800001'://现场照
                  // this.pic.user[0] = '/fds/' + this.mList[i].groupId + '/' + this.mList[i].fdsPath
                  // that.pic.user[0] =  url+params
                  tempUser[0]=(url+params)
                  break
                case '20800022'://活体识别
                  // this.pic.user[1] = '/fds/' + this.mList[i].groupId + '/' + this.mList[i].fdsPath
                  // that.pic.user[1]=url+params
                  tempUser[1]=url+params
                  break
                case '20800019'://信用卡
                  // this.pic.creCard[0] = '/fds/' + this.mList[i].groupId + '/' + this.mList[i].fdsPath
                  // that.pic.creCard[0]=url+params
                  tempCreCard[0]=url+params
                  break
                default:
                  let dftemp = {}
                  // dftemp.pic = '/fds/' + this.mList[i].groupId + '/' + this.mList[i].fdsPath
                  dftemp.pic = url+params
                  dftemp.code = temp
                  that.mOther.push(dftemp)
                  break
              }

            }
            that.pic.idCard=tempIdCard
            that.pic.creCard=tempCreCard
            that.pic.bankCard=tempBankCard
            that.pic.user=tempUser
            // this.isTrue=!this.isTrue
            if (that.mOther.length != 0) {
              that.pic.other = that.mOther
            }
          }
        }).catch(err => {

        })
      },
      queryCodes () {
        const url = '/api/bycx-rece-service/api/sys/code/mobile/query'
        let that = this
        this.$axios.post(url, this.query_code).then(res => {
          if (res.data.code == '0000') {
            that.codes = res.data.result.Atta_Type
          }
        }).catch(err => {

        })
      },
      handleChange () {

      },
      downPic (val) {
        for (let i = 0; i < this.mList.length; i++) {
          if (val == this.mList[i].attType) {

            const url = '/api/bycx-dfs-service/aSysFileAtt/downLoadAtt'
            const params='?id='+this.mList[i].id

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
            // window.open(url + params)
            return
          }
        }
        this.$message.error('不存在该图片')
      },
      check (val) {

        for (let i = 0; i < this.mList.length; i++) {
          if (val == this.mList[i].attType) {
            const url = '/api/bycx-dfs-service/aSysFileAtt/downLoadAtt'
            const params='?id='+this.mList[i].id+'&time='+Math.random()
            this.dialogVisible = true
            this.picture = url + params
            return
          }
        }
        this.$message.error('不存在该图片')
      },
      downAll () {
        // var turnForm = document.createElement('form')
        // //一定要加入到body中！！
        // document.body.appendChild(turnForm)
        // turnForm.method = 'post'
        // turnForm.id = 'down'
        // turnForm.action = '/api/bycx-dfs-service/aSysFileAtt/downBathFile'
        // // turnForm.target = '_blank'
        // //创建隐藏表单
        // var newElement = document.createElement('input')
        // newElement.setAttribute('name', 'fileType')
        // newElement.setAttribute('type', 'hidden')
        // newElement.setAttribute('value', 'ATT')
        // turnForm.appendChild(newElement)
        // var newElement2 = document.createElement('input')
        // newElement2.setAttribute('name', 'loanNo')
        // newElement2.setAttribute('type', 'hidden')
        // newElement2.setAttribute('value', this.query.params.loanNo)
        // turnForm.appendChild(newElement2)
        // var newElement3 = document.createElement('input')
        // newElement3.setAttribute('name', 'certNo')
        // newElement3.setAttribute('type', 'hidden')
        // newElement3.setAttribute('value', this.query.params.certNo)
        // turnForm.appendChild(newElement3)
        // turnForm.submit()
        //
        // document.querySelector('#down').remove()

        var param=new FormData();
        param.append('certNo',this.query.params.certNo);
        param.append('fileType','ATT');
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
      getName (val) {
        for (let i = 0; i < this.codes.length; i++) {
          if (val == this.codes[i].valCode) {
            return this.codes[i].valName
          }
        }
        return '其他信息'
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
  .text_att {
    margin-top: 5px;
    padding: 15px;
    font-size: 16px;
    margin-bottom: 5px;
  }

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
