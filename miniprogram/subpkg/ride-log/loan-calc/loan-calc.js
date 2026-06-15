// 车贷计算器 - 重构版
const { getNavBarInfo } = require('../../../utils/nav');

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    loanAmount: '',
    rate: '',
    months: 36,
    terms: [12, 24, 36, 48, 60],
    purchaseDate: '',
    result: null,
    loanInfo: null,
    paidCount: 0,
    paidTotal: '0.00',
    today: '',
  },

  onLoad() {
    this.setData(getNavBarInfo());
    const today = new Date().toISOString().slice(0, 10);
    this.setData({ today, purchaseDate: today });
    this.loadLoanInfo();
    this.loadProgress();
  },

  onShow() {
    this.loadProgress();
  },

  loadLoanInfo() {
    try {
      const info = wx.getStorageSync('kt_loan_info');
      if (info) {
        this.setData({
          loanAmount: String(info.loanAmount || ''),
          rate: String(info.rate || ''),
          months: info.months || 36,
          purchaseDate: info.purchaseDate || this.data.today,
          loanInfo: info,
          result: info.result || null,
        });
      }
    } catch (e) {}
  },

  loadProgress() {
    try {
      const records = wx.getStorageSync('kt_loan_records') || [];
      const total = records.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
      this.setData({ paidTotal: total.toFixed(2), paidCount: records.length });
    } catch (e) {}
  },

  onInput(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value });
  },

  onTermTap(e) {
    this.setData({ months: e.currentTarget.dataset.v });
  },

  onDateChange(e) {
    this.setData({ purchaseDate: e.detail.value });
  },

  onCalc() {
    const p = parseFloat(this.data.loanAmount);
    const r = parseFloat(this.data.rate) / 100 / 12;
    const n = this.data.months;
    if (isNaN(p) || isNaN(r) || p <= 0 || r <= 0) {
      wx.showToast({ title: '请正确填写', icon: 'none' });
      return;
    }
    const monthly = ((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)).toFixed(2);
    const total = (monthly * n).toFixed(2);
    const interest = (total - p).toFixed(2);
    const result = { monthly, totalPayment: total, totalInterest: interest };
    this.setData({ result });

    // 保存贷款信息
    const loanInfo = {
      loanAmount: p,
      rate: parseFloat(this.data.rate),
      months: n,
      purchaseDate: this.data.purchaseDate,
      result,
      updatedAt: Date.now(),
    };
    wx.setStorageSync('kt_loan_info', loanInfo);
    this.setData({ loanInfo });
  },

  onGoRecords() {
    wx.navigateTo({ url: '/subpkg/ride-log/loan-records/loan-records' });
  },

  onBack() { wx.navigateBack(); },
});
