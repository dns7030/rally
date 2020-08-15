// pages/event/event.js
Page({

  /**
   * Page initial data
   */
  data: {
    date: "Date",
    event: {},
    events: [],
    time: "Time"
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

    let date = event.detail.value.date;
    console.log('date', date)

    // let date1 = event.detail.value.date1;
    // console.log('date1', date1)

    // let date3 = event.detail.value.date3;
    // console.log('date3', date3)

    let events = new wx.BaaS.TableObject('events');
    let newEvent = events.create();
    const data = {
      // restaurants_id: this.data.restaurants.id,
      title: title,
      description: description,
      // date: [date1, date2, date3]
      date: [date]
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
})