const { getNavBarInfo } = require('../../../utils/nav');

const CARD_TYPES = [
  { key: 'month', name: '月卡', days: 30, priceKey: 'monthPrice' },
  { key: 'season', name: '季卡', days: 90, priceKey: 'seasonPrice' },
  { key: 'halfYear', name: '半年卡', days: 180, priceKey: 'halfYearPrice' },
  { key: 'year', name: '年卡', days: 365, priceKey: 'yearPrice' },
  { key: 'custom', name: '自定义', days: 30, priceKey: '' },
];

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDate(date) {
  const parts = (date || '').split('-').map(Number);
  if (parts.length === 3 && parts.every(Boolean)) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date();
}

function addDays(date, days) {
  const d = parseDate(date);
  d.setDate(d.getDate() + Number(days || 0));
  return formatDate(d);
}

function diffDays(start, end) {
  const s = parseDate(start);
  const e = parseDate(end);
  s.setHours(0, 0, 0, 0);
  e.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((e.getTime() - s.getTime()) / 86400000));
}

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    mode: 'list',
    parkingList: [],
    expiringCount: 0,
    activeCount: 0,
    editingId: '',
    today: formatDate(new Date()),

    cardTypes: CARD_TYPES,
    form: {
      name: '',
      carName: '',
      spot: '',
      cardType: 'month',
      fee: '',
      monthPrice: '',
      seasonPrice: '',
      halfYearPrice: '',
      yearPrice: '',
      startDate: formatDate(new Date()),
      expireDate: addDays(formatDate(new Date()), 30),
      remainDays: 30,
      note: '',
    },
  },

  onLoad() {
    this.setData(getNavBarInfo());
    this.resetForm();
  },

  onShow() {
    this.loadCarName();
    this.loadList();
  },

  loadCarName() {
    try {
      const car = wx.getStorageSync('kt_my_car') || {};
      const carName = car.model ? `${car.model}${car.year ? ` ${car.year}款` : ''}` : '极氪 001 2025款';
      this.setData({ 'form.carName': carName, 'form.spot': this.data.form.spot || carName });
    } catch (e) {
      this.setData({ 'form.carName': '极氪 001 2025款', 'form.spot': this.data.form.spot || '极氪 001 2025款' });
    }
  },

  resetForm() {
    const today = formatDate(new Date());
    this.setData({
      editingId: '',
      form: {
        name: '',
        carName: this.data.form?.carName || '极氪 001 2025款',
        spot: this.data.form?.carName || '极氪 001 2025款',
        cardType: 'month',
        fee: '',
        monthPrice: '',
        seasonPrice: '',
        halfYearPrice: '',
        yearPrice: '',
        startDate: today,
        expireDate: addDays(today, 30),
        remainDays: 30,
        note: '',
      },
    });
  },

  loadList() {
    try {
      const list = wx.getStorageSync('kt_parking_list') || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const mapped = list.map(item => this.normalizeItem(item, today.getTime())).sort((a, b) => a.expireTs - b.expireTs);
      this.setData({
        parkingList: mapped,
        expiringCount: mapped.filter(item => item.days <= 7).length,
        activeCount: mapped.filter(item => item.days > 0).length,
      });
    } catch (e) {
      this.setData({ parkingList: [], expiringCount: 0, activeCount: 0 });
    }
  },

  normalizeItem(item, todayTs) {
    const expireTs = item.expireTs || parseDate(item.expireDate).getTime();
    const days = Math.ceil((expireTs - todayTs) / 86400000);
    const card = CARD_TYPES.find(type => type.key === item.cardType) || CARD_TYPES[0];
    return {
      ...item,
      spot: item.spot || item.carName || '',
      cardTypeName: item.cardTypeName || card.name,
      fee: Number(item.fee || 0),
      feeText: Number(item.fee || 0).toFixed(2),
      days,
      expireTs,
    };
  },

  onBack() {
    if (this.data.mode === 'add') {
      this.showList();
      return;
    }
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) });
  },

  showAdd() {
    this.resetForm();
    this.loadCarName();
    this.setData({ mode: 'add' });
  },

  showList() {
    this.setData({ mode: 'list' });
  },

  onInputName(e) { this.setData({ 'form.name': e.detail.value }); },
  onInputSpot(e) { this.setData({ 'form.spot': e.detail.value }); },
  onInputFee(e) { this.setData({ 'form.fee': e.detail.value }); },
  onInputMonthPrice(e) { this.setData({ 'form.monthPrice': e.detail.value }); },
  onInputSeasonPrice(e) { this.setData({ 'form.seasonPrice': e.detail.value }); },
  onInputHalfYearPrice(e) { this.setData({ 'form.halfYearPrice': e.detail.value }); },
  onInputYearPrice(e) { this.setData({ 'form.yearPrice': e.detail.value }); },
  onInputNote(e) { this.setData({ 'form.note': e.detail.value.slice(0, 50) }); },

  onSwitchCar() {
    wx.navigateTo({ url: '/pages/my-car/my-car' });
  },

  onSelectCardType(e) {
    const key = e.currentTarget.dataset.key;
    const type = CARD_TYPES.find(item => item.key === key) || CARD_TYPES[0];
    const price = type.priceKey ? this.data.form[type.priceKey] : this.data.form.fee;
    const patch = {
      'form.cardType': type.key,
      'form.remainDays': type.days,
      'form.expireDate': addDays(this.data.form.startDate, type.days),
    };
    if (price) patch['form.fee'] = price;
    this.setData(patch);
  },

  onPickStart(e) {
    const startDate = e.detail.value;
    const card = CARD_TYPES.find(item => item.key === this.data.form.cardType) || CARD_TYPES[0];
    const remainDays = this.data.form.cardType === 'custom' ? Number(this.data.form.remainDays || 0) : card.days;
    this.setData({
      'form.startDate': startDate,
      'form.expireDate': addDays(startDate, remainDays),
      'form.remainDays': remainDays,
    });
  },

  onPickExpire(e) {
    const expireDate = e.detail.value;
    this.setData({
      'form.expireDate': expireDate,
      'form.remainDays': diffDays(this.data.form.startDate, expireDate),
      'form.cardType': this.data.form.cardType === 'custom' ? 'custom' : this.data.form.cardType,
    });
  },

  onInputRemainDays(e) {
    const remainDays = Number(e.detail.value || 0);
    // 输入剩余天数后，反推开始日期 = 到期日 - 剩余天数
    const startDate = addDays(this.data.form.expireDate, -remainDays);
    this.setData({
      'form.remainDays': remainDays,
      'form.startDate': startDate,
      'form.cardType': 'custom',
    });
  },

  onSave() {
    const form = this.data.form;
    if (!form.name.trim()) {
      wx.showToast({ title: '请输入停车场名称', icon: 'none' });
      return;
    }
    const fee = Number(form.fee || 0);
    const card = CARD_TYPES.find(item => item.key === form.cardType) || CARD_TYPES[0];
    const record = {
      id: this.data.editingId || `${Date.now()}`,
      name: form.name.trim(),
      carName: form.carName,
      spot: form.spot.trim(),
      cardType: card.key,
      cardTypeName: card.name,
      fee,
      monthPrice: Number(form.monthPrice || 0),
      seasonPrice: Number(form.seasonPrice || 0),
      halfYearPrice: Number(form.halfYearPrice || 0),
      yearPrice: Number(form.yearPrice || 0),
      startDate: form.startDate,
      expireDate: form.expireDate,
      remainDays: Number(form.remainDays || 0),
      note: form.note.trim(),
      expireTs: parseDate(form.expireDate).getTime(),
      updatedAt: Date.now(),
    };

    try {
      const list = wx.getStorageSync('kt_parking_list') || [];
      const idx = list.findIndex(item => item.id === record.id);
      if (idx >= 0) list[idx] = record;
      else list.unshift(record);
      wx.setStorageSync('kt_parking_list', list);
      wx.showToast({ title: this.data.editingId ? '已更新' : '添加成功', icon: 'success' });
      this.setData({ mode: 'list' }, () => this.loadList());
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  onEdit(e) {
    const id = e.currentTarget.dataset.id;
    const list = wx.getStorageSync('kt_parking_list') || [];
    const item = list.find(p => p.id === id);
    if (!item) return;
    this.setData({
      mode: 'add',
      editingId: id,
      form: {
        name: item.name || '',
        carName: item.carName || this.data.form.carName,
        spot: item.spot || item.carName || '',
        cardType: item.cardType || 'month',
        fee: item.fee ? String(item.fee) : '',
        monthPrice: item.monthPrice ? String(item.monthPrice) : '',
        seasonPrice: item.seasonPrice ? String(item.seasonPrice) : '',
        halfYearPrice: item.halfYearPrice ? String(item.halfYearPrice) : '',
        yearPrice: item.yearPrice ? String(item.yearPrice) : '',
        startDate: item.startDate || this.data.today,
        expireDate: item.expireDate || addDays(this.data.today, 30),
        remainDays: item.remainDays || diffDays(item.startDate || this.data.today, item.expireDate || addDays(this.data.today, 30)),
        note: item.note || '',
      },
    });
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定删除该停车场吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          const list = (wx.getStorageSync('kt_parking_list') || []).filter(item => item.id !== id);
          wx.setStorageSync('kt_parking_list', list);
          this.loadList();
          wx.showToast({ title: '已删除', icon: 'success' });
        } catch (err) {
          wx.showToast({ title: '删除失败', icon: 'none' });
        }
      },
    });
  },
});
