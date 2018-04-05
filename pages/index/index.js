//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    objectArray:[],
    channelList:[],
    articleList:[],
    isEnd:0,
    pageIndex:1,
    channelId:-1
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.initChannel();
    wx.setNavigationBarTitle({
      title: 'plus新闻'
    })
  },
  
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  clickMe: function () {
    var that = this;
    wx.request({
      url: 'http://127.0.0.1/test', //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          objectArray: res.data
        })
      }
    })
  },
 initChannel: function (e) {
   var that = this;
   wx.request({
     url: getApp().globalData.httpServer +'mini/getChannelList', 
     header: {
       'content-type': 'application/json' // 默认值
     },
     success: function (res) {
       console.log(res.data)
       that.setData({
         channelList: res.data.records
       })
     }
   })
  },
  clickChannel: function (e) {
    var that = this;
    that.setData({
      channelId : e.currentTarget.dataset.channelid
    })
    that.setData({
      pageIndex: 1
    })
    wx.request({
      url: getApp().globalData.httpServer+'/mini/queryContent',
      data: {
        currentPage: that.data.pageIndex,
        size: 10,
        channel: that.data.channelId,
        type:1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          articleList: res.data
        })
      }
    })
  },
  loadMore: function () {
    var that = this;
    if(that.data.isEnd==1)
    {
      return;
    }
    that.data.pageIndex++;
  
    // 当前页是最后一页
    setTimeout(function () {
      console.log('上拉加载更多');
      wx.request({
        url: getApp().globalData.httpServer +'mini/queryContent',
        data: {
          currentPage: that.data.pageIndex,
          size: 10,
          channel: that.data.channelId,
          type: 1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          if(res.data.length<=0)
          {
            that.data.isEnd=1;
            return;
          }
          that.setData({
            articleList: that.data.articleList.concat(res.data)
          })
        }
      })
     
    }, 300);
  },
 
  clickArticle: function (e) {
    var that = this;
    var articleId= e.currentTarget.dataset.artid;
    wx.navigateTo({
      url: 'article?id='+articleId
    })
  }
})
