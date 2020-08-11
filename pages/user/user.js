// pages/user/user.js
Page({

  /**
   * Page initial data
   */
  data: {
    currentUser: null,
    events: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const app = getApp();
    event = new wx.BaaS.TableObject('events');
    console.log(app.globalData.userInfo);
    this.setData({currentUser: app.globalData.userInfo})
   
    event.find().then((res) => {
      console.log('res',res)
      this.setData ({
        events: res.data.objects
      })
    });  
  },

  userInfoHandler(data) {
    const app = getApp();
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      console.log('user', user);
        app.globalData.userInfo = user;
        wx.setStorageSync('userInfo', user);
        this.setData({
          currentUser: user,
        })
      }, err => {
        // **err 有两种情况**：用户拒绝授权，HError 对象上会包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 HError 对象（详情见下方注解）
    })
  },

  _switchTab: function(e) {
    console.log(e.currentTarget.dataset.tab)
    let activeTab =  e.currentTarget.dataset.tab
    this.setData({
      active: activeTab
    })
  },
  bindLogout: function (event) {
    wx.BaaS.auth.logout().then(() => {
      wx.setStorageSync('userInfo', null);
      this.setData({currentUser: null});
      app.globalData.userInfo = null;
      wx.reLaunch({
        url: '/pages/me/me',
      })
    })
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  onHide: function () {

  },
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})