// utils/const.js
// 常量定义

module.exports = {
  // 存储 Key 前缀
  STORAGE_PREFIX: 'kt_',

  // 页面路径
  PAGES: {
    INDEX: '/pages/index/index',
    TOOLS: '/pages/tools/tools',
    COMMUNITY: '/pages/community/community',
    MINE: '/pages/mine/mine',
  },

  // 工具路径
  TOOLS: {
    CHARGING_COST: '/subpkg/charging-calc/charging-cost/charging-cost',
    SCENE_CODE: '/subpkg/charging-calc/scene-code/scene-code',
    TEST_DRIVE: '/subpkg/charging-calc/test-drive/test-drive',
    CHARGING_LOG: '/subpkg/charging-log/charging-log/charging-log',
    MAINTENANCE_LEDGER: '/subpkg/maintenance/maintenance-ledger/maintenance-ledger',
    VEHICLE_INFO: '/subpkg/maintenance/vehicle-info/vehicle-info',
    CARPOOL_REVENUE: '/subpkg/ride-log/carpool-revenue/carpool-revenue',
  },

  // 极氪车型
  ZEEKR_MODELS: ['ZEEKR 001', 'ZEEKR 007', 'ZEEKR X', 'ZEEKR 009', 'ZEEKR MIX'],

  // 充电类型
  CHARGE_TYPES: [
    { value: 'home', label: '家充' },
    { value: 'public', label: '公共快充' },
    { value: 'destination', label: '目的地慢充' },
  ],

  // 中国省份简称
  PROVINCES: [
    '京','津','沪','渝','冀','晋','辽','吉','黑','苏','浙','皖','闽','赣','鲁','豫','鄂','湘','粤','琼','川','贵','云','陕','甘','青','蒙','桂','藏','宁','新',
  ],
};
