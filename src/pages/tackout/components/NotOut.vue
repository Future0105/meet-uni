<!-- CustomModal.vue -->
<template>
  <view v-if="showReason" class="notOut">
    <view class="modal" @click.stop>
      <view class="modal-header"
        >请选择不带出理由（学员：<text style="color: #007aff">{{ noOutName }}</text
        >）</view
      >
      <view class="modal-content">
        <radio-group @change="onChange">
          <label class="radio-label" v-for="(reason, index) in reasons" :key="index">
            <radio :value="reason" color="#007aff">&nbsp{{ reason }}</radio>
          </label>
          <!-- 添加一个自定义理由的选项 -->
          <label class="radio-label">
            <radio value="other" color="#007aff">&nbsp其他（请说明理由）</radio>
          </label>
          <!-- 当选中自定义理由时显示文本区域 -->
          <textarea
            v-if="selectedReason === 'other'"
            v-model="otherReason"
            placeholder="请输入理由(最多200字)"
            class="textarea"
            maxlength="200"
          ></textarea>
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
import { ref } from 'vue'

const props = defineProps({
  showReason: {
    type: Boolean,
    default: false
  },
  noOutName: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['confirm', 'cancel'])
//原因
const reasons = ['健康原因', '个人原因', '未完成任务', '不想带']
//选中的理由
const selectedReason = ref('')
//其他理由(输入内容)
const otherReason = ref('')

//选择原因发送变化
const onChange = event => {
  selectedReason.value = event.detail.value
  if (selectedReason.value !== 'other') {
    otherReason.value = '' // 如果不是自定义理由，清空文本
  }
}

//确认 不带出
const handleConfirm = () => {
  //自定义原因
  if (selectedReason.value === 'other') {
    // 如果为自定义理由，检查是否输入了理由
    if (otherReason.value.trim() === '') {
      uni.showToast({
        title: '请输入理由',
        icon: 'none'
      })
      //防止空格输入,清空
      otherReason.value = ''
    } else {
      emits('confirm', otherReason.value)
      selectedReason.value = ''
    }
  } else if (selectedReason.value) {
    emits('confirm', selectedReason.value)
    selectedReason.value = ''
  } else {
    uni.showToast({
      title: '请选择一个理由',
      icon: 'none'
    })
  }
}
//取消 不带出
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
    background-color: #fff;
    width: 60%;
    max-width: 366.2109rpx /* 500px -> 366.2109rpx */;
    border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
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
      padding: 11.7188rpx /* 16px -> 11.7188rpx */;
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
        border-left: 1px solid #e7e7e7;
      }
      .btn.confirm {
        color: #fff;
        background-color: #007aff;
      }
    }
  }
}
</style>
