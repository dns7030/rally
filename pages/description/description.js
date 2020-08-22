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
    longitude: [],
    latitude: [],
    events: {},
    attendees: [],
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

  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },

  openLocation: function () {  
    wx.openLocation({ 
      longitude: this.data.events.venue_id.longitude,
      latitude: this.data.events.venue_id.latitude,
      scale: 18
    })
  },


  onLoad: function (options) {

    console.log('userInfo!', getApp().globalData.userInfo);
    this.setData({currentUser: getApp().globalData.userInfo});
   
    const events = new wx.BaaS.TableObject('events');
    console.log({ options })
    // Get specific one event

    events.expand(["venue_id"]).get(options.id).then((res) => {
      console.log('get one event',res)
      let event = res.data

      // event.date = event.date.map(date => {
      //   return util.formatDate(new Date(date));
      // });
 
      event.date = event.date.map(date => {
        return util.formatDate(new Date(date));
      });

      this.setData ({
        events: event,
      })

//get one event
    let query = new wx.BaaS.Query();
    query.compare('event_id', '=', options.id);

    //get attendees id
    const attendees = new wx.BaaS.TableObject('votes')
    console.log('attendees checking', options)
    query.compare('event_id', '=', options.id);
    query.compare('attending', '=', true);
  
    attendees.setQuery(query).expand(['event_id', 'user_id']).find().then((res) => {
      console.log('checking attendees', res)
      this.setData ({
        attendees: res.data.objects
      })
    })

    //get number of people voted on each time
    let votedDate = new wx.BaaS.TableObject('votes')
    query.compare('event_id', '=', options.id);
    query.compare('votedDate', '=', 0);

    votedDate.setQuery(query).expand(['event_id', 'votedDate']).find().then((res) => {
      console.log('checking attendees', res)
      this.setData ({
        votedDate: res.data.objects
      })
    })

 })

    
},

radioChange: function(e) {
  console.log("radioChange",e.detail.value)
  this.setData({
    votedDate: parseInt(e.detail.value)
  })
},
  yesButton: function (event) {
    let event_id = this.data.events.id;
    let user_id = this.data.currentUser.id
    console.log('event_id', event_id)

    let attending = new wx.BaaS.TableObject('votes');
    let newAttending = attending.create();
    const data = {
      attending: true,
      event_id: event_id,
      user_id: user_id,
      votedDate:  this.data.votedDate
    }
    newAttending.set(data);
    // Post data to API
    newAttending.save().then((res) => {
      console.log('save res', res);
      const newAttendings = this.data.events;
      // newAttendings.push(res.data);
      this.setData({
        event: newAttendings,
      })
      wx.reLaunch({
        url: '/pages/user/user',
      })
    })
  },

  noButton: function (event) {

    let event_id = this.data.events.id;
    let user_id = this.data.currentUser.id

    console.log('event_id', event_id)

    let attending = new wx.BaaS.TableObject('votes');
    let newAttending = attending.create();

    const data = {
      attending: false,
      event_id: event_id,
      user_id: user_id
    }

    newAttending.set(data);
    // Post data to API
    newAttending.save().then((res) => {
      console.log('save res', res);
      const newAttendings = this.data.events;
      console.log('checking push button', res)
      this.setData({
        event: newAttendings,
      })
       
    })
  },

  editClick: function (event){
    const data = event.currentTarget.dataset;
    const id = data.id;
 
    wx.reLaunch({
      url: `/pages/event/event?id=${id}`
    });
  },

  deleteClick:function(event){
    let event_id = this.data.events.id;
  
    let events = new wx.BaaS.TableObject('events')
    console.log('deleteEvent', event)
    events.delete(event_id).then(()=>{
      wx.reLaunch({
        url: '/pages/user/user'
      });
    })

   },

  locationClick: function (event) {
    
    let thisBlock = this;
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        console.log(res);
 
        thisBlock.setData({
          latitude: res.latitude,
          longitude: res.longitude,
 
          markers: [{
            iconPath: "/images/map/address.png",
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            width: 35,
            height: 35,
            title: "当前位置",
            callout: {
              padding: 10,
              content:"当前位置",
              bgColor:"#DC143C",
              color:"#FFFF00",
              display:"ALWAYS"},
            label: {content:"标题"},
            anchor: {}
          }],
        })
      },
    })
  },

  onShow: function () {

  },


})
