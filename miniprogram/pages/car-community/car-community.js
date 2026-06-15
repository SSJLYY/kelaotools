// 车主社区
const { getNavBarInfo } = require('../../utils/nav');

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    navTotalHeight: 64,

    mode: 'list', // list | add | detail
    posts: [],
    filteredPosts: [],
    activeCategory: 'all',
    currentPost: null,

    categories: [
      { key: 'all', name: '全部', icon: '📋' },
      { key: 'experience', name: '用车体验', icon: '🚗' },
      { key: 'tips', name: '经验分享', icon: '💡' },
      { key: 'question', name: '提问求助', icon: '❓' },
      { key: 'show', name: '爱车晒单', icon: '📸' },
    ],

    form: {
      category: '',
      title: '',
      content: '',
    },
    categoryIndex: -1,
  },

  onLoad() {
    this.setData(getNavBarInfo());
  },

  onShow() {
    this.loadPosts();
  },

  loadPosts() {
    try {
      const list = wx.getStorageSync('kt_community_posts') || [];
      const normalized = list.map(item => {
        const cat = this.data.categories.find(c => c.key === item.category) || this.data.categories[0];
        return {
          id: item.id || `${Date.now()}_${Math.random()}`,
          category: item.category || 'all',
          categoryName: cat.name,
          categoryIcon: cat.icon,
          title: item.title || '',
          content: item.content || '',
          userName: item.userName || '匿名用户',
          likes: item.likes || 0,
          comments: item.comments || 0,
          liked: item.liked || false,
          createdAt: item.createdAt || Date.now(),
          dateText: formatDate(new Date(item.createdAt || Date.now())),
          timeText: formatTime(new Date(item.createdAt || Date.now())),
        };
      }).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      this.setData({ posts: normalized }, () => this.refreshList());
    } catch (e) {
      this.setData({ posts: [], filteredPosts: [] });
    }
  },

  refreshList() {
    const { posts, activeCategory } = this.data;
    const filtered = activeCategory === 'all'
      ? posts
      : posts.filter(item => item.category === activeCategory);
    this.setData({ filteredPosts: filtered });
  },

  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ activeCategory: category }, () => this.refreshList());
  },

  showAdd() {
    this.setData({
      mode: 'add',
      form: { category: '', title: '', content: '' },
      categoryIndex: -1,
    });
  },

  showList() {
    this.setData({ mode: 'list' });
  },

  onCategoryChange(e) {
    const index = Number(e.detail.value);
    const cat = this.data.categories[index];
    if (cat && cat.key !== 'all') {
      this.setData({
        categoryIndex: index,
        'form.category': cat.key,
      });
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  savePost() {
    const form = this.data.form;
    if (!form.category) {
      wx.showToast({ title: '请选择分类', icon: 'none' });
      return;
    }
    if (!form.title.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' });
      return;
    }
    if (!form.content.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    const post = {
      id: `${Date.now()}`,
      category: form.category,
      title: form.title.trim(),
      content: form.content.trim(),
      userName: this.getUserName(),
      likes: 0,
      comments: 0,
      liked: false,
      createdAt: Date.now(),
    };

    try {
      const list = wx.getStorageSync('kt_community_posts') || [];
      list.unshift(post);
      wx.setStorageSync('kt_community_posts', list);

      wx.showToast({ title: '发布成功', icon: 'success' });
      this.setData({ mode: 'list' }, () => this.loadPosts());
    } catch (e) {
      wx.showToast({ title: '发布失败', icon: 'none' });
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

  onPostTap(e) {
    const id = e.currentTarget.dataset.id;
    const post = this.data.posts.find(item => item.id === id);
    if (post) {
      this.setData({ mode: 'detail', currentPost: post });
    }
  },

  onLike(e) {
    const id = e.currentTarget.dataset.id;
    try {
      const list = wx.getStorageSync('kt_community_posts') || [];
      const idx = list.findIndex(item => item.id === id);
      if (idx >= 0) {
        const post = list[idx];
        post.liked = !post.liked;
        post.likes = post.liked ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1);
        wx.setStorageSync('kt_community_posts', list);
        this.loadPosts();
      }
    } catch (e) {}
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除帖子',
      content: '确定删除这条帖子吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: res => {
        if (!res.confirm) return;
        try {
          const list = (wx.getStorageSync('kt_community_posts') || []).filter(item => item.id !== id);
          wx.setStorageSync('kt_community_posts', list);
          this.loadPosts();
          this.setData({ mode: 'list' });
          wx.showToast({ title: '已删除', icon: 'success' });
        } catch (err) {
          wx.showToast({ title: '删除失败', icon: 'none' });
        }
      },
    });
  },

  onBack() {
    if (this.data.mode === 'detail') {
      this.setData({ mode: 'list', currentPost: null });
      return;
    }
    if (this.data.mode === 'add') {
      this.showList();
      return;
    }
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) });
  },

  onShareAppMessage() {
    return {
      title: '极氪车主社区 - 分享用车心得',
      path: '/pages/car-community/car-community',
    };
  },

  onShareTimeline() {
    return {
      title: '极氪车主社区 - 分享用车心得',
    };
  },
});
