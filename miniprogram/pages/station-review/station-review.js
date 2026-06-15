// 充电站评价
const { getNavBarInfo } = require('../../utils/nav');

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    mode: 'list', // list | add | detail
    reviews: [],
    filteredReviews: [],
    activeFilter: 'all',

    stationName: '',
    stationId: '',

    // 评价表单
    form: {
      rating: 5,
      speed: 5,
      price: 5,
      environment: 5,
      comment: '',
      stationName: '',
    },

    filters: [
      { key: 'all', name: '全部' },
      { key: '5', name: '好评' },
      { key: '3-4', name: '中评' },
      { key: '1-2', name: '差评' },
    ],
  },

  onLoad(options) {
    this.setData(getNavBarInfo());
    if (options.stationId) {
      this.setData({ stationId: options.stationId, stationName: options.stationName || '' });
    }
  },

  onShow() {
    this.loadReviews();
  },

  loadReviews() {
    try {
      const list = wx.getStorageSync('kt_station_reviews') || [];
      const normalized = list.map(item => ({
        id: item.id || `${Date.now()}_${Math.random()}`,
        stationId: item.stationId || '',
        stationName: item.stationName || '未知充电站',
        rating: item.rating || 5,
        speed: item.speed || 5,
        price: item.price || 5,
        environment: item.environment || 5,
        avgRating: ((item.rating + item.speed + item.price + item.environment) / 4).toFixed(1),
        comment: item.comment || '',
        userName: item.userName || '匿名用户',
        createdAt: item.createdAt || Date.now(),
        dateText: formatDate(new Date(item.createdAt || Date.now())),
      })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      this.setData({ reviews: normalized }, () => this.refreshList());
    } catch (e) {
      this.setData({ reviews: [], filteredReviews: [] });
    }
  },

  refreshList() {
    const { reviews, activeFilter } = this.data;
    let filtered = reviews;

    if (activeFilter === '5') {
      filtered = reviews.filter(item => Number(item.avgRating) >= 4.5);
    } else if (activeFilter === '3-4') {
      filtered = reviews.filter(item => Number(item.avgRating) >= 3 && Number(item.avgRating) < 4.5);
    } else if (activeFilter === '1-2') {
      filtered = reviews.filter(item => Number(item.avgRating) < 3);
    }

    this.setData({ filteredReviews: filtered });
  },

  onFilterTap(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ activeFilter: filter }, () => this.refreshList());
  },

  showAdd() {
    this.setData({
      mode: 'add',
      form: {
        rating: 5,
        speed: 5,
        price: 5,
        environment: 5,
        comment: '',
        stationName: this.data.stationName,
      },
    });
  },

  showList() {
    this.setData({ mode: 'list' });
  },

  onRatingChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = Number(e.detail.value);
    this.setData({ [`form.${field}`]: value });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  saveReview() {
    const form = this.data.form;
    if (!form.stationName) {
      wx.showToast({ title: '请输入充电站名称', icon: 'none' });
      return;
    }

    const review = {
      id: `${Date.now()}`,
      stationId: this.data.stationId,
      stationName: form.stationName.trim(),
      rating: form.rating,
      speed: form.speed,
      price: form.price,
      environment: form.environment,
      comment: form.comment.trim(),
      userName: this.getUserName(),
      createdAt: Date.now(),
    };

    try {
      const list = wx.getStorageSync('kt_station_reviews') || [];
      list.unshift(review);
      wx.setStorageSync('kt_station_reviews', list);

      wx.showToast({ title: '评价成功', icon: 'success' });
      this.setData({ mode: 'list' }, () => this.loadReviews());
    } catch (e) {
      wx.showToast({ title: '评价失败', icon: 'none' });
    }
  },

  getUserName() {
    try {
      const car = wx.getStorageSync('kt_my_car') || {};
      return car.plate || car.model || '匿名用户';
    } catch (e) {
      return '匿名用户';
    }
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除评价',
      content: '确定删除这条评价吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          const list = (wx.getStorageSync('kt_station_reviews') || []).filter(item => item.id !== id);
          wx.setStorageSync('kt_station_reviews', list);
          this.loadReviews();
          wx.showToast({ title: '已删除', icon: 'success' });
        } catch (err) {
          wx.showToast({ title: '删除失败', icon: 'none' });
        }
      },
    });
  },

  onBack() {
    if (this.data.mode === 'add') {
      this.showList();
      return;
    }
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) });
  },

  onShareAppMessage() {
    return {
      title: '充电站评价 - 看看其他车友怎么说',
      path: '/pages/station-review/station-review',
    };
  },
});
