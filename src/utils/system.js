//获取系统信息
const SYSTEM_INFO = uni.getSystemInfoSync()

//statusBar 状态栏 Height高度
export const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || 0

//底部安全高度
// export const getDDHeight = () => SYSTEM_INFO.statusBarHeight || 10
//获取标题栏高度
export const getTitleBarHeight = () => {
  if (uni.getMenuButtonBoundingClientRect) { //getMenuButtonBoundingClientRect 胶囊按钮
    let { top, height } = uni.getMenuButtonBoundingClientRect() //top 胶囊距离顶部距离  height 胶囊高度
    return (top - getStatusBarHeight()) * 2 + height  //返回标题栏高度
  } else {
    return 0
  }
}

//头部高度
export const getNavBarHeight = () => getStatusBarHeight() + getTitleBarHeight()

//头条-抖音   避开特有logo遮挡
export const getLeftIcon = () => {
  // #ifdef MP-TOUTIAO
  let { leftIcon: { left, width } } = tt.getCustomButtonBoundingClientRect()
  return left + parseInt(width)
  // #endif 
}