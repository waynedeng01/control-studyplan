const app = getApp();
var util = require('../../util/util.js');
let animationShowHeight = "770rpx";
let flag = 0;

//扩展部分的标志
let exp_flag = 0;
const
  omain = "https://www.laowangplus.top";
let choose_year = null,
  choose_month = null;

Page({
  data: {
    time: '',
    animation: '',
    day: '',
    year: '',
    month: '',
    date: '2018-09',
    today: '',
    week: ['日', '一', '二', '三', '四', '五', '六'],
    calendar: {
      first: [],
      second: [],
      third: [],
      fourth: []
    },
    swiperMap: ['first', 'second', 'third', 'fourth'],
    swiperIndex: 1,
    showCaldenlar: false,
    blockHeight: '',
    rotateDeg: '',
    // 待办事项接收数组
    daibanList: [],
    // 今日学习时间
    studyTime: '',
    timer: '',
    none: 'none',
    daiban_none: 'none',
    // daka_none: 'none',
    // userInfo: null,
    exp: 'none',
    item: '',
    sign_id: '',
    timing_status: null,
    scrollTop: 0,

  },

  // 分钟转换成秒
  minTosec(min) {
    return min * 60;
  },

  // 日历展开和收缩
  changeFlag() {
    let animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    let rotate = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    if (flag === 0) {
      this.animation = animation
      this.rotate = rotate
      rotate.rotate(180).step();
      animation.height(animationShowHeight).step()
      flag = 1;
      var height = '200rpx';
    } else {
      this.animation = animation
      animation.height(0).step()
      rotate.rotate(0).step();
      flag = 0;
      height = '0';
    }
    this.setData({
      blockHeight: height,
      animation: animation.export(),
      cal_rotate: rotate.export()
    })
  },


  // 从后台获取待办事项，并填充时间
  getDaiban() {
    var that = this;
    var studyTime = null
    var timestr = null
    wx.request({
      url: 'https://www.laowangplus.top/api/v1/sign/getmatters?date=' + `${this.data.year}-${this.data.month}-${this.data.day}`,
      header: {
        'token': app.globalData.Token
      },
      success(res) {
        console.log(res)
        studyTime = res.data.study_time
        that.setData({
          flag: res.data.flag,
          sign_id: res.data.id,
          daibanList: res.data.matters,
          item: res.data.matters.length
        })
        timestr = that.consoleTimeFlag(studyTime);
        that.setData({
          studyTime: timestr
        })
      },

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

  onLoad: function () {
    // 检测手机的高度
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    this.setData({
      scroll_height: windowHeight * 750 / windowWidth - 250 - 30
    })

    // 初始日期处理
    var time = util.formatDate(new Date());
    const date = new Date(),
      month = this.formatMonth(date.getMonth() + 1),
      year = date.getFullYear(),
      day = this.formatDay(date.getDate()),
      today = `${year}-${month}-${day}`
    let calendar = this.generateThreeMonths(year, month)
    this.setData({
      time: time,
      calendar,
      month,
      year,
      day,
      today,
      beSelectDate: today,
      date: `${year}-${month}`
    });

    // this.getDaiban();
    // 登录，获取用户信息
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success(res) {
              that.setData({
                userInfo: res.rawData
              })
              wx.login({
                success(res) {
                  if (res.code) {
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
                        that.getDaiban();
                        // console.log(app.globalData.Token);

                      }
                    })
                  } else {
                    console.log('登录失败！' + res.errMsg)
                  }
                }
              })
            }
          });
        } else {
          wx.redirectTo({
            url: '../login/login'
          })
        }
      }
    });




  },
  touchStart(e) {
    let touchDotX = 0;//X按下时坐标
    let touchDotY = 0;//y按下时坐标
    let interval;//计时器
    let time = 0;//从按下到松开共多少时间*100
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
    this.setData({
      touchDotX: touchDotX,
      touchDotY: touchDotY
    })

  },
  touchEnd(e) {
    let interval;//计时器
    let time = 0;//从按下到松开共多少时间*100
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - this.data.touchDotX;
    // console.log(tmX)
    let tmY = touchMoveY - this.data.touchDotY;
    // console.log(tmY)
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absY > absX * 2 && tmY < 0) {
        if (flag == 1) {
          this.changeFlag()
        }
      }
      // else if (absY > absX*2 && tmY > 250) {
      //   if (flag == 0) {
      //     this.changeFlag()
      //   }
      // }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  // 防误触
  // topper() {
  //   this.setData({
  //     touchDotX:200,
  //     touchDotY:200
  //   })
  // },

  onShow: function () {
    this.onLoad();
  },

  onHide() {
    if (exp_flag = 1) {
      this.expandList();
    }

  },

  showCaldenlar() {
    this.setData({
      showCaldenlar: !this.data.showCaldenlar
    })
  },
  /**
   * 
   * 左右滑动
   * @param {any} e 
   */
  swiperChange(e) {
    const lastIndex = this.data.swiperIndex,
      currentIndex = e.detail.current
    let flag = false,
      {
        year,
        month,
        day,
        today,
        date,
        calendar,
        swiperMap
      } = this.data,
      change = swiperMap[(lastIndex + 2) % 4],
      time = this.countMonth(year, month),
      key = 'lastMonth'

    if (lastIndex > currentIndex) {
      lastIndex === 3 && currentIndex === 0 ?
        flag = true :
        null
    } else {
      lastIndex === 0 && currentIndex === 3 ?
        null :
        flag = true
    }
    if (flag) {
      key = 'nextMonth'
    }

    year = time[key].year
    month = time[key].month
    date = `${year}-${month}`
    day = ''
    if (today.indexOf(date) !== -1) {
      day = today.slice(-2)
    }

    time = this.countMonth(year, month)
    calendar[change] = null
    calendar[change] = this.generateAllDays(time[key].year, time[key].month)

    this.setData({
      swiperIndex: currentIndex,
      year,
      month,
      date,
      day,
      calendar
    })
  },
  /**
   * 
   * 点击切换月份，生成本月视图以及临近两个月的视图
   * @param {any} year 
   * @param {any} month 
   * @returns {object} calendar
   */
  generateThreeMonths(year, month) {
    let {
      swiperIndex,
      swiperMap,
      calendar
    } = this.data, thisKey = swiperMap[swiperIndex], lastKey = swiperMap[swiperIndex - 1 === -1 ? 3 : swiperIndex - 1], nextKey = swiperMap[swiperIndex + 1 === 4 ? 0 : swiperIndex + 1], time = this.countMonth(year, month)
    delete calendar[lastKey]
    calendar[lastKey] = this.generateAllDays(time.lastMonth.year, time.lastMonth.month)
    delete calendar[thisKey]
    calendar[thisKey] = this.generateAllDays(time.thisMonth.year, time.thisMonth.month)
    delete calendar[nextKey]
    calendar[nextKey] = this.generateAllDays(time.nextMonth.year, time.nextMonth.month)
    return calendar
  },
  bindDayTap(e) {
    let {
      month,
      year
    } = this.data, time = this.countMonth(year, month), tapMon = e.currentTarget.dataset.month, day = e.currentTarget.dataset.day
    if (tapMon == time.lastMonth.month) {
      this.changeDate(time.lastMonth.year, time.lastMonth.month)
    } else if (tapMon == time.nextMonth.month) {
      this.changeDate(time.nextMonth.year, time.nextMonth.month)
    } else {
      this.setData({
        day
      })
    }
    let beSelectDate = e.currentTarget.dataset.date;
    this.setData({
      beSelectDate,
      showCaldenlar: false,
    })
    if (flag == 1) {
      this.changeFlag();
    }
    this.getDaiban()
  },
  bindDateChange(e) {
    if (e.detail.value === this.data.date) {
      return
    }

    const month = e.detail.value.slice(-2),
      year = e.detail.value.slice(0, 4)

    this.changeDate(year, month)
  },


  // 时间改变

  bindTimeChange(e) {
    this.setData({
      daka_t: e.detail.value
    })
  },
  prevMonth(e) {
    let {
      year,
      month
    } = this.data, time = this.countMonth(year, month)
    this.changeDate(time.lastMonth.year, time.lastMonth.month)
  },
  nextMonth(e) {
    let {
      year,
      month
    } = this.data, time = this.countMonth(year, month)
    this.changeDate(time.nextMonth.year, time.nextMonth.month)
  },
  /**
   * 
   * 直接改变日期
   * @param {any} year 
   * @param {any} month 
   */
  changeDate(year, month) {
    let {
      day,
      today
    } = this.data, calendar = this.generateThreeMonths(year, month), date = `${year}-${month}`
    date.indexOf(today) === -1 ?
      day = '01' :
      day = today.slice(-2)

    this.setData({
      calendar,
      day,
      date,
      month,
      year,
    })
  },
  /**
   * 
   * 月份处理
   * @param {any} year 
   * @param {any} month 
   * @returns 
   */
  countMonth(year, month) {
    let lastMonth = {
      month: this.formatMonth(parseInt(month) - 1)
    },
      thisMonth = {
        year,
        month,
        num: this.getNumOfDays(year, month)
      },
      nextMonth = {
        month: this.formatMonth(parseInt(month) + 1)
      }

    lastMonth.year = parseInt(month) === 1 && parseInt(lastMonth.month) === 12 ?
      `${parseInt(year) - 1}` :
      year + ''
    lastMonth.num = this.getNumOfDays(lastMonth.year, lastMonth.month)
    nextMonth.year = parseInt(month) === 12 && parseInt(nextMonth.month) === 1 ?
      `${parseInt(year) + 1}` :
      year + ''
    nextMonth.num = this.getNumOfDays(nextMonth.year, nextMonth.month)
    return {
      lastMonth,
      thisMonth,
      nextMonth
    }
  },
  currentMonthDays(year, month) {
    const numOfDays = this.getNumOfDays(year, month)
    return this.generateDays(year, month, numOfDays)
  },
  /**
   * 生成上个月应显示的天
   * @param {any} year 
   * @param {any} month 
   * @returns 
   */
  lastMonthDays(year, month) {
    const lastMonth = this.formatMonth(parseInt(month) - 1),
      lastMonthYear = parseInt(month) === 1 && parseInt(lastMonth) === 12 ?
        `${parseInt(year) - 1}` :
        year,
      lastNum = this.getNumOfDays(lastMonthYear, lastMonth) //上月天数
    let startWeek = this.getWeekOfDate(year, month - 1, 1) //本月1号是周几
      ,
      days = []
    if (startWeek == 7) {
      return days
    }

    const startDay = lastNum - startWeek

    return this.generateDays(lastMonthYear, lastMonth, lastNum, {
      startNum: startDay,
      notCurrent: true
    })
  },
  /**
   * 生成下个月应显示天
   * @param {any} year 
   * @param {any} month
   * @returns 
   */
  nextMonthDays(year, month) {
    const nextMonth = this.formatMonth(parseInt(month) + 1),
      nextMonthYear = parseInt(month) === 12 && parseInt(nextMonth) === 1 ?
        `${parseInt(year) + 1}` :
        year,
      nextNum = this.getNumOfDays(nextMonthYear, nextMonth) //下月天数
    let endWeek = this.getWeekOfDate(year, month) //本月最后一天是周几
      ,
      days = [],
      daysNum = 0
    if (endWeek == 6) {
      return days
    } else if (endWeek == 7) {
      daysNum = 6
    } else {
      daysNum = 6 - endWeek
    }
    return this.generateDays(nextMonthYear, nextMonth, daysNum, {
      startNum: 1,
      notCurrent: true
    })
  },
  /**
   * 
   * 生成一个月的日历
   * @param {any} year 
   * @param {any} month 
   * @returns Array
   */
  generateAllDays(year, month) {
    let lastMonth = this.lastMonthDays(year, month),
      thisMonth = this.currentMonthDays(year, month),
      nextMonth = this.nextMonthDays(year, month),
      days = [].concat(lastMonth, thisMonth, nextMonth)
    return days
  },
  /**
   * 
   * 生成日详情
   * @param {any} year 
   * @param {any} month 
   * @param {any} daysNum 
   * @param {boolean} [option={
   * 		startNum:1,
   * 		grey: false
   * 	}] 
   * @returns Array 日期对象数组
   */
  generateDays(year, month, daysNum, option = {
    startNum: 1,
    notCurrent: false
  }) {
    const weekMap = ['一', '二', '三', '四', '五', '六', '日']
    let days = []
    for (let i = option.startNum; i <= daysNum; i++) {
      let week = weekMap[new Date(year, month - 1, i).getUTCDay()]
      let day = this.formatDay(i)
      days.push({
        date: `${year}-${month}-${day}`,
        event: false,
        day,
        week,
        month,
        year
      })
    }
    return days
  },
  /**
   * 
   * 获取指定月第n天是周几		|
   * 9月第1天： 2017, 08, 1 |
   * 9月第31天：2017, 09, 0 
   * @param {any} year 
   * @param {any} month 
   * @param {number} [day=0] 0为最后一天，1为第一天
   * @returns number 周 1-7, 
   */
  getWeekOfDate(year, month, day = 0) {
    let dateOfMonth = new Date(year, month, 0).getUTCDay() + 1;
    dateOfMonth == 7 ? dateOfMonth = 0 : '';
    return dateOfMonth;
  },
  /**
   * 
   * 获取本月天数
   * @param {number} year 
   * @param {number} month 
   * @param {number} [day=0] 0为本月0最后一天的
   * @returns number 1-31
   */
  getNumOfDays(year, month, day = 0) {
    return new Date(year, month, day).getDate()
  },
  /**
   * 
   * 月份处理
   * @param {number} month 
   * @returns format month MM 1-12
   */
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

  // 开始计时
  startCount(e) {
    app.globalData.countDown = e.currentTarget.dataset.duration;
    app.globalData.Ing = e.currentTarget.dataset.target
    app.globalData.id = e.currentTarget.dataset.id
    app.globalData.timing = e.currentTarget.dataset.timing
  },
  expandList() {
    //2.显示两个选项同时加号变成叉
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
    if (exp_flag === 0) {
      this.animation = animation
      this.opacity = opacity
      animation.rotate(-45).step();
      opacity.opacity(1).step();
      exp_flag = 1;
      this.setData({
        expandHide: 'containerZhezhao',
        exp: '',
      })
    } else {
      this.animation = animation
      animation.rotate(0).step()
      opacity.opacity(0).step()
      exp_flag = 0;
      this.setData({
        expandHide: 'containerHide',
        exp: 'none',
        none: 'none',
        daiban_none: 'none'
      })
    }
    this.setData({
      rotate: animation.export(),
      opacity: opacity.export()
    })
  },
  // 发送打卡数据

  // picker转秒
  timeTosec(time) {
    var str = time;
    var arr = str.split(':');
    var seconds = arr[0] * 3600 + arr[1] * 60;
    return seconds;
  },


  sendDaka(e) {
    var that = this;
    let time = e.detail.value.input
    if (time == '') {
      wx.showToast({
        title: '请填写时间',
        icon: 'none',
        duration: 1000
      })
      return
    }

    wx.showLoading({
      title: '上传中',
    })
    // console.log(e);
    wx.request({
      url: 'https://www.laowangplus.top/api/v1/sign/plantime',
      method: "post",
      data: {
        time: that.timeTosec(e.detail.value.input)
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",

        'token': app.globalData.Token
      },
    })
    setTimeout(function () {
      wx.hideLoading()
      that.setData({
        none: 'none',
        daka_t: '',
        // disabled: true
      })
    }, 500)
  },
  //添加待办事项

  //点击按钮简易获取时间
  ten() {
    this.setData({
      change_10: 'timeChange',
      change_15: '',
      change_25: '',
      change_45: '',
      change_60: '',
      b_min: '10'
    })

  },
  fifteen() {
    this.setData({
      change_15: 'timeChange',
      change_10: '',
      change_25: '',
      change_45: '',
      change_60: '',
      b_min: '15'
    })
  },
  t_five() {
    this.setData({
      change_25: 'timeChange',
      change_15: '',
      change_10: '',
      change_45: '',
      change_60: '',
      b_min: '25'
    })
  },
  f_five() {
    this.setData({
      change_45: 'timeChange',
      change_15: '',
      change_25: '',
      change_10: '',
      change_60: '',
      b_min: '45'
    })
  },
  sixty() {
    this.setData({
      change_60: 'timeChange',
      change_15: '',
      change_25: '',
      change_45: '',
      change_10: '',
      b_min: '60'
    })
  },
  unknow() {
    this.setData({
      change_60: '',
      change_15: '',
      change_25: '',
      change_45: '',
      change_10: '',
      b_min: ''
    })
  },

  //获取待办是正序还是倒序

  // 正序
  timing() {
    let opacity = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 400,
      timingFunction: "ease",
      delay: 0
    })
    let height = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 400,
      timingFunction: "ease",
      delay: 0
    })
    this.opacity = opacity;
    this.height = height;
    height.height('350rpx').step()
    opacity.opacity(0).step();
    this.setData({
      bu_opacity: opacity.export(),
      height: height.export(),
      timing_status: 1,
      change_c: 'timeChange',
      change_r: ''
    })
  },

  // 倒序
  timingReverse() {
    let opacity = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 400,
      timingFunction: "ease",
      delay: 0
    })
    let height = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 400,
      timingFunction: "ease",
      delay: 0
    })
    this.height = height;
    height.height('490rpx').step()
    this.opacity = opacity;
    opacity.opacity(1).step();
    this.setData({
      bu_opacity: opacity.export(),
      height: height.export(),
      timing_status: 0,
      change_r: 'timeChange',
      change_c: ''
    })
  },

  addDaiban(e) {
    var that = this;
    var s_time = that.minTosec(e.detail.value.s_time)
    // console.log(s_time)
    // console.log(e.detail.value.target);
    // console.log(that.data.timing_status);

    if (e.detail.value.target == '' || that.data.timing_status == null) {
      wx.showToast({
        title: '请把数据填满哦',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (that.data.timing_status == 0 && (e.detail.value.target == '' || s_time == 0)) {
      wx.showToast({
        title: '请把数据填满哦',
        icon: 'none',
        duration: 1000
      })
      return
    }

    wx.showLoading({
      title: '上传中',
    })
    wx.request({
      url: 'https://www.laowangplus.top/api/v1/matter/create',
      method: "post",
      data: {
        duration: s_time,
        target: e.detail.value.target,
        timing: that.data.timing_status,
        sign_id: that.data.sign_id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",

        'token': app.globalData.Token
      },
      success() {
        that.getDaiban();
      }
    })

    setTimeout(function () {
      wx.hideLoading()
      that.setData({
        daiban_none: 'none',
        msg: '',
        duration: '',
        timing: null,
        change_60: '',
        change_15: '',
        change_25: '',
        change_45: '',
        change_10: '',
        b_min: '',
        change_c: '',
        change_r: ''
      })
    }, 1000)


  },

  //删除待办
  deleteDaiban(e) {
    var that = this;
    // console.log(e);
    wx.showModal({
      title: '提示',
      content: '是否确定删除',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.laowangplus.top/api/v1/matter/delete/' + e.currentTarget.dataset.id + "/" + that.data.sign_id,
            method: "DELETE",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",

              'token': app.globalData.Token
            },
            success() {
              that.getDaiban()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  // 对打卡、待办关闭与打开的操作
  setDaka() {
    this.setData({
      none: '',
      daiban_none: 'none'
    })

  },
  dakaClose() {
    this.setData({
      none: 'none',

    })

  },
  setDaiban() {
    this.setData({

      daiban_none: '',
      none: 'none',

    })

  },
  daibanClose() {
    this.setData({

      daiban_none: 'none'
    })

  },
  // 完成打卡
  finished() {
    this.getDaiban();
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getDaiban()
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },





})
