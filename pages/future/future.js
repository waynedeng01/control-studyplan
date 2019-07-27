const app = getApp();
var util = require('../../util/util.js');
let flag = 0;
Page({
  data: {
    planList: [],
    dateList: [],
    num: [],
    none: 'none',
    check: '',

  },
  getPlan() {
    var that = this;
    wx.request({
      url: 'https://www.laowangplus.top/api/v1/future',
      header: {
        'token': app.globalData.Token
      },
      success(res) {
        console.log(res.data);

        let arr =
          res.data.map((item) => {
            return item.future_date
          })
        that.setData({
          planList: res.data,
          dateList: arr,
          item: res.data.length
        })
        that.num_data()
      }
    })

  },
  num_data() {
    let newArray = [];
    let baiArr = [];
    let shiArr = [];
    let geArr = [];
    let dateList = this.data.dateList
    dateList.forEach(item => {
      baiArr.push(parseInt(item / 100))
      shiArr.push(parseInt((item % 100) / 10))
      geArr.push(parseInt(item % 10))
      newArray.push(item)
    });
    this.setData({
      num: newArray,
      bai: baiArr,
      shi: shiArr,
      ge: geArr
    })



  },

  expandList() {
    let animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    let opacity = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    if (flag === 0) {
      this.animation = animation
      this.opacity = opacity
      animation.rotate(-45).step();
      opacity.opacity(1).step();
      flag = 1;
      this.setData({
        expandHide: 'containerZhezhao',
        none: ''
      })
    } else {
      this.animation = animation
      animation.rotate(0).step()
      opacity.opacity(0).step()
      flag = 0;
      this.setData({
        expandHide: 'containerHide',
        none: 'none'
      })
    }
    this.setData({
      rotate: animation.export(),
      opacity: opacity.export()
    })
  },

  bindDateChange(e) {
    this.setData({
      check: e.detail.value
    })

  },

  sendFuture(e) {
    var that = this;
    let title = e.detail.value.title
    let plan = e.detail.value.plan
    let future_date = e.detail.value.future_date
    if (title == '' || plan == '' || future_date == '') {
      wx.showToast({
        title: '请将数据填写完整哦',
        icon: 'none',
        duration: 1000
      })
      return
    }


    wx.showLoading({
      title: '上传中',
    })
    wx.request({
      url: 'https://www.laowangplus.top/api/v1/future/create',
      method: "post",
      data: {
        title: e.detail.value.title,
        plan: e.detail.value.plan,
        future_date: e.detail.value.future_date
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",

        'token': app.globalData.Token

      },
      success() {
        that.getPlan()
        if (flag == 1) {
          that.expandList()
        }
      }
    })
    setTimeout(function () {
      wx.hideLoading()
      that.setData({
        msg: '',
        check: ''
      })
    }, 1000)

  },

  deleteFuture(e) {
    var that = this;
    // console.log(e);
    wx.showModal({
      title: '提示',
      content: '是否确定删除',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.laowangplus.top/api/v1/future/delete/' + e.currentTarget.dataset.id,
            method: "DELETE",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",

              'token': app.globalData.Token
            },
            success() {
              that.getPlan()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  formatMonth(month) {
    let monthStr = ''
    if (month > 12 || month < 1) {
      monthStr = Math.abs(month - 12) + ''
    } else {
      monthStr = month + ''
    }
    monthStr = `${monthStr.length > 1 ? '' : '0'}${monthStr}`
    return monthStr
  },

  formatDay(day) {
    return `${(day + '').length > 1 ? '' : '0'}${day}`
  },

  onLoad: function (options) {
    const date = new Date(),
      month = this.formatMonth(date.getMonth() + 1),
      year = date.getFullYear(),
      day = this.formatDay(date.getDate() + 3),
      today = `${year}-${month}-${day}`
    this.setData({
      today: today,
    });
    this.getPlan();

  },
  onHide() {
    if (flag = 1) {
      this.expandList();
    }

  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getPlan()
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },


})