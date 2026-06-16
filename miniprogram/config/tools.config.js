module.exports = {
  // 首页快捷入口 (2x2 网格)
  quickEntries: [
    { id: 'sceneCode',   name: '智慧场景码', icon: '/assets/images/icons/scene-code.png', path: '/subpkg/charging-calc/scene-code/scene-code' },
    { id: 'vehicleInfo', name: '车辆信息', icon: '/assets/images/icons/vehicle-info.png', path: '/subpkg/maintenance/vehicle-info/vehicle-info' },
    { id: 'testDrive',   name: '极氪试驾', icon: '/assets/images/icons/test-drive.png',  path: '/subpkg/charging-calc/test-drive/test-drive' },
    { id: 'community',   name: '音效库', icon: '/assets/images/icons/community.png',   path: '/pages/community/community' },
  ],

  // 首页常用工具列表
  toolList: [
    { id: 'charging-cost-calc', name: '充电费用计算', icon: '/assets/images/icons/charging-calc.png',  path: '/subpkg/charging-calc/charging-cost/charging-cost' },
    { id: 'charging-log',       name: '充电记录', icon: '/assets/images/icons/charging-log.png',   path: '/subpkg/charging-log/charging-log/charging-log' },
    { id: 'maintenance-ledger', name: '养车账本', icon: '/assets/images/icons/maintenance.png',    path: '/subpkg/maintenance/maintenance-ledger/maintenance-ledger' },
    { id: 'carpool-revenue',    name: '顺风车收入', icon: '/assets/images/icons/carpool.png',        path: '/subpkg/ride-log/carpool-revenue/carpool-revenue' },
    { id: 'charging-station',   name: '充电桩收藏', icon: '/assets/images/icons/charging-log.png',    path: '/pages/charging-station/charging-station' },
    { id: 'car-wash',           name: '洗车日记', icon: '/assets/images/icons/maintenance.png',     path: '/pages/car-wash/car-wash' },
    { id: 'modification',       name: '改装配件', icon: '/assets/images/icons/carpool.png',         path: '/pages/modification/modification' },
    { id: 'mileage-log',        name: '里程记录', icon: '/assets/images/icons/charging-log.png',    path: '/pages/mileage-log/mileage-log' },
    { id: 'maintenance-reminder', name: '保养提醒', icon: '/assets/images/icons/maintenance.png', path: '/pages/maintenance-reminder/maintenance-reminder' },
    { id: 'monthly-report',     name: '月度报告', icon: '/assets/images/icons/scene-code.png',      path: '/pages/monthly-report/monthly-report' },
    { id: 'driving-guide',      name: '提车指南', icon: '/assets/images/icons/test-drive.png',      path: '/pages/driving-guide/driving-guide' },
    { id: 'loan-calc',          name: '车贷计算器', icon: '/assets/images/icons/charging-calc.png',   path: '/subpkg/ride-log/loan-calc/loan-calc' },
    { id: 'parking-reminder',   name: '停车场提醒', icon: '/assets/images/icons/maintenance.png',     path: '/subpkg/maintenance/parking-reminder/parking-reminder' },
    { id: 'consumption',        name: '电耗油耗计算', icon: '/assets/images/icons/charging-log.png',    path: '/subpkg/ride-log/consumption/consumption' },
    { id: 'data-statistics',    name: '数据统计', icon: '/assets/images/icons/scene-code.png',      path: '/pages/data-statistics/data-statistics' },
    { id: 'data-export',        name: '数据导出', icon: '/assets/images/icons/charging-log.png',    path: '/pages/data-export/data-export' },
    { id: 'price-trend',        name: '电价走势', icon: '/assets/images/icons/charging-calc.png',   path: '/pages/price-trend/price-trend' },
    { id: 'station-review',     name: '充电站评价', icon: '/assets/images/icons/maintenance.png',     path: '/pages/station-review/station-review' },
    { id: 'car-community',      name: '车主社区', icon: '/assets/images/icons/community.png',       path: '/pages/car-community/car-community' },
  ],

  // 工具页全量工具（按分类）
  toolCategories: [
    {
      name: '计算工具',
      items: [
        { id: 'charging-cost-calc', name: '充电费用计算', icon: '/assets/images/icons/charging-calc.png', path: '/subpkg/charging-calc/charging-cost/charging-cost' },
        { id: 'consumption', name: '电耗油耗计算', icon: '/assets/images/icons/charging-log.png', path: '/subpkg/ride-log/consumption/consumption' },
        { id: 'price-trend', name: '电价走势', icon: '/assets/images/icons/charging-calc.png', path: '/pages/price-trend/price-trend' },
      ],
    },
    {
      name: '记录工具',
      items: [
        { id: 'charging-log', name: '充电记录', icon: '/assets/images/icons/charging-log.png', path: '/subpkg/charging-log/charging-log/charging-log' },
        { id: 'carpool-revenue', name: '顺风车收入', icon: '/assets/images/icons/carpool.png', path: '/subpkg/ride-log/carpool-revenue/carpool-revenue' },
        { id: 'car-wash', name: '洗车日记', icon: '/assets/images/icons/maintenance.png', path: '/pages/car-wash/car-wash' },
        { id: 'modification', name: '改装配件', icon: '/assets/images/icons/carpool.png', path: '/pages/modification/modification' },
        { id: 'mileage-log', name: '里程记录', icon: '/assets/images/icons/charging-log.png', path: '/pages/mileage-log/mileage-log' },
      ],
    },
    {
      name: '养车工具',
      items: [
        { id: 'maintenance-ledger', name: '养车账本', icon: '/assets/images/icons/maintenance.png', path: '/subpkg/maintenance/maintenance-ledger/maintenance-ledger' },
        { id: 'vehicle-info', name: '车辆信息', icon: '/assets/images/icons/vehicle-info.png', path: '/subpkg/maintenance/vehicle-info/vehicle-info' },
        { id: 'charging-station', name: '充电桩收藏', icon: '/assets/images/icons/charging-log.png', path: '/pages/charging-station/charging-station' },
        { id: 'parking-reminder', name: '停车场提醒', icon: '/assets/images/icons/maintenance.png', path: '/subpkg/maintenance/parking-reminder/parking-reminder' },
        { id: 'maintenance-reminder', name: '保养提醒', icon: '/assets/images/icons/maintenance.png', path: '/pages/maintenance-reminder/maintenance-reminder' },
        { id: 'station-review', name: '充电站评价', icon: '/assets/images/icons/maintenance.png', path: '/pages/station-review/station-review' },
      ],
    },
    {
      name: '实用工具',
      items: [
        { id: 'driving-guide', name: '提车指南', icon: '/assets/images/icons/test-drive.png', path: '/pages/driving-guide/driving-guide' },
        { id: 'data-statistics', name: '数据统计', icon: '/assets/images/icons/scene-code.png', path: '/pages/data-statistics/data-statistics' },
        { id: 'monthly-report', name: '月度报告', icon: '/assets/images/icons/scene-code.png', path: '/pages/monthly-report/monthly-report' },
        { id: 'data-export', name: '数据导出', icon: '/assets/images/icons/charging-log.png', path: '/pages/data-export/data-export' },
        { id: 'car-community', name: '车主社区', icon: '/assets/images/icons/community.png', path: '/pages/car-community/car-community' },
        { id: 'changelog', name: '更新日志', icon: '/assets/images/icons/scene-code.png', path: '/pages/changelog/changelog' },
      ],
    },
  ],
};
