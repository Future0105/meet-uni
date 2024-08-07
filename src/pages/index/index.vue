<template>
  <HeadFill />
  <view class="container">
    <view class="box" @click="navigateTo(`/pages/tackout/tackout?page=${'waitOut'}`)">
      <uni-icons type="person" size="50"></uni-icons>
      <text>人员带出</text>
    </view>
    <view class="box face" @click="debouncedToWechatCustmer">
      <uni-icons type="scan" size="50"></uni-icons>
      <text>人脸录入</text>
    </view>
    <view @click="debouncedInfo" class="box face">
      <uni-icons type="gear" size="50"></uni-icons>
      <text>信息</text>
    </view>
    <view class="box face">
      <uni-icons type="person" size="50"></uni-icons>
      <text>人脸录入</text>
    </view>
  </view>
</template>
<script setup>
import HeadFill from '../../components/HeadFill/HeadFill.vue'
import { navigateTo } from '@/utils/navigate.js'
import { debounce, throttle } from 'lodash' //防抖与节流
//防抖-第一次点击触发  每次触发重新计时 必须停止触发行为2s后才可以再次触发
//节流-第一次点击触发 开始计时 2s后可再次点击触发，2s内不再触发点击
const Info = () => {
  if (uni.getSystemInfoSync().platform === 'android') {
    window.android.H5ToAndroid('PARAMETER_SETTING')
  }
  console.log('完成')
}
const debouncedInfo = debounce(Info, 1000, { leading: true, trailing: false })
const toWechatCustmer = () => {
  if (uni.getSystemInfoSync().platform === 'android') {
    window.android.H5ToAndroid('FACE_COLLECT')
  }
  console.log('完成')
}
//leading延迟开始前调用  trailing延迟结束后调用
const debouncedToWechatCustmer = debounce(toWechatCustmer, 1000, { leading: true, trailing: false })
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
