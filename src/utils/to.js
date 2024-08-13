// uni.navigateTo(OBJECT)
// 保留当前页面，跳转到应用内的某个页面，使用uni.navigateBack可以返回到原页面。
export const navigateTo = url => {
  uni.navigateTo({
    url
  })
}

// uni.redirectTo(OBJECT)
// 关闭当前页面，跳转到应用内的某个页面。
export const redirectTo = url => {
  uni.redirectTo({
    url
  })
}

