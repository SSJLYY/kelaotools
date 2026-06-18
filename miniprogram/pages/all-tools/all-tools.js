// 全部工具
const { getNavBarInfo } = require('../../utils/nav');
const toolsConfig = require('../../config/tools.config');

Page({
  data: { darkMode: false, statusBarHeight: 20, navBarHeight: 44, navTotalHeight: 64, toolCategories: [] },
  onLoad() {
    this.loadDarkMode();
    this.initNavBar();
    this.setData({ toolCategories: toolsConfig.toolCategories });
  },
  onShow() { this.loadDarkMode(); },
  initNavBar() { this.setData(getNavBarInfo()); },
  onNav(e) {
    const p = e.currentTarget.dataset.path;
    if (!p) return;
    const tabPages = ['/pages/index/index', '/pages/tools/tools', '/pages/community/community', '/pages/mine/mine'];
    tabPages.includes(p) ? wx.switchTab({ url: p }) : wx.navigateTo({ url: p });
  },
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() { wx.navigateBack(); },
});