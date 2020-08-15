// pages/description/description.js
Page({

  /**
   * Page initial data
   */
  data: {
    restaurant: {},
    events: [],
    reviews: [],
    currentUser: null,
    review: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log('userInfo!', getApp().globalData.userInfo);
    this.setData({
      currentUser: getApp().globalData.userInfo,
    });
    const Events = new wx.BaaS.TableObject('events');

    console.log({ options })

    Events.get(options.id).then((res) => {
      this.setData({
        events: res.data,
      })
    });

    let query = new wx.BaaS.Query();

    query.compare('events_id', '=', options.id);

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

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
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