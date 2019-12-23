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
    mingximax:null,
    mymingci:null ,
    army: null,
  

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
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询工号] 失败：', err)
      }
    })
  },

  getmingxi: function () {
    this.setData({ cw: parseInt(this.data.gonghao) })
    wx.cloud.database().collection('army').where({ 'ch': this.data.cw }).get({
      success: res => {

        this.setData({
          mymingci: res.data[0].mingci
        })
        console.log('[数据库] [查询名次] 成功: ', this.data.mymingci)

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询名次] 失败：', err)
      }
    }),  
 
   
      wx.cloud.database().collection('army').field({ ch: true ,mingci:true}).get({
      success: res => {

        this.setData({
          paiduimingxi: res.result.data
})
        console.log('[数据库] [查询明细] 成功: ', this.data.paiduimingxi)

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询明细] 失败：', err)
      }
    })

   

    

  },
  

  inarmy: function () {

    wx.cloud.database().collection('army').field({ 'mingci': true }).get({
      success: res => {
        this.setData({


          mingcimax: Math.max.apply(res.data.mingci)
        })
        console.log('[数据库] [查询名次明细] 成功: ', res.data.mingci)  
        console.log('[数据库] [查询最大名次] 成功: ', this.data.mingcimax)
        this.getmingxi()
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询最大名次] 失败：', err)
      }
    }),
    
    wx.cloud.database().collection('army').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        ch: this.data.gonghao,
        mingci: this.data.mingcimax+1
       
      }
    })
    .then(res => {
      console.log(res)
    })
    .catch(console.error)

  },

  outarmy: function () {

    wx.cloud.database().collection('army').where({ ch: this.data.gonghao}).remove().then(res => {
      console.log(res)
    })
    .catch(console.error),
    
  

    wx.cloud.database().collection('army').update({
      data: {
        progress: _.inc(-1)
      },
    }).then(res => {
      console.log(res)
    })
    .catch(console.error)




  }





})