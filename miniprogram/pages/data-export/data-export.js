// 数据导出
const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: { darkMode: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    exportTypes: [
      { id: 'charging', name: '充电记录', icon: '⚡', count: 0, checked: true },
      { id: 'mileage', name: '里程记录', icon: '🛣️', count: 0, checked: true },
      { id: 'maintenance', name: '养车账本', icon: '🔧', count: 0, checked: true },
      { id: 'carWash', name: '洗车日记', icon: '🚿', count: 0, checked: true },
      { id: 'modification', name: '改装配件', icon: '🏎️', count: 0, checked: true },
      { id: 'carpool', name: '顺风车收入', icon: '🚗', count: 0, checked: true },
    ],

    exportFormat: 'csv',
    dateRange: 'all',
    dateRangeOptions: [
      { value: 'all', label: '全部数据' },
      { value: 'month', label: '最近一个月' },
      { value: 'quarter', label: '最近三个月' },
      { value: 'year', label: '最近一年' },
    ],

    exporting: false,
  },

  onLoad() { this.loadDarkMode();
    this.setData(getNavBarInfo());
    this.loadDataCounts();
  },

  loadDataCounts() {
    try {
      const charging = (wx.getStorageSync('kt_charging_logs') || []).length;
      const mileage = (wx.getStorageSync('kt_mileage_logs') || []).length;
      const maintenance = (wx.getStorageSync('kt_maintenance_logs') || []).length;
      const carWash = (wx.getStorageSync('kt_car_wash_logs') || []).length;
      const modification = (wx.getStorageSync('kt_modification_logs') || []).length;
      const carpool = (wx.getStorageSync('kt_ride_logs') || []).length;

      this.setData({
        'exportTypes[0].count': charging,
        'exportTypes[1].count': mileage,
        'exportTypes[2].count': maintenance,
        'exportTypes[3].count': carWash,
        'exportTypes[4].count': modification,
        'exportTypes[5].count': carpool,
      });
    } catch (e) {}
  },

  onToggleType(e) {
    const index = Number(e.currentTarget.dataset.index);
    const key = `exportTypes[${index}].checked`;
    this.setData({ [key]: !this.data.exportTypes[index].checked });
  },

  onSelectAll() {
    const allChecked = this.data.exportTypes.every(item => item.checked);
    const exportTypes = this.data.exportTypes.map(item => ({
      ...item,
      checked: !allChecked,
    }));
    this.setData({ exportTypes });
  },

  onFormatChange(e) {
    this.setData({ exportFormat: e.detail.value });
  },

  onDateRangeChange(e) {
    this.setData({ dateRange: e.detail.value });
  },

  getSelectedTypes() {
    return this.data.exportTypes.filter(item => item.checked).map(item => item.id);
  },

  getDateRange() {
    const now = new Date();
    const range = this.data.dateRange;
    if (range === 'all') return { start: 0, end: Date.now() };
    const months = range === 'month' ? 1 : range === 'quarter' ? 3 : 12;
    const start = new Date(now.getFullYear(), now.getMonth() - months, 1).getTime();
    return { start, end: Date.now() };
  },

  loadData(type, range) {
    const storageKeys = {
      charging: 'kt_charging_logs',
      mileage: 'kt_mileage_logs',
      maintenance: 'kt_maintenance_logs',
      carWash: 'kt_car_wash_logs',
      modification: 'kt_modification_logs',
      carpool: 'kt_ride_logs',
    };

    try {
      const list = wx.getStorageSync(storageKeys[type]) || [];
      return list.filter(item => {
        const t = item.createdAt || 0;
        return t >= range.start && t < range.end;
      });
    } catch (e) {
      return [];
    }
  },

  formatDataForCSV(type, data) {
    const headers = {
      charging: ['日期', '费用(元)', '电量(kWh)', '单价(元/kWh)', '来源', '备注'],
      mileage: ['日期', '类型', '里程(km)', '能耗(kWh)', '起点', '终点', '备注'],
      maintenance: ['日期', '类型', '费用(元)', '地点', '备注'],
      carWash: ['日期', '方式', '费用(元)', '地点', '备注'],
      modification: ['日期', '类型', '名称', '费用(元)', '品牌', '来源', '备注'],
      carpool: ['日期', '平台', '收入(元)', '成本(元)', '备注'],
    };

    const rows = data.map(item => {
      switch (type) {
        case 'charging':
          return [
            this.formatDate(item.createdAt),
            (item.fee / 100).toFixed(2),
            (item.kwh / 1000).toFixed(2),
            item.unitPrice ? (item.unitPrice / 100).toFixed(2) : '',
            item.source || '',
            item.note || '',
          ];
        case 'mileage':
          return [
            item.date || this.formatDate(item.createdAt),
            item.type || '',
            item.mileage || '',
            item.consumption || '',
            item.startLocation || '',
            item.endLocation || '',
            item.note || '',
          ];
        case 'maintenance':
          return [
            item.date || this.formatDate(item.createdAt),
            item.typeName || '',
            (item.fee / 100).toFixed(2),
            item.location || '',
            item.note || '',
          ];
        case 'carWash':
          return [
            item.date || this.formatDate(item.createdAt),
            item.type || '',
            (item.amount / 100).toFixed(2),
            item.location || '',
            item.note || '',
          ];
        case 'modification':
          return [
            item.date || this.formatDate(item.createdAt),
            item.type || '',
            item.name || '',
            (item.amount / 100).toFixed(2),
            item.brand || '',
            item.source || '',
            item.note || '',
          ];
        case 'carpool':
          return [
            item.date || this.formatDate(item.createdAt),
            item.platform || '',
            (item.revenue / 100).toFixed(2),
            (item.cost / 100).toFixed(2),
            item.note || '',
          ];
        default:
          return [];
      }
    });

    return { headers: headers[type] || [], rows };
  },

  formatDate(timestamp) {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  generateCSV(allData) {
    let csv = '\uFEFF';

    allData.forEach(({ type, name, data }) => {
      if (data.length === 0) return;

      csv += `${name}\n`;
      const { headers, rows } = this.formatDataForCSV(type, data);
      csv += headers.join(',') + '\n';
      rows.forEach(row => {
        csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
      });
      csv += '\n';
    });

    return csv;
  },

  async onExport() {
    const selectedTypes = this.getSelectedTypes();
    if (selectedTypes.length === 0) {
      wx.showToast({ title: '请选择导出内容', icon: 'none' });
      return;
    }

    this.setData({ exporting: true });

    try {
      const range = this.getDateRange();
      const typeNames = {
        charging: '充电记录',
        mileage: '里程记录',
        maintenance: '养车账本',
        carWash: '洗车日记',
        modification: '改装配件',
        carpool: '顺风车收入',
      };

      const allData = selectedTypes.map(type => ({
        type,
        name: typeNames[type],
        data: this.loadData(type, range),
      }));

      const csv = this.generateCSV(allData);
      const fileName = `氪佬工具箱_数据导出_${this.formatDate(Date.now())}.csv`;
      const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;

      const fs = wx.getFileSystemManager();
      fs.writeFileSync(filePath, csv, 'utf-8');

      await wx.shareFileMessage({
        filePath,
        fileName,
        success: () => {
          wx.showToast({ title: '导出成功', icon: 'success' });
        },
        fail: () => {
          wx.showToast({ title: '导出取消', icon: 'none' });
        },
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'none' });
    } finally {
      this.setData({ exporting: false });
    }
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/mine/mine' }) });
  },
});
