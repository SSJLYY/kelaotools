// 用车小贴士
const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: {
    statusBarHeight: 20, navBarHeight: 44, navTotalHeight: 64,
    categories: ['全部','省电技巧','换季保养','胎压参考','电池养护'],
    activeCategory: '',
    tips: [
      {
        id: 1, title: '夏季空调省电技巧', category: '省电技巧',
        icon: '❄️', iconBg: '#DBEAFE',
        summary: '温度设在24-26°C，配合座椅通风更省电，续航提升约8%',
        tags: ['空调','省电','夏季'],
        content: '极氪全系车型均配备高效热泵空调。夏季使用空调时，建议将温度设置在24-26°C之间，同时开启座椅通风功能，相比单纯开空调可节省8%左右的电量。\n\n• 上车前通过极氪App远程开启空调预降温\n• 尽量使用内循环模式减少冷气流失\n• 停车时避免暴晒，使用遮阳帘\n• 座椅通风比空调更能快速降温',
      },
      {
        id: 2, title: '动能回收等级设置', category: '省电技巧',
        icon: '🔄', iconBg: '#D1FAE5',
        summary: '使用强动能回收模式，城市续航可提升15%-20%',
        tags: ['动能回收','续航','驾驶'],
        content: '极氪支持三级动能回收调节。在城市拥堵路况下，建议使用"强"回收模式，单踏板操作可减少刹车磨损并回收大量能量。\n\n• 城市通勤：动能回收"强"，续航+15-20%\n• 高速巡航：动能回收"中"或"弱"，减少拖拽感\n• 下坡路段：动能回收"强"，利用重力充电\n• 新手适应期：先从"弱"开始，逐步增加',
      },
      {
        id: 3, title: '胎压参考值', category: '胎压参考',
        icon: '🛞', iconBg: '#FEF3C7',
        summary: '极氪全系建议冷胎胎压 2.6-2.9 bar，定期检查保安全',
        tags: ['胎压','安全','全系'],
        content: '保持正确的胎压不仅能延长轮胎寿命，还能提升续航和行车安全。\n\n【各车型建议冷胎胎压】\n• ZEEKR 001：前2.6 / 后2.9 bar（半载）\n• ZEEKR 007：前2.5 / 后2.7 bar\n• ZEEKR X：前后 2.5 bar\n• ZEEKR 009：前2.3 / 后2.9 bar\n• ZEEKR MIX：前后 2.6 bar\n\n【检查频率】每月至少检查一次，长途出行前必查。\n\n【温馨提示】胎压过低会增加电耗约5-10%，过高则影响抓地力和舒适性。建议在冷态（停车3小时以上）时测量。',
      },
      {
        id: 4, title: '电池充电建议', category: '电池养护',
        icon: '🔋', iconBg: '#EDE9FE',
        summary: '日常充电至80%即可，长途出行前充至100%',
        tags: ['电池','充电','寿命'],
        content: '三元锂电池（001/007/X/009/MIX全系搭载）最佳使用区间为20%-80%。\n\n【日常使用】\n• 充电上限设置为80%，可延长电池寿命\n• 电量低于20%时及时充电\n• 避免长期电量低于10%\n\n【长途出行】\n• 出发前充至100%\n• 利用极氪APP导航规划沿途充电站\n• 快充至80%后速度下降，可拔枪出发\n\n【每月保养】\n• 每月至少进行一次慢充（交流充电）至100%\n• 有助于电池管理系统校准SOC',
      },
      {
        id: 5, title: '冬季用车指南', category: '换季保养',
        icon: '🌨️', iconBg: '#E0F2FE',
        summary: '冬季预热电池、调整胎压、关注玻璃水防冻',
        tags: ['冬季','电池','安全'],
        content: '冬季低温对电动车影响较大，做好以下几点让你的极氪安全过冬：\n\n• 出发前通过APP远程开启电池预热（10-15分钟）\n• 冬季续航下降属正常现象，预计下降15-25%\n• 检查玻璃水是否为防冻型（-30°C）\n• 关注胎压变化，低温会导致胎压下降\n• 使用座椅加热和方向盘加热代替空调暖风更省电\n• 001 FR在冬季需注意轮胎温度，半热熔胎低温性能下降',
      },
      {
        id: 6, title: '雨刮器保养', category: '换季保养',
        icon: '🌧️', iconBg: '#DBEAFE',
        summary: '每季度检查雨刮器，及时更换老化胶条',
        tags: ['雨刮','保养','安全'],
        content: '雨刮器是影响雨天行车安全的关键部件，建议每6-12个月更换一次。\n\n【更换周期】\n• 前雨刮器：6-12个月\n• 后雨刮器：12-24个月\n\n【老化信号】\n• 刮拭时有异响或跳动\n• 玻璃上出现水痕或条纹\n• 胶条出现裂纹或硬化\n\n【使用技巧】\n• 冬季结冰时不要强行启动雨刮\n• 定期用湿布清洁胶条\n• 停车时将雨刮立起避免粘连',
      },
      {
        id: 7, title: '刹车系统检查', category: '换季保养',
        icon: '🛑', iconBg: '#FEE2E2',
        summary: '电动车刹车磨损慢但不可忽视，建议每年检查一次',
        tags: ['刹车','安全','保养'],
        content: '由于动能回收系统的存在，极氪的机械刹车使用频率远低于燃油车，但定期检查仍不可忽视。\n\n【检查频率】\n• 每年或每2万公里检查刹车片厚度\n• 每2年更换刹车油\n\n【异常信号】\n• 制动时方向盘抖动\n• 刹车踏板行程变长\n• 制动时有尖锐异响\n• 仪表盘显示制动系统警告\n\n【温馨提示】建议利用保养机会同时检查，极氪服务中心可进行专业检测。',
      },
      {
        id: 8, title: 'OTA升级指引', category: '电池养护',
        icon: '📡', iconBg: '#F3E8FF',
        summary: '保持车机系统最新，每次OTA升级都将优化电池管理和续航',
        tags: ['OTA','系统','续航'],
        content: '极氪定期推送OTA空中升级，涵盖电池管理、智能驾驶、车机交互等多方面优化。\n\n【升级前】\n• 确保电量≥20%并连接充电枪\n• 车辆停放在信号良好的地方\n• 升级包下载需约30分钟\n\n【升级中】\n• 请勿驾驶或操作车辆\n• 屏幕会显示升级进度\n• 部分功能暂时不可用属正常\n\n【升级后】\n• 建议重启车机一次\n• 检查常用功能是否正常\n• 关注极氪App的更新说明',
      },
    ],
  },

  onLoad() { this.initNavBar(); },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  get filteredTips() {
    const cat = this.data.activeCategory;
    if (!cat) return this.data.tips;
    return this.data.tips.filter(t => t.category === cat);
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

  onShow() {
    this.updateFiltered();
  },

  onTipTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/tips-detail/tips-detail?id=${id}` });
  },

  onBack() { wx.navigateBack(); },
});
