// pages/user/user.js
const util = require("../../utils/util");

let app= getApp()
Page({

  data: {
    currentUser: null,
    otherEvent: {},
    myEvent: {},
    joinedEvent: {},
    active: 1,
    futureEvents: [],
    pastEvents: [],

  },

  showEvents: function(event) {
    let data = event.currentTarget.dataset;
    let id = data.id;

    console.log('checking id', id)
    wx.navigateTo({
      url: `/pages/description/description?id=${id}`
    });
  },

  onLoad: function (options) {
    console.log(app.globalData.userInfo);
    this.setData({
      currentUser: app.globalData.userInfo
    });
    let currentUser = this.data.currentUser;

    const myEvent = new wx.BaaS.TableObject('events');
    const otherEvent = new wx.BaaS.TableObject('votes');
    const venue_id = new wx.BaaS.TableObject('venues')
    //events user created
    let query = new wx.BaaS.Query();
    query.compare('created_by', '=', currentUser.id)
    myEvent.setQuery(query).expand(["venue_id"]).limit(100).find().then((res) => {

      console.log('checking events', res)
      let events = res.data.objects

      const now = new Date().getTime();
      console.log('date now', now);
      //define event

      const pastEvents = events.filter(event => {
        console.log('other event past Event', event.event_id)
        const eventDate = new Date(event.date[0]).getTime();
  
        if(eventDate < now) {
          return true;
        }
        return false;
      });

      const futureEvents = events.filter(event => {
        console.log('other event future Event', event.event_id)

        const eventDate = new Date(event.date[0]).getTime();
        if(eventDate > now) {
          return true;
        }
        return false;
      });

      console.log('past and future', pastEvents, futureEvents);

      let formatedEvents = []
      //store event with time

      events.forEach((event)=>{
        // console.log('event.date', event)
        event.date = event.date.map(date => {
        
          return util.formatShortDate(new Date(date));
        
        });
        formatedEvents.push(event)
      })

      this.setData({
        myEvent: res.data.objects,
        futureEvents,
        pastEvents
      })
    })
    //events user joined
    let queryJoined = new wx.BaaS.Query();

    queryJoined.compare('user_id', '=', currentUser.id);
    queryJoined.compare('attending', '=', true);

    // otherEvent.setQuery(queryJoined).expand(["event_id"]).find().then((res) => {
    //   console.log('checking events you joined', res)
    //   let events = res.data.objects

    //   const now = new Date().getTime();
    //   console.log('date now', now);

    //   // const pastEvents = events.filter(event => {
    //   //   console.log('other event past Event', event.event_id)
    //   //   const eventDate2 = new Date(event.event_id.date).getTime();
  
    //   //   if(eventDate2 < now) {
    //   //     return true;
    //   //   }
    //   //   return false;
    //   // });

    //   // const futureEvents = events.filter(event => {
    //   //   console.log('other event future Event', event.event_id)

    //   //   const eventDate2 = new Date(event.event_id.date).getTime();
    //   //   if(eventDate2 > now) {
    //   //     return true;
    //   //   }
    //   //   return false;
    //   // });

    //   // console.log('past and future', pastEvents, futureEvents);

    //   // define event
    //   let formatedEvents = []
    //   // store event with time

    //   // events.forEach((event)=>{
    //   // // console.log('event.date', event)
    //   //   event.date = event.date.map(date => {
    //   //     return util.formatShortDate(new Date(date));
        
    //   //   });
    //   //   formatedEvents.push(event)
    //   // })

    //   this.setData({
    //     otherEvent: res.data.objects,
    //     // futureEvents,
    //     // pastEvents
    //   })
    // })
      //  events that user created
    // const db = app.database()
    // const $ = db.command.aggregate

  },

  userInfoHandler(data) {
    const app = getApp();
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      console.log('user', user);
        app.globalData.userInfo = user;
        // wx.setStorageSync('userInfo', user);
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


  onHide: function () {

  },
  onUnload: function () {

  },


})