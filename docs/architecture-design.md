# 氪佬工具箱 — 微信小程序架构设计文档

> 版本：v2.0 | 日期：2026-06-05 | 编码：UTF-8 | 定位：极氪车主工具

---

## 一、项目背景

**氪佬工具箱** = "氪"（极氪 ZEEKR）+ "佬"（车主达人），面向极氪车主的一站式用车工具小程序。

参考竞品：鹏友工具箱（小鹏汽车）。目标：**快速上线、获取极氪车主用户、持续迭代**。

### 核心用户画像

| 维度 | 描述 |
|------|------|
| 人群 | 极氪车主 / 准车主 |
| 场景 | 充电、养车、出行记账、车友交流 |
| 痛点 | 充电费用算不清、养护记录零散、出行收入难统计 |
| 触点 | 微信搜一搜 → 小程序、车友群分享、朋友圈裂变 |

---

## 二、技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 框架 | 微信原生 | 最轻量，审核快，避免跨端框架冗余 |
| 状态管理 | 全局 App + Page data | 工具类状态简单 |
| UI | 自研组件 + CSS 变量 | 品牌感统一，不做 WeUI 依赖 |
| 后端 | 微信云开发（CloudBase） | 免运维，MVP 免费额度够用 |
| 多语言 | 自研 i18n（zh-CN / en-US） | 轻量可控 |
| 样式 | WXSS + CSS Custom Properties | 无编译依赖，开发效率高 |
| 构建 | 微信开发者工具自带 | 零配置 |

### 为什么不选 Taro/uni-app？
- 目标页面仅 8~12 页，无跨端需求
- 原生审核通过率最高
- MVP 阶段框架是负资产

---

## 三、项目完整目录结构

```
kelaocartools/
├── miniprogram/                  # 小程序主目录
│   ├── app.js                    # 入口：语言初始化、云开发、版本更新
│   ├── app.json                  # 路由、窗口、tabBar、分包声明
│   ├── app.wxss                  # 全局样式变量、通用工具类
│   ├── project.config.json       # 项目配置
│   ├── sitemap.json              # SEO 配置（微信搜一搜索引）
│   │
│   ├── i18n/                     # 多语言模块
│   │   ├── index.js              # 核心：t()、setLang()、getSupportedLangs()
│   │   ├── zh-CN.js              # 中文语言包
│   │   └── en-US.js              # 英文语言包
│   │
│   ├── config/                   # 配置驱动层
│   │   ├── tools.config.js       # 工具列表配置（驱动首页/工具页）
│   │   └── theme.config.js       # 主题色、圆角、间距变量
│   │
│   ├── utils/                    # 工具函数
│   │   ├── request.js            # wx.request 封装（错误处理/重试）
│   │   ├── storage.js            # 本地存储读写封装
│   │   ├── format.js             # 金额、日期、电量格式化
│   │   └── const.js              # 全局常量（路径、车型、充电类型）
│   │
│   ├── styles/                   # 全局样式
│   │   ├── variables.wxss        # CSS 变量定义
│   │   └── common.wxss           # 通用样式类（flex/文本/间距）
│   │
│   ├── assets/                   # 静态资源
│   │   └── images/
│   │       └── icons/            # 工具图标 PNG/SVG
│   │
│   ├── components/               # 通用组件库
│   │   ├── banner-card/          # 品牌引导卡片（渐变背景 + 按钮）
│   │   ├── quick-entry/          # 2x2 快捷功能入口网格
│   │   ├── tool-item/            # 工具列表项（图标 + 名称 + 箭头）
│   │   ├── tip-bar/              # 数据提示条（有/无记录两种状态）
│   │   ├── info-card/            # 资讯/攻略推荐卡片
│   │   ├── language-switch/      # 语言切换按钮
│   │   ├── empty-state/          # 空状态占位
│   │   └── share-poster/         # Canvas 分享图生成组件
│   │
│   ├── pages/                    # 主包页面（Tab 页）
│   │   ├── index/                # 首页（全套可用）
│   │   │   ├── index.js
│   │   │   ├── index.json
│   │   │   ├── index.wxml
│   │   │   └── index.wxss
│   │   ├── tools/                # 工具页
│   │   ├── community/            # 车主社区
│   │   └── mine/                 # 个人中心
│   │
│   └── subpkg/                   # 分包（工具详情页）
│       ├── charging-calc/        # 充电计算器
│       │   ├── charging-cost/    # 充电费用计算 ✅ 已实现
│       │   ├── scene-code/       # 智慧场景码（占位）
│       │   └── test-drive/       # 试驾邀请（占位）
│       ├── charging-log/         # 充电记录
│       │   └── charging-log/     # 充电记录列表（占位）
│       ├── maintenance/          # 养车工具
│       │   ├── maintenance-ledger/ # 养车账本（占位）
│       │   └── vehicle-info/     # 车辆信息（占位）
│       └── ride-log/             # 出行记录
│           └── carpool-revenue/  # 顺风车收入（占位）
│
├── cloudfunctions/               # 云函数
│   ├── userCenter/               # 用户登录、资料管理
│   └── dataSync/                 # 数据云端同步
│
└── docs/                         # 文档
    ├── architecture-design.md    # 本文件
    ├── api-design.md             # 接口设计
    └── deployment-guide.md       # 审核上线指南
```

