// pages/event/event.js
Page({

  /**
   * Page initial data
   */
  data: {

    date: '2020-09-01', 
    event: {},
    events: [],
    time: '12:01'
  },

  onLoad: function (options) {

  },
  bindDateChange: function(e) {
    this.setData({
        date: e.detail.value
    })

  },


  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },

  formSubmit: function (event) {
    console.log('formSubmit', event);
    console.log(event.detail.value.title)
    console.log(event.detail.value.description)

    let description = event.detail.value.description;
    let title = event.detail.value.title;
    let date1 = event.detail.value.date1;
    console.log('date1', date1)
    let date2 = event.detail.value.date2;
    let date3 = event.detail.value.date3;
    console.log('date2', date2)
    console.log('date3', date3)
    let events = new wx.BaaS.TableObject('events');
    let newEvent = events.create();
    const data = {
      // restaurants_id: this.data.restaurants.id,
      title: title,
      description: description,
      date: [date1, date2, date3]
    }

    newEvent.set(data);
    // Post data to API
    newEvent.save().then((res) => {
      console.log('save res', res);
      const newEvents = this.data.events;
      newEvents.push(res.data);
      this.setData({
        event: newEvents,
      })
    })
  },


  onReady: function () {

  },

  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})