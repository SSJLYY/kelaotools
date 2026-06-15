// 改装与配件
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
    filteredRecords: [],
    activeCategory: 'all',
    totalAmount: '0.00',

    categories: [
      { key: 'all', name: '全部', icon: '📋' },
      { key: 'accessory', name: '配件', icon: '🔧' },
      { key: 'modification', name: '改装', icon: '🏎️' },
      { key: 'decoration', name: '装饰', icon: '✨' },
      { key: 'maintenance', name: '保养件', icon: '🛢️' },
      { key: 'other', name: '其他', icon: '📦' },
    ],

    recordTypes: ['配件购买', '改装项目', '装饰件', '保养件', '其他'],
    typeIndex: -1,

    form: {
      type: '',
      category: '',
      name: '',
      date: '',
      amount: '',
      brand: '',
      source: '',
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
        category: '',
        name: '',
        date: formatDate(new Date()),
        amount: '',
        brand: '',
        source: '',
        note: '',
        carName: this.data.form?.carName || '极氪 001 2025款',
      },
    });
  },

  loadRecords() {
    try {
      const list = wx.getStorageSync('kt_modification_logs') || [];
      const normalized = list.map(item => {
        const category = this.data.categories.find(c => c.key === item.category) || this.data.categories[5];
        return {
          id: item.id || `${Date.now()}_${Math.random()}`,
          type: item.type || '配件购买',
          category: item.category || 'other',
          categoryName: category.name,
          categoryIcon: category.icon,
          name: item.name || '',
          date: item.date || formatDate(new Date(item.createdAt || Date.now())),
          amount: Number(item.amount || 0),
          amountText: (Number(item.amount || 0) / 100).toFixed(2),
          brand: item.brand || '',
          source: item.source || '',
          note: item.note || '',
          carName: item.carName || '',
          createdAt: item.createdAt || Date.now(),
        };
      }).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      const totalAmount = normalized.reduce((sum, item) => sum + item.amount, 0);
      this.setData({
        records: normalized,
        totalAmount: (totalAmount / 100).toFixed(2),
      }, () => this.refreshList());
    } catch (e) {
      this.setData({ records: [], filteredRecords: [], totalAmount: '0.00' });
    }
  },

  refreshList() {
    const { records, activeCategory } = this.data;
    const filteredRecords = activeCategory === 'all'
      ? records
      : records.filter(item => item.category === activeCategory);
    this.setData({ filteredRecords });
  },

  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ activeCategory: category }, () => this.refreshList());
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
    const type = this.data.recordTypes[index];
    if (type) {
      // 根据类型自动设置分类
      let category = 'other';
      if (type === '配件购买') category = 'accessory';
      else if (type === '改装项目') category = 'modification';
      else if (type === '装饰件') category = 'decoration';
      else if (type === '保养件') category = 'maintenance';

      this.setData({
        typeIndex: index,
        'form.type': type,
        'form.category': category,
      });
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  onDateChange(e) {
    this.setData({ 'form.date': e.detail.value });
  },

  saveRecord() {
    const form = this.data.form;
    if (!form.type) {
      wx.showToast({ title: '请选择类型', icon: 'none' });
      return;
    }
    if (!form.name) {
      wx.showToast({ title: '请输入名称', icon: 'none' });
      return;
    }

    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请输入金额', icon: 'none' });
      return;
    }

    const record = {
      id: `${Date.now()}`,
      type: form.type,
      category: form.category,
      name: form.name.trim(),
      date: form.date,
      amount: Math.round(amount * 100),
      brand: form.brand.trim(),
      source: form.source.trim(),
      note: form.note.trim(),
      carName: form.carName,
      createdAt: new Date(`${form.date} 00:00:00`).getTime() || Date.now(),
    };

    try {
      // 保存到改装记录
      const modList = wx.getStorageSync('kt_modification_logs') || [];
      modList.unshift(record);
      wx.setStorageSync('kt_modification_logs', modList);

      // 同步到养车账本
      const category = this.data.categories.find(c => c.key === record.category) || this.data.categories[5];
      const maintenanceRecord = {
        id: `mod_${record.id}`,
        type: 'repair',
        typeName: '维修费',
        icon: category.icon,
        fee: record.amount,
        date: record.date,
        location: record.source || '',
        note: `改装配件 - ${record.name}${record.brand ? '(' + record.brand + ')' : ''}${record.note ? ': ' + record.note : ''}`,
        carName: record.carName,
        createdAt: record.createdAt,
      };
      const maintenanceList = wx.getStorageSync('kt_maintenance_logs') || [];
      maintenanceList.unshift(maintenanceRecord);
      wx.setStorageSync('kt_maintenance_logs', maintenanceList);

      // 即时推送云端
      const app = getApp();
      if (app.saveSettingsToCloud) {
        app.saveSettingsToCloud('kt_modification_logs', modList);
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
      content: '确定删除这条改装记录吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          // 删除改装记录
          const modList = (wx.getStorageSync('kt_modification_logs') || []).filter(item => item.id !== id);
          wx.setStorageSync('kt_modification_logs', modList);

          // 删除养车账本中的同步记录
          const maintenanceList = (wx.getStorageSync('kt_maintenance_logs') || []).filter(item => item.id !== `mod_${id}`);
          wx.setStorageSync('kt_maintenance_logs', maintenanceList);

          // 即时推送云端
          const app = getApp();
          if (app.saveSettingsToCloud) {
            app.saveSettingsToCloud('kt_modification_logs', modList);
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

  onBack() {
    if (this.data.mode === 'add') {
      this.showList();
      return;
    }
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) });
  },

  onShareAppMessage() {
    return {
      title: '改装与配件 - 记录配件购买和改装项目',
      path: '/pages/modification/modification',
    };
  },

  onShareTimeline() {
    return {
      title: '改装与配件 - 记录配件购买和改装项目',
    };
  },
});
