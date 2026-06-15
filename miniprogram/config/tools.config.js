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
    { id: 'charging-station',   key: 'tools.items.chargingStation',   icon: '/assets/images/icons/charging-log.png',    path: '/pages/charging-station/charging-station' },
    { id: 'car-wash',           key: 'tools.items.carWash',           icon: '/assets/images/icons/maintenance.png',     path: '/pages/car-wash/car-wash' },
    { id: 'modification',       key: 'tools.items.modification',      icon: '/assets/images/icons/carpool.png',         path: '/pages/modification/modification' },
    { id: 'mileage-log',        key: 'tools.items.mileageLog',        icon: '/assets/images/icons/charging-log.png',    path: '/pages/mileage-log/mileage-log' },
    { id: 'maintenance-reminder', key: 'tools.items.maintenanceReminder', icon: '/assets/images/icons/maintenance.png', path: '/pages/maintenance-reminder/maintenance-reminder' },
    { id: 'monthly-report',     key: 'tools.items.monthlyReport',     icon: '/assets/images/icons/scene-code.png',      path: '/pages/monthly-report/monthly-report' },
    { id: 'driving-guide',      key: 'tools.items.drivingGuide',      icon: '/assets/images/icons/test-drive.png',      path: '/pages/driving-guide/driving-guide' },
    { id: 'loan-calc',          key: 'tools.items.loanCalc',          icon: '/assets/images/icons/charging-calc.png',   path: '/subpkg/ride-log/loan-calc/loan-calc' },
    { id: 'parking-reminder',   key: 'tools.items.parkingReminder',   icon: '/assets/images/icons/maintenance.png',     path: '/subpkg/maintenance/parking-reminder/parking-reminder' },
    { id: 'consumption',        key: 'tools.items.consumption',       icon: '/assets/images/icons/charging-log.png',    path: '/subpkg/ride-log/consumption/consumption' },
    { id: 'data-statistics',    key: 'tools.items.dataStatistics',    icon: '/assets/images/icons/scene-code.png',      path: '/pages/data-statistics/data-statistics' },
    { id: 'data-export',        key: 'tools.items.dataExport',        icon: '/assets/images/icons/charging-log.png',    path: '/pages/data-export/data-export' },
    { id: 'price-trend',        key: 'tools.items.priceTrend',        icon: '/assets/images/icons/charging-calc.png',   path: '/pages/price-trend/price-trend' },
    { id: 'station-review',     key: 'tools.items.stationReview',     icon: '/assets/images/icons/maintenance.png',     path: '/pages/station-review/station-review' },
    { id: 'car-community',      key: 'tools.items.carCommunity',      icon: '/assets/images/icons/community.png',       path: '/pages/car-community/car-community' },
  ],

  // 工具页全量工具（按分类）
  toolCategories: [
    {
      key: 'tools.calculator',
      items: [
        { id: 'charging-cost-calc', key: 'tools.items.chargingCostCalc', icon: '/assets/images/icons/charging-calc.png', path: '/subpkg/charging-calc/charging-cost/charging-cost' },
        { id: 'consumption', key: 'tools.items.consumption', icon: '/assets/images/icons/charging-log.png', path: '/subpkg/ride-log/consumption/consumption' },
        { id: 'price-trend', key: 'tools.items.priceTrend', icon: '/assets/images/icons/charging-calc.png', path: '/pages/price-trend/price-trend' },
      ],
    },
    {
      key: 'tools.recorder',
      items: [
        { id: 'charging-log', key: 'tools.items.chargingLog', icon: '/assets/images/icons/charging-log.png', path: '/subpkg/charging-log/charging-log/charging-log' },
        { id: 'carpool-revenue', key: 'tools.items.carpoolRevenue', icon: '/assets/images/icons/carpool.png', path: '/subpkg/ride-log/carpool-revenue/carpool-revenue' },
        { id: 'car-wash', key: 'tools.items.carWash', icon: '/assets/images/icons/maintenance.png', path: '/pages/car-wash/car-wash' },
        { id: 'modification', key: 'tools.items.modification', icon: '/assets/images/icons/carpool.png', path: '/pages/modification/modification' },
        { id: 'mileage-log', key: 'tools.items.mileageLog', icon: '/assets/images/icons/charging-log.png', path: '/pages/mileage-log/mileage-log' },
      ],
    },
    {
      key: 'tools.maintenance',
      items: [
        { id: 'maintenance-ledger', key: 'tools.items.maintenanceLedger', icon: '/assets/images/icons/maintenance.png', path: '/subpkg/maintenance/maintenance-ledger/maintenance-ledger' },
        { id: 'vehicle-info', key: 'tools.items.vehicleInfo', icon: '/assets/images/icons/vehicle-info.png', path: '/subpkg/maintenance/vehicle-info/vehicle-info' },
        { id: 'charging-station', key: 'tools.items.chargingStation', icon: '/assets/images/icons/charging-log.png', path: '/pages/charging-station/charging-station' },
        { id: 'parking-reminder', key: 'tools.items.parkingReminder', icon: '/assets/images/icons/maintenance.png', path: '/subpkg/maintenance/parking-reminder/parking-reminder' },
        { id: 'maintenance-reminder', key: 'tools.items.maintenanceReminder', icon: '/assets/images/icons/maintenance.png', path: '/pages/maintenance-reminder/maintenance-reminder' },
        { id: 'station-review', key: 'tools.items.stationReview', icon: '/assets/images/icons/maintenance.png', path: '/pages/station-review/station-review' },
      ],
    },
    {
      key: 'tools.practical',
      items: [
        { id: 'driving-guide', key: 'tools.items.drivingGuide', icon: '/assets/images/icons/test-drive.png', path: '/pages/driving-guide/driving-guide' },
        { id: 'data-statistics', key: 'tools.items.dataStatistics', icon: '/assets/images/icons/scene-code.png', path: '/pages/data-statistics/data-statistics' },
        { id: 'monthly-report', key: 'tools.items.monthlyReport', icon: '/assets/images/icons/scene-code.png', path: '/pages/monthly-report/monthly-report' },
        { id: 'data-export', key: 'tools.items.dataExport', icon: '/assets/images/icons/charging-log.png', path: '/pages/data-export/data-export' },
        { id: 'car-community', key: 'tools.items.carCommunity', icon: '/assets/images/icons/community.png', path: '/pages/car-community/car-community' },
        { id: 'changelog', key: 'tools.items.changelog', icon: '/assets/images/icons/scene-code.png', path: '/pages/changelog/changelog' },
      ],
    },
  ],
};
