// pages/description/description.js
const util = require("../../utils/util")
let app= getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    events: []
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

    events.get(options.id).then((res) => {
      console.log('res',res)
      //pull event data
      let events = res.data.objects
      //define event
      let formatedEvents = []
      //store event with time

      events.forEach((event)=>{
        console.log('event.date', event)
        event.date = event.date.map(date => {
          return util.formatTime(new Date(date));
        });
        // event.date = util.formatTime(new Date(event.date))
        formatedEvents.push(event)
      })
      this.setData ({
        events: formatedEvents
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