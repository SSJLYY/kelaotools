// 智慧场景码 - 极氪场景码列表
const { getNavBarInfo } = require('../../utils/nav');
const scenesData = require('../../data/scenes.data');

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    // 分类
    categories: ['全部','功能','充电','娱乐','迎宾','开关门','换挡','车型','安全','舒适','节能','导航','影像','灯光','音效','露营','冬季','夏季','雨天','高速','城市','泊车'],
    activeCategory: '',

    // 搜索
    searchText: '',
    loading: false,

    // 场景码数据 - 使用共享数据
    sceneList: scenesData,
    filteredList: [],
    filterSignature: '',

    // 滚动位置
    scrollTop: 0,
  },

  _scrollTop: 0,

  onLoad() {
    this.setData({
      ...getNavBarInfo(),
      filteredList: this.data.sceneList,
      filterSignature: '__',
    });
  },

  onHide() {
    // 保存滚动位置
    this.setData({ scrollTop: this._scrollTop || 0 });
  },

  onShow() {
    // 恢复滚动位置需要在渲染后
    setTimeout(() => {
      this.setData({ scrollTop: this._scrollTop || 0 });
    }, 100);
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  // 滚动位置记录
  onScroll(e) {
    this._scrollTop = e.detail.scrollTop;
  },

  // 分类切换
  onCategoryTap(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ activeCategory: cat === '全部' || cat === this.data.activeCategory ? '' : cat }, () => {
      this.refreshFilteredList();
    });
  },

  refreshFilteredList() {
    const signature = `${this.data.activeCategory || ''}__${this.data.searchText || ''}`;
    if (signature === this.data.filterSignature) return;

    let list = this.data.sceneList;
    if (this.data.activeCategory) {
      list = list.filter(item => item.tags.includes(this.data.activeCategory));
    }
    if (this.data.searchText) {
      const kw = this.data.searchText.toLowerCase();
      list = list.filter(item =>
        item.title.toLowerCase().includes(kw) ||
        item.desc.toLowerCase().includes(kw) ||
        item.code.toLowerCase().includes(kw)
      );
    }
    this.setData({ filteredList: list, filterSignature: signature });
  },

  // 搜索
  onSearchFocus() {
    wx.showToast({ title: '搜索功能开发中', icon: 'none' });
  },

  // 点击场景
  onSceneTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/subpkg/charging-calc/scene-code/scene-code?id=${id}` });
  },

  // 复制场景码
  onCopyCode(e) {
    const code = e.currentTarget.dataset.code;
    wx.setClipboardData({
      data: code,
      success: () => wx.showToast({ title: '场景码已复制', icon: 'success' }),
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '极氪智慧场景码 - 一键控车更方便',
      path: '/pages/tools/tools',
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '极氪智慧场景码 - 一键控车更方便',
    };
  },
});
