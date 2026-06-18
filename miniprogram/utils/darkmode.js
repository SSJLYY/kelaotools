const SETTING_KEY = 'kt_dark_mode_setting';
const DARK_KEY = 'kt_dark_mode';

function getSetting() {
  try {
    return wx.getStorageSync(SETTING_KEY) || { mode: 'light', darkHour: 19, darkMinute: 0, lightHour: 7, lightMinute: 0 };
  } catch (e) {
    return { mode: 'light', darkHour: 19, darkMinute: 0, lightHour: 7, lightMinute: 0 };
  }
}

function saveSetting(setting) {
  try {
    wx.setStorageSync(SETTING_KEY, setting);
  } catch (e) {}
}

function getDarkMode() {
  try {
    return wx.getStorageSync(DARK_KEY) || false;
  } catch (e) {
    return false;
  }
}

function setDarkMode(darkMode) {
  try {
    wx.setStorageSync(DARK_KEY, darkMode);
    const app = getApp();
    if (app.globalData) {
      app.globalData.darkMode = darkMode;
    }
  } catch (e) {}
}

function applyDarkMode(darkMode) {
  wx.setNavigationBarColor({
    frontColor: darkMode ? '#ffffff' : '#000000',
    backgroundColor: darkMode ? '#1a1a1a' : '#F5F5F7',
  });
  wx.setTabBarStyle({
    color: darkMode ? '#AAAAAA' : '#999999',
    selectedColor: darkMode ? '#5B8DEF' : '#2F66F6',
    backgroundColor: darkMode ? '#2A2A2A' : '#FFFFFF',
    borderStyle: darkMode ? 'black' : 'white',
  });
}

function shouldDark(setting) {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const current = h * 60 + m;
  const darkStart = setting.darkHour * 60 + setting.darkMinute;
  const lightStart = setting.lightHour * 60 + setting.lightMinute;

  if (darkStart <= lightStart) {
    return current >= darkStart && current < lightStart;
  }
  return current >= darkStart || current < lightStart;
}

function resolveDarkMode() {
  const setting = getSetting();
  if (setting.mode === 'dark') return true;
  if (setting.mode === 'light') return false;
  return shouldDark(setting);
}

function syncDarkMode() {
  const dark = resolveDarkMode();
  const prev = getDarkMode();
  if (dark !== prev) {
    setDarkMode(dark);
    applyDarkMode(dark);
  }
  return dark;
}

module.exports = {
  getSetting,
  saveSetting,
  getDarkMode,
  setDarkMode,
  applyDarkMode,
  resolveDarkMode,
  syncDarkMode,
};
