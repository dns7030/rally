//app.js

App({
  onLaunch: function () {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.BaaS = requirePlugin('sdkPlugin')
    
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment)

    let clientID = '29578368652a91f88d80';  
    wx.BaaS.init(clientID);

    wx.BaaS.auth.loginWithWechat().then(user => {
     
      this.globalData.userInfo = user;

      wx.setStorageSync('userInfo', user);
      console.log('logged in from app.js', user);
    }, err => {
      console.log('fail login');
    })

  },

  globalData: {
    userInfo: wx.getStorageSync('userInfo') || null,
    events: []
  }
})