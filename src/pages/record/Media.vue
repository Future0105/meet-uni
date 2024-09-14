<template>
  <view class="notOut">
    <view class="modal" @click.stop>
      <view class="modal-header">录音回放</view>
      <view class="modal-content">
        <Media class="media" :music="mediaSrc"></Media>
        <!-- autoplay : boolean,
	music : string,
	image : string,
	title : number | string, -->
      </view>
      <view class="modal-footer">
        <button class="btn" @click="handleCancel">关闭</button>
      </view>
    </view>
  </view>
</template>

<script setup>
// import { getReasonsList_API } from '@/api/data.js'
import Media from '@/components/cy-audio_1.0/components/cy-audio/cy-audio.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 使用 defineProps 正确地获取父组件传递的 props
const props = defineProps({
  mediaUrl: {
    type: String,
    default: ''
  }
})

const mediaSrc = ref(null)
// const mediaImg = ref('@/static/image/logo/small.png')
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
  // mediaSrc.value = props.mediaUrl
  //获取不带出理由列表
  // await getReasonsList()
})
// 关闭按钮
const handleCancel = () => {
  emits('cancel')
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
      height: 36.6211rpx /* 50px -> 36.6211rpx */;
      line-height: 36.6211rpx /* 50px -> 36.6211rpx */;
      // padding: 7.3242rpx /* 10px -> 7.3242rpx */;
      font-size: 21.9727rpx /* 30px -> 21.9727rpx */;
      color: #000000;
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
