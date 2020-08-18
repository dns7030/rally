// pages/user/user.js
const util = require("../../utils/util")
let app= getApp()
Page({

  data: {
    currentUser: null,
    events: {},
    active: 1,
    futureEvents: [],
    pastEvents: [],
    dayList: []
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
          return util.formatDate(new Date(date));
        });

        event.time = event.date.map(time => {
          return util.formatTime(new Date(time));
        });
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

  onShow: function () {

    var myDate = new Date();// hehe
    myDate.toLocaleDateString();
    var month = myDate.getMonth() + 1;
    var time = myDate.getFullYear() + '年' + month + '月' + myDate.getDate() + '日';

    var total = 1;// 个数
    var dayList = [];
    const date = [];
    
    dayList.push({
        'day': myDate.getDate(),
        'month': myDate.getMonth() + total,
        'week': toWeekDay(myDate.getDay()),
        'year': myDate.getFullYear()
    });
    for (var i = 0; i < 6; i++) {
        myDate.setDate(myDate.getDate() + total);
     
        dayList.push({
            'day': myDate.getDate(),
            'month': myDate.getMonth() + total,
            'week': toWeekDay(myDate.getDay()),
            'year': myDate.getFullYear()
        });
    }
    
    this.setData({
        dayList: dayList
    });
    function toWeekDay(weekDay) {
      switch (weekDay) {
          case 1: return 'Mon'; break;
          case 2: return 'Tue'; break;
          case 3: return 'Wed'; break;
          case 4: return 'Thu'; break;
          case 5: return 'Fri'; break;
          case 6: return 'Sat'; break;
          case 0: return 'Sun'; break;
          default: break;
      }
      return 'seven days';
  
  }
},

  onHide: function () {

  },
  onUnload: function () {

  },

  onShareAppMessage: function () {

  }
})