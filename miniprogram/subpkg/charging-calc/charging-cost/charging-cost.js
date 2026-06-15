const { getNavBarInfo } = require('../../../utils/nav');

const CAR_SPECS = {
  '001': { battery: 100, wltp: 656 },
  '001-fr': { battery: 100, wltp: 550 },
  '007': { battery: 75, wltp: 688 },
  'x': { battery: 66, wltp: 560 },
  '009': { battery: 116, wltp: 702 },
  '009-grand': { battery: 108, wltp: 702 },
  'mix': { battery: 77, wltp: 550 },
  '7x': { battery: 75, wltp: 605 },
  default: { battery: 78.2, wltp: 500 },
};

const PRICE_PRESETS = [
  { label: '0.6', value: '0.60' },
  { label: '0.8', value: '0.80' },
  { label: '1.0', value: '1.00' },
  { label: '1.2', value: '1.20' },
];
const COUPONS = [
  { threshold: 0, discount: 5 },
  { threshold: 11, discount: 10 },
  { threshold: 21, discount: 20 },
  { threshold: 31, discount: 30 },
];

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    carName: '小鹏 G9 2026款',
    batteryCapacity: 78.2,
    wltpRange: 500,

    currentCharge: 30,
    targetCharge: 90,
    unitPrice: '1.20',
    activePricePreset: '1.20',
    pricePresets: PRICE_PRESETS,
    quickTargets: [95, 100],

    // 充电损耗
    lossEnabled: false,
    lossRate: 10,
    lossPresets: [5, 8, 10, 15, 20],

    needKwhText: '46.9',
    actualKwhText: '51.6',
    estimatedFeeText: '61.92',
    coupons: [],
    bestCouponText: '满31减30',
  },

  onLoad() {
    this.setData(getNavBarInfo());
    this.loadCarInfo();
  },

  onShow() {
    this.loadCarInfo();
  },

  loadCarInfo() {
    try {
      const car = wx.getStorageSync('kt_my_car') || {};
      const spec = CAR_SPECS[car.modelId] || CAR_SPECS.default;
      const carName = car.model ? `${car.model}${car.year ? ` ${car.year}款` : ''}` : '小鹏 G9 2026款';
      this.setData({
        carName,
        batteryCapacity: spec.battery,
        wltpRange: spec.wltp,
      }, () => this.calculate());
    } catch (e) {
      const spec = CAR_SPECS.default;
      this.setData({
        carName: '小鹏 G9 2026款',
        batteryCapacity: spec.battery,
        wltpRange: spec.wltp,
      }, () => this.calculate());
    }
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/tools/tools' }) });
  },

  onCurrentSlider(e) {
    this.updateCharge('currentCharge', Number(e.detail.value));
  },

  onTargetSlider(e) {
    this.updateCharge('targetCharge', Number(e.detail.value));
  },

  onCurrentInput(e) {
    this.updateCharge('currentCharge', e.detail.value);
  },

  onTargetInput(e) {
    this.updateCharge('targetCharge', e.detail.value);
  },

  updateCharge(field, value) {
    let next = Math.round(Number(value) || 0);
    const min = field === 'targetCharge' ? 1 : 0;
    const max = field === 'currentCharge' ? 99 : 100;
    next = Math.max(min, Math.min(max, next));
    const patch = { [field]: next };
    const current = field === 'currentCharge' ? next : this.data.currentCharge;
    const target = field === 'targetCharge' ? next : this.data.targetCharge;
    if (current >= target) {
      if (field === 'currentCharge') patch.targetCharge = Math.min(100, current + 1);
      if (field === 'targetCharge') patch.currentCharge = Math.max(0, target - 1);
    }
    this.setData(patch, () => this.calculate());
  },

  onQuickTarget(e) {
    const target = Number(e.currentTarget.dataset.target);
    this.updateCharge('targetCharge', target);
  },

  onPricePreset(e) {
    const price = e.currentTarget.dataset.price;
    this.setData({ unitPrice: price, activePricePreset: price }, () => this.calculate());
  },

  onPriceInput(e) {
    const value = e.detail.value;
    const normalized = Number(value).toFixed(2);
    const matched = this.data.pricePresets.find(item => item.value === normalized);
    this.setData({ unitPrice: value, activePricePreset: matched ? matched.value : '' }, () => this.calculate());
  },

  onToggleLoss() {
    this.setData({ lossEnabled: !this.data.lossEnabled }, () => this.calculate());
  },

  onLossSlider(e) {
    this.setData({ lossRate: Number(e.detail.value) }, () => this.calculate());
  },

  onLossInput(e) {
    let val = Math.round(Number(e.detail.value) || 0);
    val = Math.max(0, Math.min(50, val));
    this.setData({ lossRate: val }, () => this.calculate());
  },

  onLossPreset(e) {
    const rate = Number(e.currentTarget.dataset.rate);
    this.setData({ lossRate: rate }, () => this.calculate());
  },

  calculate() {
    const current = Number(this.data.currentCharge) || 0;
    const target = Number(this.data.targetCharge) || 0;
    const capacity = Number(this.data.batteryCapacity) || 0;
    const price = Number(this.data.unitPrice) || 0;
    const needKwh = Math.max(0, (target - current) / 100 * capacity);

    let actualKwh = needKwh;
    if (this.data.lossEnabled && this.data.lossRate > 0) {
      actualKwh = needKwh / (1 - this.data.lossRate / 100);
    }
    const estimatedFee = actualKwh * price;
    const coupons = this.buildCoupons(estimatedFee);
    const best = coupons.find(item => item.available);
    this.setData({
      needKwhText: needKwh.toFixed(1),
      actualKwhText: actualKwh.toFixed(1),
      estimatedFeeText: estimatedFee.toFixed(2),
      coupons,
      bestCouponText: best ? best.title : '暂无可用',
    });
  },

  buildCoupons(fee) {
    return COUPONS.map(item => {
      const available = fee >= item.threshold;
      const pay = Math.max(0, fee - item.discount);
      return {
        title: item.threshold ? `满${item.threshold}减${item.discount}` : `满0减${item.discount}`,
        payText: available ? `实付 ¥${pay.toFixed(2)}` : `差 ¥${(item.threshold - fee).toFixed(2)}`,
        available,
      };
    });
  },
});
