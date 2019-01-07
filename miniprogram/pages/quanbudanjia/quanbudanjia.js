const app = getApp()

Page({

  data: {
   step:1,
    mycounts: null,
    userInfo2: 0,
    xingmingnihao: null,
    openid: '',
    num:1,
    queryResult2: '',
  },


  onLoad: function () {
    

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
            console.log('starquanbu')
            this.getprice()
          }

        }, fail: err => {
          console.error(e)
        }
      })



  },



    getprice:function() {

    if(!this.data.step)this.setData({step:1})
      wx.cloud.database().collection('monthprice').count({
        success: res =>  {
          
          this.setData({
          mycounts:res.total
        })
         
         
        }
      })



      wx.cloud.database().collection('monthprice').skip((this.data.step-1)*20).get({
        success: res => {
          this.setData({

        
            queryResult2: res.data
            
          })
          console.log('[数据库] [查询记录] 成功: ', res)
          
         

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

  prevStep: function () {
    this.setData({ step: this.data.step - 1 })
    this.setData({ num: Math.ceil((this.data.mycounts) / 20) - this.data.step }) 
    this.getprice();

  },
  nextStep: function () {
   
    this.setData({ step: this.data.step + 1 })
    this.setData({ num: Math.ceil((this.data.mycounts) / 20) - this.data.step }) 
    
    this.getprice();

  },





  

  


})