export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'inverse',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'light',
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 侧边栏, 菜单
    menuList: [],
    menuActiveName: '',
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: '',
    news: {},
    typeId: '1',
    notifyMsg: []
  },
  mutations: {
    updateDocumentClientHeight(state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType(state, type) {
      state.navbarLayoutType = type
    },
    updateSidebarLayoutSkin(state, skin) {
      state.sidebarLayoutSkin = skin
    },
    updateSidebarFold(state, fold) {
      state.sidebarFold = fold
    },
    updateMenuList(state, list) {
      state.menuList = list
    },
    updateMenuActiveName(state, name) {
      state.menuActiveName = name
    },
    updateMainTabs(state, tabs) {
      state.mainTabs = tabs
      // console.log(state.mainTabs)
    },
    updateMainTabsActiveName(state, name) {
      state.mainTabsActiveName = name
    },
    typeIdChange(state, val) {
      state.typeId = val
    },
    updataNews(state, val) {
      state.news = val;
    },
    updatanotifyMsg(state, val) {
      if (val.msg) {
        state.notifyMsg.push(val.msg);
        // console.log( state.notifyMsg)
      }

    },
    splicenotifyMsg(state, val) {
      if (val) {
        while (state.notifyMsg.indexOf(val) != -1) {
          var index = state.notifyMsg.indexOf(val);
          state.notifyMsg.splice(index, 1);
        }
      }
    }
  }
}
