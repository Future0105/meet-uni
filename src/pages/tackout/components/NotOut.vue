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
// const otherReason = ref('')

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
}

//组件加载
onLoad(async () => {
  reasons.value = [
    { Id: 1, Name: '不带出理由1' },
    { Id: 2, Name: '不带出2' },
    { Id: 3, Name: '不带出3' },
    { Id: 4, Name: '不带出4' },
    { Id: 5, Name: '不带出5' },
    { Id: 6, Name: '不带出6' }
  ]
  //获取不带出理由列表
  await getReasonsList()
})

//选择原因发送变化
const onChange = event => {
  selectedReason.value = event.detail.value.Id
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
    emits('confirm', selectedReason.value) //selectedReason.value = {Id: 7, Name: '不带出理由7'}
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
    display: flex;
    flex-direction: column;
    background-color: #fff;
    max-height: 292.9688rpx /* 400px -> 292.9688rpx */;
    width: 30%;
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
      // max-height: 366.2109rpx /* 500px -> 366.2109rpx */;
      // padding: 11.7188rpx /* 16px -> 11.7188rpx */;
      overflow-y: auto;
      // background-color: #007aff;
      .radio-label {
        display: block;
        padding: 3.6621rpx /* 5px -> 3.6621rpx */;
        margin: 3.6621rpx /* 5px -> 3.6621rpx */;
        background-color: #e9e9e9;
        border-radius: 3.6621rpx /* 5px -> 3.6621rpx */;
      }
      .radio-label radio {
        font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
      .btn.confirm {
        color: #fff;
        background-color: #00aaff;
      }
    }
  }
}
</style>
