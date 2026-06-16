// 充电月报
const { getNavBarInfo } = require('../../../utils/nav');

Page({
  data: { darkMode: false,
    statusBarHeight: 20, navBarHeight: 44, navTotalHeight: 64,
    year: '', month: '', report: { totalFee: '0.00', count: 0, totalKwh: 0, avgFee: '0.00', favStation: '--' },
    typeBreakdown: [],
  },

  onLoad() { this.loadDarkMode();
    this.initNavBar();
    const d = new Date();
    this.setData({ year: d.getFullYear(), month: d.getMonth() + 1 });
    this.calcReport();
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  calcReport() {
    try {
      const logs = wx.getStorageSync('kt_charging_logs') || [];
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

      const monthLogs = logs.filter(l => (l.createdAt || 0) >= monthStart);
      const count = monthLogs.length;
      const totalFee = monthLogs.reduce((s, l) => s + (l.fee || 0), 0);
      const totalKwh = monthLogs.reduce((s, l) => s + (l.kwh || 0), 0);

      // 最爱渠道
      const stationMap = {};
      monthLogs.forEach(l => {
        if (l.station) stationMap[l.station] = (stationMap[l.station] || 0) + 1;
      });
      let favStation = '--';
      let maxCount = 0;
      Object.entries(stationMap).forEach(([k, v]) => { if (v > maxCount) { maxCount = v; favStation = k; }});

      // 类型分布
      const typeMap = { fast: '快充', slow: '慢充', home: '家充' };
      const typeCount = {};
      monthLogs.forEach(l => { typeCount[l.type] = (typeCount[l.type] || 0) + 1; });
      const typeBreakdown = Object.entries(typeCount).map(([k, v]) => ({ name: typeMap[k] || k, count: v }));

      this.setData({
        report: {
          totalFee: (totalFee / 100).toFixed(2),
          count,
          totalKwh: totalKwh.toFixed(1),
          avgFee: count > 0 ? (totalFee / count / 100).toFixed(2) : '0.00',
          favStation,
        },
        typeBreakdown,
      });
    } catch (e) {}
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() { wx.navigateBack(); },

  onShareAppMessage() {
    return {
      title: `极氪${this.data.year}年${this.data.month}月充电报告：¥${this.data.report.totalFee}`,
      path: `/subpkg/charging-log/charging-report/charging-report`,
    };
  },
});
