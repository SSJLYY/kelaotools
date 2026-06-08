const { getNavBarInfo } = require('../../../utils/nav');

const PLATFORMS = [
  { key: 'all', name: '全部', icon: '🚘', color: '#2F66F6' },
  { key: 'gaode', name: '高德', icon: '🧭', color: '#1E90FF' },
  { key: 'didi', name: '滴滴', icon: '🛡️', color: '#F59E0B' },
  { key: 'hello', name: '哈啰', icon: '🛣️', color: '#2F66F6' },
  { key: 'other', name: '其他', icon: '🚙', color: '#64748B' },
];

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDateTime(date) {
  const parts = (date || '').split('-').map(Number);
  if (parts.length === 3 && parts.every(Boolean)) {
    return new Date(parts[0], parts[1] - 1, parts[2]).getTime();
  }
  return Date.now();
}

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    mode: 'list',
    platforms: PLATFORMS,
    activePlatform: 'all',
    records: [],
    filteredRecords: [],
    totalCount: 0,
    totalRevenue: '0.00',
    monthRevenue: '0.00',
    avgRevenue: '0.00',

    platformOptions: PLATFORMS.filter(item => item.key !== 'all'),
    platformIndex: 0,
    form: {
      platform: 'gaode',
      platformName: '高德',
      date: '',
      carName: '',
      amount: '',
      start: '',
      startTag: '',
      end: '',
      endTag: '',
      mileage: '',
      cost: '',
      note: '',
    },
  },

  onLoad() {
    this.setData(getNavBarInfo());
    this.resetForm();
  },

  onShow() {
    this.loadCarName();
    this.loadRecords();
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
      platformIndex: 0,
      form: {
        platform: 'gaode',
        platformName: '高德',
        date: formatDate(new Date()),
        carName: this.data.form?.carName || '极氪 001 2025款',
        amount: '',
        start: '',
        startTag: '',
        end: '',
        endTag: '',
        mileage: '',
        cost: '',
        note: '',
      },
    });
  },

  loadRecords() {
    try {
      const list = wx.getStorageSync('kt_ride_logs') || [];
      const normalized = list.map(item => this.normalizeRecord(item)).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      this.setData({ records: normalized }, () => this.refreshList());
    } catch (e) {
      this.setData({ records: [], filteredRecords: [] });
      this.refreshStats([]);
    }
  },

  normalizeRecord(item) {
    const platform = PLATFORMS.find(p => p.key === item.platform) || PLATFORMS.find(p => p.key === 'other');
    const revenue = Number(item.revenue || 0);
    const cost = Number(item.cost || 0);
    return {
      id: item.id || `${Date.now()}`,
      platform: item.platform || platform.key,
      platformName: item.platformName || platform.name,
      icon: item.icon || platform.icon,
      color: platform.color,
      revenue,
      revenueText: (revenue / 100).toFixed(2),
      cost,
      costText: (cost / 100).toFixed(2),
      date: item.date || formatDate(new Date(item.createdAt || Date.now())),
      start: item.start || '',
      startTag: item.startTag || '',
      end: item.end || '',
      endTag: item.endTag || '',
      mileage: item.mileage || '',
      note: item.note || '',
      carName: item.carName || '',
      createdAt: item.createdAt || Date.now(),
    };
  },

  refreshList() {
    const { records, activePlatform } = this.data;
    const filteredRecords = activePlatform === 'all' ? records : records.filter(item => item.platform === activePlatform);
    this.setData({ filteredRecords });
    this.refreshStats(records);
  },

  refreshStats(records) {
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const total = records.reduce((sum, item) => sum + Number(item.revenue || 0), 0);
    const month = records
      .filter(item => (item.date || '').startsWith(monthPrefix))
      .reduce((sum, item) => sum + Number(item.revenue || 0), 0);
    this.setData({
      totalCount: records.length,
      totalRevenue: (total / 100).toFixed(2),
      monthRevenue: (month / 100).toFixed(2),
      avgRevenue: records.length ? (total / 100 / records.length).toFixed(2) : '0.00',
    });
  },

  onBack() {
    if (this.data.mode === 'add') {
      this.showList();
      return;
    }
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) });
  },

  onPlatformTap(e) {
    const platform = e.currentTarget.dataset.platform || 'all';
    this.setData({ activePlatform: platform }, () => this.refreshList());
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
      title: '顺风车统计',
      content: `共 ${this.data.totalCount} 笔收入\n累计收入：¥${this.data.totalRevenue}\n本月收入：¥${this.data.monthRevenue}\n平均每单：¥${this.data.avgRevenue}`,
      showCancel: false,
      confirmText: '知道了',
    });
  },

  onRegisterTap() {
    wx.showModal({
      title: '高德顺风车',
      content: '请打开高德地图 App，搜索「顺风车」完成车主注册。',
      showCancel: false,
      confirmText: '知道了',
    });
  },

  selectPlatform(e) {
    const platform = e.currentTarget.dataset.platform;
    const index = this.data.platformOptions.findIndex(item => item.key === platform);
    const item = this.data.platformOptions[index];
    if (!item) return;
    this.setData({
      platformIndex: index,
      'form.platform': item.key,
      'form.platformName': item.name,
    });
  },

  onPlatformChange(e) {
    const index = Number(e.detail.value);
    const item = this.data.platformOptions[index];
    if (!item) return;
    this.setData({
      platformIndex: index,
      'form.platform': item.key,
      'form.platformName': item.name,
    });
  },

  onDateChange(e) {
    this.setData({ 'form.date': e.detail.value });
  },

  onAmountInput(e) {
    this.setData({ 'form.amount': e.detail.value });
  },

  onStartInput(e) {
    this.setData({ 'form.start': e.detail.value });
  },

  onEndInput(e) {
    this.setData({ 'form.end': e.detail.value });
  },

  setStartTag(e) {
    this.setData({ 'form.startTag': e.currentTarget.dataset.tag });
  },

  setEndTag(e) {
    this.setData({ 'form.endTag': e.currentTarget.dataset.tag });
  },

  onMileageInput(e) {
    this.setData({ 'form.mileage': e.detail.value });
  },

  onCostInput(e) {
    this.setData({ 'form.cost': e.detail.value });
  },

  onNoteInput(e) {
    this.setData({ 'form.note': e.detail.value.slice(0, 50) });
  },

  onSwitchCar() {
    wx.navigateTo({ url: '/pages/my-car/my-car' });
  },

  saveRecord() {
    const form = this.data.form;
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请输入收入金额', icon: 'none' });
      return;
    }

    const platform = this.data.platformOptions.find(item => item.key === form.platform) || this.data.platformOptions[0];
    const record = {
      id: `${Date.now()}`,
      platform: form.platform,
      platformName: form.platformName,
      icon: platform.icon,
      revenue: Math.round(amount * 100),
      cost: Math.round((Number(form.cost) || 0) * 100),
      date: form.date,
      start: form.start.trim(),
      startTag: form.startTag,
      end: form.end.trim(),
      endTag: form.endTag,
      mileage: form.mileage,
      note: form.note.trim(),
      carName: form.carName,
      createdAt: parseDateTime(form.date),
    };

    try {
      const list = wx.getStorageSync('kt_ride_logs') || [];
      list.unshift(record);
      wx.setStorageSync('kt_ride_logs', list);
      wx.showToast({ title: '保存成功', icon: 'success' });
      this.setData({ mode: 'list', activePlatform: 'all' }, () => this.loadRecords());
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除记录',
      content: '确定删除这条顺风车收入吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          const list = (wx.getStorageSync('kt_ride_logs') || []).filter(item => item.id !== id);
          wx.setStorageSync('kt_ride_logs', list);
          this.loadRecords();
          wx.showToast({ title: '已删除', icon: 'success' });
        } catch (err) {
          wx.showToast({ title: '删除失败', icon: 'none' });
        }
      },
    });
  },
});
