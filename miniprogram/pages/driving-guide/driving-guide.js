// 提车指南 - 28项检查清单
const { getNavBarInfo } = require('../../utils/nav');

Page({
  data: { darkMode: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,
    totalItems: 28,
    checkedCount: 0,
    allChecked: false,
    categories: [
      { key: '外观检查', icon: '🚗', checkedCount: 0, totalCount: 7, items: [
        { id: 1, text: '车漆是否有划痕、凹陷、色差', checked: false },
        { id: 2, text: '前后挡风玻璃是否有裂纹或气泡', checked: false },
        { id: 3, text: '四条轮胎是否完好，胎毛是否在', checked: false },
        { id: 4, text: '轮毂是否有刮擦痕迹', checked: false },
        { id: 5, text: '大灯、尾灯、转向灯是否正常', checked: false },
        { id: 6, text: '车门缝隙是否均匀对称', checked: false },
        { id: 7, text: '天窗是否正常开合，无异响', checked: false },
      ]},
      { key: '内饰检查', icon: '🪑', checkedCount: 0, totalCount: 6, items: [
        { id: 8, text: '座椅皮质是否有破损或污渍', checked: false },
        { id: 9, text: '方向盘按键是否灵敏', checked: false },
        { id: 10, text: '中控屏触控是否灵敏，无坏点', checked: false },
        { id: 11, text: '仪表盘显示是否正常', checked: false },
        { id: 12, text: '空调出风是否正常，无异味', checked: false },
        { id: 13, text: '音响所有扬声器是否正常发声', checked: false },
      ]},
      { key: '功能测试', icon: '⚙️', checkedCount: 0, totalCount: 5, items: [
        { id: 14, text: '四个车门锁止/解锁是否正常', checked: false },
        { id: 15, text: '四个车窗升降是否正常', checked: false },
        { id: 16, text: '后视镜电动调节和折叠是否正常', checked: false },
        { id: 17, text: '前后雨刮器是否正常工作', checked: false },
        { id: 18, text: '充电口盖是否正常开合', checked: false },
      ]},
      { key: '电池检查', icon: '🔋', checkedCount: 0, totalCount: 4, items: [
        { id: 19, text: '电池SOH健康度是否≥99%', checked: false },
        { id: 20, text: '插枪充电是否正常启动', checked: false },
        { id: 21, text: '表显续航与实际是否一致', checked: false },
        { id: 22, text: '电池温度显示是否正常', checked: false },
      ]},
      { key: '文件核验', icon: '📄', checkedCount: 0, totalCount: 3, items: [
        { id: 23, text: '车辆合格证是否齐全', checked: false },
        { id: 24, text: '三包凭证是否在有效期内', checked: false },
        { id: 25, text: '购车发票信息是否正确', checked: false },
      ]},
      { key: '随车物品', icon: '🎒', checkedCount: 0, totalCount: 3, items: [
        { id: 26, text: '便携充电枪是否在车内', checked: false },
        { id: 27, text: '随车工具包是否齐全', checked: false },
        { id: 28, text: '补胎液/备胎是否在指定位置', checked: false },
      ]},
    ],
  },

  onLoad() { this.loadDarkMode();
    this.setData(getNavBarInfo());
  },

  onCheckToggle(e) {
    const { catIdx, itemIdx } = e.currentTarget.dataset;
    const ci = Number(catIdx);
    const ii = Number(itemIdx);
    const categories = this.data.categories;
    categories[ci].items[ii].checked = !categories[ci].items[ii].checked;

    // 更新每个分类的已选数量
    let checkedCount = 0;
    categories.forEach(cat => {
      let catChecked = 0;
      cat.items.forEach(item => { if (item.checked) catChecked++; });
      cat.checkedCount = catChecked;
      checkedCount += catChecked;
    });

    const allChecked = checkedCount === this.data.totalItems;
    this.setData({ categories, checkedCount, allChecked });

    if (allChecked) {
      wx.showModal({
        title: '恭喜！所有检查项已通过',
        content: '提车检查全部完成，祝您用车愉快！',
        showCancel: false,
        confirmText: '太棒了',
      });
    }
  },

  onReset() {
    wx.showModal({
      title: '重置检查清单',
      content: '确定要重置所有检查项吗？',
      success: res => {
        if (res.confirm) {
          const categories = this.data.categories;
          categories.forEach(cat => {
            cat.checkedCount = 0;
            cat.items.forEach(item => { item.checked = false; });
          });
          this.setData({ categories, checkedCount: 0, allChecked: false });
        }
      },
    });
  },

  
  loadDarkMode() { try { const darkMode = wx.getStorageSync('kt_dark_mode') || false; this.setData({ darkMode }); } catch (e) {} },
  onBack() { wx.navigateBack(); },

  onShareAppMessage() {
    return {
      title: '极氪提车指南 - 28项检查清单，提车不踩坑',
      path: '/pages/driving-guide/driving-guide',
    };
  },

  onShareTimeline() {
    return { title: '极氪提车指南 - 28项检查清单' };
  },
});
