const app = getApp()

Page({

  data: {
    step: 1,
    gonghao: null,
    wuwu: 1,
    userInfo2: 0,
    xingmingnihao: null,
    openid: '',
    num2: 1,
    zhi:null,
    queryResult3: '',
    cw: null,
    mycounts2: null,
    res2: 0,
    i: 0,
   

  },


  onLoad: function (options) {
    if (!this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({

            openid: res.result.openid
          })
          this.getxingming()
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    }

  },


  getxingming: function () {
    wx.cloud.database().collection('usrs')
      .where({ '_openid': this.data.openid })
      .field({ 'xingming': true })
      .get({
        success: res => {
          if (JSON.stringify(res.data).length > 2) {

            this.setData({

              xingmingnihao: res.data[0].xingming, userInfo2: 1

            })
            // this.setData({ xingmingnihao: this.data.xingmingnihao.substring(this.data.xingmingnihao.length - 10, this.data.xingmingnihao.length - 3) })
            console.log('star')
            this.getgonghao()
          }

        }, fail: err => {
          console.error(e)
        }
      })



  },


  getgonghao: function () {


    wx.cloud.database().collection('usrs').where({ _openid: this.data.openid }).field({ gonghao: true }).get({
      success: res => {
        this.setData({


          gonghao: res.data[0].gonghao
        })
        //  this.setData({gonghao:this.data.gonghao.substring(this.data.gonghao.length - 4, this.data.gonghao.length - 2)})         
        console.log('[数据库] [查询工号] 成功: ', this.data.gonghao)
        this.getmingxi()
        this.getsumsum()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  getmingxi: function () {
    if (!this.data.step) this.setData({ step: 1 })

    this.setData({ cw: parseInt(this.data.gonghao) })
    wx.cloud.database().collection('mingxi').where({ 'chewei': this.data.cw }).count({
      success: res => {

        this.setData({
          mycounts2: res.total
        })
        
     
      }
    })

    wx.cloud.callFunction({
      // 云函数名称 
      name: 'colletionsum2',
      // 传给云函数的参数 
      data: {
        a: this.data.gonghao

      },
    })
      .then(res => {


        this.setData({


          queryResult3: res.result.data

        })
        console.log('[数据库] [查询记录55] 成功: ', res)
      })
      .catch(console.error)





  },
  fromzhi: function (e) {
    this.data.zhi = parseInt(e.detail.value);
  
    for (this.data.i = 0; this.data.i < this.data.queryResult3.length; this.data.i++) {
      if (this.data.queryResult3[this.data.i].kh == this.data.zhi || this.data.queryResult3[this.data.i].ch == this.data.zhi || this.data.queryResult3[this.data.i].dj == this.data.zhi || this.data.queryResult3[this.data.i].sl== this.data.zhi) { this.data.queryResult3[this.data.i].visle = 1 } else { this.data.queryResult3[this.data.i].visle  = 0}
      if (typeof e.detail.value == "undefined" || e.detail.value == null || e.detail.value == "") { this.data.queryResult3[this.data.i].visle = 1}
      }

    this.setData({queryResult3: this.data.queryResult3})


  },


  
  getsumsum: function () {

    wx.cloud.callFunction({
      // 云函数名称 
      name: 'colletionsum2',
      // 传给云函数的参数 
      data: {
        a: this.data.gonghao

      },
    })
      .then(res => {


        this.data.res2 = res.result.data[0].je

        for (this.data.i = 1; this.data.i < res.result.data.length; this.data.i++) {
          this.data.res2 = this.data.res2 + res.result.data[this.data.i].je
        }
        this.setData({ res2: Math.floor(this.data.res2) })
        console.log('[数据库] [查询总金额] 成功: ', this.data.res2)

      })
      .catch(console.error)


  },


















})