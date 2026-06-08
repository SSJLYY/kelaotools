// 添加充电记录
const { getNavBarInfo } = require('../../../utils/nav');

Page({
  data: {
    statusBarHeight: 20, navBarHeight: 44, navTotalHeight: 64,
    carList: [], selectedCarIdx: 0, selectedCar: '',
    dateValue: '', chargeType: 'fast',
    fee: '', kwh: '', station: '', useCoupon: false, note: '',
    saving: false,
  },

  onLoad() {
    this.initNavBar();
    const d = new Date();
    this.setData({ dateValue: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` });
    this.loadCars();
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  loadCars() {
    try {
      const cars = wx.getStorageSync('kt_my_cars') || [];
      const list = cars.map(c => ({ label: c.model + (c.year ? ` ${c.year}款` : ''), id: c.id }));
      this.setData({ carList: list, selectedCarIdx: 0, selectedCar: list[0]?.label || '' });
    } catch (e) {}
  },

  onCarChange(e) {
    const i = e.detail.value;
    this.setData({ selectedCarIdx: i, selectedCar: this.data.carList[i]?.label || '' });
  },
  onDateChange(e) { this.setData({ dateValue: e.detail.value }); },
  onTypeTap(e)    { this.setData({ chargeType: e.currentTarget.dataset.type }); },
  onFeeInput(e)   { this.setData({ fee: e.detail.value }); },
  onKwhInput(e)   { this.setData({ kwh: e.detail.value }); },
  onStationInput(e){this.setData({ station: e.detail.value }); },
  onCouponSwitch(e){this.setData({ useCoupon: e.detail.value }); },
  onNoteInput(e)  { this.setData({ note: e.detail.value }); },

  onSave() {
    const { fee, kwh, station, chargeType, dateValue, note, useCoupon } = this.data;
    if (!fee || !kwh) { wx.showToast({ title: '请填写费用和电量', icon: 'none' }); return; }
    if (!station)     { wx.showToast({ title: '请填写充电站名称', icon: 'none' }); return; }

    this.setData({ saving: true });
    const record = {
      id: Date.now().toString(),
      type: chargeType,
      fee: Math.round(parseFloat(fee) * 100),
      kwh: parseFloat(kwh),
      station: station.trim(),
      date: dateValue,
      note: note.trim(),
      useCoupon,
      carLabel: this.data.selectedCar,
      createdAt: new Date(dateValue).getTime() || Date.now(),
    };

    try {
      const logs = wx.getStorageSync('kt_charging_logs') || [];
      logs.push(record);
      wx.setStorageSync('kt_charging_logs', logs);
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1000);
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
      this.setData({ saving: false });
    }
  },

  onBack() { wx.navigateBack(); },
});