---

## 四、多语言方案（中/英）

### 4.1 设计原则

- 语言包与代码分离，代码中只引用 key
- 支持模板替换：`t('home.tipBarHasData', { count: 5 })`
- 语言切换无需重启，`onShow` 时自动刷新
- 语言偏好存入 `wx.Storage`，持久化

### 4.2 核心实现

```javascript
// i18n/index.js
const zhCN = require('./zh-CN');
const enUS = require('./en-US');

const langs = { 'zh-CN': zhCN, 'en-US': enUS, en: enUS };
let currentLang = 'zh-CN';

function init() {
  const stored = wx.getStorageSync('app_lang') || 'zh-CN';
  setLang(stored);
}

function setLang(lang) {
  currentLang = langs[lang] ? lang : 'zh-CN';
  wx.setStorageSync('app_lang', currentLang);
  getApp().globalData.lang = currentLang;
  getApp().globalData.langVersion = (getApp().globalData.langVersion || 0) + 1;
}

function t(path, params) {
  const keys = path.split('.');
  let result = langs[currentLang];
  for (const k of keys) {
    if (result == null) return path;
    result = result[k];
  }
  if (typeof result !== 'string') return path;

  // 模板替换: t('home.tipBarHasData', { count: 5 })
  if (params) {
    Object.keys(params).forEach(key =>
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), params[key])
    );
  }
  return result;
}

function getCurrentLang() { return currentLang; }
function getSupportedLangs() {
  return [
    { code: 'zh-CN', name: '中文' },
    { code: 'en-US', name: 'English' },
  ];
}

module.exports = { init, setLang, t, getCurrentLang, getSupportedLangs };
```

### 4.3 页面使用

```javascript
// pages/index/index.js
const i18n = require('../../i18n/index');

Page({
  onShow() {
    this.setData({
      bannerTitle: i18n.t('home.bannerTitle'),
      toolsTitle: i18n.t('home.toolsTitle'),
    });
  },
});
```

---

## 五、页面路由与分包策略

### 5.1 app.json 配置

