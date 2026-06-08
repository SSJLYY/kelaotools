// 场景码详情
const { getNavBarInfo } = require('../../../utils/nav');

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    isFaved: false,
    scene: {
      id: 0,
      title: '',
      desc: '',
      tags: [],
      code: '',
    },
  },

  onLoad(options) {
    this.initNavBar();
    const id = parseInt(options.id) || 1;
    this.loadScene(id);
    this.checkFav(id);
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  loadScene(id) {
    // 模拟数据（实际应从云数据库或配置加载）
    const scenes = [
      { id: 1,  title: '一键舒适模式',    desc: '驾驶模式自动切换为舒适，悬挂调软，方向盘轻盈，适合城市通勤', tags: ['功能','驾驶'], code: 'SCENE001' },
      { id: 2,  title: '极氪运动模式',    desc: '动力响应更灵敏，悬挂变硬，转向更精准，适合激烈驾驶场景',  tags: ['功能','驾驶'], code: 'SCENE002' },
      { id: 3,  title: '长途出行模式',    desc: '自动调节座椅按摩、空调温度24°、播放轻音乐，打造舒适长途体验',  tags: ['功能','舒适'], code: 'SCENE003' },
      { id: 4,  title: '午休模式',        desc: '主驾座椅放平至140°，空调恒温24°，播放白噪音，定时45分钟',  tags: ['功能','舒适'], code: 'SCENE004' },
      { id: 5,  title: '充电快捷入口',    desc: '一键打开充电地图，自动筛选极氪自营+合作充电站，显示实时空闲桩数', tags: ['充电','导航'], code: 'SCENE010' },
      { id: 6,  title: '家充预约模式',    desc: '自动设置充电上限80%，启用谷电时段(22:00-06:00)充电，每度电低至0.3元', tags: ['充电','节能'], code: 'SCENE011' },
      { id: 7,  title: '快充准备模式',    desc: '导航至快充站途中自动预热电池至35°C最佳充电温度，提升充电速度30%', tags: ['充电','电池'], code: 'SCENE012' },
      { id: 8,  title: '车载KTV模式',      desc: '自动切换氛围灯为律动模式、调校音响均衡器为K歌模式、打开雷石KTV',  tags: ['娱乐','灯光'], code: 'SCENE020' },
      { id: 9,  title: '影院模式',        desc: '中控屏亮度降至20%、氛围灯关闭、主驾座椅后仰、空调切换静音模式', tags: ['娱乐','灯光'], code: 'SCENE021' },
      { id: 10, title: '露营模式',        desc: 'V2L外放电功能开启、车内恒温22°、氛围灯切换为暖橙色、天窗关闭', tags: ['娱乐','户外'], code: 'SCENE022' },
      { id: 11, title: '迎宾灯语',        desc: '解锁车辆时矩阵大灯流水点亮、贯穿式尾灯呼吸效果、车内氛围灯渐亮', tags: ['迎宾','灯光'], code: 'SCENE030' },
      { id: 12, title: '回家灯光秀',      desc: '锁车后矩阵大灯延时30秒关闭，照亮回家路，贯穿尾灯渐暗关闭',      tags: ['迎宾','灯光'], code: 'SCENE031' },
      { id: 13, title: '上车欢迎语',      desc: '开门时播放自定义极氪专属音效，中控屏显示问候语+天气信息',      tags: ['迎宾','音效'], code: 'SCENE032' },
      { id: 14, title: '离车自动锁车',    desc: '携带蓝牙钥匙离开车辆3米自动锁车，车窗关闭+后视镜折叠',       tags: ['开关门','安全'], code: 'SCENE040' },
      { id: 15, title: '靠近自动解锁',    desc: '携带钥匙靠近车辆1米自动解锁，后视镜展开+门把手弹出',          tags: ['开关门','便利'], code: 'SCENE041' },
      { id: 16, title: '儿童锁模式',      desc: '后排车窗锁定、车门儿童锁开启、后排空调锁定22°适宜温度',       tags: ['开关门','安全'], code: 'SCENE042' },
      { id: 17, title: 'D挡自动驻车',    desc: '挂入D挡时自动启用Auto Hold功能，红绿灯停车时无需持续踩刹车',   tags: ['换挡','安全'], code: 'SCENE050' },
      { id: 18, title: 'R挡360°影像',    desc: '挂入R挡自动打开360°全景影像+透明底盘，无死角观察周围环境',    tags: ['换挡','影像'], code: 'SCENE051' },
      { id: 19, title: 'P挡自动手刹',    desc: '挂入P挡自动拉起电子手刹，无需额外手动操作，下车更从容',        tags: ['换挡','便利'], code: 'SCENE052' },
      { id: 20, title: '雪地起步模式',    desc: '极氪001专享：降低电机扭矩输出斜率，优化ESP介入逻辑，避免雪地起步打滑', tags: ['功能','安全'], code: 'SCENE060' },
      { id: 21, title: '极氪001赛道主题', desc: '切换运动驾驶氛围，仪表主题、氛围灯与驾驶提醒同步进入性能状态，适合封闭道路体验或赛道日氛围', tags: ['车型','功能'], code: '72221053' },
      { id: 22, title: '极氪001猎装露营', desc: '开启外放电提醒、后备箱照明、露营氛围灯和低风量恒温，适合户外休息和轻露营场景', tags: ['车型','娱乐'], code: '72221054' },
      { id: 23, title: '极氪007通勤模式', desc: '上班通勤自动设置导航偏好、座椅加热/通风和舒适驾驶模式，减少每日重复设置', tags: ['车型','功能'], code: '72221007' },
      { id: 24, title: '极氪007哨兵提醒', desc: '停车后提醒开启安全看护，异常震动与电量状态及时提示，适合地库或临停场景', tags: ['车型','功能'], code: '72221008' },
      { id: 25, title: '极氪009贵宾迎宾', desc: '二排座椅、空调、香氛和迎宾灯效联动，提前营造商务接待或家庭贵宾乘坐氛围', tags: ['车型','迎宾'], code: '72221009' },
      { id: 26, title: '极氪009亲子出行', desc: '儿童锁、后排空调、舒缓音乐和车内照明一键切换亲子模式，适合带娃长短途出行', tags: ['车型','开关门'], code: '72221010' },
      { id: 27, title: '极氪X城市灵动', desc: '窄路会车、低速跟车和轻盈转向提醒，适合城市短途穿行和拥堵路况', tags: ['车型','功能'], code: '72221011' },
      { id: 28, title: '极氪X宠物守护', desc: '临停时保持适宜温度并显示宠物提示，提醒车主注意电量与离车时长', tags: ['车型','娱乐'], code: '72221012' },
      { id: 29, title: '极氪7X家庭远行', desc: '长途导航、电量规划、后排舒适和儿童安全提醒联动，适合家庭周末或假期出行', tags: ['车型','充电'], code: '72221013' },
      { id: 30, title: '极氪MIX派对模式', desc: '车内灯光、音乐和空间布局提示联动，适合朋友聚会、露营驻车和休闲氛围', tags: ['车型','娱乐'], code: '72221014' },
    ];
    const scene = scenes.find(s => s.id === id) || scenes[0];
    this.setData({ scene });
  },

  checkFav(id) {
    try {
      const favs = wx.getStorageSync('kt_fav_scenes') || [];
      this.setData({ isFaved: favs.some(item => Number(item && typeof item === 'object' ? item.id : item) === Number(id)) });
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

  onBack() { wx.navigateBack(); },

  onShareAppMessage() {
    return {
      title: `极氪智慧场景码: ${this.data.scene.title}`,
      path: `/subpkg/charging-calc/scene-code/scene-code?id=${this.data.scene.id}`,
    };
  },
});
