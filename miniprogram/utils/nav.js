let cachedNavBarInfo = null;

function getNavBarInfo(force = false) {
  if (!force && cachedNavBarInfo) return cachedNavBarInfo;

  let windowInfo = {};
  let menuButton = {};

  try {
    if (wx.getWindowInfo) {
      windowInfo = wx.getWindowInfo();
    } else if (wx.getSystemInfoSync) {
      windowInfo = wx.getSystemInfoSync();
    }
  } catch (e) {
    windowInfo = {};
  }

  try {
    menuButton = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : {};
  } catch (e) {
    menuButton = {};
  }

  const statusBarHeight = Math.max(Number(windowInfo.statusBarHeight) || 0, 20);
  const menuTop = Number(menuButton.top) || 0;
  const menuHeight = Number(menuButton.height) || 0;

  let navBarHeight = 44;
  if (menuTop > statusBarHeight && menuHeight > 0) {
    navBarHeight = (menuTop - statusBarHeight) * 2 + menuHeight;
  }

  navBarHeight = Math.max(navBarHeight, 44);

  cachedNavBarInfo = {
    statusBarHeight,
    navBarHeight,
    navTotalHeight: statusBarHeight + navBarHeight,
  };

  return cachedNavBarInfo;
}

module.exports = {
  getNavBarInfo,
};
