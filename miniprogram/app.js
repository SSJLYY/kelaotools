// 氪佬工具箱 - 应用入口
const i18n = require('./i18n/index');
const darkmode = require('./utils/darkmode');

App({
  onLaunch() {
    // 1. 初始化多语言
    i18n.init();

    // 2. 云开发按需初始化
    this.initCloudIfNeeded();

    // 3. 检查版本更新
    this.checkUpdate();

    // 4. 修复：从云端恢复用户设置（自定义工具排序、提醒开关等）
    this.restoreSettingsFromCloud();

    // 5. 初始化深色模式
    this.initDarkMode();
  },

  globalData: {
    lang: 'zh-CN',
    langVersion: 0,
    cloudEnv: '',
    cloudReady: false,
    darkMode: false,
  },

  initDarkMode() {
    const dark = darkmode.resolveDarkMode();
    this.globalData.darkMode = dark;
    darkmode.setDarkMode(dark);
    darkmode.applyDarkMode(dark);
    this._startDarkModeTimer();
  },

  _startDarkModeTimer() {
    if (this._darkModeTimer) clearInterval(this._darkModeTimer);
    this._darkModeTimer = setInterval(() => {
      const setting = darkmode.getSetting();
      if (setting.mode === 'auto') {
        darkmode.syncDarkMode();
      }
    }, 60000);
  },

  checkUpdate() {
    if (!wx.getUpdateManager) return;
    const um = wx.getUpdateManager();
    const currentVersion = '2.4.1';
    const lastVersion = wx.getStorageSync('kt_last_update_version');

    um.onUpdateReady(() => {
      wx.showModal({
        title: '新版本已就绪',
        content: '是否立即重启更新？',
        success: res => {
          if (res.confirm) um.applyUpdate();
        },
      });
    });

    // 每版仅弹一次更新说明，延迟到页面完全渲染后
    if (lastVersion !== currentVersion) {
      setTimeout(() => {
        try {
          wx.showModal({
            title: 'v' + currentVersion + ' 更新说明',
            content: '首页公告更新至v2.4\n"我的"页新增全部功能入口\n首页工具列表动态化\n多项体验优化',
            showCancel: false,
            confirmText: '知道了',
            success: () => {
              wx.setStorageSync('kt_last_update_version', currentVersion);
            },
          });
        } catch (e) {
          wx.setStorageSync('kt_last_update_version', currentVersion);
        }
      }, 3000);
    }
  },

  initCloudIfNeeded() {
    const cloudEnv = this.globalData.cloudEnv;
    if (!cloudEnv || !wx.cloud) return;
    try {
      wx.cloud.init({ env: cloudEnv, traceUser: true });
      this.globalData.cloudReady = true;
    } catch (e) {
      this.globalData.cloudReady = false;
    }
  },

  // 修复：从云端恢复用户设置
  restoreSettingsFromCloud() {
    if (!this.globalData.cloudReady || !wx.cloud) return;

    try {
      const db = wx.cloud.database();
      const settingsKeys = [
        { cloud: 'tool_sort', local: 'kt_tool_sort' },
        { cloud: 'home_reminders', local: 'kt_home_reminders' },
        { cloud: 'charging_stations', local: 'kt_charging_stations' },
        { cloud: 'charging_logs', local: 'kt_charging_logs' },
        { cloud: 'maintenance_logs', local: 'kt_maintenance_logs' },
        { cloud: 'ride_logs', local: 'kt_ride_logs' },
        { cloud: 'car_wash_logs', local: 'kt_car_wash_logs' },
        { cloud: 'modification_logs', local: 'kt_modification_logs' },
        { cloud: 'mileage_logs', local: 'kt_mileage_logs' },
        { cloud: 'maintenance_reminders', local: 'kt_maintenance_reminders' },
        { cloud: 'my_cars', local: 'kt_my_cars' },
        { cloud: 'my_car', local: 'kt_my_car' },
      ];

      settingsKeys.forEach(({ cloud, local }) => {
        try {
          db.collection('user_settings').where({
            key: cloud,
          }).get().then(res => {
            if (res.data && res.data.length > 0) {
              const cloudData = res.data[0].value;
              const localData = wx.getStorageSync(local);
              // 如果本地没有数据或云端数据更新，则恢复
              if (!localData || (res.data[0].updatedAt > (wx.getStorageSync(local + '_sync_time') || 0))) {
                wx.setStorageSync(local, cloudData);
                wx.setStorageSync(local + '_sync_time', Date.now());
              }
            }
          }).catch(() => {});
        } catch (e) {}
      });
    } catch (e) {}
  },

  // 保存用户设置到云端
  saveSettingsToCloud(key, value) {
    if (!this.globalData.cloudReady || !wx.cloud) return;

    try {
      const db = wx.cloud.database();
      const cloudKey = key.replace('kt_', '');

      db.collection('user_settings').where({
        key: cloudKey,
      }).get().then(res => {
        if (res.data && res.data.length > 0) {
          // 更新
          db.collection('user_settings').doc(res.data[0]._id).update({
            data: {
              value: value,
              updatedAt: Date.now(),
            },
          });
        } else {
          // 新增
          db.collection('user_settings').add({
            data: {
              key: cloudKey,
              value: value,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          });
        }
        wx.setStorageSync(key + '_sync_time', Date.now());
      }).catch(() => {});
    } catch (e) {}
  },

  // 手动同步所有数据到云端
  syncAllToCloud(callback) {
    if (!this.globalData.cloudReady || !wx.cloud) {
      callback && callback(false);
      return;
    }

    try {
      const settingsKeys = [
        { cloud: 'tool_sort', local: 'kt_tool_sort' },
        { cloud: 'home_reminders', local: 'kt_home_reminders' },
        { cloud: 'charging_stations', local: 'kt_charging_stations' },
        { cloud: 'charging_logs', local: 'kt_charging_logs' },
        { cloud: 'maintenance_logs', local: 'kt_maintenance_logs' },
        { cloud: 'ride_logs', local: 'kt_ride_logs' },
        { cloud: 'car_wash_logs', local: 'kt_car_wash_logs' },
        { cloud: 'modification_logs', local: 'kt_modification_logs' },
        { cloud: 'my_cars', local: 'kt_my_cars' },
        { cloud: 'mileage_logs', local: 'kt_mileage_logs' },
        { cloud: 'maintenance_reminders', local: 'kt_maintenance_reminders' },
        { cloud: 'my_car', local: 'kt_my_car' },
      ];

      let completed = 0;
      const total = settingsKeys.length;

      settingsKeys.forEach(({ cloud, local }) => {
        const value = wx.getStorageSync(local);
        if (value) {
          this.saveSettingsToCloud(local, value);
        }
        completed++;
        if (completed >= total) {
          callback && callback(true);
        }
      });
    } catch (e) {
      callback && callback(false);
    }
  },
});
