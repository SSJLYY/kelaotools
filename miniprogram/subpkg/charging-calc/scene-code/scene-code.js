// 场景码详情
const { getNavBarInfo } = require('../../../utils/nav');
const scenesData = require('../../../data/scenes.data');

Page({
  data: { darkMode: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    isFaved: false,
    feedbackSubmitted: false,
    scene: {
      id: 0,
      title: '',
      desc: '',
      tags: [],
      code: '',
    },
  },

  onLoad(options) {
    this.loadDarkMode();
    this.initNavBar();
    const id = parseInt(options.id) || 1;
    this.loadScene(id);
    this.checkFav(id);
    this.checkFeedback(id);
  },

  loadDarkMode() {
    try {
      const darkMode = wx.getStorageSync('kt_dark_mode') || false;
      this.setData({ darkMode });
    } catch (e) {}
  },

  onShow() {
    this.loadDarkMode();
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  loadScene(id) {
    // 使用共享数据
    const scene = scenesData.find(s => s.id === id) || scenesData[0];
    this.setData({ scene });
  },

  checkFav(id) {
    try {
      const favs = wx.getStorageSync('kt_fav_scenes') || [];
      this.setData({ isFaved: favs.some(item => Number(item && typeof item === 'object' ? item.id : item) === Number(id)) });
    } catch (e) {}
  },

  checkFeedback(id) {
    try {
      const feedbacks = wx.getStorageSync('kt_scene_feedback') || [];
      this.setData({ feedbackSubmitted: feedbacks.some(f => f.sceneId === id) });
    } catch (e) {}
  },

  onCopyCode() {
    wx.setClipboardData({
      data: this.data.scene.code,
      success: () => wx.showToast({ title: '场景码已复制', icon: 'success' }),
    });
  },

  onFav() {
    const { scene, isFaved } = this.data;
    try {
      let favs = wx.getStorageSync('kt_fav_scenes') || [];
      if (isFaved) {
        favs = favs.filter(item => Number(item && typeof item === 'object' ? item.id : item) !== Number(scene.id));
      } else {
        favs = favs.filter(item => Number(item && typeof item === 'object' ? item.id : item) !== Number(scene.id));
        favs.unshift({ id: scene.id, time: Date.now() });
      }
      wx.setStorageSync('kt_fav_scenes', favs);
      this.setData({ isFaved: !isFaved });
      wx.showToast({ title: isFaved ? '已取消收藏' : '已收藏', icon: 'success' });
    } catch (e) {}
  },

  // 失效反馈
  onFeedback() {
    wx.showModal({
      title: '场景码失效反馈',
      content: '该场景码已失效？我们会尽快核实处理',
      success: res => {
        if (res.confirm) {
          try {
            let feedbacks = wx.getStorageSync('kt_scene_feedback') || [];
            feedbacks.push({ id: Date.now(), sceneId: this.data.scene.id, time: Date.now() });
            wx.setStorageSync('kt_scene_feedback', feedbacks);
            this.setData({ feedbackSubmitted: true });
            wx.showToast({ title: '感谢反馈', icon: 'success' });
          } catch (e) {}
        }
      },
    });
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() { wx.navigateBack(); },

  onShareAppMessage() {
    return {
      title: `极氪智慧场景码: ${this.data.scene.title}`,
      path: `/subpkg/charging-calc/scene-code/scene-code?id=${this.data.scene.id}`,
    };
  },
});
