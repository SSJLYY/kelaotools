// 用车小贴士
const { getNavBarInfo } = require('../../utils/nav');
const tipsData = require('../../data/tips.data');

Page({
  data: { darkMode: false,
    statusBarHeight: 20, navBarHeight: 44, navTotalHeight: 64,
    categories: ['全部','省电技巧','换季保养','胎压参考','电池养护','安全驾驶','隐藏功能','充电技巧','用车常识'],
    activeCategory: '',
    tips: tipsData,
    filteredTips: [],
  },

  onLoad() { this.loadDarkMode();
    this.initNavBar();
    this.updateFiltered();
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  onCatTap(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ activeCategory: cat === this.data.activeCategory ? '' : cat });
    this.updateFiltered();
  },

  updateFiltered() {
    const cat = this.data.activeCategory;
    const list = cat ? this.data.tips.filter(t => t.category === cat) : this.data.tips;
    this.setData({ filteredTips: list });
  },

  onShow() { this.loadDarkMode();
    this.updateFiltered();
  },

  onTipTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/tips-detail/tips-detail?id=${id}` });
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() { wx.navigateBack(); },
});