```json
{
  "pages": [
    "pages/index/index",
    "pages/tools/tools",
    "pages/community/community",
    "pages/mine/mine"
  ],
  "subpackages": [
    {
      "root": "subpkg/charging-calc",
      "pages": [
        "charging-cost/charging-cost",
        "scene-code/scene-code",
        "test-drive/test-drive"
      ]
    },
    {
      "root": "subpkg/charging-log",
      "pages": [
        "charging-log/charging-log"
      ]
    },
    {
      "root": "subpkg/maintenance",
      "pages": [
        "maintenance-ledger/maintenance-ledger",
        "vehicle-info/vehicle-info"
      ]
    },
    {
      "root": "subpkg/ride-log",
      "pages": [
        "carpool-revenue/carpool-revenue"
      ]
    }
  ],
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", "text": "首页", "iconPath": "/assets/images/icons/home.png", "selectedIconPath": "/assets/images/icons/home-active.png" },
      { "pagePath": "pages/tools/tools", "text": "工具", "iconPath": "/assets/images/icons/tools.png", "selectedIconPath": "/assets/images/icons/tools-active.png" },
      { "pagePath": "pages/community/community", "text": "社区", "iconPath": "/assets/images/icons/community.png", "selectedIconPath": "/assets/images/icons/community-active.png" },
      { "pagePath": "pages/mine/mine", "text": "我的", "iconPath": "/assets/images/icons/mine.png", "selectedIconPath": "/assets/images/icons/mine-active.png" }
    ]
  }
}
```

### 5.2 路由图

```
首页 (Tab) ──→ 快捷入口 (2×2)
  ├── 智慧场景码  → subpkg/charging-calc/scene-code
  ├── 车辆信息    → subpkg/maintenance/vehicle-info
  ├── 极氪试驾    → subpkg/charging-calc/test-drive
  └── 车主社区    → pages/community/community

常用工具
  ├── 充电费用计算 → subpkg/charging-calc/charging-cost
  ├── 充电记录     → subpkg/charging-log/charging-log
  ├── 养车账本     → subpkg/maintenance/maintenance-ledger
  └── 顺风车收入   → subpkg/ride-log/carpool-revenue

工具 (Tab) ──→ 全量工具分类列表 → 各工具详情
社区 (Tab) ──→ 车主分享/攻略
我的 (Tab) ──→ 个人中心 / 我的极氪 / 语言切换
```

### 5.3 分包体积控制

| 分包名 | 预估大小 | 说明 |
|------|------|------|
| 主包 | < 1.5MB | 4 Tab 页 + 组件 + 公共代码 |
| charging-calc | < 800KB | 3 个页面 |
| charging-log | < 500KB | 1 个页面 |
| maintenance | < 600KB | 2 个页面 |
| ride-log | < 400KB | 1 个页面 |

---

## 六、首页 UI 设计

### 6.1 布局结构（参考鹏友工具箱）

```
┌──────────────────────────────┐
│  [状态栏]                      │
├──────────────────────────────┤
│  ⚡ Logo    氪佬工具箱    🌐  │  ← 自定义导航栏（含语言切换按钮）
├──────────────────────────────┤
│  ┌─────────────────────────┐ │
│  │  🔋 Banner 引导卡片      │ │
│  │  欢迎加入极氪             │ │  ← 极氪品牌渐变（蓝→紫）
│  │  充电、养车、出行一站搞定  │ │
│  │  [添加你的极氪 →]        │ │
│  └─────────────────────────┘ │
├──────────────────────────────┤
│  ┌──────────┐ ┌──────────┐  │
│  │ ⚙️       │ │ 🚗       │  │
│  │智慧场景码│ │ 车辆信息 │  │  ← 快捷入口 2×2
│  └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐  │
│  │ 🧪       │ │ 👥       │  │
│  │极氪试驾  │ │车主社区  │  │
│  └──────────┘ └──────────┘  │
├──────────────────────────────┤
│  💡 本月暂无充电记录，快去充  │  ← 数据提示条
├──────────────────────────────┤
│  📝 用车技巧 · 极氪OTA升级  →│  ← 攻略入口
├──────────────────────────────┤
│  常用工具              更多 >│
│  ┌─────────────────────────┐ │
│  │ 🔌  充电费用计算         │ │
│  │ 📋  充电记录             │ │  ← 工具列表
│  │ 🛠️  养车账本             │ │
│  │ 🚘  顺风车收入           │ │
│  └─────────────────────────┘ │
├──────────────────────────────┤
│  首页 │ 工具 │ 社区 │ 我的   │  ← 底部 TabBar
└──────────────────────────────┘
```

