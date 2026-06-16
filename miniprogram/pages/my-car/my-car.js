// 我的车辆
const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: { darkMode: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    carList: [],
  },

  onLoad() { this.loadDarkMode();
    this.initNavBar();
  },

  onShow() { this.loadDarkMode();
    this.loadCarList();
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  loadCarList() {
    try {
      const cars = wx.getStorageSync('kt_my_cars') || [];
      this.setData({ carList: cars });
    } catch (e) {
      this.setData({ carList: [] });
    }
  },

  onAddCar() {
    wx.navigateTo({ url: '/pages/car-setting/car-setting' });
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() {
    wx.navigateBack();
  },

  // 点击车辆卡片 → 车辆信息详情
  onEditCar(e) {
    const { id } = e.currentTarget.dataset;
    const car = this.data.carList.find(c => c.id === id);
    if (car) {
      // 将当前车辆写入 kt_my_car 供车辆信息页读取
      wx.setStorageSync('kt_my_car', car);
      wx.navigateTo({ url: '/subpkg/maintenance/vehicle-info/vehicle-info' });
    }
  },
});
