// pages/description/description.js
const util = require("../../utils/util")
let app= getApp()
Page({

  /**
   * Page initial data
   */
  data: {
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
    console.log('get events', options)
    const app = getApp();

    console.log(app.globalData.userInfo);
    this.setData({currentUser: app.globalData.userInfo});

    const events = new wx.BaaS.TableObject('events');
    events.get(options.id).then((res)=>{
      console.log('restaurant_detail', res);
      
      this.setData({
        events: res.data
      })
    });
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