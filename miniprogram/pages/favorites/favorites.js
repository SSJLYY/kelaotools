const { getNavBarInfo } = require('../../utils/nav');

const SCENES = [
  { id: 1, title: '一键舒适模式', desc: '驾驶模式自动切换为舒适，悬挂调软，方向盘轻盈', code: 'SCENE001', tags: ['功能','驾驶'] },
  { id: 2, title: '极氪运动模式', desc: '动力响应更灵敏，悬挂变硬，适合激烈驾驶', code: 'SCENE002', tags: ['功能','驾驶'] },
  { id: 3, title: '长途出行模式', desc: '自动调节座椅按摩、空调温度、音乐音量', code: 'SCENE003', tags: ['功能','舒适'] },
  { id: 4, title: '午休模式', desc: '主驾座椅放平，空调恒温24°，播放白噪音', code: 'SCENE004', tags: ['功能','舒适'] },
  { id: 5, title: '充电快捷入口', desc: '一键打开充电地图，显示附近可用充电桩', code: 'SCENE010', tags: ['充电','导航'] },
  { id: 6, title: '家充预约模式', desc: '自动设置充电上限80%，启用谷电时段充电', code: 'SCENE011', tags: ['充电','节能'] },
  { id: 7, title: '快充准备模式', desc: '自动预热电池至最佳充电温度，提升充电速度', code: 'SCENE012', tags: ['充电','电池'] },
  { id: 8, title: '车载KTV模式', desc: '自动调节氛围灯、音响均衡器，打开唱吧App', code: 'SCENE020', tags: ['娱乐','灯光'] },
  { id: 9, title: '影院模式', desc: '熄屏、氛围灯调暗、座椅后仰、空调静音', code: 'SCENE021', tags: ['娱乐','灯光'] },
  { id: 10, title: '露营模式', desc: '外放电开启、车内恒温、氛围灯调为暖色', code: 'SCENE022', tags: ['娱乐','户外'] },
  { id: 11, title: '迎宾灯语', desc: '解锁车辆时矩阵大灯流水点亮、尾灯呼吸、车内氛围灯渐亮', code: 'SCENE030', tags: ['迎宾','灯光'] },
  { id: 12, title: '回家灯光秀', desc: '锁车后矩阵大灯延时关闭，照亮回家路', code: 'SCENE031', tags: ['迎宾','灯光'] },
  { id: 13, title: '上车欢迎语', desc: '开门时播放自定义音效，中控屏显示问候语和天气信息', code: 'SCENE032', tags: ['迎宾','音效'] },
  { id: 14, title: '离车自动锁车', desc: '携带蓝牙钥匙离开车辆后自动锁车并折叠后视镜', code: 'SCENE040', tags: ['开关门','安全'] },
  { id: 15, title: '靠近自动解锁', desc: '携带钥匙靠近车辆自动解锁，后视镜展开并弹出门把手', code: 'SCENE041', tags: ['开关门','便利'] },
  { id: 16, title: '儿童锁模式', desc: '后排车窗锁定、儿童锁开启、后排空调切换适宜温度', code: 'SCENE042', tags: ['开关门','安全'] },
  { id: 17, title: 'D挡自动驻车', desc: '挂入D挡时自动启用Auto Hold，等灯更从容', code: 'SCENE050', tags: ['换挡','安全'] },
  { id: 18, title: 'R挡360°影像', desc: '挂入R挡自动打开360°全景影像和透明底盘', code: 'SCENE051', tags: ['换挡','影像'] },
  { id: 19, title: 'P挡自动手刹', desc: '挂入P挡自动拉起电子手刹，下车无需额外操作', code: 'SCENE052', tags: ['换挡','便利'] },
  { id: 20, title: '雪地起步模式', desc: '降低电机扭矩输出斜率，优化雪地起步稳定性', code: 'SCENE060', tags: ['功能','安全'] },
  { id: 21, title: '极氪001赛道主题', desc: '切换运动驾驶氛围，仪表主题、氛围灯与驾驶提醒同步进入性能状态', code: '72221053', tags: ['车型','功能'] },
  { id: 22, title: '极氪001猎装露营', desc: '开启外放电提醒、后备箱照明、露营氛围灯和低风量恒温', code: '72221054', tags: ['车型','娱乐'] },
  { id: 23, title: '极氪007通勤模式', desc: '上班通勤自动设置导航偏好、座椅加热/通风和舒适驾驶模式', code: '72221007', tags: ['车型','功能'] },
  { id: 24, title: '极氪007哨兵提醒', desc: '停车后提醒开启安全看护，异常震动与电量状态及时提示', code: '72221008', tags: ['车型','功能'] },
  { id: 25, title: '极氪009贵宾迎宾', desc: '二排座椅、空调、香氛和迎宾灯效联动', code: '72221009', tags: ['车型','迎宾'] },
  { id: 26, title: '极氪009亲子出行', desc: '儿童锁、后排空调、舒缓音乐和车内照明一键切换', code: '72221010', tags: ['车型','开关门'] },
  { id: 27, title: '极氪X城市灵动', desc: '窄路会车、低速跟车和轻盈转向提醒', code: '72221011', tags: ['车型','功能'] },
  { id: 28, title: '极氪X宠物守护', desc: '临停时保持适宜温度并显示宠物提示', code: '72221012', tags: ['车型','娱乐'] },
  { id: 29, title: '极氪7X家庭远行', desc: '长途导航、电量规划、后排舒适和儿童安全提醒联动', code: '72221013', tags: ['车型','充电'] },
  { id: 30, title: '极氪MIX派对模式', desc: '车内灯光、音乐和空间布局提示联动', code: '72221014', tags: ['车型','娱乐'] },
];

