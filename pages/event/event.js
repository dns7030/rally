// pages/event/event.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    date1: "Date",
    date2: "Other option",
    date3: "Other option",
    event: {},
    events: [],
    time1: "Time",
    time2: "Other option",
    time3: "Other option",
    langitude: '',
    latitude: '',
    
  },

  onLoad: function (options) {

  },

  placeSearch: function (options) {
    let place = event.detail.value.place;
    let query = new wx.BaaS.Query();
    query.compare('name_en', '=', search.input);
  },

  date: function(e) {
    console.log(date0, e)
    this.setData({
      date: e.detail.value 
    })
  },

  locationPicker: function(e) {
    wx.chooseLocation()
  },

  // locationPicker((res) => {
  //   wx.chooseLocation()
  //   this.setData ({
  //     longitude: res.data.longitude,
  //     latitude: res.data.longitude
  //   })
  // }),

  bindDateChange1: function(e) {
    console.log('bindDateChange 1', e);
    this.setData({
        date1: e.detail.value
    })
  },
  bindDateChange2: function(e) {
    console.log('bindDateChange 2', e);
    this.setData({
        date2: e.detail.value
    })
  },
  bindDateChange3: function(e) {
    console.log('bindDateChange 3', e);
    this.setData({
        date3: e.detail.value
    })
  },
  bindTimeChange1(e) {
    this.setData({
      time1: e.detail.value
    })
  },
  bindTimeChange2(e) {
    this.setData({
      time2: e.detail.value
    })
  },
  bindTimeChange3(e) {
    this.setData({
      time3: e.detail.value
    })
  },
   
  formSubmit: function (event) {
    console.log('formSubmit', event);

    let currentUser = this.data.currentUser

    if (!currentUser) {
      wx.switchTab({
        url: '/pages/user/user' // logged in
      });
    };

    console.log(event.detail.value.title)
    console.log(event.detail.value.description)

    let title = event.detail.value.title;
    let description = event.detail.value.description;

    let date1 = event.detail.value.date1;
    console.log('date1', date1)
    let date2 = event.detail.value.date2;
    console.log('date2', date2)
    let date3 = event.detail.value.date3;
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

  onClickSearchButton: function (event) {
    console.log('checking search', event)
  },
})