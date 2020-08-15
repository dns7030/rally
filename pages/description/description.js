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