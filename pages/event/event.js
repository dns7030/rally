// pages/event/event.js
const app = getApp()

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

  // selectResult(e) {
  //   let selectData = new wx.BaaS.TableObject('venues')
  //   let query = new wx.BaaS.Query()
  //   console.log('get search data', e.detail);
  //   query.contains('name_en', e.detail.value)
  // },

  onLoad: function (options) {
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
    const page = this
    wx.chooseLocation({
      success: function(e) {
        console.log('e',e)
        page.setData({
          longitude: e.longitude,
          latitude: e.longitude
        })
      }
    
    })
},
   // locationPicker((res) => {
    //   wx.chooseLocation()
    //   this.setData ({
    //     longitude: res.data.longitude,
    //     latitude: res.data.longitude
    //   })
    // })

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

    if (!currentUser) {
      wx.switchTab({
        url: '/pages/user/user' // logged in
      });
    };

    console.log(event.detail.value.title)
    console.log(event.detail.value.description)

    let title = event.detail.value.title;
    let description = event.detail.value.description;
    let selectData = event.detail.value.place

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
      place: [selectData],
      date: [date1, date2, date3],
      longitude: this.data.longitude,
      latitude: this.data.latitude
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

      // wx.navigateTo({
      //   url: `/pages/description/description?id=${newEvents[0]._id}`,
      // })

      console.log('new events', newEvents[0]._id)
    })

    wx.showToast({
      title: "Let's go!",
      icon: 'success',
      duration: 4000,
      mask: true,


    });
  },

  onClickSearchButton: function (event) {
    console.log('checking search', event)
  },
})
