// 充电桩收藏
const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: { darkMode: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    mode: 'list', // list | add
    stations: [],
    filteredStations: [],
    activeBrand: '',

    brands: ['全部', '特来电', '星星充电', '国家电网', '小桔充电', '蔚来超充', '特斯拉超充', '其他'],

    form: {
      brand: '',
      speed: '', // 充电速度 kW
      price: '', // 电价 元/kWh
      address: '',
      name: '',
      note: '',
    },
  },

  onLoad() { this.loadDarkMode();
    this.setData(getNavBarInfo());
  },

  onShow() { this.loadDarkMode();
    this.loadStations();
  },

  loadStations() {
    try {
      const list = wx.getStorageSync('kt_charging_stations');
      if (!Array.isArray(list)) {
        this.setData({ stations: [], filteredStations: [] });
        return;
      }
      const normalized = list.filter(item => item && typeof item === 'object').map(item => ({
        id: item.id || `${Date.now()}_${Math.random()}`,
        brand: item.brand || '其他',
        speed: item.speed || '',
        price: item.price || '',
        address: item.address || '',
        name: item.name || '',
        note: item.note || '',
        powerSummary: item.speed ? `${item.speed}kW` : '',
        createdAt: item.createdAt || Date.now(),
      })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      this.setData({ stations: normalized }, () => this.refreshList());
    } catch (e) {
      this.setData({ stations: [], filteredStations: [] });
    }
  },

  refreshList() {
    const { stations, activeBrand } = this.data;
    const filteredStations = activeBrand && activeBrand !== '全部'
      ? stations.filter(item => item.brand === activeBrand)
      : stations;
    this.setData({ filteredStations });
  },

  onBrandTap(e) {
    const brand = e.currentTarget.dataset.brand;
    this.setData({ activeBrand: brand === this.data.activeBrand ? '' : brand }, () => this.refreshList());
  },

  showAdd() {
    this.setData({
      mode: 'add',
      form: {
        brand: '',
        speed: '',
        price: '',
        address: '',
        name: '',
        note: '',
      },
    });
  },

  showList() {
    this.setData({ mode: 'list' });
  },

  onBrandChange(e) {
    const index = Number(e.detail.value);
    const brand = this.data.brands[index];
    if (brand && brand !== '全部') {
      this.setData({ 'form.brand': brand });
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  saveStation() {
    const form = this.data.form;
    if (!form.brand) {
      wx.showToast({ title: '请选择品牌', icon: 'none' });
      return;
    }
    if (!form.address && !form.name) {
      wx.showToast({ title: '请输入名称或地址', icon: 'none' });
      return;
    }

    const station = {
      id: `${Date.now()}`,
      brand: form.brand,
      speed: form.speed.trim(),
      price: form.price.trim(),
      address: form.address.trim(),
      name: form.name.trim(),
      note: form.note.trim(),
      createdAt: Date.now(),
    };

    try {
      const list = wx.getStorageSync('kt_charging_stations') || [];
      list.unshift(station);
      wx.setStorageSync('kt_charging_stations', list);

      const app = getApp();
      if (app.saveSettingsToCloud) {
        app.saveSettingsToCloud('kt_charging_stations', list);
      }

      wx.showToast({ title: '收藏成功', icon: 'success' });
      this.setData({ mode: 'list' }, () => this.loadStations());
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除收藏',
      content: '确定删除这个充电站收藏吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          const list = (wx.getStorageSync('kt_charging_stations') || []).filter(item => item.id !== id);
          wx.setStorageSync('kt_charging_stations', list);

          const app = getApp();
          if (app.saveSettingsToCloud) {
            app.saveSettingsToCloud('kt_charging_stations', list);
          }

          this.loadStations();
          wx.showToast({ title: '已删除', icon: 'success' });
        } catch (err) {
          wx.showToast({ title: '删除失败', icon: 'none' });
        }
      },
    });
  },

  onCopyAddress(e) {
    const address = e.currentTarget.dataset.address;
    if (address) {
      wx.setClipboardData({
        data: address,
        success: () => wx.showToast({ title: '地址已复制', icon: 'success' }),
      });
    }
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
      title: '充电桩收藏 - 记录常用充电站，方便比价',
      path: '/pages/charging-station/charging-station',
    };
  },

  onShareTimeline() {
    return {
      title: '充电桩收藏 - 记录常用充电站，方便比价',
    };
  },
});
