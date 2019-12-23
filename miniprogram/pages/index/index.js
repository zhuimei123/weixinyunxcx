//index.js
const app = getApp()

Page({
  data: {
    wuwu:1,
    userInfo2: 0,
    openid:null,
    xingmingnihao:null,
    mingcheng3:null,
    mingcheng2:null,
    logged: false,
    takeSession: false,
    
  },

  onLoad: function() {
   if (!wx.cloud) {
     wx.redirectTo({
       url: '../chooseLib/chooseLib',
     })
      return
    }

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

    
  getxingming:function(){
    wx.cloud.database().collection('usrs')
      .where({ '_openid': this.data.openid })
      .field({ 'xingming': true })
      .get({
        success: res => {
          if (JSON.stringify(res.data).length > 2) {
        
            this.setData({xingmingnihao: res.data[0].xingming, userInfo2: 1})
     //       this.setData({  xingmingnihao : this.data.xingmingnihao.substring(this.data.xingmingnihao.length - 10, this.data.xingmingnihao.length - 3)})
          console.log('star')
          this.getwuwu()
          }
         
        }, fail: err => { console.error(e) 
        }
      }) 

    

  },
  getwuwu: function () {
    wx.cloud.database().collection('wuwu')
      .where({ '_openid': this.data.openid })
      .field({ 'xingming': true })
      .get({
        success: res => {
          if (JSON.stringify(res.data).length > 2) {

            this.setData({ wuwu: 0 })
            //       this.setData({  xingmingnihao : this.data.xingmingnihao.substring(this.data.xingmingnihao.length - 10, this.data.xingmingnihao.length - 3)})
            console.log('star')
            
          }

        }, fail: err => {
          console.error(e)
        }
      })



  },

  fromgonghao: function (e) {
    this.data.gonghao = parseInt(e.detail.value);



  },

  frommima: function (e) {
    this.data.mima = parseInt(e.detail.value);



  },

  onAddsq: function () {
    if (this.data.gonghao > 0 || this.data.mima > 0){
     const db = wx.cloud.database()
    db.collection('mima').where({ gonghao: this.data.gonghao, mima: this.data.mima }).field({ mingcheng: true }).get({
        success: res => {

          this.setData({mingcheng2: res.data[0].mingcheng})
         
          console.log('okokoko')
          console.log(this.data.mingcheng2.length)
          if(this.data.mingcheng2.length >2)
          {
          //  this.data.mingcheng2 = this.data.mingcheng2.substring(this.data.mingcheng2.length - 10, this.data.mingcheng2.length - 3)
            this.onAdd()}      
               

        }        
      })
    }   //if结束
  },
  
onAdd:function(){
   const db2 = wx.cloud.database()
  db2.collection('usrs').add({
    data: {
      xingming: this.data.mingcheng2,
      gonghao: this.data.gonghao
    },
    success: res => {
      console.log('[数据库] [添加记录] 成功: ', this.data.mingcheng2)
      this.setData({ mingcheng3: this.data.mingcheng2, userInfo2: 1 }),
        wx.redirectTo({
          url: '../index/index',
        })
    },
    fail: err => {
      console.error(e)
      console.log('fail')
    }
  })
},
  onwuwu: function () {
    const db2 = wx.cloud.database()
    db2.collection('wuwu').add({
      data: {
        xingming: this.data.xingmingnihao
        
      },
      success: res => {
        console.log('[数据库] [添加记录] 成功: ', this.data.mingcheng2)
        this.setData({ wuwu: 0 }),
          wx.redirectTo({
            url: '../index/index',
          })
      },
      fail: err => {
        console.error(e)
        console.log('fail')
      }
    })
  }


 

 

 
  
  



  
})
