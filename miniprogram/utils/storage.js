// utils/storage.js
// 本地存储封装

const PREFIX = 'kt_';

function get(key) {
  try {
    return wx.getStorageSync(PREFIX + key) || null;
  } catch (e) {
    return null;
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(PREFIX + key, value);
    return true;
  } catch (e) {
    return false;
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(PREFIX + key);
  } catch (e) {}
}

module.exports = { get, set, remove };
