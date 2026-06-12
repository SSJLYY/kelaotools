module.exports = {
  // 首页快捷入口 (2x2 网格)
  quickEntries: [
    { id: 'sceneCode',   key: 'home.quickEntry.sceneCode',   icon: '/assets/images/icons/scene-code.png', path: '/subpkg/charging-calc/scene-code/scene-code' },
    { id: 'vehicleInfo', key: 'home.quickEntry.vehicleInfo', icon: '/assets/images/icons/vehicle-info.png', path: '/subpkg/maintenance/vehicle-info/vehicle-info' },
    { id: 'testDrive',   key: 'home.quickEntry.testDrive',   icon: '/assets/images/icons/test-drive.png',  path: '/subpkg/charging-calc/test-drive/test-drive' },
    { id: 'community',   key: 'home.quickEntry.community',   icon: '/assets/images/icons/community.png',   path: '/pages/community/community' },
  ],

  // 首页常用工具列表
  toolList: [
    { id: 'charging-cost-calc', key: 'tools.items.chargingCostCalc',  icon: '/assets/images/icons/charging-calc.png',  path: '/subpkg/charging-calc/charging-cost/charging-cost' },
    { id: 'charging-log',       key: 'tools.items.chargingLog',       icon: '/assets/images/icons/charging-log.png',   path: '/subpkg/charging-log/charging-log/charging-log' },
    { id: 'maintenance-ledger', key: 'tools.items.maintenanceLedger', icon: '/assets/images/icons/maintenance.png',    path: '/subpkg/maintenance/maintenance-ledger/maintenance-ledger' },
    { id: 'carpool-revenue',    key: 'tools.items.carpoolRevenue',    icon: '/assets/images/icons/carpool.png',        path: '/subpkg/ride-log/carpool-revenue/carpool-revenue' },
  ],

  // 工具页全量工具（按分类）
  toolCategories: [
    {
      key: 'tools.calculator',
      items: [
        { id: 'charging-cost-calc', key: 'tools.items.chargingCostCalc', icon: '/assets/images/icons/charging-calc.png', path: '/subpkg/charging-calc/charging-cost/charging-cost' },
      ],
    },
    {
      key: 'tools.recorder',
      items: [
        { id: 'charging-log', key: 'tools.items.chargingLog', icon: '/assets/images/icons/charging-log.png', path: '/subpkg/charging-log/charging-log/charging-log' },
        { id: 'carpool-revenue', key: 'tools.items.carpoolRevenue', icon: '/assets/images/icons/carpool.png', path: '/subpkg/ride-log/carpool-revenue/carpool-revenue' },
        { id: 'car-wash', key: 'tools.items.carWash', icon: '/assets/images/icons/car-wash.png', path: '/pages/car-wash/car-wash' },
        { id: 'modification', key: 'tools.items.modification', icon: '/assets/images/icons/modification.png', path: '/pages/modification/modification' },
      ],
    },
    {
      key: 'tools.maintenance',
      items: [
        { id: 'maintenance-ledger', key: 'tools.items.maintenanceLedger', icon: '/assets/images/icons/maintenance.png', path: '/subpkg/maintenance/maintenance-ledger/maintenance-ledger' },
        { id: 'vehicle-info', key: 'tools.items.vehicleInfo', icon: '/assets/images/icons/vehicle-info.png', path: '/subpkg/maintenance/vehicle-info/vehicle-info' },
        { id: 'charging-station', key: 'tools.items.chargingStation', icon: '/assets/images/icons/charging-station.png', path: '/pages/charging-station/charging-station' },
      ],
    },
  ],
};
