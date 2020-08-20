// pages/description/description.js
const util = require("../../utils/util")
let app= getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    currentUser: null,
    event: {},
    votes: [],
    longtitude: [],
    latitude: [],
    iconSize: [40, 40, 40, 40],
    iconColor: ['red'],
    iconType: [
      'warn'
    ],
  },

  // userInfoHandler(data) {
  //   wx.BaaS.auth.loginWithWechat(data).then(user => {
  //       app.globalData.userInfo = user;
  //       this.setData({
  //         currentUser: user,
  //       })
  //     }, err => {
  //   })
  // },

  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },

  openLocation: function () {
    
    wx.openLocation({ 
      longitude: this.data.event.venue_id.longitude,
      latitude: this.data.event.venue_id.latitude,
      scale: 100
    })
  },


  onLoad: function (options) {

    console.log('userInfo!', getApp().globalData.userInfo);
    this.setData({
      currentUser: getApp().globalData.userInfo,
    });

    const events = new wx.BaaS.TableObject('events');

    console.log({ options })

    events.expand(["venue_id"]).get(options.id).then((res) => {
      console.log('get one event',res)
      let event = res.data
    
        event.date = util.formatTime(new Date(event.date));
          this.setData({
          event: event
          
          })
      })

    let query = new wx.BaaS.Query();

    query.compare('events_id', '=', options.id);

  },

  yesButton: function (event) {
    let event_id = this.data.events.id;
    console.log('event_id', event_id)

    let attending = new wx.BaaS.TableObject('votes');
    let newAttending = attending.create();
    const data = {
      attending: true,
      event_id: event_id
    }

    newAttending.set(data);
    // Post data to API
    newAttending.save().then((res) => {
      console.log('save res', res);
      const newAttendings = this.data.events;
      newAttendings.push(res.data);
      this.setData({
        event: newAttendings,
      })
       
    })
  },

  noButton: function (event) {
    // let title = event.detail.value.title;
    // let description = event.detail.value.description;

    let event_id = this.data.events.id;
    console.log('event_id', event_id)

    let attending = new wx.BaaS.TableObject('votes');
    let newAttending = attending.create();
    const data = {
      attending: false,
      event_id: event_id
    }

    newAttending.set(data);
    // Post data to API
    newAttending.save().then((res) => {
      console.log('save res', res);
      const newAttendings = this.data.events;
      newAttendings.push(res.data);
      this.setData({
        event: newAttendings,
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