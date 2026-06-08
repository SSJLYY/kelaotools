// 氪佬工具箱 - 首页
const i18n = require('../../i18n/index');
const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: {
    // 系统信息
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    // 车辆绑定
    hasCar: false,
    myCar: null,

    // 欢迎区
    userAvatar: '/assets/images/icons/avatar-default.png',
    welcomeName: '极氪车主',
    welcomeSub: '欢迎使用氪佬工具箱',

    // 数据概览（动态）
    overviewCharging: '¥0.00',
    overviewMaintenance: '¥0.00',
    overviewCarpool: '¥0.00',

    // 提示条
    tipBarText: '本月暂无充电记录，快去充一次吧',
    hasChargingRecords: false,

    // 攻略入口
    infoCardText: '用车技巧 · 极氪OTA升级指南',

    // 我的车辆卡片
    mycarStatusText: '本月暂无充电记录',

    // 报告卡片
    reportYear: '',
    reportMonth: '',

    // 每日小贴士
    dailyTip: { icon: '💡', title: '', summary: '' },
  },

  onLoad() {
    this.initSystemInfo();
    this.initDailyTip();
  },

  onShow() {
    this.renderI18n();
    this.checkCarBinding();
    this.loadDataOverview();
    this.initDailyTip();
  },

  // 初始化系统信息
  initSystemInfo() {
    this.setData(getNavBarInfo());
  },

  // 渲染多语言
  renderI18n() {
    // 多语言更新 app.js langVersion 触发 onShow 刷新
  },

  // ---- 车辆绑定 ----
  checkCarBinding() {
    try {
      const myCar = wx.getStorageSync('kt_my_car');
      if (myCar) {
        this.setData({
          hasCar: true,
          myCar,
          welcomeName: myCar.plate || myCar.model || '极氪车主',
          welcomeSub: myCar.year ? `${myCar.year}款 · 已绑定` : '已绑定车辆',
        });
      } else {
        this.setData({
          hasCar: false,
          myCar: null,
          welcomeName: '极氪车主',
          welcomeSub: '欢迎使用氪佬工具箱',
        });
      }
    } catch (e) {
      this.setData({ hasCar: false, myCar: null });
    }
  },

  // ---- 数据概览 ----
  loadDataOverview() {
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

      const chargingLogs = wx.getStorageSync('kt_charging_logs') || [];
      const maintenanceLogs = wx.getStorageSync('kt_maintenance_logs') || [];
      const rideLogs = wx.getStorageSync('kt_ride_logs') || [];

      const monthCharging = chargingLogs
        .filter(l => (l.createdAt || 0) >= monthStart)
        .reduce((sum, l) => sum + (l.fee || 0), 0);
      const monthMaintenance = maintenanceLogs
        .filter(l => (l.createdAt || 0) >= monthStart)
        .reduce((sum, l) => sum + (l.fee || 0), 0);
      const monthCarpool = rideLogs
        .filter(l => (l.createdAt || 0) >= monthStart)
        .reduce((sum, l) => sum + (l.revenue || 0), 0);

      this.setData({
        overviewCharging: this.formatMoney(monthCharging),
        overviewMaintenance: this.formatMoney(monthMaintenance),
        overviewCarpool: this.formatMoney(monthCarpool),
      });

      // 更新提示条和车辆状态
      const monthRecords = chargingLogs.filter(l => (l.createdAt || 0) >= monthStart);
      const hasMonthRecords = monthRecords.length > 0;
      const totalFee = (monthCharging / 100).toFixed(2);
      this.setData({
        hasChargingRecords: hasMonthRecords,
        tipBarText: hasMonthRecords
          ? `本月已充电 ${monthRecords.length} 次，总费用 ¥${totalFee}`
          : '本月暂无充电记录，快去充一次吧',
        mycarStatusText: hasMonthRecords
          ? `本月已充电 ${monthRecords.length} 次，费用 ¥${totalFee}`
          : '本月暂无充电记录',

        // 报告卡片年月
        reportYear: now.getFullYear(),
        reportMonth: now.getMonth() + 1,
      });

      // 攻略入口（根据车型推荐）
      const car = wx.getStorageSync('kt_my_car');
      if (car && car.modelId === '001') {
        this.setData({ infoCardText: '用车技巧 · 极氪001专属OTA升级指南' });
      }
    } catch (e) {
      // storage 读取失败
    }
  },

  // 格式化金额
  formatMoney(fen) {
    if (!fen) return '¥0.00';
    return '¥' + (fen / 100).toFixed(2);
  },

  // ---- 事件处理 ----

  onSwitchLang() {
    const current = i18n.getCurrentLang();
    const next = current === 'zh-CN' ? 'en-US' : 'zh-CN';
    i18n.setLang(next);
    this.onShow();
  },

  onAddCar() {
    wx.navigateTo({ url: '/pages/car-setting/car-setting' });
  },

  onGotoCarSetting() {
    wx.navigateTo({ url: '/pages/my-car/my-car' });
  },

  // 查看充电月报
  onGoReport() {
    wx.navigateTo({ url: '/subpkg/charging-log/charging-report/charging-report' });
  },

  // 每日小贴士（随机轮播）
  initDailyTip() {
    const tips = [
      { icon: '🛞', title: '胎压参考值', summary: '极氪001建议冷胎胎压前2.6/后2.9 bar' },
      { icon: '❄️', title: '空调省电技巧', summary: '温度设24-26°C，配合座椅通风续航提升8%' },
      { icon: '🔋', title: '电池充电建议', summary: '日常充电至80%，长途出行再充至100%' },
      { icon: '🌨️', title: '冬季用车指南', summary: '提前预热电池10分钟，续航更稳定' },
      { icon: '🔄', title: '动能回收技巧', summary: '城市用强回收模式，续航可提升15-20%' },
    ];
    // 按当天日期取不同的tip
    const idx = new Date().getDate() % tips.length;
    this.setData({ dailyTip: tips[idx] });
  },

  // 跳转小贴士列表
  onGoTips() {
    wx.navigateTo({ url: '/pages/tips/tips' });
  },

  onGoAddDesktopGuide() {
    wx.navigateTo({ url: '/pages/add-desktop-guide/add-desktop-guide' });
  },

  goToPage(path) {
    if (!path) return;

    if (path === '/pages/tools/tools') {
      wx.switchTab({ url: path });
      return;
    }

    wx.navigateTo({
      url: path,
      fail: err => {
        wx.showToast({ title: '页面打开失败，请看控制台', icon: 'none' });
        console.error('navigateTo failed:', path, err);
      },
    });
  },

  onGoSceneCode() {
    this.goToPage('/pages/tools/tools');
  },

  onGoVehicleInfo() {
    this.goToPage('/subpkg/maintenance/vehicle-info/vehicle-info');
  },

  onGoTestDrive() {
    this.goToPage('/subpkg/charging-calc/test-drive/test-drive');
  },

  // 快捷入口
  onQuickEntry(e) {
    const { type } = e.currentTarget.dataset;
    const paths = {
      scene: '/pages/tools/tools',
      vehicle: '/subpkg/maintenance/vehicle-info/vehicle-info',
      testdrive: '/subpkg/charging-calc/test-drive/test-drive',
    };
    this.goToPage(paths[type]);
  },

  // 数据概览点击
  onDataTap(e) {
    const { type } = e.currentTarget.dataset;
    const paths = {
      charging: '/subpkg/charging-log/charging-log/charging-log',
      maintenance: '/subpkg/maintenance/maintenance-ledger/maintenance-ledger',
      carpool: '/subpkg/ride-log/carpool-revenue/carpool-revenue',
    };
    const path = paths[type];
    if (path) wx.navigateTo({ url: path });
  },

  // 提示条点击
  onTipTap() {
    if (this.data.hasChargingRecords) {
      wx.navigateTo({ url: '/subpkg/charging-log/charging-log/charging-log' });
    } else {
      wx.navigateTo({ url: '/subpkg/charging-calc/charging-cost/charging-cost' });
    }
  },

  // 攻略入口
  onInfoTap() {
    wx.showToast({ title: '攻略功能开发中', icon: 'none' });
  },

  // 工具点击
  onToolTap(e) {
    const { path } = e.currentTarget.dataset;
    if (path) wx.navigateTo({ url: path });
  },

  onMoreTools() {
    wx.navigateTo({ url: '/pages/all-tools/all-tools' });
  },

  // 优惠券
  onCouponTap(e) {
    const { id } = e.currentTarget.dataset;
    if (id === 1) {
      wx.showModal({
        title: '新氪友8元储值卡',
        content: '请通过极氪App「我的-卡券中心」查看最新充电优惠活动',
        showCancel: false,
        confirmText: '知道了',
      });
    } else if (id === 2) {
      wx.showModal({
        title: '21-20充电券',
        content: '请打开平安好车主App，在「优惠券」页面绑定车辆后领取充电券',
        confirmText: '我知道了',
        showCancel: false,
      });
    } else if (id === 3) {
      wx.showModal({
        title: '社群抽奖',
        content: '请加入平安好车主微信社群参与每日抽奖。获取社群入口请关注平安好车主公众号。',
        confirmText: '好的',
        showCancel: false,
      });
    }
  },

  onMoreCoupon() {
    wx.showToast({ title: '更多优惠券即将上线', icon: 'none' });
  },

  // 兼职外快
  onSideJobTap(e) {
    const { id } = e.currentTarget.dataset;
    const names = { amap: '高德顺风车', didi: '滴滴顺风车', hello: '哈啰顺风车' };
    wx.showModal({
      title: names[id] || '顺风车注册',
      content: '即将跳转到外部应用注册，是否继续？',
      success: res => {
        if (res.confirm) wx.showToast({ title: '功能开发中', icon: 'none' });
      },
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.checkCarBinding();
    this.loadDataOverview();
    setTimeout(() => wx.stopPullDownRefresh(), 500);
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '氪佬工具箱 - 极氪车主一站式用车助手',
      path: '/pages/index/index',
    };
  },
});
