<template>
  <view class="container">
    <view class="box" @click="navigateTo(`/pages/tackout/tackout?page=${'waitOut'}`)">
      <uni-icons type="person" size="50"></uni-icons>
      <text>人员带出</text>
    </view>
    <view class="box face" @click="toWechatCustmer">
      <uni-icons type="person" size="50"></uni-icons>
      <text>人脸录入</text>
    </view>
    <view class="box face">
      <uni-icons type="person" size="50"></uni-icons>
      <text>人脸录入</text>
    </view>
    <view class="box face">
      <uni-icons type="person" size="50"></uni-icons>
      <text>人脸录入</text>
    </view>
  </view>
</template>
<script setup>
import { navigateTo } from '@/utils/navigate.js'
import Tackout from '../tackout/tackout.vue'
// const navigateTo = url => {
//   uni.navigateTo({
//     url
//   })
// }

const toWechatCustmer = () => {
  if (uni.getSystemInfoSync().platform === 'android') {
    window.android.H5ToAndroid('000')
  }
}
</script>
<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 75%;
  margin: auto;
  flex-wrap: wrap; /* 允许换行 */
  .box {
    width: 22%;
    height: 109.8633rpx /* 150px -> 109.8633rpx */;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 21.9727rpx /* 30px -> 21.9727rpx */; /* 间距 */
    gap: 7.3242rpx /* 10px -> 7.3242rpx */; /* 图标和文本之间的间距 */
    font-size: 17.5781rpx /* 24px -> 17.5781rpx */;
    background-color: rgba(72, 171, 232, 0.8); /* 设置背景色和透明度 */
    border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
    backdrop-filter: blur(14.6484rpx /* 20px -> 14.6484rpx */); /* 添加模糊效果 */
  }
}
</style>
