// 车辆设置 - 车系和年款选择
const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: {
    // 导航栏
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    // 车系列表
    carSeries: [
      {
        id: '001',
        name: '极氪 001',
        desc: '豪华猎装轿跑',
        emoji: '🏎️',
        comingSoon: false,
      },
      {
        id: '001-fr',
        name: '极氪 001 FR',
        desc: '纯电猎装超跑',
        emoji: '🏁',
        comingSoon: false,
      },
      {
        id: '007',
        name: '极氪 007',
        desc: '纯电豪华轿车',
        emoji: '🚗',
        comingSoon: false,
      },
      {
        id: 'x',
        name: '极氪 X',
        desc: '新奢全能SUV',
        emoji: '🚙',
        comingSoon: false,
      },
      {
        id: '009',
        name: '极氪 009',
        desc: '豪华纯电MPV',
        emoji: '🚐',
        comingSoon: false,
      },
      {
        id: '009-grand',
        name: '极氪 009 光辉',
        desc: '四座超豪华MPV',
        emoji: '✨',
        comingSoon: false,
      },
      {
        id: 'mix',
        name: '极氪 MIX',
        desc: '新奢全场景五座',
        emoji: '🚘',
        comingSoon: false,
      },
      {
        id: '7x',
        name: '极氪 7X',
        desc: '豪华大五座SUV',
        emoji: '🚙',
        comingSoon: true,
      },
    ],

    // 年款
    years: ['2024', '2025', '2026'],

    // 车身颜色库（按车系）
    carColors: {
      '001': [
        { id: 'night-black', name: '极夜黑', hex: '#1A1A2E' },
        { id: 'polar-white', name: '极昼白', hex: '#F5F5F0' },
        { id: 'aurora-blue', name: '极光蓝', hex: '#2563EB' },
        { id: 'mist-gray', name: '极境灰', hex: '#8B8B83' },
        { id: 'laser-gray', name: '镭射灰', hex: '#A0A0A8' },
        { id: 'electro-blue', name: '电光蓝', hex: '#1E40AF' },
      ],
      '001-fr': [
        { id: 'night-black', name: '极夜黑', hex: '#1A1A2E' },
        { id: 'polar-white', name: '极昼白', hex: '#F5F5F0' },
        { id: 'khaki-green', name: '卡其绿', hex: '#6B705C' },
      ],
      '007': [
        { id: 'night-black', name: '极夜黑', hex: '#1A1A2E' },
        { id: 'polar-white', name: '极昼白', hex: '#F5F5F0' },
        { id: 'nebula-gray', name: '星云灰', hex: '#9CA3AF' },
        { id: 'sky-blue', name: '晴空蓝', hex: '#60A5FA' },
        { id: 'dawn-brown', name: '曙光棕', hex: '#8B6914' },
        { id: 'cloud-gold', name: '云霞金', hex: '#C9A96E' },
      ],
      'x': [
        { id: 'night-black', name: '极夜黑', hex: '#1A1A2E' },
        { id: 'polar-white', name: '极昼白', hex: '#F5F5F0' },
        { id: 'nebula-gray', name: '星云灰', hex: '#9CA3AF' },
        { id: 'miami-orange', name: '迈阿密橙', hex: '#F97316' },
        { id: 'sydney-blue', name: '悉尼湾蓝', hex: '#3B82F6' },
      ],
      '009': [
        { id: 'night-black', name: '极夜黑', hex: '#1A1A2E' },
        { id: 'polar-white', name: '极昼白', hex: '#F5F5F0' },
        { id: 'nebula-gray', name: '星云灰', hex: '#9CA3AF' },
        { id: 'dawn-blue', name: '拂晓蓝', hex: '#93C5FD' },
      ],
      '009-grand': [
        { id: 'night-black', name: '极夜黑', hex: '#1A1A2E' },
        { id: 'polar-white', name: '极昼白', hex: '#F5F5F0' },
      ],
      'mix': [
        { id: 'night-black', name: '极夜黑', hex: '#1A1A2E' },
        { id: 'polar-white', name: '极昼白', hex: '#F5F5F0' },
        { id: 'nebula-gray', name: '星云灰', hex: '#9CA3AF' },
        { id: 'aurora-blue', name: '极光蓝', hex: '#2563EB' },
      ],
      '7x': [
        { id: 'night-black', name: '极夜黑', hex: '#1A1A2E' },
        { id: 'polar-white', name: '极昼白', hex: '#F5F5F0' },
        { id: 'nebula-gray', name: '星云灰', hex: '#9CA3AF' },
        { id: 'dawn-brown', name: '曙光棕', hex: '#8B6914' },
      ],
    },

    // 当前车系可选颜色
    currentColors: [],

    // 选中状态
    selectedSeries: '',
    selectedSeriesName: '',
    selectedYear: '',
    selectedColor: '',
    selectedColorName: '',

    // 提交状态
    saving: false,
  },

  onLoad() {
    this.initNavBar();
    this.loadExistingCar();
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  // 加载已有车辆信息（编辑模式）
  loadExistingCar() {
    try {
      const car = wx.getStorageSync('kt_my_car');
      if (car && car.modelId) {
        const colors = this.data.carColors[car.modelId] || [];
        this.setData({
          selectedSeries: car.modelId,
          selectedSeriesName: car.model,
          selectedYear: car.year || '',
          currentColors: colors,
          selectedColor: car.colorId || '',
          selectedColorName: car.color || '',
        });
      }
    } catch (e) {}
  },

  // 选择车系
  onSelectSeries(e) {
    const id = e.currentTarget.dataset.id;
    const series = this.data.carSeries.find(s => s.id === id);
    if (series && series.comingSoon) return;

    // 切换车系时加载对应颜色，清除已选的年款和颜色
    const colors = this.data.carColors[id] || [];
    this.setData({
      selectedSeries: id,
      selectedSeriesName: series ? series.name : '',
      currentColors: colors,
      selectedYear: '',
      selectedColor: '',
      selectedColorName: '',
    });
  },

  // 选择年款
  onSelectYear(e) {
    const year = e.currentTarget.dataset.year;
    if (year) {
      this.setData({ selectedYear: String(year) });
    }
  },

  // 选择车身颜色
  onSelectColor(e) {
    const id = e.currentTarget.dataset.id;
    const color = this.data.currentColors.find(c => c.id === id);
    if (color) {
      this.setData({
        selectedColor: id,
        selectedColorName: color.name,
      });
    }
  },

  // 保存
  onSave() {
    if (!this.data.selectedSeries || !this.data.selectedYear) {
      wx.showToast({ title: '请选择车系和年款', icon: 'none' });
      return;
    }
    if (!this.data.selectedColor) {
      wx.showToast({ title: '请选择车身颜色', icon: 'none' });
      return;
    }

    this.setData({ saving: true });

    try {
      const carData = {
        model: this.data.selectedSeriesName,
        modelId: this.data.selectedSeries,
        year: this.data.selectedYear,
        color: this.data.selectedColorName,
        colorId: this.data.selectedColor,
        isDefault: true,
        updatedAt: Date.now(),
      };

      // 获取已添加的车辆列表
      let cars = wx.getStorageSync('kt_my_cars') || [];

      // 检查是否已有同车型
      const existingIndex = cars.findIndex(c => c.modelId === carData.modelId && c.year === carData.year);

      if (existingIndex >= 0) {
        // 更新已有车辆
        cars[existingIndex] = { ...cars[existingIndex], ...carData };
      } else {
        // 新增车辆，取消其他默认
        cars = cars.map(c => ({ ...c, isDefault: false }));
        carData.id = Date.now().toString();
        carData.createdAt = Date.now();
        cars.push(carData);
      }

      wx.setStorageSync('kt_my_cars', cars);
      wx.setStorageSync('kt_my_car', carData);

      wx.showToast({ title: '保存成功', icon: 'success', duration: 1200 });

      setTimeout(() => wx.navigateBack(), 1300);

    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
      this.setData({ saving: false });
    }
  },

  onBack() {
    wx.navigateBack();
  },
});
