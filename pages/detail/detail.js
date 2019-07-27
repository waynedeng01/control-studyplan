const app = getApp();

Page({


  data: {

  },

  getUserInfo() {
    var that = this
    wx.getUserInfo({
      success(res) {
        const userInfo = res.userInfo
        const nickName = userInfo.nickName
        const avatarUrl = userInfo.avatarUrl
        that.setData({
          userInfo: userInfo,
          nickName: nickName,
          avatarUrl: avatarUrl
        })

      }
    })
  },

  getMonth() {
    var that = this;
    var study_time = null;
    var timestr = null
    wx.request({
      url: 'https://www.laowangplus.top/api/v1/user/getinformation/type/month',
      header: {
        'token': app.globalData.Token
      },
      success(res) {
        console.log(res)
        study_time = res.data.study_time
        timestr = that.consoleTimeFlag(study_time);
        that.setData({
          num: res.data.num,
          study_days: res.data.study_days,
          m_matters_count: res.data.matters_count,
          m_matters_finish: res.data.matters_finish,
          m_study_time: timestr
        })
      }
    })
  },

  consoleTimeFlag(seconds) {
    if (seconds >= 3600) {
      let hour = Math.floor(seconds / 3600);
      let timeFlag = `${hour}小时`;
      return timeFlag;
    } else if (seconds < 3600) {
      let mimutes = Math.floor(seconds / 60);
      let timeFlag = `${mimutes}分钟`;
      return timeFlag;


    }

  },

  getWeek() {
    var that = this;
    var study_time = null;
    var timestr = null
    wx.request({
      url: 'https://www.laowangplus.top/api/v1/user/getinformation/type/week',
      header: {
        'token': app.globalData.Token
      },
      success(res) {
        console.log(res)
        study_time = res.data.study_time
        timestr = that.consoleTimeFlag(study_time);
        that.setData({
          w_matters_count: res.data.matters_count,
          w_matters_finish: res.data.matters_finish,
          w_study_time: timestr
        })
      }
    })
  },

  onLoad: function (options) {
    this.getUserInfo();
    this.getMonth();
    this.getWeek();
  },


})