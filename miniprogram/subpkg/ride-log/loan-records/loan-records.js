Page({
  data: { records:[], totalPaid:'0.00', paidCount:0, showModal:false, formPeriod:'', formAmount:'', formDate:'', formNote:'', today:new Date().toISOString().slice(0,10) },
  onShow() { this.load(); },
  load() {
    try {
      const r = wx.getStorageSync('kt_loan_records')||[];
      r.sort((a,b)=>(b.period||0)-(a.period||0));
      const total = r.reduce((s,x)=>s+(parseFloat(x.amount)||0),0);
      this.setData({ records:r, totalPaid:total.toFixed(2), paidCount:r.length });
    }catch(e){}
  },
  onAdd() { this.setData({ showModal:true, formPeriod:'', formAmount:'', formDate:'', formNote:'' }); },
  onCloseModal() { this.setData({ showModal:false }); },
  onInputPeriod(e) { this.setData({ formPeriod: e.detail.value }); },
  onInputAmount(e) { this.setData({ formAmount: e.detail.value }); },
  onInputNote(e) { this.setData({ formNote: e.detail.value }); },
  onPickDate(e) { this.setData({ formDate: e.detail.value }); },
  onSave() {
    const { formPeriod, formAmount, formDate } = this.data;
    if (!formPeriod||!formAmount||!formDate) { wx.showToast({title:'请填写完整',icon:'none'}); return; }
    try {
      let r = wx.getStorageSync('kt_loan_records')||[];
      r.push({ id:Date.now().toString(), period:parseInt(formPeriod), amount:parseFloat(formAmount).toFixed(2), date:formDate, note:this.data.formNote });
      wx.setStorageSync('kt_loan_records', r);
      this.setData({ showModal:false }); this.load(); wx.showToast({title:'保存成功',icon:'success'});
    }catch(e){ wx.showToast({title:'保存失败',icon:'none'}); }
  },
  onBack() { wx.navigateBack(); },
});
