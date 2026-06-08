// 全部工具
const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: { statusBarHeight: 20, navBarHeight: 44, navTotalHeight: 64 },
  onLoad() { this.initNavBar(); },
  initNavBar() {
    this.setData(getNavBarInfo());
  },
  onNav(e) {
    const p = e.currentTarget.dataset.path;
    if (!p) return;

    const tabPages = ['/pages/index/index', '/pages/tools/tools', '/pages/community/community', '/pages/mine/mine'];
    if (tabPages.includes(p)) {
      wx.switchTab({ url: p });
      return;
    }

    wx.navigateTo({ url: p });
  },
  onComing() { wx.showToast({ title: '即将上线', icon: 'none' }); },
  onBack() { wx.navigateBack(); },
});
