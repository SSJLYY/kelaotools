// 个人信息 & 设置
const { getNavBarInfo } = require('../../utils/nav');
const toolsConfig = require('../../config/tools.config');

Page({
  data: {
    statusBarHeight: 20, navBarHeight: 44, navTotalHeight: 64,
    userAvatar: '/assets/images/icons/avatar-default.png',
    userName: '极氪车主', registerDate: '', bindCar: '暂无',
    lastActive: '', chargingCount: 0, syncing: false,

    // 提醒开关
    reminders: {
      loan: true,
      parking: true,
      budget: true,
    },

    // 工具排序
    toolSortList: [],
    editingSort: false,
  },

  onLoad() {
    this.initNavBar();
    this.loadUserInfo();
    this.loadReminders();
    this.loadToolSort();
  },

  onShow() {
    this.loadUserInfo();
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  loadUserInfo() {
    try {
      const car = wx.getStorageSync('kt_my_car');
      if (car?.plate) this.setData({ userName: car.plate });
      if (car?.model) this.setData({ bindCar: car.model + (car.year ? ' ' + car.year + '款' : '') });
    } catch (e) {}
    const rd = wx.getStorageSync('kt_register_date') || this.fmtDate();
    if (!wx.getStorageSync('kt_register_date')) wx.setStorageSync('kt_register_date', rd);
    this.setData({
      registerDate: rd,
      lastActive: this.fmtDateTime(),
      chargingCount: (wx.getStorageSync('kt_charging_logs') || []).length,
    });
  },

  // ---- 提醒开关 ----
  loadReminders() {
    try {
      const saved = wx.getStorageSync('kt_home_reminders');
      if (saved) {
        this.setData({
          reminders: {
            loan: saved.loan !== false,
            parking: saved.parking !== false,
            budget: saved.budget !== false,
          },
        });
      }
    } catch (e) {}
  },

  saveReminders() {
    try {
      wx.setStorageSync('kt_home_reminders', this.data.reminders);
      // 修复：自动同步到云端
      const app = getApp();
      if (app.saveSettingsToCloud) {
        app.saveSettingsToCloud('kt_home_reminders', this.data.reminders);
      }
    } catch (e) {}
  },

  onToggleReminder(e) {
    const key = e.currentTarget.dataset.key;
    const reminders = { ...this.data.reminders };
    reminders[key] = !reminders[key];
    this.setData({ reminders }, () => {
      this.saveReminders();
      wx.showToast({
        title: reminders[key] ? '已开启提醒' : '已关闭提醒',
        icon: 'success',
      });
    });
  },

  // ---- 工具排序 ----
  loadToolSort() {
    try {
      const saved = wx.getStorageSync('kt_tool_sort');
      const allTools = toolsConfig.toolList.map(t => ({
        id: t.id,
        key: t.key,
        icon: t.icon,
        path: t.path,
        enabled: true,
      }));

      if (saved && Array.isArray(saved) && saved.length > 0) {
        // 按保存的顺序和启用状态恢复
        const toolMap = {};
        allTools.forEach(t => { toolMap[t.id] = t; });
        const sorted = [];
        saved.forEach(s => {
          if (toolMap[s.id]) {
            sorted.push({ ...toolMap[s.id], enabled: s.enabled !== false });
            delete toolMap[s.id];
          }
        });
        // 未保存过的新工具追加到末尾
        Object.values(toolMap).forEach(t => sorted.push(t));
        this.setData({ toolSortList: sorted });
      } else {
        this.setData({ toolSortList: allTools });
      }
    } catch (e) {
      this.setData({
        toolSortList: toolsConfig.toolList.map(t => ({ ...t, enabled: true })),
      });
    }
  },

  saveToolSort() {
    try {
      const sortData = this.data.toolSortList.map(t => ({
        id: t.id,
        enabled: t.enabled,
      }));
      wx.setStorageSync('kt_tool_sort', sortData);
      // 修复：自动同步到云端
      const app = getApp();
      if (app.saveSettingsToCloud) {
        app.saveSettingsToCloud('kt_tool_sort', sortData);
      }
    } catch (e) {}
  },

  onEditSort() {
    this.setData({ editingSort: true });
  },

  onDoneSort() {
    this.setData({ editingSort: false });
    this.saveToolSort();
    wx.showToast({ title: '排序已保存', icon: 'success' });
  },

  onToggleTool(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.toolSortList.map(t =>
      t.id === id ? { ...t, enabled: !t.enabled } : t
    );
    this.setData({ toolSortList: list });
  },

  onMoveUp(e) {
    const id = e.currentTarget.dataset.id;
    const list = [...this.data.toolSortList];
    const idx = list.findIndex(t => t.id === id);
    if (idx <= 0) return;
    [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
    this.setData({ toolSortList: list });
  },

  onMoveDown(e) {
    const id = e.currentTarget.dataset.id;
    const list = [...this.data.toolSortList];
    const idx = list.findIndex(t => t.id === id);
    if (idx < 0 || idx >= list.length - 1) return;
    [list[idx], list[idx + 1]] = [list[idx + 1], list[idx]];
    this.setData({ toolSortList: list });
  },

  // ---- 其他操作 ----
  onSync() {
    this.setData({ syncing: true });
    const app = getApp();

    // 尝试同步到云端
    if (app.globalData.cloudReady) {
      app.syncAllToCloud(success => {
        this.setData({ syncing: false, lastActive: this.fmtDateTime() });
        wx.showToast({ title: success ? '同步完成' : '同步失败', icon: success ? 'success' : 'none' });
      });
    } else {
      // 无云端环境时仅模拟
      setTimeout(() => {
        this.setData({ syncing: false, lastActive: this.fmtDateTime() });
        wx.showToast({ title: '同步完成', icon: 'success' });
      }, 1500);
    }
  },

  onLogout() {
    wx.showModal({
      title: '退出登录', content: '退出后本地数据仍会保留，确定退出吗？',
      confirmColor: '#EF4444',
      success: res => {
        if (res.confirm) {
          wx.showToast({ title: '已退出', icon: 'success' });
          setTimeout(() => wx.switchTab({ url: '/pages/index/index' }), 1000);
        }
      },
    });
  },

  onClearData() {
    wx.showModal({
      title: '清除数据', content: '将清除所有充电记录、养车记录、车辆信息等本地数据，此操作不可恢复！',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          wx.clearStorageSync();
          wx.setStorageSync('kt_register_date', this.data.registerDate);
          wx.showToast({ title: '已清除', icon: 'success' });
          setTimeout(() => wx.switchTab({ url: '/pages/index/index' }), 1000);
        } catch (e) { wx.showToast({ title: '清除失败', icon: 'none' }); }
      },
    });
  },

  fmtDate() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
  fmtDateTime() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  },
  onBack() { wx.navigateBack(); },
});
