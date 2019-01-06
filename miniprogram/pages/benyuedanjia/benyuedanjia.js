const app = getApp()

Page({

  data: {
    
    counterId: '',
    fromkuanhao:'',
    kuanhao:'',
    
    openid: '',
    count: null,
    
    queryResult2: '',
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
          this.getbenyue()
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    } },
    getbenyue:function() {
      
      
      
      wx.cloud.database().collection('price').where({ kh: this.data.kuanhao}).get({
        success: res => {
          this.setData({
            
          // queryResult: JSON.stringify(res.data, null, 2),
            queryResult2: res.data
       //     queryResult: res.data
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


  

  fromkuanhao: function (e) {
    this.data.kuanhao = parseInt(e.detail.value);
  


  },

  

 
  

})