// 保养提醒
const { getNavBarInfo } = require('../../utils/nav');

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
}

Page({
  data: { darkMode: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    mode: 'list', // list | add
    reminders: [],
    urgentCount: 0,

    reminderTypes: ['机油更换', '轮胎更换', '刹车片更换', '空调滤芯', '电池检测', '空调冷媒', '雨刮更换', '其他'],
    typeIndex: -1,

    form: {
      type: '',
      lastDate: '',
      lastMileage: '',
      intervalDays: '180',
      intervalMileage: '10000',
      note: '',
      carName: '',
    },
  },

  onLoad() { this.loadDarkMode();
    this.setData(getNavBarInfo());
    this.resetForm();
  },

  onShow() { this.loadDarkMode();
    this.loadReminders();
    this.loadCarName();
  },

  loadCarName() {
    try {
      const car = wx.getStorageSync('kt_my_car') || {};
      const carName = car.model ? `${car.model}${car.year ? ` ${car.year}款` : ''}` : '极氪 001 2025款';
      this.setData({ 'form.carName': carName });
    } catch (e) {
      this.setData({ 'form.carName': '极氪 001 2025款' });
    }
  },

  resetForm() {
    this.setData({
      typeIndex: -1,
      form: {
        type: '',
        lastDate: formatDate(new Date()),
        lastMileage: '',
        intervalDays: '180',
        intervalMileage: '10000',
        note: '',
        carName: this.data.form?.carName || '极氪 001 2025款',
      },
    });
  },

  loadReminders() {
    try {
      const list = wx.getStorageSync('kt_maintenance_reminders') || [];
      const now = new Date();
      const normalized = list.map(item => {
        const lastDate = item.lastDate || formatDate(new Date(item.createdAt || Date.now()));
        const intervalDays = Number(item.intervalDays) || 180;
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + intervalDays);
        const daysLeft = daysBetween(now, nextDate);
        const isUrgent = daysLeft <= 30;
        const isOverdue = daysLeft < 0;

        return {
          id: item.id || `${Date.now()}_${Math.random()}`,
          type: item.type || '其他',
          lastDate,
          lastMileage: item.lastMileage || '',
          intervalDays,
          intervalMileage: item.intervalMileage || '10000',
          nextDate: formatDate(nextDate),
          daysLeft,
          status: isOverdue ? 'overdue' : isUrgent ? 'urgent' : 'normal',
          statusText: isOverdue ? `已超期${Math.abs(daysLeft)}天` : isUrgent ? `${daysLeft}天后到期` : `${daysLeft}天后`,
          note: item.note || '',
          carName: item.carName || '',
          createdAt: item.createdAt || Date.now(),
        };
      }).sort((a, b) => a.daysLeft - b.daysLeft);

      const urgentCount = normalized.filter(item => item.status === 'overdue' || item.status === 'urgent').length;
      this.setData({ reminders: normalized, urgentCount });
    } catch (e) {
      this.setData({ reminders: [], urgentCount: 0 });
    }
  },

  showAdd() {
    this.resetForm();
    this.loadCarName();
    this.setData({ mode: 'add' });
  },

  showList() {
    this.setData({ mode: 'list' });
  },

  onTypeChange(e) {
    const index = Number(e.detail.value);
    const type = this.data.reminderTypes[index];
    if (type) {
      this.setData({
        typeIndex: index,
        'form.type': type,
      });
    }
  },

  onLastDateChange(e) {
    this.setData({ 'form.lastDate': e.detail.value });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  saveReminder() {
    const form = this.data.form;
    if (!form.type) {
      wx.showToast({ title: '请选择保养类型', icon: 'none' });
      return;
    }

    const reminder = {
      id: `${Date.now()}`,
      type: form.type,
      lastDate: form.lastDate,
      lastMileage: form.lastMileage.trim(),
      intervalDays: form.intervalDays.trim() || '180',
      intervalMileage: form.intervalMileage.trim() || '10000',
      note: form.note.trim(),
      carName: form.carName,
      createdAt: new Date(`${form.lastDate} 00:00:00`).getTime() || Date.now(),
    };

    try {
      const list = wx.getStorageSync('kt_maintenance_reminders') || [];
      list.unshift(reminder);
      wx.setStorageSync('kt_maintenance_reminders', list);

      const app = getApp();
      if (app.saveSettingsToCloud) {
        app.saveSettingsToCloud('kt_maintenance_reminders', list);
      }

      wx.showToast({ title: '保存成功', icon: 'success' });
      this.setData({ mode: 'list' }, () => this.loadReminders());
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除提醒',
      content: '确定删除这条保养提醒吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          const list = (wx.getStorageSync('kt_maintenance_reminders') || []).filter(item => item.id !== id);
          wx.setStorageSync('kt_maintenance_reminders', list);

          const app = getApp();
          if (app.saveSettingsToCloud) {
            app.saveSettingsToCloud('kt_maintenance_reminders', list);
          }

          this.loadReminders();
          wx.showToast({ title: '已删除', icon: 'success' });
        } catch (err) {
          wx.showToast({ title: '删除失败', icon: 'none' });
        }
      },
    });
  },

  onMarkDone(e) {
    const id = e.currentTarget.dataset.id;
    const reminder = this.data.reminders.find(item => item.id === id);
    if (!reminder) return;

    wx.showModal({
      title: '标记完成',
      content: `确定已完成「${reminder.type}」保养吗？\n将更新保养日期为今天`,
      confirmText: '确定',
      success: res => {
        if (!res.confirm) return;
        try {
          const list = wx.getStorageSync('kt_maintenance_reminders') || [];
          const idx = list.findIndex(item => item.id === id);
          if (idx >= 0) {
            list[idx].lastDate = formatDate(new Date());
            list[idx].createdAt = Date.now();
          }
          wx.setStorageSync('kt_maintenance_reminders', list);

          const app = getApp();
          if (app.saveSettingsToCloud) {
            app.saveSettingsToCloud('kt_maintenance_reminders', list);
          }

          this.loadReminders();
          wx.showToast({ title: '已更新', icon: 'success' });
        } catch (err) {
          wx.showToast({ title: '更新失败', icon: 'none' });
        }
      },
    });
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
      title: '保养提醒 - 再也不错过保养时间',
      path: '/pages/maintenance-reminder/maintenance-reminder',
    };
  },

  onShareTimeline() {
    return {
      title: '保养提醒 - 再也不错过保养时间',
    };
  },
});
