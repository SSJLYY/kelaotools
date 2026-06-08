// 个人信息
const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: {
    statusBarHeight:20,navBarHeight:44,navTotalHeight:64,
    userAvatar:'/assets/images/icons/avatar-default.png',
    userName:'极氪车主', registerDate:'', bindCar:'暂无',
    lastActive:'', chargingCount:0, syncing:false,
  },
  onLoad() {
    this.initNavBar();
    try {
      const car = wx.getStorageSync('kt_my_car');
      if (car?.plate) this.setData({ userName: car.plate });
      if (car?.model) this.setData({ bindCar: car.model + (car.year?' '+car.year+'款':'') });
    } catch(e){}
    const rd = wx.getStorageSync('kt_register_date') || this.fmtDate();
    if (!wx.getStorageSync('kt_register_date')) wx.setStorageSync('kt_register_date', rd);
    this.setData({
      registerDate: rd,
      lastActive: this.fmtDateTime(),
      chargingCount: (wx.getStorageSync('kt_charging_logs')||[]).length,
    });
  },
  initNavBar() {
    this.setData(getNavBarInfo());
  },
  onSync() {
    this.setData({ syncing:true });
    setTimeout(() => {
      this.setData({ syncing:false, lastActive: this.fmtDateTime() });
      wx.showToast({ title:'同步完成', icon:'success' });
    }, 1500);
  },
  onLogout() {
    wx.showModal({
      title:'退出登录', content:'退出后本地数据仍会保留，确定退出吗？',
      confirmColor:'#EF4444',
      success: res => {
        if (res.confirm) { wx.showToast({ title:'已退出', icon:'success' }); setTimeout(()=>wx.switchTab({url:'/pages/index/index'}),1000); }
      },
    });
  },
  onClearData() {
    wx.showModal({
      title:'清除数据', content:'将清除所有充电记录、养车记录、车辆信息等本地数据，此操作不可恢复！',
      confirmColor:'#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          wx.clearStorageSync();
          wx.setStorageSync('kt_register_date', this.data.registerDate);
          wx.showToast({ title:'已清除', icon:'success' });
          setTimeout(()=>wx.switchTab({url:'/pages/index/index'}),1000);
        } catch(e) { wx.showToast({ title:'清除失败', icon:'none' }); }
      },
    });
  },
  fmtDate() { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; },
  fmtDateTime() { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; },
  onBack() { wx.navigateBack(); },
});
