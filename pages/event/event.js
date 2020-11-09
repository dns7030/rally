// pages/event/event.js
const app = getApp()
const util = require("../../utils/util")
Page({

  /**
   * Page initial data
   */
  data: {
    date1: "Date",
    date2: "optional",
    date3: "optional",
    event: {},
    events: [],
    time1: "Time",

    time2: "Other option",
    time3: "Other option",
    show: false,
    index: 0,//选择的下拉列表下标
    searchInput: [],
    selectData: [],
    item: '',
    longitude: '',
    latitude: '',

    eventsData: null
  },

  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },

  getSearchInput: function (e){
    let name_en = new wx.BaaS.TableObject('venues')
    let selectData = new wx.BaaS.TableObject('venues')
    let query = new wx.BaaS.Query()
    console.log('set BaaS', e.detail)
    query.contains('name_en', e.detail.value)
    selectData.setQuery(query).find().then((res) => {
      console.log('checking search query',res)
      // store data and display data
      this.setData({
        selectData: res.data.objects,
      })
    })

    console.log(e.detail.value)
  },

  selectResult(e) {
    console.log('get search result', e);
    let venueID = e.currentTarget.dataset.id;
    let keyword = e.currentTarget.dataset.name;
    
    this.setData({
      selectvenueID: venueID,
      searchInput: keyword
    })
  },

  onLoad(options) {
    this.setData({ events_id: options.id });
    var that = this;
    console.log('checking event edit', options)

    const events = new wx.BaaS.TableObject('events');

    events.expand(["venue_id"]).get(options.id).then((res) => {
      console.log('get edit event',res)
      let event = res.data
 
      event.date = event.date.map(date => {
        return util.formatShortDate(new Date(date));
      });

      this.setData ({
        eventsData: event,
      })
      
      console.log('anu', event)
    })
  },

  searchSubmitFn: function (e) {
    console.log(e)
    var that = this
    var searchInput = this.data.searchInput
    var searchRecord = this.data.searchRecord
    if (searchInput == '') {
    }
    else {
      let arrnum = searchRecord.indexOf(searchInput);

      if (arrnum==-1){
        searchRecord.unshift(searchInput)
        //将历史记录数组整体储存到缓存中
      }
      else{
        // 删除已存在后重新插入至数组
        searchRecord.splice(arrnum, 1)
        searchRecord.unshift(searchInput)
      }
      wx.setStorageSync('searchRecord', searchRecord)

    }
    this.setData({
      searchRecord: this.data.searchRecord
    })
  },

  date: function(e) {
    console.log(date0, e)
    this.setData({
      date: e.detail.value
    })
  },

  locationPicker: function(e) {
    console.log('checkin location',e)
    const page = this
    wx.chooseLocation({
      success: function(e) {
        console.log('e',e)
        page.setData({
          longitude: e.longitude,
          latitude: e.latitude
        })
      }
    })
},

  bindDateChange1: function(e) {
    console.log('bindDateChange 1', e);
    this.setData({
        "date1": e.detail.value,
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
    let events = new wx.BaaS.TableObject('events');
    let newEvent = events.create();

    if (!currentUser) {
      wx.switchTab({
        url: '/pages/user/user' // logged in
      });
    };

    console.log(event.detail.value.title)
    console.log(event.detail.value.description)
    console.log(event.detail.value.selectvenueID)

    let title = event.detail.value.title;
    // if (title == '') {
    //   wx: wx.showToast({
    //     title: 'Please fill the blank window'
    //   })
    //   return false
    // };
  
    let description = event.detail.value.description;
    let selectvenueID = this.data.selectvenueID;
    let longitude = this.data.longitude;
    let latitude = this.data.latitude;
    let date1 = event.detail.value.date1;
    let date2 = event.detail.value.date2;
    let date3 = event.detail.value.date3;
    
    const data = {
      title: title,
      description: description,
      date: [date1, date2, date3],
      venue_id: selectvenueID,
      longitude: this.data.longitude,
      latitude: this.data.latitude
    }
    console.log('selected venue pass to BaaS', event)

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

wx.request({
  url: util.apiUrl + 'event/formsubmit?program_id=' + app.jtappid,
  data: FormData,
  header: { 'Content-Type': 'application/json' },
  success: function (res){
    if(res.data.satus == 1){
      wx.showToast({
        title: "Let's go!",
        icon: 'success',
        duration: 4000,
        mask: true,
      });
      that.setData({
        title: '',
        description: '',
        searchInput:'',
        date: '',
        time:''
      })
    }
  }
})
  },
  formReset: function (e){

    console.log('reset events')
  },
  onClickSearchButton: function (event) {
    console.log('checking search', event)
  },
})
