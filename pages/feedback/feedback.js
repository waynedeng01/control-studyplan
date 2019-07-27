const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'bug', value: 'bug反馈' },
      { name: 'content', value: '内容有关' },
      { name: 'advice', value: '功能建议' },
    ],
    category: ''
  },

  radioChange: function (e) {
    this.setData({
      category: e.detail.value
    })

  },


  submitContent(e) {
    var that = this;
    if (that.data.category == '' || e.detail.value.content == '') {
      wx.showToast({
        title: '请把数据填满哦',
        icon: 'none',
        duration: 1000
      })
      return
    }
    console.log(e)
    wx.showLoading({
      title: '上传中',
    })

    wx.request({
      url: 'https://www.laowangplus.top/api/v1/feedback',
      method: "post",
      data: {
        category: that.data.category,
        content: e.detail.value.content
      },
      header: {
        'token': app.globalData.Token,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res);

      }
    })

    setTimeout(function () {
      wx.hideLoading()
      wx.navigateBack({
        delta: 1
      })
    }, 500)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


})