### 6.2 配色方案

极氪品牌色系 → 蓝色科技 + 紫色点缀：

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 | `#0066FF` | 极氪蓝，科技感 |
| 辅色 | `#7C3AED` | 紫色点缀 |
| 渐变 | `#0066FF → #7C3AED` | Banner/按钮渐变 |
| 文字主色 | `#1A1A2E` | 深色文字 |
| 文字辅色 | `#6B7280` | 灰色文字 |
| 背景色 | `#F5F5F7` | 浅灰背景 |
| 卡片白 | `#FFFFFF` | 纯白卡片 |
| 成功绿 | `#10B981` | 充电完成等正向状态 |
| 提示蓝 | `#E8F4FD` | 提示条背景 |
| 警示橙 | `#F59E0B` | 提醒/待处理 |

### 6.3 品牌差异化设计要素

| 参考（鹏友） | 氪佬工具箱 |
|------|------|
| 小鹏汽车品牌色 | 极氪品牌色（注册前用 #0066FF） |
| 添加你的小鹏 | 添加你的极氪 |
| 充电记录（小鹏） | 充电记录（支持极氪全系） |
| 新鹏友试驾 | 极氪试驾 |

---

## 七、数据架构

### 7.1 存储分层

| 层 | 技术 | 内容 | 容量 |
|------|------|------|------|
| L1 本地 | `wx.setStorage` | 语言偏好、用户设置、最近记录缓存 | ≤ 10MB |
| L2 云端 | 云开发数据库 | 充电记录、养车记录、出行记录 | 按需扩容 |
| L3 静态 | 云开发存储 | 工具图标、分享模板图 | CDN |

### 7.2 核心数据模型（NoSQL）

```
users                      # 用户
  ├── _openid
  ├── nickname / avatarUrl
  ├── lang                 # 'zh-CN' | 'en-US'
  ├── carModel             # 极氪车型 (ZEEKR 001/007/X/MIX)
  └── createdAt

charging_logs              # 充电记录
  ├── _openid
  ├── type                 # home | public | destination
  ├── startPercent / endPercent
  ├── kwh                  # 充电度数
  ├── fee                  # 费用（分）
  ├── station              # 充电站名称
  └── createdAt

maintenance_logs           # 养车记录
  ├── _openid
  ├── type                 # 保养 | 维修 | 保险 | 改装
  ├── fee                  # 费用（分）
  ├── mileage              # 里程数
  ├── note
  └── createdAt

ride_logs                  # 出行记录
  ├── _openid
  ├── type                 # carpool | travel
  ├── from / to            # 起终点
  ├── distance             # 距离（km）
  ├── revenue              # 收入（分）
  └── createdAt
```

### 7.3 配置驱动渲染

首页工具列表、工具页分类均由 `config/tools.config.js` 驱动：

```javascript
// 首页渲染伪代码
toolList.map(t => ({
  ...t,
  name: i18n.t(t.key),      // key → 动态翻译
}))
```

新增工具只需在配置数组中追加一行，零代码改动。

---

## 八、核心代码

### 8.1 app.js

```javascript
const i18n = require('./i18n/index');

App({
  onLaunch() {
    i18n.init();
    if (wx.cloud) {
      wx.cloud.init({ env: 'krypton-tools-xxxxx', traceUser: true });
    }
    this.checkUpdate();
  },

  globalData: { lang: 'zh-CN', langVersion: 0 },

  checkUpdate() {
    if (!wx.getUpdateManager) return;
    const um = wx.getUpdateManager();
    um.onUpdateReady(() => {
      wx.showModal({
        title: '新版本已就绪',
        content: '是否立即重启更新？',
        success: res => res.confirm && um.applyUpdate(),
      });
    });
  },
});
```

### 8.2 首页逻辑

