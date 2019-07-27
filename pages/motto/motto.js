const app = getApp();
Page({


  data: {
    current: 0,
    max: 15,
  },
  limit(e) {
    var value = e.detail.value;

    var length = parseInt(value.length);



    if (length > this.data.max) {
      return;
    }

    this.setData({
      current: length
    });
  },

  submitMotto(e) {
    // var that = this;
    console.log(e)
    wx.showLoading({
      title: '上传中',
    })

    wx.request({
      url: 'https://www.laowangplus.top/api/v1/user/setmotto',
      method: "post",
      data: {
        motto: e.detail.value.motto
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

  // onLoad: function (options) {

  // },

})