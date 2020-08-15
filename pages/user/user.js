// pages/user/user.js
const util = require("../../utils/util")
let app= getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    currentUser: null,
    events: {},
    restaurants:{},
    active: 1,
    futureEvents: [],
    pastEvents: []
  },

  showEvents: function(event) {
    // let data = event.currentTarget.dataset;
    // let id = data.id;
    console.log('checking id', id)
    // wx.navigateTo({
    //   url: `/pages/description/description?id=${id}`
    // });
  },

  onLoad: function (options) {

    const app = getApp();
    console.log(app.globalData.userInfo);
    this.setData({currentUser: app.globalData.userInfo});
    const events = new wx.BaaS.TableObject('events');
    events.find().then((res) => {
      console.log('res',res)
      //pull event data
      let events = res.data.objects
      const now = new Date().getTime();

      console.log('date now', now);

      const pastEvents = events.filter(event => {
        const eventDate = new Date(event.date[0]).getTime();
        if(eventDate < now) {
          return true;
        }
        return false;
      });

      const futureEvents = events.filter(event => {
        const eventDate = new Date(event.date[0]).getTime();
        if(eventDate > now) {
          return true;
        }
        return false;
      });

      console.log(pastEvents, futureEvents);
      //define event
      let formatedEvents = []
      //store event with time
      events.forEach((event)=>{
        // console.log('event.date', event)
        event.date = event.date.map(date => {
          return util.formatTime(new Date(date));
        });
        // event.date = util.formatTime(new Date(event.date))
        formatedEvents.push(event)
      })
      this.setData ({
        events: formatedEvents,
        futureEvents,
        pastEvents
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
 
  onReady: function () {
    this.setData({
      events: app.globalData.events
    })
  },

  /**
   * Lifecycle function--Called when page show
   */
  // onShow: function () {

  //     const app = getApp();
  //     console.log(app.globalData.userInfo);
  //     this.setData({currentUser: app.globalData.userInfo});
  //     const events = new wx.BaaS.TableObject('events');
  //     const restaurants = new wx.BaaS.TableObject('restaurants');
  //     events.find().then((res) => {
  //       console.log('res',res)
  //       //pull event data
  //       let events = res.data.objects
  //       //define event
  //       let formatedEvents = []
  //       //store event with time
  //       events.forEach((event)=>{
  //         event.date = util.formatTime(new Date(event.date))
  //         formatedEvents.push(event)
  //       })
  //       this.setData ({
  //         events: formatedEvents
  //       })
  //     }); 
  //     restaurants.find().then((res) => {
  //       console.log('res',res)
  //       this.setData ({
  //         restaurants: res.data.objects
  //       })
  //     });  
  // },

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