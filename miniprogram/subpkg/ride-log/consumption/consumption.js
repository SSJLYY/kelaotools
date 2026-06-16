Page({
  data: { darkMode: false, mode:'elec', distance:'', kwhUsed:'', fuelVol:'', fuelPrice:'', resultElec:'', resultFuel:'' },
  onMode(e) { this.setData({ mode:e.currentTarget.dataset.mode, resultElec:'', resultFuel:'' }); },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  onCalc() {
    if (this.data.mode==='elec') {
      const d=parseFloat(this.data.distance), k=parseFloat(this.data.kwhUsed);
      if (!d||!k||d<=0) { wx.showToast({title:'请正确填写',icon:'none'}); return; }
      this.setData({ resultElec: ((k/d)*100).toFixed(1) });
    } else {
      const d=parseFloat(this.data.distance), v=parseFloat(this.data.fuelVol), p=parseFloat(this.data.fuelPrice);
      if (!d||!v||d<=0) { wx.showToast({title:'请正确填写',icon:'none'}); return; }
      const l100 = ((v/d)*100).toFixed(1);
      const perKm = p ? ((v*p)/d).toFixed(2) : '--';
      this.setData({ resultFuel: `${l100}L/100km · ¥${perKm}/km` });
    }
  },
  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() { wx.navigateBack(); },
});
