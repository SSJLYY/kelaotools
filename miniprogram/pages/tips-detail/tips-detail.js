// 小贴士详情
const { getNavBarInfo } = require('../../utils/nav');
const tipsData = require('../../data/tips.data');

Page({
  data: { darkMode: false,
    statusBarHeight: 20, navBarHeight: 44, navTotalHeight: 64,
    tip: {}, contentLines: [], relatedTips: [],
  },

  onLoad(options) {
    this.initNavBar();
    const id = parseInt(options.id) || 1;
    const tip = tipsData.find(t => t.id === id) || tipsData[0];
    const rawLines = (tip.content || '').split('\n').filter(Boolean);
    const contentLines = rawLines.map(line => this.parseBold(line));
    const related = tipsData.filter(t => t.id !== id && t.category === tip.category).slice(0, 2);
    this.setData({ tip, contentLines, relatedTips: related });
  },

  parseBold(text) {
    const parts = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.index), bold: false });
      }
      parts.push({ text: match[1], bold: true });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), bold: false });
    }
    return { parts, isPlainText: parts.length <= 1 && !parts[0]?.bold };
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  onRelatedTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.redirectTo({ url: `/pages/tips-detail/tips-detail?id=${id}` });
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() { wx.navigateBack(); },
});
