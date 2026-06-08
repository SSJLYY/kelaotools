const zhCN = require('./zh-CN');
const enUS = require('./en-US');

const langs = { 'zh-CN': zhCN, 'en-US': enUS, en: enUS };
let currentLang = 'zh-CN';

function init() {
  try {
    const stored = wx.getStorageSync('app_lang') || 'zh-CN';
    setLang(stored);
  } catch (e) {
    setLang('zh-CN');
  }
}

function setLang(lang) {
  currentLang = langs[lang] ? lang : 'zh-CN';
  try {
    wx.setStorageSync('app_lang', currentLang);
  } catch (e) {
    // storage full, ignore
  }

  const app = typeof getApp === 'function' ? getApp() : null;
  if (app && app.globalData) {
    app.globalData.lang = currentLang;
    app.globalData.langVersion = (app.globalData.langVersion || 0) + 1;
  }
}

function t(path, params) {
  const keys = path.split('.');
  let result = langs[currentLang];
  for (const k of keys) {
    if (result == null) return path;
    result = result[k];
  }
  if (typeof result !== 'string') return path;

  // 支持模板替换: t('home.tipBarHasData', { count: 5 })
  if (params) {
    Object.keys(params).forEach(key => {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), params[key]);
    });
  }
  return result;
}

function getCurrentLang() {
  return currentLang;
}

function getSupportedLangs() {
  return [
    { code: 'zh-CN', name: '中文' },
    { code: 'en-US', name: 'English' },
  ];
}

module.exports = { init, setLang, t, getCurrentLang, getSupportedLangs };
