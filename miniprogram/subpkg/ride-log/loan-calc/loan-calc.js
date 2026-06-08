Page({
  data: { loanAmount:'', rate:'', months:36, terms:[12,24,36,48,60], result:null },
  onInput(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  onTermTap(e) { this.setData({ months: e.currentTarget.dataset.v }); },
  onCalc() {
    const p = parseFloat(this.data.loanAmount), r = parseFloat(this.data.rate)/100/12, n = this.data.months;
    if (isNaN(p)||isNaN(r)||p<=0||r<=0) { wx.showToast({title:'请正确填写',icon:'none'}); return; }
    const monthly = ((p*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1)).toFixed(2);
    const total = (monthly*n).toFixed(2);
    const interest = (total-p).toFixed(2);
    this.setData({ result: { monthly, totalPayment:total, totalInterest:interest } });
  },
  onBack() { wx.navigateBack(); },
});
