// pages/event/event.js
Page({

  /**
   * Page initial data
   */
  data: {
    date: "Date",
    event: {},
    events: [],
    time: '12:01'
  },

  onLoad: function (options) {

  },

  bindDateChange: function(e) {
    console.log('bindDateChange', e);
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

    let title = event.detail.value.title;
    let description = event.detail.value.description;

    let date1 = event.detail.value.date1;
    console.log('date', date1)
    let date2 = event.detail.value.date2;
    let date3 = event.detail.value.date3;
    console.log('date1', date1)
    console.log('date3', date3)

    let events = new wx.BaaS.TableObject('events');
    let newEvent = events.create();
    const data = {
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

       
      
      wx.navigateTo({
        url: `/pages/description/description?id=${newEvents[0]._id}`,
      })

      console.log('new events', newEvents[0]._id)
    })

    wx.showToast({
      title: 'Your event was created. To share it with your friends find it in your future events page',
      icon: 'success',
      duration: 2000,
      mask: true,
    });
  },


  onReady: function () {

  },

  onShow: function () {

  },
})