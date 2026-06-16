const { getNavBarInfo } = require('../../../utils/nav');

const CATEGORIES = [
  { key: 'all', name: '全部', icon: '📋' },
  { key: 'charging', name: '充电费', icon: '⚡' },
  { key: 'parking', name: '停车费', icon: '🅿️' },
  { key: 'toll', name: '过路费', icon: '🛣️' },
  { key: 'wash', name: '洗车费', icon: '🚿' },
  { key: 'maintenance', name: '保养费', icon: '🔧' },
  { key: 'insurance', name: '保险费', icon: '🛡️' },
  { key: 'repair', name: '维修费', icon: '🧰' },
  { key: 'violation', name: '违章罚款', icon: '🚦' },
  { key: 'other', name: '其他', icon: '💳' },
];

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

    mode: 'list',
    categories: CATEGORIES,
    activeType: 'all',
    records: [],
    filteredRecords: [],
    totalCount: 0,
    totalAmount: '0.00',
    monthAmount: '0.00',

    typeIndex: -1,
    typeOptions: CATEGORIES.filter(item => item.key !== 'all'),
    form: {
      type: '',
      typeName: '',
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
        typeName: '',
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
      const list = wx.getStorageSync('kt_maintenance_logs') || [];
      const normalized = list.map(item => this.normalizeRecord(item)).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      this.setData({ records: normalized }, () => {
        this.refreshList();
      });
    } catch (e) {
      this.setData({ records: [], filteredRecords: [] });
      this.refreshStats([]);
    }
  },

  normalizeRecord(item) {
    const category = CATEGORIES.find(c => c.key === item.type) || CATEGORIES.find(c => c.key === 'other');
    const fee = Number(item.fee || 0);
    return {
      id: item.id || `${Date.now()}_${Math.random()}`,
      type: item.type || category.key,
      typeName: item.typeName || category.name,
      icon: item.icon || category.icon,
      fee,
      amountText: (fee / 100).toFixed(2),
      date: item.date || formatDate(new Date(item.createdAt || Date.now())),
      location: item.location || '',
      note: item.note || '',
      carName: item.carName || '',
      createdAt: item.createdAt || Date.now(),
    };
  },

  refreshList() {
    const { records, activeType } = this.data;
    const filteredRecords = activeType === 'all' ? records : records.filter(item => item.type === activeType);
    this.setData({ filteredRecords });
    this.refreshStats(records);
  },

  refreshStats(records) {
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const totalFee = records.reduce((sum, item) => sum + Number(item.fee || 0), 0);
    const monthFee = records
      .filter(item => (item.date || '').startsWith(monthPrefix))
      .reduce((sum, item) => sum + Number(item.fee || 0), 0);
    this.setData({
      totalCount: records.length,
      totalAmount: (totalFee / 100).toFixed(2),
      monthAmount: (monthFee / 100).toFixed(2),
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

  onCategoryTap(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ activeType: type || 'all' }, () => this.refreshList());
  },

  showAdd() {
    this.resetForm();
    this.loadCarName();
    this.setData({ mode: 'add' });
  },

  showList() {
    this.setData({ mode: 'list' });
  },

  showStats() {
    wx.showModal({
      title: '费用统计',
      content: `共 ${this.data.totalCount} 条记录\n累计费用：¥${this.data.totalAmount}\n本月费用：¥${this.data.monthAmount}`,
      showCancel: false,
      confirmText: '知道了',
    });
  },

  onTypeChange(e) {
    const index = Number(e.detail.value);
    const item = this.data.typeOptions[index];
    if (!item) return;
    this.setData({
      typeIndex: index,
      'form.type': item.key,
      'form.typeName': item.name,
    });
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

  onSwitchCar() {
    wx.navigateTo({ url: '/pages/my-car/my-car' });
  },

  saveRecord() {
    const form = this.data.form;
    if (!form.type) {
      wx.showToast({ title: '请选择费用类型', icon: 'none' });
      return;
    }

    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请输入费用金额', icon: 'none' });
      return;
    }

    const category = this.data.typeOptions.find(item => item.key === form.type) || {};
    const record = {
      id: `${Date.now()}`,
      type: form.type,
      typeName: form.typeName,
      icon: category.icon || '💳',
      fee: Math.round(amount * 100),
      date: form.date,
      location: form.location.trim(),
      note: form.note.trim(),
      carName: form.carName,
      createdAt: new Date(`${form.date} 00:00:00`).getTime() || Date.now(),
    };

    try {
      const list = wx.getStorageSync('kt_maintenance_logs') || [];
      list.unshift(record);
      wx.setStorageSync('kt_maintenance_logs', list);
      wx.showToast({ title: '保存成功', icon: 'success' });
      this.setData({ mode: 'list', activeType: 'all' }, () => this.loadRecords());
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除记录',
      content: '确定删除这条费用记录吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          const list = (wx.getStorageSync('kt_maintenance_logs') || []).filter(item => item.id !== id);
          wx.setStorageSync('kt_maintenance_logs', list);
          this.loadRecords();
          wx.showToast({ title: '已删除', icon: 'success' });
        } catch (err) {
          wx.showToast({ title: '删除失败', icon: 'none' });
        }
      },
    });
  },
});
