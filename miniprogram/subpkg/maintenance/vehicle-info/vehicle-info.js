// 车辆信息页
const { getNavBarInfo } = require('../../../utils/nav');

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    // 车辆数据
    car: null,
    carEmoji: '🚗',
    carSpec: {},
    carColorHex: '#1A1A2E',

    // 基本参数
    basicSpecs: [],
    // 动力参数
    powerSpecs: [],
    // 性能参数
    perfSpecs: [],
  },

  onLoad() {
    this.initNavBar();
    this.loadCar();
  },

  onShow() {
    this.loadCar();
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  loadCar() {
    const defaultCar = {
      modelId: '001',
      model: '极氪 001',
      year: '2025',
      color: '极昼白',
      plate: '',
    };

    try {
      const car = wx.getStorageSync('kt_my_car') || {};
      let currentCar = null;

      if (car.modelId) {
        currentCar = car;
      } else {
        const cars = wx.getStorageSync('kt_my_cars') || [];
        currentCar = cars.find(item => item && item.modelId) || null;
      }

      currentCar = currentCar || defaultCar;
      this.setData({ car: currentCar });
      this.loadSpecs(currentCar.modelId || defaultCar.modelId);
      this.setEmoji(currentCar.modelId || defaultCar.modelId);
      this.resolveColorHex(currentCar.color || defaultCar.color);
    } catch (e) {
      this.setData({ car: defaultCar });
      this.loadSpecs(defaultCar.modelId);
      this.setEmoji(defaultCar.modelId);
      this.resolveColorHex(defaultCar.color);
    }
  },

  // 根据颜色名称获取 hex 值
  resolveColorHex(colorName) {
    const colorMap = {
      '极夜黑': '#1A1A2E', '极昼白': '#F5F5F0', '极光蓝': '#2563EB',
      '极境灰': '#8B8B83', '镭射灰': '#A0A0A8', '电光蓝': '#1E40AF',
      '卡其绿': '#6B705C', '星云灰': '#9CA3AF', '晴空蓝': '#60A5FA',
      '曙光棕': '#8B6914', '云霞金': '#C9A96E', '迈阿密橙': '#F97316',
      '悉尼湾蓝': '#3B82F6', '拂晓蓝': '#93C5FD',
    };
    this.setData({ carColorHex: colorMap[colorName] || '#1A1A2E' });
  },

  // 根据车型设置表情
  setEmoji(modelId) {
    const map = {
      '001': '🏎️', '001-fr': '🏁', '007': '🚗',
      'x': '🚙', '009': '🚐', '009-grand': '✨',
      'mix': '🚘', '7x': '🚙',
    };
    this.setData({ carEmoji: map[modelId] || '🚗' });
  },

  // 加载车型规格参数
  loadSpecs(modelId) {
    // 极氪各车型规格数据库
    const specsDb = {
      '001': {
        configName: 'WE版 100kWh',
        color: '极昼白',
        totalMileage: '12,580',
        range: '741',
        batteryHealth: '98%',
        basic: [
          { label: '长(mm)', value: '4,970' },
          { label: '宽(mm)', value: '1,999' },
          { label: '高(mm)', value: '1,545' },
          { label: '轴距(mm)', value: '3,005' },
          { label: '整备质量(kg)', value: '2,295' },
          { label: '座位数', value: '5座' },
          { label: '后备箱(L)', value: '539' },
          { label: '风阻系数', value: '0.23Cd' },
        ],
        power: [
          { label: '电机类型', value: '永磁同步' },
          { label: '总功率(kW)', value: '400' },
          { label: '总扭矩(N·m)', value: '686' },
          { label: '电池容量(kWh)', value: '100' },
          { label: '电池类型', value: '三元锂' },
          { label: 'CLTC续航(km)', value: '741' },
          { label: '充电接口', value: 'CCS2' },
          { label: 'V2L外放电', value: '支持(3.3kW)' },
        ],
        perf: [
          { label: '最高车速(km/h)', value: '200' },
          { label: '0-100加速(s)', value: '3.3' },
          { label: '快充(10-80%)', value: '15分钟' },
          { label: '百公里电耗(kWh)', value: '14.8' },
          { label: '驱动方式', value: '双电机四驱' },
          { label: '悬架类型', value: '空气悬架+CDC' },
          { label: '制动距离(m)', value: '34.5' },
          { label: '智驾芯片', value: 'Mobyeleye' },
        ],
      },
      '007': {
        configName: '后驱智驾版 100kWh',
        color: '极夜黑',
        totalMileage: '8,320',
        range: '870',
        batteryHealth: '99%',
        basic: [
          { label: '长(mm)', value: '4,865' },
          { label: '宽(mm)', value: '1,900' },
          { label: '高(mm)', value: '1,450' },
          { label: '轴距(mm)', value: '2,928' },
          { label: '整备质量(kg)', value: '2,150' },
          { label: '座位数', value: '5座' },
          { label: '后备箱(L)', value: '462' },
          { label: '风阻系数', value: '0.20Cd' },
        ],
        power: [
          { label: '电机类型', value: '永磁同步' },
          { label: '总功率(kW)', value: '310' },
          { label: '总扭矩(N·m)', value: '420' },
          { label: '电池容量(kWh)', value: '100' },
          { label: '电池类型', value: '麒麟电池' },
          { label: 'CLTC续航(km)', value: '870' },
          { label: '充电接口', value: 'CCS2' },
          { label: 'V2L外放电', value: '支持(3.3kW)' },
        ],
        perf: [
          { label: '最高车速(km/h)', value: '210' },
          { label: '0-100加速(s)', value: '2.84' },
          { label: '快充(10-80%)', value: '10分钟' },
          { label: '百公里电耗(kWh)', value: '13.2' },
          { label: '驱动方式', value: '后驱' },
          { label: '悬架类型', value: '前双叉臂+后五连杆' },
          { label: '制动距离(m)', value: '33.2' },
          { label: '智驾芯片', value: 'NVIDIA Orin-X' },
        ],
      },
      'x': {
        configName: 'YOU版 四驱',
        color: '极光绿',
        totalMileage: '6,100',
        range: '560',
        batteryHealth: '97%',
        basic: [
          { label: '长(mm)', value: '4,450' },
          { label: '宽(mm)', value: '1,836' },
          { label: '高(mm)', value: '1,572' },
          { label: '轴距(mm)', value: '2,750' },
          { label: '整备质量(kg)', value: '1,945' },
          { label: '座位数', value: '5座' },
          { label: '后备箱(L)', value: '362' },
          { label: '风阻系数', value: '0.27Cd' },
        ],
        power: [
          { label: '电机类型', value: '永磁同步' },
          { label: '总功率(kW)', value: '315' },
          { label: '总扭矩(N·m)', value: '543' },
          { label: '电池容量(kWh)', value: '66' },
          { label: '电池类型', value: '三元锂' },
          { label: 'CLTC续航(km)', value: '560' },
          { label: '充电接口', value: 'CCS2' },
          { label: 'V2L外放电', value: '支持(3.3kW)' },
        ],
        perf: [
          { label: '最高车速(km/h)', value: '190' },
          { label: '0-100加速(s)', value: '3.7' },
          { label: '快充(10-80%)', value: '28分钟' },
          { label: '百公里电耗(kWh)', value: '14.3' },
          { label: '驱动方式', value: '双电机四驱' },
          { label: '悬架类型', value: '麦弗逊+多连杆' },
          { label: '制动距离(m)', value: '36.1' },
          { label: '智驾芯片', value: 'Mobyeleye' },
        ],
      },
      '009': {
        configName: 'WE版',
        color: '星云白',
        totalMileage: '15,200',
        range: '702',
        batteryHealth: '96%',
        basic: [
          { label: '长(mm)', value: '5,209' },
          { label: '宽(mm)', value: '2,024' },
          { label: '高(mm)', value: '1,848' },
          { label: '轴距(mm)', value: '3,205' },
          { label: '整备质量(kg)', value: '2,830' },
          { label: '座位数', value: '6座' },
          { label: '后备箱(L)', value: '376' },
          { label: '风阻系数', value: '0.27Cd' },
        ],
        power: [
          { label: '电机类型', value: '永磁同步' },
          { label: '总功率(kW)', value: '400' },
          { label: '总扭矩(N·m)', value: '686' },
          { label: '电池容量(kWh)', value: '116' },
          { label: '电池类型', value: '宁德时代麒麟' },
          { label: 'CLTC续航(km)', value: '702' },
          { label: '充电接口', value: 'CCS2' },
          { label: 'V2L外放电', value: '支持(3.3kW)' },
        ],
        perf: [
          { label: '最高车速(km/h)', value: '190' },
          { label: '0-100加速(s)', value: '4.5' },
          { label: '快充(10-80%)', value: '28分钟' },
          { label: '百公里电耗(kWh)', value: '18.9' },
          { label: '驱动方式', value: '双电机四驱' },
          { label: '悬架类型', value: '双叉臂+多连杆+空悬' },
          { label: '制动距离(m)', value: '36.0' },
          { label: '智驾芯片', value: 'Mobyeleye' },
        ],
      },
      'mix': {
        configName: '标准版',
        color: '星河银',
        totalMileage: '3,200',
        range: '650',
        batteryHealth: '100%',
        basic: [
          { label: '长(mm)', value: '4,710' },
          { label: '宽(mm)', value: '1,990' },
          { label: '高(mm)', value: '1,600' },
          { label: '轴距(mm)', value: '3,000' },
          { label: '整备质量(kg)', value: '2,180' },
          { label: '座位数', value: '5座' },
          { label: '后备箱(L)', value: '520' },
          { label: '风阻系数', value: '0.24Cd' },
        ],
        power: [
          { label: '电机类型', value: '永磁同步' },
          { label: '总功率(kW)', value: '310' },
          { label: '总扭矩(N·m)', value: '420' },
          { label: '电池容量(kWh)', value: '100' },
          { label: '电池类型', value: '三元锂' },
          { label: 'CLTC续航(km)', value: '650' },
          { label: '充电接口', value: 'CCS2' },
          { label: 'V2L外放电', value: '支持(3.3kW)' },
        ],
        perf: [
          { label: '最高车速(km/h)', value: '200' },
          { label: '0-100加速(s)', value: '4.8' },
          { label: '快充(10-80%)', value: '20分钟' },
          { label: '百公里电耗(kWh)', value: '16.5' },
          { label: '驱动方式', value: '后驱' },
          { label: '悬架类型', value: '前双叉臂+后五连杆' },
          { label: '制动距离(m)', value: '35.5' },
          { label: '智驾芯片', value: 'NVIDIA Orin-X' },
        ],
      },
      '001-fr': {
        configName: 'FR版',
        color: '极速红',
        totalMileage: '2,100',
        range: '550',
        batteryHealth: '100%',
        basic: [
          { label: '长(mm)', value: '4,970' },
          { label: '宽(mm)', value: '1,999' },
          { label: '高(mm)', value: '1,510' },
          { label: '轴距(mm)', value: '3,005' },
          { label: '整备质量(kg)', value: '2,350' },
          { label: '座位数', value: '5座' },
          { label: '后备箱(L)', value: '539' },
          { label: '风阻系数', value: '0.23Cd' },
        ],
        power: [
          { label: '电机类型', value: '四永磁同步' },
          { label: '总功率(kW)', value: '930' },
          { label: '总扭矩(N·m)', value: '1,280' },
          { label: '电池容量(kWh)', value: '100' },
          { label: '电池类型', value: '三元锂' },
          { label: 'CLTC续航(km)', value: '550' },
          { label: '充电接口', value: 'CCS2' },
          { label: 'V2L外放电', value: '支持(3.3kW)' },
        ],
        perf: [
          { label: '最高车速(km/h)', value: '280' },
          { label: '0-100加速(s)', value: '2.02' },
          { label: '快充(10-80%)', value: '15分钟' },
          { label: '百公里电耗(kWh)', value: '22.0' },
          { label: '驱动方式', value: '四电机四驱' },
          { label: '悬架类型', value: '空气悬架+CDC(赛道调校)' },
          { label: '制动距离(m)', value: '33.4' },
          { label: '智驾芯片', value: 'Mobyeleye' },
        ],
      },
      '009-grand': {
        configName: '光辉版 四座',
        color: '曜石黑',
        totalMileage: '800',
        range: '702',
        batteryHealth: '100%',
        basic: [
          { label: '长(mm)', value: '5,209' },
          { label: '宽(mm)', value: '2,024' },
          { label: '高(mm)', value: '1,848' },
          { label: '轴距(mm)', value: '3,205' },
          { label: '整备质量(kg)', value: '2,920' },
          { label: '座位数', value: '4座' },
          { label: '后备箱(L)', value: '376' },
          { label: '风阻系数', value: '0.27Cd' },
        ],
        power: [
          { label: '电机类型', value: '永磁同步' },
          { label: '总功率(kW)', value: '400' },
          { label: '总扭矩(N·m)', value: '686' },
          { label: '电池容量(kWh)', value: '116' },
          { label: '电池类型', value: '宁德时代麒麟' },
          { label: 'CLTC续航(km)', value: '702' },
          { label: '充电接口', value: 'CCS2' },
          { label: 'V2L外放电', value: '支持(3.3kW)' },
        ],
        perf: [
          { label: '最高车速(km/h)', value: '190' },
          { label: '0-100加速(s)', value: '4.5' },
          { label: '快充(10-80%)', value: '28分钟' },
          { label: '百公里电耗(kWh)', value: '19.5' },
          { label: '驱动方式', value: '双电机四驱' },
          { label: '悬架类型', value: '双叉臂+多连杆+空悬' },
          { label: '制动距离(m)', value: '36.0' },
          { label: '智驾芯片', value: 'Mobyeleye' },
        ],
      },
      '7x': {
        configName: '待上市',
        color: '--',
        totalMileage: '--',
        range: '700+',
        batteryHealth: '--',
        basic: [
          { label: '长(mm)', value: '4,950' },
          { label: '宽(mm)', value: '1,999' },
          { label: '高(mm)', value: '1,650' },
          { label: '轴距(mm)', value: '3,050' },
          { label: '整备质量(kg)', value: '--' },
          { label: '座位数', value: '5座' },
          { label: '后备箱(L)', value: '--' },
          { label: '风阻系数', value: '--' },
        ],
        power: [
          { label: '电机类型', value: '待公布' },
          { label: '总功率(kW)', value: '--' },
          { label: '总扭矩(N·m)', value: '--' },
          { label: '电池容量(kWh)', value: '--' },
          { label: '电池类型', value: '待公布' },
          { label: 'CLTC续航(km)', value: '700+ (预计)' },
          { label: '充电接口', value: '--' },
          { label: 'V2L外放电', value: '--' },
        ],
        perf: [
          { label: '最高车速(km/h)', value: '--' },
          { label: '0-100加速(s)', value: '--' },
          { label: '快充(10-80%)', value: '--' },
          { label: '百公里电耗(kWh)', value: '--' },
          { label: '驱动方式', value: '待公布' },
          { label: '悬架类型', value: '待公布' },
          { label: '制动距离(m)', value: '--' },
          { label: '智驾芯片', value: '待公布' },
        ],
      },
    };

    const spec = specsDb[modelId] || specsDb['001'];
    this.setData({
      carSpec: spec,
      basicSpecs: spec.basic,
      powerSpecs: spec.power,
      perfSpecs: spec.perf,
    });
  },

  // 快捷功能导航
  onNavigate(e) {
    const { path } = e.currentTarget.dataset;
    if (path) wx.navigateTo({ url: path });
  },

  // 编辑车辆
  onEdit() {
    wx.navigateTo({ url: '/pages/car-setting/car-setting' });
  },

  // 删除车辆
  onDelete() {
    wx.showModal({
      title: '删除车辆',
      content: '删除后车辆信息和相关记录将无法恢复，确定删除吗？',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          const car = wx.getStorageSync('kt_my_car') || {};
          let cars = wx.getStorageSync('kt_my_cars') || [];
          cars = cars.filter(c => c.id !== car.id);
          wx.setStorageSync('kt_my_cars', cars);
          wx.setStorageSync('kt_my_car', cars[0] || null);
          wx.showToast({ title: '已删除', icon: 'success' });
          setTimeout(() => wx.switchTab({ url: '/pages/index/index' }), 1000);
        } catch (e) {
          wx.showToast({ title: '删除失败', icon: 'none' });
        }
      },
    });
  },

  onBack() { wx.navigateBack(); },

  onShareAppMessage() {
    return {
      title: `我的${this.data.car?.model || '极氪'}车辆信息`,
      path: '/pages/index/index',
    };
  },
});
