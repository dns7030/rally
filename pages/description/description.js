// pages/description/description.js
const util = require("../../utils/util")
let app= getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    restaurant: {},
    events: [],
    reviews: [],
    currentUser: null,
    review: [],
    events: [],
    iconSize: [40, 40, 40, 40],
    iconColor: ['red'],
    iconType: [
      'warn'
    ]
  },

  userInfoHandler(data) {
    wx.BaaS.auth.loginWithWechat(data).then(user => {
        app.globalData.userInfo = user;
        this.setData({
          currentUser: user,
        })
      }, err => {
    })
  },

  onLoad: function (options) {

    console.log('userInfo!', getApp().globalData.userInfo);
    this.setData({
      currentUser: getApp().globalData.userInfo,
    });

    const events = new wx.BaaS.TableObject('events');

    console.log({ options })

    events.get(options.id).then((res) => {
      console.log('get one event',res)
      let event = res.data
        event.date = util.formatTime(new Date(event.date));
          this.setData({
          events: event
          })
      })

    let query = new wx.BaaS.Query();

    query.compare('events_id', '=', options.id);

  },

  
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  onShareAppMessage: function () {

  }
})