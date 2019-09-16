// pages/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    parkingShow: true,
    parking: false,
    backBox:false,
    longitude: '121.62',
    latitude:'38.92',
    animation: '',
    animationBack:'',
    selectType: 'now',
    markers: [
      {
        id: "0",
        latitude: 38.92,
        longitude: 121.62,
      },
      {
        id: "1",
        latitude: 38.92,
        longitude: 121.52,
      },
      {
        id: "2",
        latitude: 38.87,
        longitude: 121.52,
      }
    ],
  },
  //切换选中状态
  selectNow (e) {
    this.setData({
      selectType: e.currentTarget.dataset.id
    })
  },
  selectApp (e) {
    this.setData({
      selectType: e.currentTarget.dataset.id
    })
    wx.redirectTo({
      url: '../appointment/appointment',
    })
  },
  //点击marker
  markertap(e) {
    console.log(e.markerId)
  },
  //定位
  location() {
    let mapLoc = wx.createMapContext("map");
    mapLoc.moveToLocation();
  },
  //刷新
  refresh() {
    let that = this;
    that.onLoad();
  },
  //预约
  appointment () {
    this.setData({
      backBox: true
    })
    this.animation.translateY(-283).step()
    this.setData({ animation: this.animation.export() })
  },
   //弹框
  translate () {
    this.setData({
      parkingShow: false
    })
    this.setData({
      backBox: true
    })
    this.animation.translateY(-283).step()
    this.setData({ animation: this.animation.export() })
  },
  //收回弹框
  translateBack () {
    this.setData({
      parkingShow: true
    })
    this.setData({
      backBox: false
    })
    this.animationBack.translateY(283).step()
    this.setData({ animation: this.animationBack.export() })
  },
  //去个人中心
  toPC() {
    wx.redirectTo({
      url: '../personalCenter/personalCenter',
    })
  },
  
  //授权登陆
  bindGetUserInfo(res) {
    let info = res;
    console.log(res);
    if (res.data != "") {
      this.setData({
        show: false
      })
    }
     if (info.detail.userInfo) {
       console.log("点击了同意授权");
       wx.login({
         success: res => {
           // ------ 获取凭证 ------
           let code = res.code;
           if (code) {
             console.log('获取用户登录凭证：' + code);
             // ------ 发送凭证 ------
             wx.request({
               url: 'http://192.168.1.185:8866/stopCar/admin/personInformation/%7Bcode%7D?code=123123',
              data: { 
                code: code,
              },
               method: 'POST',
               header: {
                 'content-type': 'application/json'
               },
               success: function (res) {
                 if (res.statusCode == 200) {  
                   console.log("获取到的openid为：" + res.data)
                   getApp().globalData.openid = res.data
                   wx.setStorageSync('openid', res.data)
                   console.log(res)
                 } else {
                   console.log(res.errMsg)
                 }
                 
               },
             })
           } else {
             console.log('获取用户登录失败：' + res.errMsg);
           }
        
         }
       })
     }
   },

  /**
   * 生命周期函数--监听页面加载
   */

  //定位和标点
  onLoad: function () {
    var that = this
    wx.showLoading({
      title: "定位中",
      mask: true
    })
    wx.getLocation({
      type: 'gcj02',
      altitude: true,//高精度定位
      //定位成功，更新定位结果
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude

        that.setData({
          longitude: longitude,
          latitude: latitude,
        })
      },
      
      //定位失败回调
      fail: function () {
        wx.showToast({
          title: "定位失败",
          icon: "none"
        })
      },

      complete: function () {
        //隐藏定位中信息进度
        wx.hideLoading()
      },
    })
    //是否弹出登陆框
    var showOrNot = wx.getStorageSync("openid")
    if (showOrNot != "") {
      this.setData({
        show: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 350
    });
    this.animationBack = wx.createAnimation({
      duration: 350
    });
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