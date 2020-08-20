// pages/description/description.js
const util = require("../../utils/util")
let app= getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    currentUser: null,
    events: [],
    iconSize: [40, 40, 40, 40],
    iconColor: ['red'],
    iconType: [
      'warn'
    ],
  },


  // map function start
  onReady: function (e) {
    // Use wx.createMapContext to obtain the map context
    this.mapCtx = wx.createMapContext('myMap')
  },
  getCenterLocation: function () {
    wx.openLocation({
      longitude,
      latitude,
      scale: 18
    })
  },
// map function end


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

  yesButton: function (event) {
    console.log('yes button checking', event)
    // const data = event.currentTarget.dataset;

    let tableName = 'votes'
    let votes = new wx.BaaS.TableObject('votes');
    let vote = votes.create();

    const data = {
      event_id: this.data.events.id,
      user_id: this.data.currentUser.id
    }

    vote.set(data);

    vote.set(data).save().then((res) => {
      wx.showToast({
        title: 'See you soon!',
        duration: 3000,
        icon: 'success',
        mask: true,
      })
      const vote = res.data

      wx.reLaunch({
        url: '/pages/user/user',
      })

    })

  },

  deleteClick:function(event){
    console.log('deleteEvent', event)
    const page = this;
    let id = event.currentTarget.dataset.deleteid;

    let events = new wx.BaaS.TableObject('events')
    events.delete(events.id).then(() => {
      page.delete(events.id, null)
    });
   },

  onShow: function () {

  },

  onShareAppMessage: function () {

  }
})
