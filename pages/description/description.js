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
    const data = event.currentTarget.dataset;
    let eventID = this.data.events.id
    let userID = this.data.currentUser.id

    let votes = new wx.BaaS.TableObject('votes');
    let vote = votes.create();

    
  },

  deleteClick:function(event){
    console.log('deleteEvent', event)
    let id = event.currentTarget.dataset.deleteid;
   
    wx.request({
      url: 'https://shop.yunapply.com/home/shipping/delAddress?id='+id,
     data: {},
     method: 'GET',
     success: function(res){
      if(res.data.status == 0){

       wx.showToast({
        title: res.data.info,
        icon: 'loading',
        duration: 1500
       })
      }else{

       wx.showToast({
        title: res.data.info,
        icon: 'success',
        duration: 1000
       })
      }
     },
   
     fail:function(){
         wx.showToast({
          title: '服务器网络错误!',
          icon: 'loading',
          duration: 1500
         })
        }
    })
   },

  onShow: function () {

  },

  onShareAppMessage: function () {

  }
})