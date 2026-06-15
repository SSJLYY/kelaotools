// 自定义音效
const soundsData = require('../../data/sounds.data');

Page({
  data: {
    categories: ['全部','推荐','乌萨奇','圣诞','小团团','开关门','懒羊羊','卡皮巴拉','哈士奇','蜡笔小新','来电音效','上车欢迎','小黄人','游戏音效','影视经典','军哥系列','搞笑方言','动物叫声','自然音效','机械音效','电子音效'],
    activeCat: '',
    sounds: soundsData,
    filteredSounds: [],
    favSoundIds: [],
  },

  onShow() {
    this.loadSoundFavs();
  },

  loadSoundFavs() {
    try {
      const favs = wx.getStorageSync('kt_fav_sounds') || [];
      const favSoundIds = favs.map(item => Number(item && typeof item === 'object' ? item.id : item)).filter(Boolean);
      this.setData({ favSoundIds }, () => this.doFilter());
    } catch (e) {
      this.setData({ favSoundIds: [] }, () => this.doFilter());
    }
  },

  decorateSounds(list) {
    const favSet = (this.data.favSoundIds || []).reduce((map, id) => {
      map[id] = true;
      return map;
    }, {});
    return list.map(item => ({ ...item, isFaved: !!favSet[item.id] }));
  },

  onCatTap(e) {
    const cat = e.currentTarget.dataset.cat === '全部' ? '' : e.currentTarget.dataset.cat;
    this.setData({ activeCat: cat === this.data.activeCat ? '' : cat }, () => this.doFilter());
  },

  doFilter() {
    const cat = this.data.activeCat;
    let list;
    if (cat === '推荐') {
      list = this.data.sounds.filter(s => s.recommended);
    } else if (cat) {
      list = this.data.sounds.filter(s => s.cat === cat);
    } else {
      list = this.data.sounds;
    }
    // 推荐的排在前面
    list.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
    this.setData({ filteredSounds: this.decorateSounds(list) });
  },

  onPlay(e) {
    const id = e.currentTarget.dataset.id;
    const sounds = this.data.sounds.map(item => item.id === id ? { ...item, playing: !item.playing } : item);
    const current = sounds.find(item => item.id === id);
    this.setData({ sounds }, () => this.doFilter());
    wx.showToast({ title: current && current.playing ? '播放中(模拟)' : '已暂停', icon: 'none', duration: 800 });
  },

  onCopy(e) {
    const code = e.currentTarget.dataset.code;
    wx.setClipboardData({ data: code, success: () => wx.showToast({ title: '音效码已复制', icon: 'success' }) });
  },

  onFav(e) {
    const id = Number(e.currentTarget.dataset.id);
    if (!id) return;
    try {
      let favs = wx.getStorageSync('kt_fav_sounds') || [];
      const exists = favs.some(item => Number(item && typeof item === 'object' ? item.id : item) === id);
      if (exists) {
        favs = favs.filter(item => Number(item && typeof item === 'object' ? item.id : item) !== id);
      } else {
        favs = favs.filter(item => Number(item && typeof item === 'object' ? item.id : item) !== id);
        favs.unshift({ id, time: Date.now() });
      }
      wx.setStorageSync('kt_fav_sounds', favs);
      wx.showToast({ title: exists ? '已取消收藏' : '已收藏', icon: 'success' });
      this.loadSoundFavs();
    } catch (err) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  onSearch() { wx.showToast({ title: '搜索功能开发中', icon: 'none' }); },

  onShareAppMessage() {
    return { title: '极氪专属自定义音效，让你的爱车与众不同', path: '/pages/community/community' };
  },

  onShareTimeline() {
    return { title: '极氪专属自定义音效，让你的爱车与众不同' };
  },
});
