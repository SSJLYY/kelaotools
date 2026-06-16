// 洗车日记
const { getNavBarInfo } = require('../../utils/nav');

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

Page({
  data: { darkMode: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    mode: 'list', // list | add
    records: [],
    totalAmount: '0.00',
    monthAmount: '0.00',

    washTypes: ['自己洗车', '加油站洗车', '洗车店精洗', '洗车店普洗', '上门洗车', '自动洗车机'],
    typeIndex: -1,

    form: {
      type: '',
      date: '',
      amount: '',
      location: '',
      note: '',
      carName: '',
    },
  },

  onLoad() { this.loadDarkMode();
    this.setData(getNavBarInfo());
    this.resetForm();
  },

  onShow() { this.loadDarkMode();
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
        amount: '',
        location: '',
        note: '',
        carName: this.data.form?.carName || '极氪 001 2025款',
      },
    });
  },

  loadRecords() {
    try {
      const list = wx.getStorageSync('kt_car_wash_logs') || [];
      const normalized = list.map(item => ({
        id: item.id || `${Date.now()}_${Math.random()}`,
        type: item.type || '自己洗车',
        date: item.date || formatDate(new Date(item.createdAt || Date.now())),
        amount: Number(item.amount || 0),
        amountText: (Number(item.amount || 0) / 100).toFixed(2),
        location: item.location || '',
        note: item.note || '',
        carName: item.carName || '',
        createdAt: item.createdAt || Date.now(),
      })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      const totalAmount = normalized.reduce((sum, item) => sum + item.amount, 0);
      const now = new Date();
      const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const monthAmount = normalized
        .filter(item => item.date.startsWith(monthPrefix))
        .reduce((sum, item) => sum + item.amount, 0);

      this.setData({
        records: normalized,
        totalAmount: (totalAmount / 100).toFixed(2),
        monthAmount: (monthAmount / 100).toFixed(2),
      });
    } catch (e) {
      this.setData({ records: [], totalAmount: '0.00', monthAmount: '0.00' });
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
    const type = this.data.washTypes[index];
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

  onAmountInput(e) {
    this.setData({ 'form.amount': e.detail.value });
  },

  onLocationInput(e) {
    this.setData({ 'form.location': e.detail.value });
  },

  onNoteInput(e) {
    this.setData({ 'form.note': e.detail.value.slice(0, 50) });
  },

  saveRecord() {
    const form = this.data.form;
    if (!form.type) {
      wx.showToast({ title: '请选择洗车方式', icon: 'none' });
      return;
    }

    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请输入洗车费用', icon: 'none' });
      return;
    }

    const record = {
      id: `${Date.now()}`,
      type: form.type,
      date: form.date,
      amount: Math.round(amount * 100),
      location: form.location.trim(),
      note: form.note.trim(),
      carName: form.carName,
      createdAt: new Date(`${form.date} 00:00:00`).getTime() || Date.now(),
    };

    try {
      // 保存到洗车日记
      const washList = wx.getStorageSync('kt_car_wash_logs') || [];
      washList.unshift(record);
      wx.setStorageSync('kt_car_wash_logs', washList);

      // 同步到养车账本
      const maintenanceRecord = {
        id: `wash_${record.id}`,
        type: 'wash',
        typeName: '洗车费',
        icon: '🚿',
        fee: record.amount,
        date: record.date,
        location: record.location,
        note: `洗车日记 - ${record.type}${record.note ? ': ' + record.note : ''}`,
        carName: record.carName,
        createdAt: record.createdAt,
      };
      const maintenanceList = wx.getStorageSync('kt_maintenance_logs') || [];
      maintenanceList.unshift(maintenanceRecord);
      wx.setStorageSync('kt_maintenance_logs', maintenanceList);

      // 即时推送云端
      const app = getApp();
      if (app.saveSettingsToCloud) {
        app.saveSettingsToCloud('kt_car_wash_logs', washList);
        app.saveSettingsToCloud('kt_maintenance_logs', maintenanceList);
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
      content: '确定删除这条洗车记录吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          // 删除洗车记录
          const washList = (wx.getStorageSync('kt_car_wash_logs') || []).filter(item => item.id !== id);
          wx.setStorageSync('kt_car_wash_logs', washList);

          // 删除养车账本中的同步记录
          const maintenanceList = (wx.getStorageSync('kt_maintenance_logs') || []).filter(item => item.id !== `wash_${id}`);
          wx.setStorageSync('kt_maintenance_logs', maintenanceList);

          // 即时推送云端
          const app = getApp();
          if (app.saveSettingsToCloud) {
            app.saveSettingsToCloud('kt_car_wash_logs', washList);
            app.saveSettingsToCloud('kt_maintenance_logs', maintenanceList);
          }

          this.loadRecords();
          wx.showToast({ title: '已删除', icon: 'success' });
        } catch (err) {
          wx.showToast({ title: '删除失败', icon: 'none' });
        }
      },
    });
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() {
    if (this.data.mode === 'add') {
      this.showList();
      return;
    }
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) });
  },

  onShareAppMessage() {
    return {
      title: '洗车日记 - 记录每次洗车，自动同步养车账本',
      path: '/pages/car-wash/car-wash',
    };
  },

  onShareTimeline() {
    return {
      title: '洗车日记 - 记录每次洗车，自动同步养车账本',
    };
  },
});
