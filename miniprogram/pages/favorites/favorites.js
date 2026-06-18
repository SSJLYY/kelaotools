const { getNavBarInfo } = require('../../utils/nav');
const scenesData = require('../../data/scenes.data');
const soundsData = require('../../data/sounds.data');

const SCENES = scenesData;

const SOUNDS = soundsData;

Page({
  data: { darkMode: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    tabs: [
      { key: 'all', name: '全部' },
      { key: 'scene', name: '场景码' },
      { key: 'sound', name: '音效' },
    ],
    activeTab: 'all',
    favorites: [],
    filteredFavorites: [],
    favoriteStats: { total: 0, scene: 0, sound: 0 },
    emptyTitle: '还没有收藏',
    emptySub: '收藏的场景码和音效会按照最新时间排在最上面',
  },

  onLoad() { this.loadDarkMode();
    this.setData(getNavBarInfo());
  },

  onShow() { this.loadDarkMode();
    this.loadFavorites();
  },

  loadFavorites() {
    try {
      const sceneRecords = this.normalizeFavRecords(wx.getStorageSync('kt_fav_scenes'));
      const soundRecords = this.normalizeFavRecords(wx.getStorageSync('kt_fav_sounds'));
      const favSceneIds = sceneRecords.map(item => item.id);
      const favSoundIds = soundRecords.map(item => item.id);
      const sceneTimeMap = this.toTimeMap(sceneRecords);
      const soundTimeMap = this.toTimeMap(soundRecords);
      const sceneItems = SCENES
        .filter(item => favSceneIds.includes(item.id))
        .map(item => ({ ...item, uid: `scene-${item.id}`, type: 'scene', typeName: '场景码', icon: '景', time: sceneTimeMap[item.id] || 0, timeText: this.formatFavTime(sceneTimeMap[item.id]) }));
      const soundItems = SOUNDS
        .filter(item => favSoundIds.includes(item.id))
        .map(item => ({ ...item, uid: `sound-${item.id}`, type: 'sound', typeName: '音效', icon: '音', tags: [item.cat], time: soundTimeMap[item.id] || 0, timeText: this.formatFavTime(soundTimeMap[item.id]) }));
      const favorites = [...sceneItems, ...soundItems].sort((a, b) => (b.time || 0) - (a.time || 0));
      const favoriteStats = { total: favorites.length, scene: sceneItems.length, sound: soundItems.length };
      const tabs = this.data.tabs.map(tab => ({
        ...tab,
        count: tab.key === 'all' ? favoriteStats.total : favoriteStats[tab.key],
      }));
      this.setData({ favorites, favoriteStats, tabs }, () => this.refreshList());
    } catch (e) {
      this.setData({ favorites: [], filteredFavorites: [], favoriteStats: { total: 0, scene: 0, sound: 0 } });
    }
  },

  normalizeFavRecords(raw) {
    const list = Array.isArray(raw) ? raw : [];
    const recordMap = {};
    list.forEach(item => {
      const id = Number(item && typeof item === 'object' ? item.id : item);
      if (!id) return;
      const time = Number(item && typeof item === 'object' ? (item.time || item.favTime || item.createdAt) : 0) || 0;
      const prevTime = recordMap[id] ? recordMap[id].time : 0;
      recordMap[id] = { id, time: Math.max(prevTime || 0, time) };
    });
    return Object.keys(recordMap).map(id => recordMap[id]);
  },

  toTimeMap(records) {
    return records.reduce((map, item) => {
      map[item.id] = item.time || 0;
      return map;
    }, {});
  },

  formatFavTime(time) {
    if (!time) return '较早收藏';
    const date = new Date(Number(time));
    if (Number.isNaN(date.getTime())) return '较早收藏';
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    if (isToday) return `今天 ${hour}:${minute}`;
    if (isYesterday) return `昨天 ${hour}:${minute}`;
    return `${date.getMonth() + 1}月${date.getDate()}日 ${hour}:${minute}`;
  },

  refreshList() {
    const { activeTab, favorites } = this.data;
    const filteredFavorites = activeTab === 'all' ? favorites : favorites.filter(item => item.type === activeTab);
    const active = this.data.tabs.find(tab => tab.key === activeTab) || this.data.tabs[0];
    const isAllEmpty = favorites.length === 0;
    this.setData({
      filteredFavorites,
      emptyTitle: isAllEmpty ? '还没有收藏' : `${active.name}暂无收藏`,
      emptySub: isAllEmpty ? '收藏常用的场景码和音效，稍后可在这里快速复制和管理' : `当前分类没有收藏内容，可切换到“全部”查看 ${favorites.length} 条收藏`,
    });
  },

  onTabTap(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeTab: key }, () => this.refreshList());
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/mine/mine' }) });
  },

  onItemTap(e) {
    const { type, id } = e.currentTarget.dataset;
    if (type === 'scene') {
      wx.navigateTo({ url: `/subpkg/charging-calc/scene-code/scene-code?id=${id}` });
      return;
    }
    wx.switchTab({ url: '/pages/community/community' });
  },

  onCopy(e) {
    const code = e.currentTarget.dataset.code;
    wx.setClipboardData({ data: code, success: () => wx.showToast({ title: '已复制', icon: 'success' }) });
  },

  onRemove(e) {
    const { type, id } = e.currentTarget.dataset;
    try {
      const key = type === 'scene' ? 'kt_fav_scenes' : 'kt_fav_sounds';
      const numericId = Number(id);
      const list = wx.getStorageSync(key) || [];
      wx.setStorageSync(key, list.filter(item => Number(item && typeof item === 'object' ? item.id : item) !== numericId));
      wx.showToast({ title: '已取消收藏', icon: 'success' });
      this.loadFavorites();
    } catch (err) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  onGoExplore() {
    const url = this.data.activeTab === 'sound' ? '/pages/community/community' : '/pages/tools/tools';
    wx.switchTab({ url });
  },
});