const SOUNDS = [
  { id: 1, title: '乌萨奇呀哈', desc: '小红书:乌萨奇', code: 'SOUND001', cat: '乌萨奇' },
  { id: 2, title: '小八乌拉呀哈', desc: '小红书:乌萨奇', code: 'SOUND002', cat: '乌萨奇' },
  { id: 3, title: '乌萨奇笑哈哈', desc: '小红书:乌萨奇', code: 'SOUND003', cat: '乌萨奇' },
  { id: 4, title: '圣诞老人来了', desc: '小红书:极氪车主', code: 'SOUND010', cat: '圣诞' },
  { id: 5, title: '铃儿响叮当', desc: '小红书:极氪车主', code: 'SOUND011', cat: '圣诞' },
  { id: 6, title: '小团团导航声', desc: '车友分享', code: 'SOUND020', cat: '小团团' },
  { id: 7, title: '团团提醒系安全带', desc: '车友分享', code: 'SOUND021', cat: '小团团' },
  { id: 8, title: '开门提示音-懒羊羊', desc: '小红书:极氪001', code: 'SOUND030', cat: '懒羊羊' },
  { id: 9, title: '关门提示音-懒羊羊', desc: '小红书:极氪001', code: 'SOUND031', cat: '懒羊羊' },
  { id: 10, title: '锁车声-卡皮巴拉', desc: '小红书:极氪007', code: 'SOUND040', cat: '卡皮巴拉' },
  { id: 11, title: '解锁声-卡皮巴拉', desc: '小红书:极氪007', code: 'SOUND041', cat: '卡皮巴拉' },
  { id: 12, title: '哈士奇开门声', desc: '车友分享', code: 'SOUND050', cat: '哈士奇' },
  { id: 13, title: '蜡笔小新来电', desc: '小红书:极氪X', code: 'SOUND060', cat: '蜡笔小新' },
  { id: 14, title: '小新说拜拜', desc: '小红书:极氪X', code: 'SOUND061', cat: '蜡笔小新' },
  { id: 15, title: '极氪专属来电', desc: '极氪官方', code: 'SOUND070', cat: '来电音效' },
  { id: 16, title: '001FR赛道来电', desc: '极氪官方', code: 'SOUND071', cat: '来电音效' },
  { id: 17, title: '开门声-开关门', desc: '车友分享', code: 'SOUND080', cat: '开关门' },
  { id: 18, title: '欢迎上车-极氪', desc: '小红书:极氪009', code: 'SOUND090', cat: '上车欢迎' },
];

Page({
  data: {
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

  onLoad() {
    this.setData(getNavBarInfo());
  },

  onShow() {
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
