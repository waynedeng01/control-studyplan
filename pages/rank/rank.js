const app = getApp();
Page({


  data: {
    rankList: [],
    studyTime: [],
    min: [],
    rankImg: ["../../imgs/1.png", "../../imgs/2.png", "../../imgs/3.png", "../../imgs/4.png", "../../imgs/5.png", "../../imgs/6.png", "../../imgs/7.png", "../../imgs/8.png", "../../imgs/9.png", "../../imgs/10.png"]

  },

  getRankList() {
    var that = this
    wx.request({
      url: 'https://www.laowangplus.top/api/v1/ranking',
      header: {
        'token': app.globalData.Token
      },
      success(res) {
        // console.log(res);

        // 利用有item方法的数组方法
        let arr =
          res.data.map((item) => {
            return item.study_time
          })
        that.setData({
          rankList: res.data,
          studyTime: arr,
          item: res.data.length
        })
        that.secToMin()
      }
    })
  },

  secToMin() {
    let newArr = [];
    let studyTime = this.data.studyTime;
    let len = (studyTime.length) - 1
    for (let i = 0; i <= len; i++) {
      let min = Math.floor(studyTime[i] / 60)
      newArr.push(min)
    }
    this.setData({
      min: newArr
    })
  },

  timeRank() {
    setTimeout(
      function () {
        wx.showToast({
          title: '切换成功',
          icon: 'success',
          duration: 500
        })
      }, 500)

    this.getRankList();
    this.setData({
      t_rank: 'choice',
      d_rank: 'unchoice'
    })
  },

  dakaRank() {
    setTimeout(
      function () {
        wx.showToast({
          title: '切换成功',
          icon: 'success',
          duration: 500
        })
      }, 500)
    var that = this;
    wx.request({
      url: 'https://www.laowangplus.top/api/v1/rankingbycontinuity',
      header: {
        'token': app.globalData.Token
      },
      success(res) {
        console.log(res);

        // 利用有item方法的数组方法
        let arr =
          res.data.map((item) => {
            return item.study_time
          })
        that.setData({
          rankList: res.data,
          studyTime: arr,
          item: res.data.length,
          d_rank: 'choice',
          t_rank: 'unchoice'
        })
        that.secToMin()
      }
    })
  },


  onLoad: function (options) {
    this.getRankList()
  },

  onShow() {
    this.getRankList()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getRankList()
    this.setData({
      t_rank:'choice',
      d_rank:'unchoice'
    })
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

})