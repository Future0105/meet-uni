<template>
  <view class="notOut">
    <view class="modal" @click.stop>
      <view class="modal-header">录像回放</view>
      <view class="modal-content">
        <video
          class="viedo"
          @error="videoErrorCallback"
          :src="viedoSrc"
          :page-gesture="true"
          :show-fullscreen-btn="false"
        ></video>
      </view>
      <view class="modal-footer">
        <button class="btn" @click="handleCancel">关闭</button>
      </view>
    </view>
  </view>
</template>

<script setup>
// import { getReasonsList_API } from '@/api/data.js'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const viedoSrc = ref(
  'https://cn-sh-ct-01-10.bilivideo.com/upgcxcode/58/39/1597793958/1597793958-1-192.mp4?e=ig8euxZM2rNcNbRVhwdVhwdlhWdVhwdVhoNvNC8BqJIzNbfq9rVEuxTEnE8L5F6VnEsSTx0vkX8fqJeYTj_lta53NCM=&uipk=5&nbs=1&deadline=1725698868&gen=playurlv2&os=bcache&oi=241938686&trid=0000ecc9e63b38614b359e9f4adbb1db1dd4T&mid=294837898&platform=html5&og=hw&upsig=aaf609315633859bef91276e22e0a98c&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform,og&cdnid=88210&bvc=vod&nettype=0&bw=96829&orderid=0,1&buvid=&build=0&mobi_app=&f=T_0_0&logo=80000000'
)
//返回确认和取消操作给父级
const emits = defineEmits(['cancel'])
//获取不带出理由列表
// const getReasonsList = async () => {
//   const reasonstRes = await getReasonsList_API()
//   if (reasonstRes.code === 200) {
//     reasons.value = reasonstRes.data
//   } else {
//     uni.showToast({
//       title: '获取不带出理由列表失败',
//       icon: 'none'
//     })
//   }
// }

//组件加载
onLoad(async () => {
  //获取不带出理由列表
  // await getReasonsList()
})
// 关闭按钮
const handleCancel = () => {
  emits('cancel')
}

const videoErrorCallback = e => {
  uni.showModal({
    // content: e.target.errMsg,
    content: '播放失败',
    showCancel: false
  })
}
</script>

<style scoped lang="scss">
.notOut {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(31, 31, 31, 0.6);
  z-index: 5; /* 确保这是页面上最高的z-index */
  .modal {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    // max-height: 292.9688rpx /* 400px -> 292.9688rpx */;
    // width: 585.9375rpx /* 800px -> 585.9375rpx */;
    border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
    overflow: auto;
    .modal-header {
      height: 32.959rpx /* 45px -> 32.959rpx */;
      line-height: 32.959rpx /* 45px -> 32.959rpx */;
      // padding: 7.3242rpx /* 10px -> 7.3242rpx */;
      font-size: 14.6484rpx /* 20px -> 14.6484rpx */;
      color: #000000;
      font-weight: 500;
      background-color: #f2f2f2;
      text-align: center;
    }
    .modal-content {
      flex: 1;
      // height: 200px;
      // max-height: 366.2109rpx /* 500px -> 366.2109rpx */;
      // padding: 11.7188rpx /* 16px -> 11.7188rpx */;
      overflow-y: auto;
      // background-color: #007aff;
      // padding: 6%;
      .viedo {
        width: 585.9375rpx /* 800px -> 585.9375rpx */;
        height: 329.5898rpx /* 450px -> 329.5898rpx */;
        // height: 500px;
      }
    }
    .modal-footer {
      background-color: #f2f2f2;
      // margin-top: 3.6621rpx /* 5px -> 3.6621rpx */;
      height: 43.9453rpx /* 60px -> 43.9453rpx */;
      display: flex;
      align-items: center;
      padding: 7.3242rpx /* 10px -> 7.3242rpx */;
      // justify-content: space-around;
      // gap: 7.3242rpx /* 10px -> 7.3242rpx */;
      .btn {
        // flex-grow: 1;
        width: 65.918rpx /* 90px -> 65.918rpx */;
        height: 29.2969rpx /* 40px -> 29.2969rpx */;
        line-height: 29.2969rpx /* 40px -> 29.2969rpx */;
        // padding: 7.3242rpx /* 10px -> 7.3242rpx */;
        text-align: center;
        color: #333;
        font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
        background-color: #e0e0e0;
        // border-left: 0.7324rpx /* 1px -> .7324rpx */ solid #e7e7e7;
      }
    }
  }
}
</style>
