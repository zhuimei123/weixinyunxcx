const app = getApp()

Page({

  data: {
    step: 1,
    gonghao: null,
    wuwu: 1,
    userInfo2: 0,
    xingmingnihao: null,
    openid: '',
    quanxin: 0,
    mingcimax:0,
    mymingci:null ,
    mid:null,
    gh:null,
    tichum:null,
    
    
    paiduimingxi:null

  },


  onLoad: function (options) {
    if (!this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({openid: res.result.openid})
          console.log("1111111111111aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
          console.log(res.result.openid)
           ///
          wx.cloud.database().collection('quanxin').where({ 'quanxinid': res.result.openid }).get({
            success: res => {
              if(res.data.length)this.setData({ quanxin: 1 })
              console.log(res.data)
                console.log("2222222222222222aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            },
            fail: err => {
                     console.error('[数据库] [查询明细] 失败：', err)
            }
          }),



           ///


         
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
        console.log('parseint(-1):', parseInt('-1'))
        this.getmingci()
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

  getmingci: function () {
    this.setData({ cw: parseInt(this.data.gonghao) })
    wx.cloud.database().collection('army').where({ 'ch': this.data.cw }).get({
      success: res => {
     if(res.data.length){
        this.setData({mymingci: res.data[0].mingci})}
     else { this.setData({ mymingci: 0 })}
        console.log('[数据库] [查询名次] 成功: ', this.data.mymingci)

      },
      fail: err => {
        wx.showToast({icon: 'none',title: '查询名次记录失败'})
        console.error('[数据库] [查询名次] 失败：', err)
      }
    })
    
  },  
 
  getmingxi: function () {
    wx.cloud.database().collection('army').field({ 'ch': true, 'mingci': true }).orderBy('mingci', 'desc').get({
      success: res => {

        this.setData({ paiduimingxi: res.data})
        console.log('[数据库] [查询明细] 成功: ', this.data.paiduimingxi)

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询明细] 失败：', err)
      }
    }),

    console.log('执行到这里')

   

    

  },
  

  inarmy: function () {
    wx.cloud.database().collection('army').where({ 'ch': this.data.gonghao }).get({
      success: res => {


                 if (res.data.length) {
                      wx.showToast({ icon: 'none',title:'已经在队里了'})
                       console.error('已经在队里了', err)
                      }
                  else{
   

                          wx.cloud.callFunction({name: 'colletionupdate', data: {m: 1,n:1}}).then(res => {
                 wx.cloud.database().collection('army').add({ data: { ch: this.data.gonghao, mingci: 1 } }).then(res => {
                              console.log('[数据库] 加入队伍成功: '),
                                this.getmingxi()
                                this.getmingci()
                              wx.showToast({ icon: 'none', title: '加入队伍' })
                            }).catch(console.log("346346754677"), console.error)

                                 console.log('[数据库] 全部加1 成功: ')
                          }).catch(console.log("sdgsdgklsdgjsd"),console.error)


                  
                  }
       //else end,
      },
      fail: err => {
        wx.showToast({icon: 'none',title: '查询记录失败'})
        console.error('[数据库] [查询记录] 失败：', err)
      }
      //fail end
    })
  },

  
  ///////
  outarmy: function () {
    wx.cloud.database().collection('army').where({ 'ch': this.data.gonghao }).get({
      success: res => {


        if (!res.data.length) {
          wx.showToast({ icon: 'none', title: '没有在队里了' })
          console.error('没有在队里了', err)
        }
        else {


          wx.cloud.callFunction({name: 'colletionremove', data: { a: this.data.gonghao}})
            .then(res => {
              wx.cloud.callFunction({name: 'colletionupdate', data: { m: 1,  n: -1 }})
                .then(res => {
                  this.getmingxi()
                  this.getmingci()
                    wx.showToast({ icon: 'none', title: '退出排队成功' })
                  console.log('[数据库] [重新排队] 成功: ', res)
                }).catch(console.error),
               
            
               console.log('[数据库] [remove] 成功: ', res)
            })
            .catch(console.error)
            
            
           

     

         
        }
        //else end,
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询最大名次] 失败：', err)
      }
    })
  },
///////
  chadui: function () { 
    if(this.data.gh ||this.data.mid){
      
            this.chadui2()
         

                
  }else{ wx.showToast({ icon: 'none', title: '输入插入位置(前面)和工号' })}},

////////
  chadui2: function () {
    wx.cloud.callFunction({ name: 'colletionupdate', data: { m: this.data.mid, n: 1 } })
      .then(res => {

        wx.cloud.database().collection('army').add({ data: { ch: this.data.gh, mingci: this.data.mid } }).then(res => {
          console.log('[数据库] 中间排队成功: '),
            this.getmingxi()
          
          //wx.showToast({ icon: 'none', title: '中间排队' })
        }).catch(console.log("346346fhdfhdfhdf"), console.error)

        



        
        
      
      }).catch(console.error),



    wx.showToast({ icon: 'none', title: '插队成功' })
    
  },
  ///////
  tichu: function () {
    if (this.data.gh ) {

      
      wx.cloud.database().collection('army').where({ 'ch': this.data.gh }).get({
        success: res => {
          if (res.data.length) {
            this.setData({ tichum: res.data[0].mingci })
            this.tichu2()
          }
          else { wx.showToast({ icon: 'none', title: '噢噢噢噢噢噢噢噢哦哦' }) }
          console.log('噢噢噢噢哦哦哦 ',res.data)

        },
        fail: err => {
         // wx.showToast({ icon: 'none', title: '啊啊啊啊啊啊啊啊啊啊啊' })
          console.error('啊啊啊啊啊啊啊啊啊啊啊', err)
        }
      })
      



    } else { wx.showToast({ icon: 'none', title: '输入工号' }) }
  },

  ////////
  tichu2: function () {
    wx.cloud.callFunction({ name: 'colletionupdate', data: { m: this.data.tichum, n: -1 } })
      .then(res => {
      
        wx.cloud.callFunction({ name: 'colletionremove', data: { a: this.data.gh } }).then(res => {
          console.log('[数据库] 中间排队成功: '),
            this.getmingxi()

        //  wx.showToast({ icon: 'none', title: 'jjjjjjjjjjjjjjjj' })
        }).catch(console.log("急急急急急急急急急急急急"), console.error)








      }).catch(console.error),



      wx.showToast({ icon: 'none', title: '插队成功' })

  },

 
///////
  fromgh: function (e) {
    this.data.gh = parseInt(e.detail.value)



  },
  ///////
  frommid: function (e) {
    this.data.mid = parseInt(e.detail.value)



  },
  ///////



})