// 电价走势
const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    activeTab: 'electricity',
    tabs: [
      { key: 'electricity', name: '电价走势' },
      { key: 'tips', name: '省电技巧' },
    ],

    // 电价数据
    currentPrice: 0.65,
    peakPrice: 1.2,
    valleyPrice: 0.35,
    peakHours: '10:00-14:00, 18:00-22:00',
    valleyHours: '23:00-07:00',

    // 24小时电价趋势
    hourlyPrices: [],

    // 省电技巧
    tips: [
      {
        title: '谷电充电最省钱',
        icon: '💰',
        desc: '晚上11点到早上7点是谷电时段，电价仅为峰电的1/3',
      },
      {
        title: '避开高峰期',
        icon: '⏰',
        desc: '工作日10-14点、18-22点是用电高峰，电价最高',
      },
      {
        title: '周末充电更便宜',
        icon: '📅',
        desc: '周末部分时段有优惠，建议关注各平台活动',
      },
      {
        title: '使用预约充电',
        icon: '📱',
        desc: '设置车辆预约充电，自动在谷电时段开始充电',
      },
      {
        title: '关注充电平台优惠',
        icon: '🎫',
        desc: '各平台经常有满减、折扣券，充电前记得领取',
      },
      {
        title: '保持电池温度',
        icon: '🌡️',
        desc: '冬季充电前预热电池，可提高充电效率，减少损耗',
      },
    ],
  },

  onLoad() {
    this.setData(getNavBarInfo());
    this.generateHourlyPrices();
  },

  generateHourlyPrices() {
    const basePrice = 0.65;
    const hourlyPrices = [];

    for (let hour = 0; hour < 24; hour++) {
      let price = basePrice;
      let type = 'normal';

      // 谷电时段 23:00-07:00
      if (hour >= 23 || hour < 7) {
        price = 0.35;
        type = 'valley';
      }
      // 峰电时段 10:00-14:00, 18:00-22:00
      else if ((hour >= 10 && hour < 14) || (hour >= 18 && hour < 22)) {
        price = 1.2;
        type = 'peak';
      }
      // 平电时段
      else {
        price = 0.65;
        type = 'normal';
      }

      hourlyPrices.push({
        hour: `${String(hour).padStart(2, '0')}:00`,
        price: price.toFixed(2),
        percent: Math.round((price / 1.2) * 100),
        type,
      });
    }

    this.setData({ hourlyPrices });
  },

  onTabChange(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) });
  },

  onShareAppMessage() {
    return {
      title: '电价走势 - 掌握最佳充电时间',
      path: '/pages/price-trend/price-trend',
    };
  },

  onShareTimeline() {
    return {
      title: '电价走势 - 掌握最佳充电时间',
    };
  },
});
