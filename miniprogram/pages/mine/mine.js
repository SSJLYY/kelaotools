const i18n = require('../../i18n/index');
Page({
  data: {
    userAvatar: '/assets/images/icons/avatar-default.png',
    userName: '极氪车主',
    chargingCount: 0, maintenanceCount: 0, carpoolCount: 0,
    currentLang: '中文',
    registerDate: '',
  },
  onShow() {
    this.loadStats();
    this.setData({ currentLang: i18n.getCurrentLang() === 'zh-CN' ? '中文' : 'English' });
    try {
      const car = wx.getStorageSync('kt_my_car');
      if (car?.plate) this.setData({ userName: car.plate });
    } catch (e) {}
    // 注册日期
    let rd = wx.getStorageSync('kt_register_date');
    if (!rd) { rd = this.fmtDate(); wx.setStorageSync('kt_register_date', rd); }
    this.setData({ registerDate: rd });
  },
  loadStats() {
    try {
      const c = (wx.getStorageSync('kt_charging_logs')||[]).length;
      const m = (wx.getStorageSync('kt_maintenance_logs')||[]).length;
      const r = (wx.getStorageSync('kt_ride_logs')||[]).length;
      this.setData({ chargingCount:c, maintenanceCount:m, carpoolCount:r });
    } catch(e){}
  },
  onGoProfile() { wx.navigateTo({ url: '/pages/profile/profile' }); },
  onGoAddDesktopGuide() { wx.navigateTo({ url: '/pages/add-desktop-guide/add-desktop-guide' }); },
  onGoFeatureIntro() { wx.navigateTo({ url: '/pages/feature-intro/feature-intro' }); },
  onNav(e) { const p = e.currentTarget.dataset.path; if (p) wx.navigateTo({ url: p }); },
  onSwitchLang() {
    const langs = i18n.getSupportedLangs();
    const cur = i18n.getCurrentLang();
    wx.showActionSheet({ itemList: langs.map(l=>l.name), success: res => {
      const s = langs[res.tapIndex];
      if (s.code !== cur) { i18n.setLang(s.code); this.setData({ currentLang: s.name }); wx.showToast({ title:'已切换', icon:'success' }); }
    }});
  },
  onFeedback() { wx.showModal({ title:'意见反馈', content:'请通过极氪车友群联系开发者\n或发送邮件至 shaun88@88.com', showCancel:false, confirmText:'知道了' }); },
  onAbout() { wx.showModal({ title:'关于氪佬工具箱', content:'极氪车主一站式用车助手\n\n充电计算 · 养车账本 · 出行记录 · 场景码 · 音效\n版本：v1.1.0\n为极氪车主而生 ⚡', showCancel:false, confirmText:'好的' }); },
  fmtDate() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  },
  onShareAppMessage() { return { title:'氪佬工具箱 - 极氪车主一站式用车助手', path:'/pages/index/index' }; },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '氪佬工具箱 - 极氪车主一站式用车助手',
    };
  },
});
