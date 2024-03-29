var util = require('../../util/util.js');
const app = getApp();


Page({


  data: {
    userInfo: [],
    nickName: '',
    avatarUrl: '',
    time: '',
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
    dakaList: [],
    motto: '',
    //连续打卡天数
    study_days: '0'
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



  onLoad: function (options) {
    this.getUserInfo();
    // 初始时间
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
    this.getDakaList();



  },

  onShow() {
    this.getDakaList();
  },

  bindDateChange(e) {
    if (e.detail.value === this.data.date) {
      return
    }

    const month = e.detail.value.slice(-2),
      year = e.detail.value.slice(0, 4)

    this.changeDate(year, month)
  },

  getDakaList() {
    var that = this;
    wx.request({
      url: 'https://www.laowangplus.top/api/v1/sign/getmonth',
      header: {
        'token': app.globalData.Token
      },
      success(res) {
        console.log(res)
        //从得到的数组中筛选出已经打卡的天数得到一个新的数组
        let arr = res.data.month.filter(item => item.sign_status == 1)
        let dateArr = arr.map(item => item.date)
        that.setData({
          dakaList: dateArr,
          motto: res.data.motto,
          //连续学习天数
          study_days: res.data.num
        })
        that.isSign();
      }
    })


  },
  // 判断打卡 
  isSign() {
    let dakaList = this.data.dakaList;
    let first = this.data.calendar.first;
    let second = this.data.calendar.second
    let third = this.data.calendar.third
    let fourth = this.data.calendar.fourth
    var that = this;
    for (let index = 0; index < first.length; index++) {
      let isSign = 'calendar.first[' + index + '].isSign'
      let len = dakaList.length
      for (let i = 0; i < len; i++) { 


        if (first[index].date == dakaList[i]) {
          that.setData({
            [isSign]: true,
          })
        }

      }
    }
    for (let index = 0; index < second.length; index++) {
      let isSign = 'calendar.second[' + index + '].isSign'
      let len = dakaList.length
      for (let i = 0; i < len; i++) {


        if (second[index].date == dakaList[i]) {
          that.setData({
            [isSign]: true,
          })
        }

      }
    }
    for (let index = 0; index < third.length; index++) {
      let isSign = 'calendar.third[' + index + '].isSign'
      let len = dakaList.length
      for (let i = 0; i < len; i++) {
        if (third[index].date == dakaList[i]) {
          that.setData({
            [isSign]: true,
          })
        }

      }
    }
    for (let index = 0; index < fourth.length; index++) {
      let isSign = 'calendar.fourth[' + index + '].isSign'
      let len = dakaList.length
      for (let i = 0; i < len; i++) {
        if (fourth[index].date == dakaList[i]) {
          that.setData({
            [isSign]: true,
          })
        }

      }
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
        isSign: false,
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

  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getDakaList();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },


})