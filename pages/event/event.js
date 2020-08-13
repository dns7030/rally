// pages/event/event.js
Page({

  /**
   * Page initial data
   */
  data: {
    date: '2020-09-01',
    time: '12:01'
  },

  onLoad: function (options) {

  },
  bindDateChange: function(e) {
    this.setData({
        date: e.detail.value
    })
},
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  onReady: function () {

  },

  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})