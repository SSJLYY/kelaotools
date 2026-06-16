const i18n = require('../../i18n/index');
const darkmode = require('../../utils/darkmode');
const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: {
    statusBarHeight: 20, navBarHeight: 44, navTotalHeight: 64,
    userAvatar: '/assets/images/icons/avatar-default.png',
    userName: '极氪车主',
    chargingCount: 0, maintenanceCount: 0, carpoolCount: 0, mileageCount: 0,
    currentLang: '中文',
    registerDate: '',
    appVersion: 'v2.4.1',
    darkMode: false,
    darkModeSetting: { mode: 'light', darkHour: 19, darkMinute: 0, lightHour: 7, lightMinute: 0 },
    showDarkModePopup: false,
    darkHourRange: [],
    darkMinuteRange: [],
    lightHourRange: [],
    lightMinuteRange: [],
  },
  onLoad() {
    this.initNavBar();
    this._initTimePickerData();
    this.loadDarkMode();
  },
  onShow() {
    this.loadStats();
    this.loadDarkMode();
    this.setData({ currentLang: i18n.getCurrentLang() === 'zh-CN' ? '中文' : 'English' });
    try {
      const car = wx.getStorageSync('kt_my_car');
      if (car?.plate) this.setData({ userName: car.plate });
    } catch (e) {}
    let rd = wx.getStorageSync('kt_register_date');
    if (!rd) { rd = this.fmtDate(); wx.setStorageSync('kt_register_date', rd); }
    this.setData({ registerDate: rd });
  },
  initNavBar() {
    this.setData(getNavBarInfo());
  },
  _initTimePickerData() {
    const hours = [];
    const minutes = [];
    for (let i = 0; i < 24; i++) hours.push(i < 10 ? '0' + i : '' + i);
    for (let i = 0; i < 60; i++) minutes.push(i < 10 ? '0' + i : '' + i);
    this.setData({
      darkHourRange: hours,
      darkMinuteRange: minutes,
      lightHourRange: hours,
      lightMinuteRange: minutes,
    });
  },
  loadStats() {
    try {
      const c = (wx.getStorageSync('kt_charging_logs')||[]).length;
      const m = (wx.getStorageSync('kt_maintenance_logs')||[]).length;
      const r = (wx.getStorageSync('kt_ride_logs')||[]).length;
      const ml = (wx.getStorageSync('kt_mileage_logs')||[]).length;
      this.setData({ chargingCount:c, maintenanceCount:m, carpoolCount:r, mileageCount:ml });
    } catch(e){}
  },
  loadDarkMode() {
    try {
      const darkMode = darkmode.resolveDarkMode();
      const setting = darkmode.getSetting();
      this.setData({ darkMode, darkModeSetting: setting });
    } catch (e) {}
  },

  onOpenDarkModeSetting() {
    const setting = darkmode.getSetting();
    this.setData({ showDarkModePopup: true, darkModeSetting: setting });
  },

  onCloseDarkModePopup() {
    this.setData({ showDarkModePopup: false });
  },

  onSetDarkMode(e) {
    const mode = e.currentTarget.dataset.mode;
    const setting = { ...this.data.darkModeSetting, mode };
    this.setData({ darkModeSetting: setting });
  },

  onDarkHourChange(e) {
    const val = parseInt(e.detail.value);
    const setting = { ...this.data.darkModeSetting, darkHour: val };
    this.setData({ darkModeSetting: setting });
  },

  onDarkMinuteChange(e) {
    const val = parseInt(e.detail.value);
    const setting = { ...this.data.darkModeSetting, darkMinute: val };
    this.setData({ darkModeSetting: setting });
  },

  onLightHourChange(e) {
    const val = parseInt(e.detail.value);
    const setting = { ...this.data.darkModeSetting, lightHour: val };
    this.setData({ darkModeSetting: setting });
  },

  onLightMinuteChange(e) {
    const val = parseInt(e.detail.value);
    const setting = { ...this.data.darkModeSetting, lightMinute: val };
    this.setData({ darkModeSetting: setting });
  },

  onConfirmDarkModeSetting() {
    const setting = this.data.darkModeSetting;
    darkmode.saveSetting(setting);
    const dark = darkmode.resolveDarkMode();
    darkmode.setDarkMode(dark);
    darkmode.applyDarkMode(dark);
    this.setData({ showDarkModePopup: false, darkMode: dark });
    const modeNames = { light: '浅色模式', dark: '深色模式', auto: '自动切换' };
    wx.showToast({ title: modeNames[setting.mode] || '已保存', icon: 'success' });
  },
  onGoProfile() { wx.navigateTo({ url: '/pages/profile/profile' }); },
  onGoAddDesktopGuide() { wx.navigateTo({ url: '/pages/add-desktop-guide/add-desktop-guide' }); },
  onGoFeatureIntro() { wx.navigateTo({ url: '/pages/feature-intro/feature-intro' }); },
  onGoChangelog() { wx.navigateTo({ url: '/pages/changelog/changelog' }); },
  onCheckUpdate() {
    if (!wx.getUpdateManager) return;
    const um = wx.getUpdateManager();
    um.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        wx.showToast({ title: '发现新版本，正在下载...', icon: 'loading' });
      } else {
        wx.showToast({ title: '已是最新版本', icon: 'success' });
      }
    });
  },
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
  onAbout() { wx.showModal({ title:'关于氪佬工具箱', content:`极氪车主一站式用车助手\n\n充电计算 · 养车账本 · 出行记录 · 场景码 · 音效\n充电桩收藏 · 洗车日记 · 改装配件 · 用车日历\n里程记录 · 保养提醒 · 月度报告\n数据导出 · 深色模式 · 电价走势\n车主社区\n版本：${this.data.appVersion}\n为极氪车主而生 ⚡`, confirmText:'查看更新日志', cancelText:'知道了', success: res => { if (res.confirm) wx.navigateTo({ url: '/pages/changelog/changelog' }); } }); },
  fmtDate() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  },
  onShareAppMessage() { return { title:'氪佬工具箱 - 极氪车主一站式用车助手', path:'/pages/index/index' }; },
  onShareTimeline() {
    return {
      title: '氪佬工具箱 - 极氪车主一站式用车助手',
    };
  },
});
