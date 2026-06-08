// 充电记录列表
const { getNavBarInfo } = require('../../../utils/nav');

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    records: [],
    totalAmount: '0.00',
    loading: false,
  },

  onLoad() {
    this.initNavBar();
  },

  onShow() {
    this.loadRecords();
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  loadRecords() {
    try {
      const logs = wx.getStorageSync('kt_charging_logs') || [];
      // 按时间倒序
      logs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      const typeMap = {
        fast: { name: '快充', icon: '⚡', bg: '#FEF3C7' },
        slow: { name: '慢充', icon: '🔌', bg: '#DBEAFE' },
        home: { name: '家充', icon: '🏠', bg: '#D1FAE5' },
      };

      const records = logs.map(l => ({
        ...l,
        typeName: (typeMap[l.type] || typeMap.fast).name,
        typeIcon: (typeMap[l.type] || typeMap.fast).icon,
        typeBg: (typeMap[l.type] || typeMap.fast).bg,
        price: ((l.fee || 0) / 100).toFixed(2),
        date: this.formatDate(l.createdAt),
      }));

      // 计算总费用
      const total = logs.reduce((sum, l) => sum + (l.fee || 0), 0);

      this.setData({
        records,
        totalAmount: (total / 100).toFixed(2),
      });
    } catch (e) {
      this.setData({ records: [], totalAmount: '0.00' });
    }
  },

  formatDate(ts) {
    if (!ts) return '--';
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  },

  onAdd() {
    wx.navigateTo({ url: '/subpkg/charging-log/charging-add/charging-add' });
  },

  onRecordTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/subpkg/charging-log/charging-detail/charging-detail?id=${id}` });
  },

  onMonthReport() {
    wx.navigateTo({ url: '/subpkg/charging-log/charging-report/charging-report' });
  },

  onBack() { wx.navigateBack(); },
});
