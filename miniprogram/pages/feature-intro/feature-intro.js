const { getNavBarInfo } = require('../../utils/nav');

const FEATURES = [
  {
    icon: '🎯', title: '智慧场景码', action: '去看看', path: '/pages/tools/tools', tab: true,
    desc: '一键复制场景码去车机搜索添加，覆盖通勤、露营、亲子等几十种实用场景。云端同步更新，持续扩充。',
    tags: ['分类搜索快速查找', '一键复制场景分享码', '收藏常用场景码', '云端内容实时更新'],
  },
  {
    icon: '🎵', title: '自定义音效', action: '去看看', path: '/pages/community/community', tab: true,
    desc: '精选音效包，支持分类筛选、在线试听、一键复制下载链接，方便导入车机使用。',
    tags: ['在线试听即时播放', '分类筛选快速定位', '复制链接去车机导入', '支持分享给其他朋友'],
  },
  {
    icon: '💡', title: '用车小贴士', action: '去学习', path: '/pages/tips/tips',
    desc: '省电技巧、换季保养、胎压参考、充电技巧、智能驾驶等实用用车知识，新老朋友都能学到东西。',
    tags: ['丰富用车知识库', '省电与驾驶技巧', '换季保养指南', '智能驾驶使用教程'],
  },
  {
    icon: '⚡', title: '充电记录', action: '开始记录', path: '/subpkg/charging-log/charging-log/charging-log',
    desc: '极简记录每次充电费用和渠道，自动同步到养车账本。支持多平台来源和月度费用趋势。',
    tags: ['极简填写只记费用', '自动同步养车账本', '多渠道分类统计', '月度费用趋势图表'],
  },
  {
    icon: '📒', title: '养车账本', action: '开始记录', path: '/subpkg/maintenance/maintenance-ledger/maintenance-ledger',
    desc: '停车费、过路费、洗车费、保养、保险、维修等全部支出统一管理。月度一目了然。',
    tags: ['多类型支出分类记录', '充电费用自动汇入', '月度/年度统计分析', '预算提醒防超支'],
  },
  {
    icon: '🚗', title: '顺风车收入', action: '开始记录', path: '/subpkg/ride-log/carpool-revenue/carpool-revenue',
    desc: '记录高德、滴滴、哈啰等平台的顺风车接单收入，通勤分摊路费，闲时跑单赚外快。',
    tags: ['多平台收入记录', '收入趋势分析', '行程详情随时查看', '收入统计汇总'],
  },
  {
    icon: '🅿️', title: '停车场到期提醒', action: '去管理', path: '/subpkg/maintenance/parking-reminder/parking-reminder',
    desc: '记录月卡年卡起止日期和费用，到期前自动提醒续费。数据实时同步云端，换设备也不丢。',
    tags: ['停车场信息管理', '到期日前自动提醒', '费用自动记录统计', '云端同步数据安全'],
  },
  {
    icon: '🏦', title: '车贷计算与管理', action: '去计算', path: '/subpkg/ride-log/loan-calc/loan-calc',
    desc: '等额本息精准月供计算，支持部分免息期、自定义利率。还款进度实时追踪，到期日前自动提醒。',
    tags: ['月供精准计算含免息', '还款进度一目了然', '到期日自动提醒', '多年车贷分别管理'],
  },
  {
    icon: '🧮', title: '充电费用计算', action: '去计算', path: '/subpkg/charging-calc/charging-cost/charging-cost',
    desc: '充电前先算一笔账，输入电量单价快速估算费用。支持充电损耗计算，计算结果可保存为快捷预设。',
    tags: ['快速估算充电费用', '电价预设一键填充', '充电损耗可选', '计算历史记录可查'],
  },
  {
    icon: '⛽', title: '电耗油耗计算', action: '去计算', path: '/subpkg/ride-log/consumption/consumption',
    desc: '纯电 vs 增程用车成本对比，输入里程和能耗数据，秒算每公里花费，帮你做最经济的选择。',
    tags: ['电耗与油耗实时对比', '每公里成本精确计算', '纯电/增程场景切换'],
  },
  {
    icon: '🚘', title: '车辆信息管理', action: '去查看', path: '/subpkg/maintenance/vehicle-info/vehicle-info',
    desc: '查看已绑定车辆的车型、年款、颜色和参数信息，快速关联到账本、停车和顺风车记录。',
    tags: ['车型参数详情查看', '车辆信息统一维护', '关联记录自动带入'],
  },
  {
    icon: '🚙', title: '多车辆管理', action: '去管理', path: '/pages/my-car/my-car',
    desc: '添加多辆车，查看车型参数和电池详情。自动匹配对应场景码和音效，管理更智能。',
    tags: ['多辆极氪车型管理', '车型参数详情查看', '数据云端同步备份'],
  },
  {
    icon: '📊', title: '数据统计总览', action: '去查看', path: '/pages/index/index', tab: true,
    desc: '年度充电、养车、顺风车费用汇总分析。图表直观展示支出构成，智能洞察帮你优化用车成本。',
    tags: ['年度支出汇总对比', '分类费用统计分析', '趋势图表直观展示', '智能成本优化建议'],
  },
  {
    icon: '⭐', title: '我的收藏', action: '去查看', path: '/pages/favorites/favorites',
    desc: '常用场景码和音效一键收藏，云端同步永不丢失。管理新增内容也会自动出现在收藏页。',
    tags: ['场景码一键收藏', '音效快速收藏', '云端同步数据不丢', '收藏内容直接跳转'],
  },
  {
    icon: '⚡', title: '充电桩收藏', action: '去使用', path: '/pages/charging-station/charging-station',
    desc: '记录常用充电站品牌、速度、电价和地址，方便比价选择最优充电站。',
    tags: ['充电站收藏', '品牌筛选', '地址复制', '比价'],
  },
  {
    icon: '🚿', title: '洗车日记', action: '去使用', path: '/pages/car-wash/car-wash',
    desc: '记录每次洗车方式和花费，自动同步到养车账本，洗车花费一目了然。',
    tags: ['洗车记录', '自动同步', '养车账本', '费用统计'],
  },
  {
    icon: '🏎️', title: '改装与配件', action: '去使用', path: '/pages/modification/modification',
    desc: '记录配件购买和改装项目，花费自动写入养车账本，改装投入清清楚楚。',
    tags: ['改装记录', '配件购买', '自动同步', '分类管理'],
  },
  {
    icon: '📋', title: '提车指南', action: '去使用', path: '/pages/driving-guide/driving-guide',
    desc: '28项检查清单，涵盖外观、内饰、功能、电池、文件、随车物品，提车照着走一遍不踩坑。',
    tags: ['提车检查', '28项清单', '逐项勾选', '进度显示'],
  },
  {
    icon: '🗓️', title: '用车日历', action: '去使用', path: '/pages/index/index', tab: true,
    desc: '车贷还款、停车场到期、月度预算等提醒一目了然，重要日期不错过。',
    tags: ['车贷还款提醒', '停车场到期提醒', '预算告警通知', '自定义开关控制'],
  },
  {
    icon: '⚙️', title: '首页工具自定义', action: '去设置', path: '/pages/profile/profile',
    desc: '在设置里自定义首页显示的常用工具，把最常用的功能排到前面。',
    tags: ['工具排序自定义', '常用工具优先', '显示/隐藏控制', '首页同步更新'],
  },
  {
    icon: '🛣️', title: '里程记录', action: '去记录', path: '/pages/mileage-log/mileage-log',
    desc: '记录每次出行里程和能耗，形成用车习惯画像，掌握每公里成本。',
    tags: ['出行里程记录', '能耗数据追踪', '百公里能耗计算', '出行类型分类'],
  },
  {
    icon: '🔧', title: '保养提醒', action: '去设置', path: '/pages/maintenance-reminder/maintenance-reminder',
    desc: '根据里程/时间自动提醒保养，再也不错过保养时间。',
    tags: ['保养时间提醒', '保养里程提醒', '已完成标记', '紧急状态显示'],
  },
  {
    icon: '📊', title: '月度报告', action: '去查看', path: '/pages/monthly-report/monthly-report',
    desc: '每月自动生成用车报告，充电、里程、支出一目了然，支持分享给车友。',
    tags: ['月度用车报告', '充电里程统计', '支出分类明细', '一键分享车友'],
  },
  {
    icon: '📤', title: '数据导出', action: '去导出', path: '/pages/data-export/data-export',
    desc: '导出充电、里程、养车等数据为CSV格式，方便报销或换车时迁移。',
    tags: ['CSV格式导出', '多类型数据', '日期范围选择', 'Excel可打开'],
  },
  {
    icon: '🌙', title: '深色模式', action: '去设置', path: '/pages/profile/profile',
    desc: '深色模式让夜间用车更舒适，减少屏幕亮度对眼睛的刺激。',
    tags: ['护眼模式', '夜间友好', '一键切换', '全局适配'],
  },
  {
    icon: '⚡', title: '电价走势', action: '去查看', path: '/pages/price-trend/price-trend',
    desc: '24小时电价走势图，帮你选择最佳充电时间，省电又省钱。',
    tags: ['24小时电价', '峰谷时段', '省电技巧', '充电建议'],
  },
  {
    icon: '⭐', title: '充电站评价', action: '去评价', path: '/pages/station-review/station-review',
    desc: '给充电站打分+评价，分享充电体验，帮助其他车友选择。',
    tags: ['充电站评分', '用户体验', '充电速度', '环境评价'],
  },
  {
    icon: '💬', title: '车主社区', action: '去逛逛', path: '/pages/car-community/car-community',
    desc: '轻量化社区，分享用车心得、经验交流、爱车晒单。',
    tags: ['用车心得', '经验分享', '提问求助', '爱车晒单'],
  },
];

Page({
  data: { darkMode: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    features: FEATURES,
  },

  onLoad() { this.loadDarkMode();
    this.setData(getNavBarInfo());
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/mine/mine' }) });
  },

  onFeatureTap(e) {
    const item = this.data.features[e.currentTarget.dataset.index];
    if (!item || !item.path) return;
    if (item.tab) {
      wx.switchTab({ url: item.path });
      return;
    }
    wx.navigateTo({ url: item.path });
  },
});
