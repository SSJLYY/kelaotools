const { getNavBarInfo } = require('../../utils/nav');

const PERIODS = [
  { key: 'month', name: '本月' },
  { key: 'quarter', name: '本季度' },
  { key: 'year', name: '今年' },
];

const EXPENSE_COLORS = {
  charging: '#2F66F6',
  maintenance: '#64748B',
  rideCost: '#F59E0B',
  carWash: '#06B6D4',
  modification: '#8B5CF6',
};

Page({
  data: { darkMode: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    periods: PERIODS,
    activePeriod: 'month',
    periodTitle: '本月',

    budgetEditing: false,
    budgetInput: '',
    budgetText: '设上限',
    budgetPercent: 0,

    totalExpenseText: '¥0',
    totalIncomeText: '¥0',
    balanceText: '¥0',
    balanceClass: 'neutral',
    dailyExpenseText: '¥0',
    dailyIncomeText: '¥0',
    avgChargingCostText: '¥0',
    dailyCarCostText: '¥0',
    insightText: '充电均次 ¥0 · 日均用车成本仅 ¥0',

    expenseCategories: [],
    chargingOverview: [
      { label: '充电', value: '0次' },
      { label: '费用', value: '¥0' },
    ],
    trendMonths: [],
  },

  onLoad() { this.loadDarkMode();
    this.setData(getNavBarInfo());
  },

  onShow() { this.loadDarkMode();
    this.refreshStats();
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/mine/mine' }) });
  },

  onPeriodTap(e) {
    const key = e.currentTarget.dataset.key || 'month';
    this.setData({ activePeriod: key, budgetEditing: false }, () => this.refreshStats());
  },

  onBudgetEdit() {
    const budgets = this.getBudgets();
    const value = budgets[this.data.activePeriod] || '';
    this.setData({ budgetEditing: true, budgetInput: value ? String(value) : '' });
  },

  onBudgetInput(e) {
    this.setData({ budgetInput: e.detail.value });
  },

  onBudgetSave() {
    const amount = Number(this.data.budgetInput);
    const budgets = this.getBudgets();
    if (!amount || amount <= 0) {
      delete budgets[this.data.activePeriod];
    } else {
      budgets[this.data.activePeriod] = amount;
    }
    wx.setStorageSync('kt_data_stats_budgets', budgets);
    this.setData({ budgetEditing: false }, () => this.refreshStats());
    wx.showToast({ title: amount > 0 ? '已保存' : '已清除', icon: 'success' });
  },

  getBudgets() {
    try {
      return wx.getStorageSync('kt_data_stats_budgets') || {};
    } catch (e) {
      return {};
    }
  },

  refreshStats() {
    const now = new Date();
    const range = this.getRange(this.data.activePeriod, now);
    const raw = this.loadAllRecords();
    const charging = raw.charging.filter(item => this.inRange(item.time, range));
    const maintenance = raw.maintenance.filter(item => this.inRange(item.time, range));
    const rides = raw.rides.filter(item => this.inRange(item.time, range));
    const carWash = raw.carWash.filter(item => this.inRange(item.time, range));
    const modification = raw.modification.filter(item => this.inRange(item.time, range));
    const mileage = raw.mileage.filter(item => this.inRange(item.time, range));

    const chargingFee = charging.reduce((sum, item) => sum + item.fee, 0);
    const chargingKwh = charging.reduce((sum, item) => sum + item.kwh, 0);
    const maintenanceFee = maintenance.reduce((sum, item) => sum + item.fee, 0);
    const rideRevenue = rides.reduce((sum, item) => sum + item.revenue, 0);
    const rideCost = rides.reduce((sum, item) => sum + item.cost, 0);
    const carWashFee = carWash.reduce((sum, item) => sum + item.fee, 0);
    const modificationFee = modification.reduce((sum, item) => sum + item.fee, 0);
    const totalMileage = mileage.reduce((sum, item) => sum + item.mileage, 0);
    const totalConsumption = mileage.reduce((sum, item) => sum + item.consumption, 0);
    const avgConsumption = totalMileage > 0 ? ((totalConsumption / totalMileage) * 100).toFixed(1) : '0';

    const totalExpense = chargingFee + maintenanceFee + rideCost + carWashFee + modificationFee;
    const totalIncome = rideRevenue;
    const balance = totalIncome - totalExpense;
    const days = this.getElapsedDays(range, now);
    const avgChargingCost = charging.length ? chargingFee / 100 / charging.length : 0;
    const dailyCarCost = totalExpense / 100 / days;
    const budget = Number(this.getBudgets()[this.data.activePeriod] || 0);

    // 找出最大支出类型
    const typeAmounts = [
      { name: '充电', amount: chargingFee },
      { name: '养车', amount: maintenanceFee },
      { name: '洗车', amount: carWashFee },
      { name: '改装', amount: modificationFee },
    ].filter(item => item.amount > 0);
    const maxType = typeAmounts.length > 0
      ? typeAmounts.reduce((a, b) => (a.amount > b.amount ? a : b))
      : null;

    this.setData({
      periodTitle: range.title,
      budgetText: budget ? `¥${this.formatNumber(budget)}` : '设上限',
      budgetPercent: budget ? Math.min(100, Math.round((totalExpense / 100 / budget) * 100)) : 0,
      totalExpenseText: this.formatMoney(totalExpense),
      totalIncomeText: this.formatMoney(totalIncome),
      balanceText: this.formatMoney(balance),
      balanceClass: balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'neutral',
      dailyExpenseText: this.formatMoney(totalExpense / days),
      dailyIncomeText: this.formatMoney(totalIncome / days),
      avgChargingCostText: `¥${this.formatNumber(avgChargingCost)}`,
      dailyCarCostText: `¥${this.formatNumber(dailyCarCost)}`,
      insightText: maxType ? `最大支出类型：${maxType.name}（${this.formatMoney(maxType.amount)}）` : `充电均次 ${this.formatNumber(avgChargingCost)} · 日均用车成本仅 ${this.formatNumber(dailyCarCost)}`,
      expenseCategories: this.buildExpenseCategories(chargingFee, maintenanceFee, rideCost, carWashFee, modificationFee),
      chargingOverview: [
        { label: '充电', value: `${charging.length}次` },
        { label: '费用', value: this.formatMoney(chargingFee) },
        { label: '里程', value: `${totalMileage.toFixed(0)}km` },
        { label: '能耗', value: `${avgConsumption}kWh` },
      ],
      trendMonths: this.buildTrend(raw, now),
    });
  },

  loadAllRecords() {
    try {
      const chargingLogs = wx.getStorageSync('kt_charging_logs') || [];
      const maintenanceLogs = wx.getStorageSync('kt_maintenance_logs') || [];
      const rideLogs = wx.getStorageSync('kt_ride_logs') || [];
      const carWashLogs = wx.getStorageSync('kt_car_wash_logs') || [];
      const modificationLogs = wx.getStorageSync('kt_modification_logs') || [];
      const mileageLogs = wx.getStorageSync('kt_mileage_logs') || [];

      // 收集洗车和改装的同步记录ID，用于从养车账本中排除
      const syncIds = new Set();
      carWashLogs.forEach(item => syncIds.add(`wash_${item.id}`));
      modificationLogs.forEach(item => syncIds.add(`mod_${item.id}`));

      return {
        charging: chargingLogs.map(item => ({
          fee: Number(item.fee || 0),
          kwh: Number(item.kwh || 0),
          time: this.resolveTime(item),
        })),
        maintenance: maintenanceLogs
          .filter(item => !syncIds.has(item.id))
          .map(item => ({
            fee: Number(item.fee || 0),
            typeName: item.typeName || '养车',
            time: this.resolveTime(item),
          })),
        rides: rideLogs.map(item => ({
          revenue: Number(item.revenue || 0),
          cost: Number(item.cost || 0),
          time: this.resolveTime(item),
        })),
        carWash: carWashLogs.map(item => ({
          fee: Number(item.amount || 0),
          time: this.resolveTime(item),
        })),
        modification: modificationLogs.map(item => ({
          fee: Number(item.amount || 0),
          time: this.resolveTime(item),
        })),
        mileage: mileageLogs.map(item => ({
          mileage: Number(item.mileage || 0),
          consumption: Number(item.consumption || 0),
          time: this.resolveTime(item),
        })),
      };
    } catch (e) {
      return { charging: [], maintenance: [], rides: [], carWash: [], modification: [], mileage: [] };
    }
  },

  resolveTime(item) {
    if (item.createdAt) return Number(item.createdAt);
    if (item.date) {
      const parts = String(item.date).split('-').map(Number);
      if (parts.length === 3 && parts.every(Boolean)) {
        return new Date(parts[0], parts[1] - 1, parts[2]).getTime();
      }
    }
    return 0;
  },

  getRange(period, now) {
    const year = now.getFullYear();
    const month = now.getMonth();
    if (period === 'quarter') {
      const startMonth = Math.floor(month / 3) * 3;
      return {
        title: '本季度',
        start: new Date(year, startMonth, 1).getTime(),
        end: new Date(year, startMonth + 3, 1).getTime(),
      };
    }
    if (period === 'year') {
      return {
        title: '今年',
        start: new Date(year, 0, 1).getTime(),
        end: new Date(year + 1, 0, 1).getTime(),
      };
    }
    return {
      title: '本月',
      start: new Date(year, month, 1).getTime(),
      end: new Date(year, month + 1, 1).getTime(),
    };
  },

  inRange(time, range) {
    return time >= range.start && time < range.end;
  },

  getElapsedDays(range, now) {
    const end = Math.min(now.getTime(), range.end - 1);
    return Math.max(1, Math.ceil((end - range.start + 1) / 86400000));
  },

  buildExpenseCategories(chargingFee, maintenanceFee, rideCost, carWashFee, modificationFee) {
    const items = [
      { key: 'charging', name: '充电', amount: chargingFee, color: EXPENSE_COLORS.charging },
      { key: 'maintenance', name: '养车', amount: maintenanceFee, color: EXPENSE_COLORS.maintenance },
      { key: 'rideCost', name: '顺风车成本', amount: rideCost, color: EXPENSE_COLORS.rideCost },
      { key: 'carWash', name: '洗车', amount: carWashFee, color: EXPENSE_COLORS.carWash },
      { key: 'modification', name: '改装', amount: modificationFee, color: EXPENSE_COLORS.modification },
    ].filter(item => item.amount > 0);
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    if (!total) {
      return [{ key: 'empty', name: '暂无支出', amountText: '¥0', percent: 0, color: '#CBD5E1' }];
    }
    return items.map(item => ({
      ...item,
      amountText: this.formatMoney(item.amount),
      percent: Math.max(4, Math.round((item.amount / total) * 100)),
    }));
  },

  buildTrend(raw, now) {
    const months = [];
    const base = new Date(now.getFullYear(), now.getMonth(), 1);
    for (let i = 5; i >= 0; i -= 1) {
      const startDate = new Date(base.getFullYear(), base.getMonth() - i, 1);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
      const range = { start: startDate.getTime(), end: endDate.getTime() };
      const charging = raw.charging.filter(item => this.inRange(item.time, range)).reduce((sum, item) => sum + item.fee, 0);
      const maintenance = raw.maintenance.filter(item => this.inRange(item.time, range)).reduce((sum, item) => sum + item.fee, 0);
      const carWash = raw.carWash.filter(item => this.inRange(item.time, range)).reduce((sum, item) => sum + item.fee, 0);
      const modification = raw.modification.filter(item => this.inRange(item.time, range)).reduce((sum, item) => sum + item.fee, 0);
      const rideRevenue = raw.rides.filter(item => this.inRange(item.time, range)).reduce((sum, item) => sum + item.revenue, 0);
      months.push({
        label: `${startDate.getMonth() + 1}月`,
        charging,
        expense: charging + maintenance + carWash + modification,
        income: rideRevenue,
      });
    }
    const max = Math.max(1, ...months.map(item => Math.max(item.charging, item.expense, item.income)));
    return months.map(item => ({
      label: item.label,
      chargingHeight: Math.max(4, Math.round((item.charging / max) * 116)),
      expenseHeight: Math.max(4, Math.round((item.expense / max) * 116)),
      incomeHeight: Math.max(4, Math.round((item.income / max) * 116)),
      hasData: item.charging + item.expense + item.income > 0,
    }));
  },

  formatMoney(cents) {
    const value = Number(cents || 0) / 100;
    const sign = value < 0 ? '-' : '';
    return `¥${sign}${this.formatNumber(Math.abs(value))}`;
  },

  formatNumber(value) {
    const fixed = Number(value || 0).toFixed(2);
    return fixed.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
  },
});
