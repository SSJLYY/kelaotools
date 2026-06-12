// 添加车辆
const consts = require('../../../utils/const');
const { getNavBarInfo } = require('../../../utils/nav');

// 默认车型列表
const DEFAULT_MODELS = [
  { id: '001', name: 'ZEEKR 001', subtitle: '豪华猎装轿跑', emoji: '🏎️', bgColor: '#E8F2FF' },
  { id: '007', name: 'ZEEKR 007', subtitle: '纯电豪华轿车', emoji: '🚗', bgColor: '#F0F4FF' },
  { id: 'x',   name: 'ZEEKR X',   subtitle: '新奢全能SUV',  emoji: '🚙', bgColor: '#FFF7ED' },
  { id: '009', name: 'ZEEKR 009', subtitle: '豪华纯电MPV',  emoji: '🚐', bgColor: '#EDE9FE' },
  { id: 'mix', name: 'ZEEKR MIX', subtitle: '全场景五座',   emoji: '🚘', bgColor: '#ECFDF5' },
];

Page({
  data: {
    // 导航栏
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    // 步骤控制
    step: 1, // 1: 选车型, 2: 填信息

    // 车型选择
    selectedModel: '',
    selectedModelName: '',
    models: DEFAULT_MODELS,

    // 车辆信息表单
    plateProvince: '京',
    plateNumber: '',
    vin: '',
    purchaseDate: '',
    isDefault: true,

    // 状态
    vinFocus: false,
    submitting: false,

    // 省份选择
    showProvincePicker: false,
    provinces: consts.PROVINCES || [
      '京','津','沪','渝','冀','晋','辽','吉','黑','苏','浙','皖','闽','赣','鲁','豫','鄂','湘','粤','琼','川','贵','云','陕','甘','青','蒙','桂','藏','宁','新',
    ],
  },

  onLoad() {
    this.initNavBar();
    const d = new Date();
    this.setData({ dateMax: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` });

    // 优化：从云端获取最新车型列表
    this.loadModelsFromCloud();
  },

  onShow() {
    // 优化：每次显示时尝试刷新车型列表
    this.loadModelsFromCloud();
  },

  initNavBar() {
    this.setData(getNavBarInfo());
  },

  // 优化：从云端加载车型列表，新增车型后自动更新
  loadModelsFromCloud() {
    const app = getApp();

    // 如果云端可用，从云端获取
    if (app.globalData.cloudReady && wx.cloud) {
      try {
        const db = wx.cloud.database();
        db.collection('car_models').get().then(res => {
          if (res.data && res.data.length > 0) {
            const cloudModels = res.data.map(item => ({
              id: item.modelId,
              name: item.name,
              subtitle: item.subtitle || '',
              emoji: item.emoji || '🚗',
              bgColor: item.bgColor || '#F0F4FF',
            }));

            // 合并云端和本地车型（云端新增的排在后面）
            const localIds = new Set(DEFAULT_MODELS.map(m => m.id));
            const merged = [...DEFAULT_MODELS];
            cloudModels.forEach(cm => {
              if (!localIds.has(cm.id)) {
                merged.push(cm);
              }
            });

            this.setData({ models: merged });

            // 缓存到本地，下次无网也能用
            wx.setStorageSync('kt_cloud_car_models', merged);
          }
        }).catch(() => {
          // 云端获取失败，尝试使用本地缓存
          this.loadCachedModels();
        });
      } catch (e) {
        this.loadCachedModels();
      }
    } else {
      // 无云端，使用本地缓存
      this.loadCachedModels();
    }
  },

  // 从本地缓存加载云端车型
  loadCachedModels() {
    try {
      const cached = wx.getStorageSync('kt_cloud_car_models');
      if (cached && Array.isArray(cached) && cached.length > 0) {
        this.setData({ models: cached });
      }
    } catch (e) {}
  },

  // 选择车型
  onSelectModel(e) {
    const { id } = e.currentTarget.dataset;
    const model = this.data.models.find(m => m.id === id);
    this.setData({
      selectedModel: id,
      selectedModelName: model ? model.name : '',
    });
  },

  // 下一步
  onNextStep() {
    if (!this.data.selectedModel) {
      wx.showToast({ title: '请先选择车型', icon: 'none' });
      return;
    }
    this.setData({ step: 2 });
  },

  // 更换车型
  onChangeModel() {
    this.setData({ step: 1 });
  },

  // 选择省份
  onSelectProvince() {
    this.setData({ showProvincePicker: true });
  },
  onCloseProvince() {
    this.setData({ showProvincePicker: false });
  },
  onPickProvince(e) {
    this.setData({
      plateProvince: e.currentTarget.dataset.code,
      showProvincePicker: false,
    });
  },

  // 车牌输入
  onPlateInput(e) {
    this.setData({ plateNumber: e.detail.value.toUpperCase() });
  },

  // VIN输入
  onVinInput(e) {
    this.setData({ vin: e.detail.value.toUpperCase() });
  },
  onVinFocus() { this.setData({ vinFocus: true }); },
  onVinBlur()  { this.setData({ vinFocus: false }); },

  // 扫码识别VIN
  onScanVin() {
    wx.scanCode({
      scanType: ['barCode'],
      success: res => {
        this.setData({ vin: res.result.toUpperCase() });
      },
      fail: () => {
        wx.showToast({ title: '扫描失败，请手动输入', icon: 'none' });
      },
    });
  },

  // 选择日期
  onDatePickChange(e) {
    this.setData({ purchaseDate: e.detail.value });
  },

  // 默认开关
  onSwitchDefault(e) {
    this.setData({ isDefault: e.detail.value });
  },

  // 提交
  onSubmit() {
    // 验证
    if (!this.data.plateNumber && !this.data.vin) {
      wx.showToast({ title: '请至少填写车牌号或VIN码', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    const carData = {
      id: Date.now().toString(),
      model: this.data.selectedModelName,
      modelId: this.data.selectedModel,
      plate: this.data.plateProvince + this.data.plateNumber,
      vin: this.data.vin || '',
      purchaseDate: this.data.purchaseDate || '',
      isDefault: this.data.isDefault,
      createdAt: Date.now(),
    };

    // 存入本地
    try {
      let cars = wx.getStorageSync('kt_my_cars') || [];

      // 如果设为默认，取消其他默认
      if (carData.isDefault) {
        cars = cars.map(c => ({ ...c, isDefault: false }));
      }

      // 如果第一辆车，自动设为默认
      if (cars.length === 0) {
        carData.isDefault = true;
      }

      cars.push(carData);
      wx.setStorageSync('kt_my_cars', cars);

      // 设置当前默认车辆
      const defaultCar = cars.find(c => c.isDefault) || cars[0];
      wx.setStorageSync('kt_my_car', defaultCar);

      // 优化：同步到云端
      const app = getApp();
      if (app.saveSettingsToCloud) {
        app.saveSettingsToCloud('kt_my_cars', cars);
        app.saveSettingsToCloud('kt_my_car', defaultCar);
      }

      wx.showToast({ title: '添加成功', icon: 'success', duration: 1500 });

      setTimeout(() => {
        // 返回上一页（我的车辆）
        wx.navigateBack();
      }, 1500);

    } catch (e) {
      wx.showToast({ title: '保存失败，请重试', icon: 'none' });
      this.setData({ submitting: false });
    }
  },

  onBack() {
    if (this.data.step === 2) {
      this.setData({ step: 1 });
    } else {
      wx.navigateBack();
    }
  },
});
