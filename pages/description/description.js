// pages/description/description.js
const util = require("../../utils/util")
let app= getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    currentUser: null,
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
    venues: [],
    votedDate: -1
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
      longitude: this.data.events.longitude,
      latitude: this.data.events.latitude,
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
 
      event.date = event.date.map(date => {
        return util.formatShortDate(new Date(date));
      });

      this.setData ({
        events: event,
      })

  //get one event
    let query = new wx.BaaS.Query();
    let queryx = new wx.BaaS.Query();
    query.compare('event_id', '=', options.id);

    //get attendees id
    const attendees = new wx.BaaS.TableObject('votes')
    console.log('attendees checking', options)
    // query.compare('event_id', '=', options.id);
    queryx.compare('attending', '=', true);
  
    const andQueryx = new wx.BaaS.Query.and(query, queryx);
    attendees.setQuery(andQueryx).limit(100).expand(['event_id', 'user_id']).find().then((res) => {
      console.log('checking attendees', res)
      this.setData ({
        attendees: res.data.objects
      })
    })
    //get venue address
    let venues = new wx.BaaS.TableObject('venues')
    
    //get number of people voted on each time

    this.getVotedData(options)
      
    })



    },

  getVotedData: function (options) {
    const events = new wx.BaaS.TableObject('events');
    events.get(options.id).then((res) => {
      let votedDate = new wx.BaaS.TableObject('votes')
      const query1 = new wx.BaaS.Query();
      const query2 = new wx.BaaS.Query();
      const query3 = new wx.BaaS.Query();
      const query4 = new wx.BaaS.Query();
      query1.compare('event_id', '=', options.id);
      query2.compare('votedDate', '=', 0);
      query3.compare('votedDate', '=', 1);
      query4.compare('votedDate', '=', 2);
  
      const andQuery1 = new wx.BaaS.Query.and(query1, query2);
      const andQuery2 = new wx.BaaS.Query.and(query1, query3);
      const andQuery3 = new wx.BaaS.Query.and(query1, query4);
  
      votedDate.setQuery(andQuery1).expand(['event_id', 'votedDate']).find().then((res) => {
        console.log('checking attendees 1', res)
        console.log('anu', this.data.events.date)
        this.data.events.date[0].attendees = res.data.objects.length
        this.setData(this.data)
      })
  
      votedDate.setQuery(andQuery2).expand(['event_id', 'votedDate']).find().then((res) => {
        console.log('checking attendees 2', res)
        this.data.events.date[1].attendees = res.data.objects.length
        this.setData(this.data)
      })
  
      votedDate.setQuery(andQuery3).expand(['event_id', 'votedDate']).find().then((res) => {
        console.log('checking attendees 3', res)
        this.data.events.date[2].attendees = res.data.objects.length
        this.setData(this.data)
      })
    })
  },

  radioChange: function(e) {
    console.log("radioChange",e.target.dataset.index)

    this.setData({
      votedDate: parseInt(e.target.dataset.index)
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
    console.log('is no button working?', event)
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
      console.log('checking no button', res)
      this.setData({
        event: newAttendings,
      })
        
    })
    wx.showToast({
      title: ":(",
      duration: 2000,
      mask: true,
    });
    
    wx.reLaunch({
      url: '/pages/user/user',
    })
  },
  
  editClick: function (event){
    console.log('anu', event, this.data.events._id)
      wx.reLaunch({
        url: `/pages/event/event?id=${this.data.events._id}`
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
