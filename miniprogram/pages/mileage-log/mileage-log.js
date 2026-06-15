// 里程记录
const { getNavBarInfo } = require('../../utils/nav');

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    mode: 'list', // list | add
    records: [],
    totalMileage: '0',
    monthMileage: '0',
    avgConsumption: '0',
    totalTrips: 0,

    tripTypes: ['通勤', '出行', '长途', '其他'],
    typeIndex: -1,

    form: {
      type: '',
      date: '',
      mileage: '',
      consumption: '',
      startLocation: '',
      endLocation: '',
      note: '',
      carName: '',
    },
  },

  onLoad() {
    this.setData(getNavBarInfo());
    this.resetForm();
  },

  onShow() {
    this.loadRecords();
    this.loadCarName();
  },

  loadCarName() {
    try {
      const car = wx.getStorageSync('kt_my_car') || {};
      const carName = car.model ? `${car.model}${car.year ? ` ${car.year}款` : ''}` : '极氪 001 2025款';
      this.setData({ 'form.carName': carName });
    } catch (e) {
      this.setData({ 'form.carName': '极氪 001 2025款' });
    }
  },

  resetForm() {
    this.setData({
      typeIndex: -1,
      form: {
        type: '',
        date: formatDate(new Date()),
        mileage: '',
        consumption: '',
        startLocation: '',
        endLocation: '',
        note: '',
        carName: this.data.form?.carName || '极氪 001 2025款',
      },
    });
  },

  loadRecords() {
    try {
      const list = wx.getStorageSync('kt_mileage_logs') || [];
      const normalized = list.map(item => ({
        id: item.id || `${Date.now()}_${Math.random()}`,
        type: item.type || '通勤',
        date: item.date || formatDate(new Date(item.createdAt || Date.now())),
        mileage: Number(item.mileage || 0),
        consumption: Number(item.consumption || 0),
        consumptionPer100: item.mileage > 0 ? ((item.consumption / item.mileage) * 100).toFixed(1) : '0',
        startLocation: item.startLocation || '',
        endLocation: item.endLocation || '',
        note: item.note || '',
        carName: item.carName || '',
        createdAt: item.createdAt || Date.now(),
      })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      const totalMileage = normalized.reduce((sum, item) => sum + item.mileage, 0);
      const totalConsumption = normalized.reduce((sum, item) => sum + item.consumption, 0);
      const now = new Date();
      const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const monthRecords = normalized.filter(item => item.date.startsWith(monthPrefix));
      const monthMileage = monthRecords.reduce((sum, item) => sum + item.mileage, 0);
      const monthConsumption = monthRecords.reduce((sum, item) => sum + item.consumption, 0);
      const avgConsumption = totalMileage > 0 ? ((totalConsumption / totalMileage) * 100).toFixed(1) : '0';

      this.setData({
        records: normalized,
        totalMileage: totalMileage.toFixed(0),
        monthMileage: monthMileage.toFixed(0),
        avgConsumption,
        totalTrips: normalized.length,
      });
    } catch (e) {
      this.setData({ records: [], totalMileage: '0', monthMileage: '0', avgConsumption: '0', totalTrips: 0 });
    }
  },

  showAdd() {
    this.resetForm();
    this.loadCarName();
    this.setData({ mode: 'add' });
  },

  showList() {
    this.setData({ mode: 'list' });
  },

  onTypeChange(e) {
    const index = Number(e.detail.value);
    const type = this.data.tripTypes[index];
    if (type) {
      this.setData({
        typeIndex: index,
        'form.type': type,
      });
    }
  },

  onDateChange(e) {
    this.setData({ 'form.date': e.detail.value });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  saveRecord() {
    const form = this.data.form;
    if (!form.type) {
      wx.showToast({ title: '请选择出行类型', icon: 'none' });
      return;
    }

    const mileage = Number(form.mileage);
    if (!mileage || mileage <= 0) {
      wx.showToast({ title: '请输入行驶里程', icon: 'none' });
      return;
    }

    const consumption = Number(form.consumption) || 0;

    const record = {
      id: `${Date.now()}`,
      type: form.type,
      date: form.date,
      mileage: Math.round(mileage * 10) / 10,
      consumption: Math.round(consumption * 10) / 10,
      startLocation: form.startLocation.trim(),
      endLocation: form.endLocation.trim(),
      note: form.note.trim(),
      carName: form.carName,
      createdAt: new Date(`${form.date} 00:00:00`).getTime() || Date.now(),
    };

    try {
      const list = wx.getStorageSync('kt_mileage_logs') || [];
      list.unshift(record);
      wx.setStorageSync('kt_mileage_logs', list);

      // 即时推送云端
      const app = getApp();
      if (app.saveSettingsToCloud) {
        app.saveSettingsToCloud('kt_mileage_logs', list);
      }

      wx.showToast({ title: '保存成功', icon: 'success' });
      this.setData({ mode: 'list' }, () => this.loadRecords());
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除记录',
      content: '确定删除这条里程记录吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          const list = (wx.getStorageSync('kt_mileage_logs') || []).filter(item => item.id !== id);
          wx.setStorageSync('kt_mileage_logs', list);

          const app = getApp();
          if (app.saveSettingsToCloud) {
            app.saveSettingsToCloud('kt_mileage_logs', list);
          }

          this.loadRecords();
          wx.showToast({ title: '已删除', icon: 'success' });
        } catch (err) {
          wx.showToast({ title: '删除失败', icon: 'none' });
        }
      },
    });
  },

  onBack() {
    if (this.data.mode === 'add') {
      this.showList();
      return;
    }
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) });
  },

  onShareAppMessage() {
    return {
      title: '里程记录 - 记录每次出行，掌握用车习惯',
      path: '/pages/mileage-log/mileage-log',
    };
  },

  onShareTimeline() {
    return {
      title: '里程记录 - 记录每次出行，掌握用车习惯',
    };
  },
});
