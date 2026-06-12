// 智慧场景码 - 极氪场景码列表
const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    // 分类
    categories: ['全部','功能','充电', '娱乐','迎宾','开关门','换挡','车型'],
    activeCategory: '',

    // 搜索
    searchText: '',
    loading: false,

    // 场景码数据
    sceneList: [
      { id: 1,  title: '一键舒适模式',    desc: '驾驶模式自动切换为舒适，悬挂调软，方向盘轻盈', tags: ['功能','驾驶'], code: 'SCENE001' },
      { id: 2,  title: '极氪运动模式',    desc: '动力响应更灵敏，悬挂变硬，适合激烈驾驶',  tags: ['功能','驾驶'], code: 'SCENE002' },
      { id: 3,  title: '长途出行模式',    desc: '自动调节座椅按摩、空调温度、音乐音量',    tags: ['功能','舒适'], code: 'SCENE003' },
      { id: 4,  title: '午休模式',        desc: '主驾座椅放平，空调恒温24°，播放白噪音',  tags: ['功能','舒适'], code: 'SCENE004' },
      { id: 5,  title: '充电快捷入口',    desc: '一键打开充电地图，显示附近可用充电桩',   tags: ['充电','导航'], code: 'SCENE010' },
      { id: 6,  title: '家充预约模式',    desc: '自动设置充电上限80%，启用谷电时段充电',   tags: ['充电','节能'], code: 'SCENE011' },
      { id: 7,  title: '快充准备模式',    desc: '自动预热电池至最佳充电温度，提升充电速度', tags: ['充电','电池'], code: 'SCENE012' },
      { id: 8,  title: '车载KTV模式',      desc: '自动调节氛围灯、音响均衡器，打开唱吧App',  tags: ['娱乐','灯光'], code: 'SCENE020' },
      { id: 9,  title: '影院模式',        desc: '熄屏、氛围灯调暗、座椅后仰、空调静音',    tags: ['娱乐','灯光'], code: 'SCENE021' },
      { id: 10, title: '露营模式',        desc: '外放电开启、车内恒温、氛围灯调为暖色',    tags: ['娱乐','户外'], code: 'SCENE022' },
      { id: 11, title: '迎宾灯语',        desc: '解锁车辆时，大灯和尾灯流水点亮，氛围灯渐亮', tags: ['迎宾','灯光'], code: 'SCENE030' },
      { id: 12, title: '回家灯光秀',      desc: '锁车后大灯延时30秒关闭，照亮回家路',      tags: ['迎宾','灯光'], code: 'SCENE031' },
      { id: 13, title: '上车欢迎语',      desc: '开门时播放自定义音效，中控屏显示欢迎动画',  tags: ['迎宾','音效'], code: 'SCENE032' },
      { id: 14, title: '离车自动锁车',    desc: '携带钥匙离开3米自动锁车，关窗折后视镜',    tags: ['开关门','安全'], code: 'SCENE040' },
      { id: 15, title: '靠近自动解锁',    desc: '携带钥匙靠近1米自动解锁，展开后视镜',      tags: ['开关门','便利'], code: 'SCENE041' },
      { id: 16, title: '儿童锁模式',      desc: '后排车窗锁定、儿童锁开启、空调锁定22°',    tags: ['开关门','安全'], code: 'SCENE042' },
      { id: 17, title: 'D挡自动驻车',    desc: '挂D挡时自动启用Auto Hold，防止溜车',      tags: ['换挡','安全'], code: 'SCENE050' },
      { id: 18, title: 'R挡360°影像',    desc: '挂R挡自动打开360°全景影像+透明底盘',      tags: ['换挡','影像'], code: 'SCENE051' },
      { id: 19, title: 'P挡自动手刹',    desc: '挂P挡自动拉手刹，无需手动操作电子手刹',    tags: ['换挡','便利'], code: 'SCENE052' },
      { id: 20, title: '雪地起步模式',    desc: '极氪001专享：降低扭矩输出，避免起步打滑',  tags: ['功能','安全'], code: 'SCENE060' },
      { id: 21, title: '极氪001赛道主题', desc: '切换运动驾驶氛围，仪表主题、氛围灯与驾驶提醒同步进入性能状态', tags: ['车型','功能'], code: '72221053' },
      { id: 22, title: '极氪001猎装露营', desc: '开启外放电提醒、后备箱照明、露营氛围灯和低风量恒温', tags: ['车型','娱乐'], code: '72221054' },
      { id: 23, title: '极氪007通勤模式', desc: '上班通勤自动设置导航偏好、座椅加热/通风和舒适驾驶模式', tags: ['车型','功能'], code: '72221007' },
      { id: 24, title: '极氪007哨兵提醒', desc: '停车后提醒开启安全看护，异常震动与电量状态及时提示', tags: ['车型','功能'], code: '72221008' },
      { id: 25, title: '极氪009贵宾迎宾', desc: '二排座椅、空调、香氛和迎宾灯效联动，适合商务接待', tags: ['车型','迎宾'], code: '72221009' },
      { id: 26, title: '极氪009亲子出行', desc: '儿童锁、后排空调、舒缓音乐和车内照明一键切换亲子模式', tags: ['车型','开关门'], code: '72221010' },
      { id: 27, title: '极氪X城市灵动', desc: '窄路会车、低速跟车和轻盈转向提醒，适合城市短途穿行', tags: ['车型','功能'], code: '72221011' },
      { id: 28, title: '极氪X宠物守护', desc: '临停时保持适宜温度并显示宠物提示，提醒车主注意电量', tags: ['车型','娱乐'], code: '72221012' },
      { id: 29, title: '极氪7X家庭远行', desc: '长途导航、电量规划、后排舒适和儿童安全提醒联动', tags: ['车型','充电'], code: '72221013' },
      { id: 30, title: '极氪MIX派对模式', desc: '车内灯光、音乐和空间布局提示联动，适合朋友聚会氛围', tags: ['车型','娱乐'], code: '72221014' },
    ],
    filteredList: [],
    filterSignature: '',
  },

  onLoad() {
    this.setData({
      ...getNavBarInfo(),
      filteredList: this.data.sceneList,
      filterSignature: '__',
    });
  },

  initNavBar() {
    this.setData(getNavBarInfo());
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
