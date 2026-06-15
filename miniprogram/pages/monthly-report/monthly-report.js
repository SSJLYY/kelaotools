// 月度报告
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

    reportYear: '',
    reportMonth: '',
    reportTitle: '',

    // 充电数据
    chargingCount: 0,
    chargingFee: '0',
    chargingKwh: '0',
    avgChargingFee: '0',

    // 里程数据
    mileageTotal: '0',
    tripCount: 0,
    avgConsumption: '0',

    // 支出数据
    totalExpense: '0',
    expenseBreakdown: [],

    // 收入数据
    totalIncome: '0',

    // 养车数据
    maintenanceCount: 0,
    carWashCount: 0,
    modificationCount: 0,

    // 洞察
    insights: [],

    // 是否有数据
    hasData: false,
  },

  onLoad(options) {
    this.setData(getNavBarInfo());
    const year = options.year || new Date().getFullYear();
    const month = options.month || new Date().getMonth() + 1;
    this.setData({
      reportYear: year,
      reportMonth: month,
      reportTitle: `${year}年${month}月用车报告`,
    });
    this.generateReport(year, month);
  },

  generateReport(year, month) {
    const startTime = new Date(year, month - 1, 1).getTime();
    const endTime = new Date(year, month, 1).getTime();

    // 加载所有数据
    const chargingLogs = wx.getStorageSync('kt_charging_logs') || [];
    const mileageLogs = wx.getStorageSync('kt_mileage_logs') || [];
    const maintenanceLogs = wx.getStorageSync('kt_maintenance_logs') || [];
    const rideLogs = wx.getStorageSync('kt_ride_logs') || [];
    const carWashLogs = wx.getStorageSync('kt_car_wash_logs') || [];
    const modificationLogs = wx.getStorageSync('kt_modification_logs') || [];

    // 筛选当月数据
    const monthCharging = chargingLogs.filter(l => {
      const t = l.createdAt || 0;
      return t >= startTime && t < endTime;
    });
    const monthMileage = mileageLogs.filter(l => {
      const t = l.createdAt || 0;
      return t >= startTime && t < endTime;
    });
    const monthMaintenance = maintenanceLogs.filter(l => {
      const t = l.createdAt || 0;
      return t >= startTime && t < endTime;
    });
    const monthRides = rideLogs.filter(l => {
      const t = l.createdAt || 0;
      return t >= startTime && t < endTime;
    });
    const monthCarWash = carWashLogs.filter(l => {
      const t = l.createdAt || 0;
      return t >= startTime && t < endTime;
    });
    const monthModification = modificationLogs.filter(l => {
      const t = l.createdAt || 0;
      return t >= startTime && t < endTime;
    });

    // 计算充电数据
    const chargingCount = monthCharging.length;
    const chargingFeeTotal = monthCharging.reduce((sum, l) => sum + (l.fee || 0), 0);
    const chargingKwhTotal = monthCharging.reduce((sum, l) => sum + (l.kwh || 0), 0);
    const avgChargingFee = chargingCount > 0 ? chargingFeeTotal / chargingCount : 0;

    // 计算里程数据
    const mileageTotal = monthMileage.reduce((sum, l) => sum + (l.mileage || 0), 0);
    const tripCount = monthMileage.length;
    const consumptionTotal = monthMileage.reduce((sum, l) => sum + (l.consumption || 0), 0);
    const avgConsumption = mileageTotal > 0 ? (consumptionTotal / mileageTotal) * 100 : 0;

    // 计算支出数据
    const maintenanceFee = monthMaintenance.reduce((sum, l) => sum + (l.fee || 0), 0);
    const carWashFee = monthCarWash.reduce((sum, l) => sum + (l.amount || 0), 0);
    const modificationFee = monthModification.reduce((sum, l) => sum + (l.amount || 0), 0);
    const rideCost = monthRides.reduce((sum, l) => sum + (l.cost || 0), 0);
    const totalExpense = chargingFeeTotal + maintenanceFee + carWashFee + modificationFee + rideCost;

    // 计算收入数据
    const totalIncome = monthRides.reduce((sum, l) => sum + (l.revenue || 0), 0);

    // 构建支出明细
    const expenseBreakdown = [];
    if (chargingFeeTotal > 0) expenseBreakdown.push({ name: '充电', amount: chargingFeeTotal, icon: '⚡' });
    if (maintenanceFee > 0) expenseBreakdown.push({ name: '养车', amount: maintenanceFee, icon: '🔧' });
    if (carWashFee > 0) expenseBreakdown.push({ name: '洗车', amount: carWashFee, icon: '🚿' });
    if (modificationFee > 0) expenseBreakdown.push({ name: '改装', amount: modificationFee, icon: '🏎️' });
    if (rideCost > 0) expenseBreakdown.push({ name: '顺风车成本', amount: rideCost, icon: '🚗' });

    // 生成洞察
    const insights = [];
    if (chargingCount > 0) {
      insights.push(`本月充电${chargingCount}次，平均每次花费¥${(avgChargingFee / 100).toFixed(2)}`);
    }
    if (mileageTotal > 0) {
      insights.push(`本月行驶${mileageTotal.toFixed(0)}公里，平均能耗${avgConsumption.toFixed(1)}kWh/100km`);
    }
    if (totalIncome > 0) {
      const profit = totalIncome - totalExpense;
      insights.push(`顺风车收入¥${(totalIncome / 100).toFixed(2)}，净赚¥${(profit / 100).toFixed(2)}`);
    }
    if (totalExpense > 0) {
      const maxExpense = expenseBreakdown.reduce((a, b) => a.amount > b.amount ? a : b, expenseBreakdown[0]);
      if (maxExpense) {
        insights.push(`最大支出：${maxExpense.name}（¥${(maxExpense.amount / 100).toFixed(2)}）`);
      }
    }

    const hasData = chargingCount > 0 || tripCount > 0 || monthMaintenance.length > 0;

    this.setData({
      chargingCount,
      chargingFee: (chargingFeeTotal / 100).toFixed(2),
      chargingKwh: (chargingKwhTotal / 1000).toFixed(1),
      avgChargingFee: (avgChargingFee / 100).toFixed(2),
      mileageTotal: mileageTotal.toFixed(0),
      tripCount,
      avgConsumption: avgConsumption.toFixed(1),
      totalExpense: (totalExpense / 100).toFixed(2),
      expenseBreakdown,
      totalIncome: (totalIncome / 100).toFixed(2),
      maintenanceCount: monthMaintenance.length,
      carWashCount: monthCarWash.length,
      modificationCount: monthModification.length,
      insights,
      hasData,
    });
  },

  onShareAppMessage() {
    return {
      title: this.data.reportTitle,
      path: `/pages/monthly-report/monthly-report?year=${this.data.reportYear}&month=${this.data.reportMonth}`,
    };
  },

  onShareTimeline() {
    return {
      title: this.data.reportTitle,
    };
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) });
  },
});
