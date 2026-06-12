// 自定义音效
Page({
  data: {
    categories: ['全部','乌萨奇','圣诞','小团团','开关门','懒羊羊','卡皮巴拉','哈士奇','蜡笔小新','来电音效','上车欢迎'],
    activeCat: '',
    sounds: [
      { id: 1,  title: '乌萨奇呀哈',   source: '小红书:乌萨奇',   carIcon: '🚗', duration: '00:02', code: 'SOUND001', cat: '乌萨奇' },
      { id: 2,  title: '小八乌拉呀哈', source: '小红书:乌萨奇',   carIcon: '🏎️', duration: '00:03', code: 'SOUND002', cat: '乌萨奇' },
      { id: 3,  title: '乌萨奇笑哈哈', source: '小红书:乌萨奇',   carIcon: '🚗', duration: '00:02', code: 'SOUND003', cat: '乌萨奇' },
      { id: 4,  title: '圣诞老人来了', source: '小红书:极氪车主',  carIcon: '🚙', duration: '00:05', code: 'SOUND010', cat: '圣诞' },
      { id: 5,  title: '铃儿响叮当',   source: '小红书:极氪车主',  carIcon: '🚗', duration: '00:08', code: 'SOUND011', cat: '圣诞' },
      { id: 6,  title: '小团团导航声', source: '车友分享',        carIcon: '🚐', duration: '00:04', code: 'SOUND020', cat: '小团团' },
      { id: 7,  title: '团团提醒系安全带', source: '车友分享',     carIcon: '🚗', duration: '00:03', code: 'SOUND021', cat: '小团团' },
      { id: 8,  title: '开门提示音-懒羊羊', source: '小红书:极氪001', carIcon: '🏎️', duration: '00:02', code: 'SOUND030', cat: '懒羊羊' },
      { id: 9,  title: '关门提示音-懒羊羊', source: '小红书:极氪001', carIcon: '🚗', duration: '00:02', code: 'SOUND031', cat: '懒羊羊' },
      { id: 10, title: '锁车声-卡皮巴拉',  source: '小红书:极氪007', carIcon: '🚗', duration: '00:03', code: 'SOUND040', cat: '卡皮巴拉' },
      { id: 11, title: '解锁声-卡皮巴拉',  source: '小红书:极氪007', carIcon: '🚗', duration: '00:03', code: 'SOUND041', cat: '卡皮巴拉' },
      { id: 12, title: '哈士奇开门声',     source: '车友分享',      carIcon: '🚙', duration: '00:03', code: 'SOUND050', cat: '哈士奇' },
      { id: 13, title: '蜡笔小新来电',     source: '小红书:极氪X',  carIcon: '🚙', duration: '00:06', code: 'SOUND060', cat: '蜡笔小新' },
      { id: 14, title: '小新说拜拜',       source: '小红书:极氪X',  carIcon: '🚙', duration: '00:04', code: 'SOUND061', cat: '蜡笔小新' },
      { id: 15, title: '极氪专属来电',     source: '极氪官方',      carIcon: '🏎️', duration: '00:04', code: 'SOUND070', cat: '来电音效' },
      { id: 16, title: '001FR赛道来电',    source: '极氪官方',      carIcon: '🏁', duration: '00:05', code: 'SOUND071', cat: '来电音效' },
      { id: 17, title: '开门声-开关门',    source: '车友分享',      carIcon: '🚗', duration: '00:01', code: 'SOUND080', cat: '开关门' },
      { id: 18, title: '欢迎上车-极氪',    source: '小红书:极氪009',carIcon: '🚐', duration: '00:06', code: 'SOUND090', cat: '上车欢迎' },
    ],
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
    const list = cat ? this.data.sounds.filter(s => s.cat === cat) : this.data.sounds;
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

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '极氪专属自定义音效，让你的爱车与众不同',
    };
  },
});
