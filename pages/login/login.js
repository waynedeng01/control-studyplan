const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null,
    // isHide: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 登录，获取用户信息
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        console.log(res);

        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success(res) {
              that.setData({
                userInfo: res.rawData
              })
              wx.login({
                success(res) {
                  if (res.code) {
                    // console.log(res.code)
                    wx.request({
                      url: 'https://www.laowangplus.top/api/v1/token/user',
                      method: "post",
                      data: {
                        code: res.code,
                        raw_data: that.data.userInfo
                      },
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      success(res) {
                        app.globalData.Token = res.data;
                        // that.getDaiban();
                        console.log(app.globalData.Token);

                      }
                    })
                  } else {
                    console.log('登录失败！' + res.errMsg)
                  }
                }
              })
              // if (this.userInfoReadyCallback) {
              //   this.userInfoReadyCallback(res)
              // }
            }
          });
        }
      }
    });

  },

  bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      // var that = this;

      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      // app.globalData.success = true;
      // that.setData({
      //   isHide: false
      // });
      wx.switchTab({
        url: '../index/index'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})