```javascript
const i18n = require('../../i18n/index');
const toolCfg = require('../../config/tools.config');

Page({
  data: {
    banner: {}, quickEntries: [], toolList: [],
    tipText: '', toolsTitle: '', moreText: '', hasRecords: false,
  },

  onShow() {
    this.renderI18n();
    this.loadChargingStatus();
  },

  renderI18n() {
    this.setData({
      banner: { title: i18n.t('home.bannerTitle'), sub: i18n.t('home.bannerSub'), btn: i18n.t('home.bannerBtn') },
      quickEntries: toolCfg.quickEntries.map(e => ({ ...e, name: i18n.t(e.key) })),
      toolList: toolCfg.toolList.map(t => ({ ...t, name: i18n.t(t.key) })),
      tipText: i18n.t('home.tipBar'),
      toolsTitle: i18n.t('home.toolsTitle'),
      moreText: i18n.t('home.more'),
    });
  },

  loadChargingStatus() {
    const logs = wx.getStorageSync('kt_charging_logs') || [];
    const thisMonth = logs.filter(l => /* 本月内 */);
    this.setData({
      hasRecords: thisMonth.length > 0,
      tipText: thisMonth.length > 0
        ? i18n.t('home.tipBarHasData', { count: thisMonth.length })
        : i18n.t('home.tipBar'),
    });
  },

  onToolTap(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.path });
  },
});
```

### 8.3 充电费用计算器

```javascript
Page({
  data: {
    currentCharge: 20,       // %
    targetCharge: 90,        // %
    batteryCapacity: 100,    // kWh
    unitPrice: 0.6,          // 元/kWh（谷电）
    result: '',
    hasResult: false,
    showPeakTip: false,
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [field]: Number(e.detail.value) || 0 });
  },

  onCalculate() {
    const { currentCharge, targetCharge, batteryCapacity, unitPrice } = this.data;
    if (currentCharge >= targetCharge) {
      wx.showToast({ title: '当前电量已达目标', icon: 'none' }); return;
    }
    const kwh = ((targetCharge - currentCharge) / 100) * batteryCapacity;
    const fee = (kwh * unitPrice).toFixed(2);
    const result = i18n.t('calculator.charging.result', { fee, kwh: kwh.toFixed(1) });
    this.setData({ result, hasResult: true, showPeakTip: unitPrice > 1 });
  },

  // Canvas 分享图生成
  onShare() {
    // 调用 share-poster 组件生成分享图
  },
});
```

---

## 九、快速上线策略

### 9.1 MVP 功能切分

| 优先级 | 功能 | 理由 |
|------|------|------|
| **P0** | 首页完整 UI + 多语言 | 门面，用户第一印象 |
| **P0** | 充电费用计算器 | 车主高频需求 |
| **P0** | 充电记录（本地版） | 留存抓手 |
| **P0** | 分享裂变 | 0 成本获客 |
| **P1** | 养车账本 | 低频但刚需 |
| **P1** | 顺风车收入统计 | 特定用户场景 |
| **P1** | 车辆信息页 | 补充功能完整性 |
| **P2** | 场景码 / 试驾 | 需配合极氪官方接口 |
| **P2** | 车主社区 | 内容运营成本高 |

### 9.2 开发排期（单人）

| 阶段 | 天数 | 产出 |
|------|------|------|
| 项目搭建 + i18n + 全局样式 | 1天 | 目录结构、多语言框架 |
| 首页 UI 开发 | 1.5天 | 完整首页，配置驱动渲染 |
| 充电费用计算器 | 1天 | 第一个完整工具页 |
| 充电记录 | 1天 | CRUD + 本地存储 |
| 养车账本 | 1天 | 记账核心能力 |
| 我的页面 + 语言切换 | 0.5天 | 设置中心 |
| 分享裂变 + Canvas 海报 | 0.5天 | 增长闭环 |
| 调试 + 提审材料 | 1天 | 测试、截图、描述 |
| **合计** | **~7.5天** | 可提审 MVP |

