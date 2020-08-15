// pages/description/description.js
const util = require("../../utils/util")
let app= getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    restaurant: {},
    events: [],
    reviews: [],
    currentUser: null,
    review: [],
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
    console.log('userInfo!', getApp().globalData.userInfo);
    this.setData({
      currentUser: getApp().globalData.userInfo,
    });
    const Events = new wx.BaaS.TableObject('events');

    console.log({ options })

    Events.get(options.id).then((res) => {
      this.setData({
        events: res.data,
      })
    });

    let query = new wx.BaaS.Query();

    query.compare('events_id', '=', options.id);

  },

  voteDate(event) {
    const data = event.currentTarget.dataset;
    console.log('data', data)

    const id = data.id
    let clickedDate = this.data.stories.find(story => story._id == id) 

    if (clickedDate.currentUserAlreadyClicked && clickedDate.currentUserAlreadyClicked == true) {
      return 
    }
    
    const votes = data.votes;
    const page = this

    let tableName = 'events'
    let eventID = id // 数据行 id

    let Story = new wx.BaaS.TableObject(tableName)
    let story = Story.getWithoutData(eventID)

    story.set('likes', likes + 1) //if clicked - disable
    story.update().then(res => {
      console.log(res)
      const new_story = res.data
      let stories = page.data.stories
      let story = stories.find(story => story._id == new_story.id) 
      story.likes = new_story.likes
      story.currentUserAlreadyClicked = true
      console.log(stories)
      page.setData({ stories: stories })

    })
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