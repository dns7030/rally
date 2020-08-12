// pages/user/user.js
Page({

  /**
   * Page initial data
   */
  data: {
    currentUser: null,
    events: {},
    restaurants:{}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

    const app = getApp();
    console.log(app.globalData.userInfo);
    this.setData({currentUser: app.globalData.userInfo});

    const events = new wx.BaaS.TableObject('events');
    const restaurants = new wx.BaaS.TableObject('restaurants');
    events.find().then((res) => {
      console.log('res',res)
      this.setData ({
        events: res.data.objects
      })
    }); 
    restaurants.find().then((res) => {
      console.log('res',res)
      this.setData ({
        restaurants: res.data.objects
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
    })
  },

  bindLogout: function (event) {
    wx.BaaS.auth.logout().then(() => {
      wx.setStorageSync('userInfo', null);
      this.setData({currentUser: null});
      app.globalData.userInfo = null;
      wx.reLaunch({
        url: '/pages/user/user',
      })
    })
  },

  _switchTab: function(e) {
    console.log(e.currentTarget.dataset.tab)
    let activeTab =  e.currentTarget.dataset.tab
    this.setData({
      active: activeTab
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