### 9.3 用户增长设计

**1. 分享裂变（0 成本获客）**
- 充电计算结果页 → 一键生成分享图
- "极氪 001 充满 80% 仅需 ¥31.2" → 自带传播
- 分享卡片带小程序路径参数，直达计算器

**2. 微信搜一搜**
- 小程序名称："氪佬工具箱"
- 搜索关键词：极氪工具箱、极氪充电、极氪养车、极氪车主
- sitemap.json 配置页面索引规则

**3. 社群增长**
- 极氪车友群 → 小程序分享
- 车主口碑传播：充电记录对比 → 分享

**4. 留存设计**
- 充电完成后本地通知提醒记录
- "本月充电费用 ¥XXX" 月度小结
- 常用工具智能置顶

### 9.4 审核准备

| 检查项 | 要求 | 状态 |
|------|------|------|
| 类目选择 | 工具 > 信息查询 | ✅ |
| 隐私协议 | 弹窗声明存储用途（充电记录） | 待完成 |
| 内容安全 | 无 UGC，免审核资质 | ✅ |
| 分包大小 | 单包 ≤ 2MB | ✅ |
| HTTPS | 所有请求加密 | ✅ |
| 英文翻译 | 准确无歧义 | ✅ |
| 品牌合规 | 不使用极氪官方 Logo（自绘图标） | 待确认 |

---

## 十、扩展预留

| 能力 | 实现 | 触发条件 |
|------|------|------|
| 极氪 API 对接 | 云函数代理极氪官方接口 | 获取官方授权 |
| 充电地图 | 接入充电站 POI 数据 | 用户量 ≥ 1万 |
| 电池健康分析 | 基于充电曲线计算 SOH | 积累足够数据 |
| 二手车估值 | 里程 + 电池 + 车龄 模型 | P2 阶段 |
| 多车型 | const.js 扩展车型列表 | 极氪发布新车 |
| 车主认证 | 云函数 + 行驶证 OCR | 开启社区功能时 |

---

## 十一、架构总览

```
 ┌─────────────────────────────────────────────────────┐
 │                 氪佬工具箱（极氪车主）                │
 ├─────────────────────────────────────────────────────┤
 │                                                      │
 │  ┌──────┐  ┌──────┐  ┌──────────┐  ┌──────┐        │
 │  │ 首页  │  │ 工具  │  │ 车主社区  │  │ 我的  │        │
 │  │index  │  │tools │  │community │  │mine  │        │
 │  └──┬───┘  └──┬───┘  └────┬─────┘  └──┬───┘        │
 │     │         │            │            │             │
 │     ▼         ▼            ▼            ▼             │
 │  ┌──────────────────────────────────────────────┐    │
 │  │          组件层 (Components)                  │    │
 │  │  banner-card / quick-entry / tool-item / ...  │    │
 │  └──────────────────┬───────────────────────────┘    │
 │                     │                                 │
 │  ┌──────────────────▼───────────────────────────┐    │
 │  │          服务层 (Utils + Config)              │    │
 │  │  i18n / request / storage / tools.config      │    │
 │  └──────────────────┬───────────────────────────┘    │
 │                     │                                 │
 │  ┌──────────────────▼───────────────────────────┐    │
 │  │          数据层                                │    │
 │  │  wx.Storage (本地)  ←→  CloudBase (云端)      │    │
 │  └──────────────────────────────────────────────┘    │
 │                                                      │
 │  ┌──────────────────────────────────────────────┐    │
 │  │          分包（按工具类型懒加载）              │    │
 │  │  charging-calc / charging-log / maintenance    │    │
 │  │         / ride-log                             │    │
 │  └──────────────────────────────────────────────┘    │
 │                                                      │
 └─────────────────────────────────────────────────────┘
```

---

*架构设计 v2.0 完成。下一步：搭建首页 WXML/WXSS，实现充电计算器完整交互。*
