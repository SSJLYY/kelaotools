// 车贷记录编辑
const { getNavBarInfo } = require('../../../utils/nav');

Page({
  data: { darkMode: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    isEdit: false,
    editId: '',
    formPeriod: '',
    formAmount: '',
    formDate: '',
    formNote: '',
    today: '',
    periods: [],
    totalPaid: '0.00',
    paidCount: 0,
  },

  onLoad(options) {
    this.loadDarkMode();
    this.setData(getNavBarInfo());
    const today = new Date().toISOString().slice(0, 10);
    const periods = [];
    for (let i = 1; i <= 60; i++) periods.push(i);
    this.setData({ today, formDate: today, periods });

    if (options.id) {
      this.setData({ isEdit: true, editId: options.id });
      this.loadRecord(options.id);
    }

    this.loadProgress();
  },

  loadRecord(id) {
    try {
      const records = wx.getStorageSync('kt_loan_records') || [];
      const record = records.find(r => r.id === id);
      if (record) {
        this.setData({
          formPeriod: String(record.period || ''),
          formAmount: String(record.amount || ''),
          formDate: record.date || this.data.today,
          formNote: record.note || '',
        });
      }
    } catch (e) {}
  },

  loadProgress() {
    try {
      const records = wx.getStorageSync('kt_loan_records') || [];
      const total = records.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
      this.setData({ totalPaid: total.toFixed(2), paidCount: records.length });
    } catch (e) {}
  },

  onPeriodChange(e) {
    const idx = Number(e.detail.value);
    this.setData({ formPeriod: String(this.data.periods[idx]) });
  },

  onAmountInput(e) {
    this.setData({ formAmount: e.detail.value });
    this.updatePreview();
  },

  onDateChange(e) {
    this.setData({ formDate: e.detail.value });
  },

  onNoteInput(e) {
    this.setData({ formNote: e.detail.value });
  },

  updatePreview() {
    // 实时预览已还总额
    try {
      const records = wx.getStorageSync('kt_loan_records') || [];
      const currentAmount = parseFloat(this.data.formAmount) || 0;
      let total = records.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
      if (!this.data.isEdit) {
        total += currentAmount;
      }
      this.setData({ totalPaid: total.toFixed(2) });
    } catch (e) {}
  },

  onSave() {
    const { formPeriod, formAmount, formDate, isEdit, editId } = this.data;
    if (!formPeriod || !formAmount || !formDate) {
      wx.showToast({ title: '请填写完整', icon: 'none' });
      return;
    }

    try {
      let records = wx.getStorageSync('kt_loan_records') || [];

      if (isEdit) {
        const idx = records.findIndex(r => r.id === editId);
        if (idx >= 0) {
          records[idx] = {
            ...records[idx],
            period: parseInt(formPeriod),
            amount: parseFloat(formAmount).toFixed(2),
            date: formDate,
            note: this.data.formNote,
          };
        }
      } else {
        records.push({
          id: Date.now().toString(),
          period: parseInt(formPeriod),
          amount: parseFloat(formAmount).toFixed(2),
          date: formDate,
          note: this.data.formNote,
        });
      }

      wx.setStorageSync('kt_loan_records', records);
      wx.showToast({ title: isEdit ? '已更新' : '保存成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1000);
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() { wx.navigateBack(); },
});
