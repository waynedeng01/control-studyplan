const app = getApp();
Page({
  data: {
  },

  onReady: function () {
    this.startCount();
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },
  startCount() {
    this.setData({
      countDown: app.globalData.countDown,
      Ing: app.globalData.Ing,
      timing: app.globalData.timing
    })
    var that = this;
    wx.request({
      url: 'https://www.laowangplus.top/api/v1/matter/startstudy/' + app.globalData.id,
      header: {
        'token': app.globalData.Token
      },
      success(res) {
        console.log(res)
        that.setData({
          imgUrl: res.data.msg.img,
          motto: res.data.msg.aphorism
        })
      }
    })
    //2.开始计时
    var that = this
    let countDownNum = app.globalData.countDown;
    let count = 0;

    // 倒计时
    if (that.data.timing == 0) {
      that.setData({
        timer: setInterval(function () {
          let hour = Math.floor(countDownNum / 3600);
          let minutes = Math.floor(countDownNum / 60 % 60);
          let seconds = Math.floor(countDownNum % 60);
          if (hour < 10) {
            hour = '0' + hour;
          }
          if (minutes < 10) {
            minutes = '0' + minutes;
          }
          if (seconds < 10) {
            seconds = '0' + seconds;
          }
          countDownNum--;
          that.setData({
            countDown_hour: hour,
            countDown_min: minutes,
            countDown_sec: seconds
          })
          if (countDownNum == 0) {
            clearInterval(that.data.timer);
            that.setData({
              countDown_hour: '00',
              countDown_min: '00',
              countDown_sec: '00',
            })
            wx.showModal({
              title: '提示',
              content: '您设定的时间已到，是否返回',
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

          }
        }, 1000)
      })
    } else {
      // 正向计时
      that.setData({
        timer: setInterval(function () {
          let hour = Math.floor(count / 3600);
          let minutes = Math.floor(count / 60 % 60);
          let seconds = Math.floor(count % 60);
          if (hour < 10) {
            hour = '0' + hour;
          }
          if (minutes < 10) {
            minutes = '0' + minutes;
          }
          if (seconds < 10) {
            seconds = '0' + seconds;
          }
          count++;

          that.setData({
            countDown_hour: hour,
            countDown_min: minutes,
            countDown_sec: seconds
          })
          if (count == 14400) {
            clearInterval(that.data.timer);
            that.setData({
              countDown_hour: '00',
              countDown_min: '00',
              countDown_sec: '00',
            })
            wx.showModal({
              title: '提示',
              content: '正向计时上限已到，是否返回',
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

          }

        }, 1000)
      })


    }


  },

  onUnload: function () {
    wx.request({
      url: 'https://www.laowangplus.top/api/v1/matter/stopstudy/' + app.globalData.id,
      header: {
        'token': app.globalData.Token
      },

    })
    clearInterval(this.data.timer);
    wx.showModal({
      title: '提示',
      content: '已为您记录时间',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },




})