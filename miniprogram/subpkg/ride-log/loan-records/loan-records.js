// 车贷还款记录 - 重构版
const { getNavBarInfo } = require('../../../utils/nav');

Page({
  data: { darkMode: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    records: [],
    totalPaid: '0.00',
    paidCount: 0,
  },

  onLoad() { this.loadDarkMode();
    this.setData(getNavBarInfo());
  },

  onShow() { this.loadDarkMode();
    this.load();
  },

  load() {
    try {
      const r = wx.getStorageSync('kt_loan_records') || [];
      r.sort((a, b) => (b.period || 0) - (a.period || 0));
      const total = r.reduce((s, x) => s + (parseFloat(x.amount) || 0), 0);
      this.setData({ records: r, totalPaid: total.toFixed(2), paidCount: r.length });
    } catch (e) {}
  },

  // 跳转到编辑页面（新增）
  onAdd() {
    wx.navigateTo({ url: '/subpkg/ride-log/loan-edit/loan-edit' });
  },

  // 跳转到编辑页面（编辑）
  onEdit(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/subpkg/ride-log/loan-edit/loan-edit?id=' + id });
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除记录',
      content: '确定删除这条还款记录吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          const records = (wx.getStorageSync('kt_loan_records') || []).filter(r => r.id !== id);
          wx.setStorageSync('kt_loan_records', records);
          this.load();
          wx.showToast({ title: '已删除', icon: 'success' });
        } catch (e) {
          wx.showToast({ title: '删除失败', icon: 'none' });
        }
      },
    });
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() { wx.navigateBack(); },
});
