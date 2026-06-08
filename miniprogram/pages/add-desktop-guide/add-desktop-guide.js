const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
  },

  onLoad() {
    this.setData(getNavBarInfo());
  },

  onBack() {
    wx.navigateBack({
      fail: () => wx.switchTab({ url: '/pages/index/index' }),
    });
  },

  onCopyName() {
    wx.setClipboardData({
      data: '氪佬工具箱',
      success: () => wx.showToast({ title: '名称已复制', icon: 'success' }),
    });
  },

  onShareAppMessage() {
    return {
      title: '把氪佬工具箱添加到桌面，快速打开更方便',
      path: '/pages/add-desktop-guide/add-desktop-guide',
    };
  },
});
