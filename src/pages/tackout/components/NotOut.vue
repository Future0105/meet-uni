<!-- CustomModal.vue -->
<template>
  <view class="notOut">
    <view class="modal" @click.stop>
      <view class="modal-header">请选择不带出理由</view>
      <view class="modal-content">
        <radio-group @change="onChange">
          <label class="radio-label" v-for="(reason, index) in reasons" :key="index">
            <radio :value="reason" color="#007aff">&nbsp{{ reason.Name }}</radio>
          </label>
          <!-- ---------------------------------------------------------------------- -->
          <!-- 添加一个自定义理由的选项 -->
          <!-- <label class="radio-label">
            <radio value="other" color="#007aff">&nbsp其他（请说明理由）</radio>
          </label> -->
          <!-- 当选中自定义理由时显示文本区域 -->
          <!-- <textarea
            v-if="selectedReason === 'other'"
            v-model="otherReason"
            placeholder="请输入理由(最多200字)"
            class="textarea"
            maxlength="200"
          ></textarea> -->
          <!-- ----------------------------------------------------------------------- -->
        </radio-group>
      </view>
      <view class="modal-footer">
        <button class="btn" @click="handleCancel">取消</button>
        <button class="btn confirm" @click="handleConfirm">确认</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getReasonsList_API } from '@/api/data.js'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

//返回确认和取消操作给父级
const emits = defineEmits(['confirm', 'cancel'])
//不带出理由列表
const reasons = ref([])
//选中的不带出理由
const selectedReason = ref('')
//其他理由(自定义输入内容)
const otherReason = ref('')

//获取不带出理由列表
const getReasonsList = async () => {
  const reasonstRes = await getReasonsList_API()
  if (reasonstRes.code === 200) {
    reasons.value = reasonstRes.data
  } else {
    uni.showToast({
      title: '获取不带出理由列表失败',
      icon: 'none'
    })
  }
  console.log(reasons.value)
}

//组件加载
onLoad(async () => {
  //获取不带出理由列表
  await getReasonsList()
})

//选择原因发送变化
const onChange = event => {
  selectedReason.value = event.detail.value
  //-----------------------------------------------------------
  // if (selectedReason.value !== 'other') {
  //   otherReason.value = '' // 如果不是其他理由，清空自定义理由文本
  // }
  //--------------------------------------------------------
}

// 不带出 确认按钮
const handleConfirm = () => {
  if (selectedReason.value) {
    // 非其他理由
    emits('confirm', selectedReason.value.Id)
    selectedReason.value = ''
  } else {
    uni.showToast({
      title: '请选择不带出理由',
      icon: 'none'
    })
  }
  // //选择其他原因
  // if (selectedReason.value === 'other') {
  //   // 如果为其他理由，检查是否输入了理由
  //   if (otherReason.value.trim() === '') {
  //     uni.showToast({
  //       title: '请输入理由',
  //       icon: 'none'
  //     })
  //     //防止空格输入,清空
  //     otherReason.value = ''
  //   } else {
  //     emits('confirm', otherReason.value)
  //     //确认,清空选中理由以及其他理由中自定义文本
  //     selectedReason.value = ''
  //     otherReason.value = ''
  //   }
  // } else if (selectedReason.value) {
  //   // 非其他理由
  //   emits('confirm', selectedReason.value)
  //   selectedReason.value = ''
  // } else {
  //   uni.showToast({
  //     title: '请选择一个理由',
  //     icon: 'none'
  //   })
  // }
}
// 不带出 取消按钮
const handleCancel = () => {
  emits('cancel')
  selectedReason.value = ''
  // otherReason.value = ''
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
    background-color: #fff;
    max-height: 80%;
    width: 60%;
    max-width: 366.2109rpx /* 500px -> 366.2109rpx */;
    border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
    overflow: hidden;
    .modal-header {
      padding: 10.9863rpx /* 15px -> 10.9863rpx */;
      font-size: 14.6484rpx /* 20px -> 14.6484rpx */;
      color: #000000;
      font-weight: 500;
      background-color: #f2f2f2;
      text-align: center;
    }
    .modal-content {
      max-height: 366.2109rpx /* 500px -> 366.2109rpx */;
      padding: 11.7188rpx /* 16px -> 11.7188rpx */;
      overflow-y: auto;
      // background-color: #007aff;
      .radio-label {
        display: block;
        padding: 7.3242rpx /* 10px -> 7.3242rpx */;
        margin-bottom: 5.8594rpx /* 8px -> 5.8594rpx */;
        background-color: #e9e9e9;
        border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
      }
      .radio-label radio {
        font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        // text-overflow: ellipsis;
      }
      .textarea {
        width: 100%;
        height: 73.2422rpx /* 100px -> 73.2422rpx */;
        padding: 7.3242rpx /* 10px -> 7.3242rpx */;
        margin-top: 7.3242rpx /* 10px -> 7.3242rpx */;
        border: 0.7324rpx /* 1px -> .7324rpx */ solid #ccc;
        border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
        // overflow-y: auto;
        box-sizing: border-box; /* 确保padding不影响宽度计算 */
      }
    }
    .modal-footer {
      display: flex;
      justify-content: space-around;
      .btn {
        flex-grow: 1;
        padding: 7.3242rpx /* 10px -> 7.3242rpx */;
        text-align: center;
        color: #333;
        background-color: #f9f9f9;
        border-left: 0.7324rpx /* 1px -> .7324rpx */ solid #e7e7e7;
      }
      .btn.confirm {
        color: #fff;
        background-color: #007aff;
      }
    }
  }
}
</style>
