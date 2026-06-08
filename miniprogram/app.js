// 氪佬工具箱 - 应用入口
const i18n = require('./i18n/index');

App({
  onLaunch() {
    // 1. 初始化多语言
    i18n.init();

    // 2. 初始化云开发（可选，待配置）
    if (wx.cloud) {
      wx.cloud.init({
        env: 'krypton-tools-prod',
        traceUser: true,
      });
    }

    // 3. 检查版本更新
    this.checkUpdate();
  },

  globalData: {
    lang: 'zh-CN',
    langVersion: 0,
  },

  checkUpdate() {
    if (!wx.getUpdateManager) return;
    const um = wx.getUpdateManager();
    um.onUpdateReady(() => {
      wx.showModal({
        title: '新版本已就绪',
        content: '是否立即重启更新？',
        success: res => {
          if (res.confirm) um.applyUpdate();
        },
      });
    });
  },
});
