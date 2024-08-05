<template>
  <view class="container">
    <radio-group @change="onChange">
      <label class="radio-label" v-for="(reason, index) in reasons" :key="index">
        <radio :value="reason" color="#007aff">{{ reason }}</radio>
      </label>
      <!-- 添加一个自定义理由的选项 -->
      <label class="radio-label">
        <radio value="custom" color="#007aff">其他（请说明理由）</radio>
      </label>
      <!-- 当选中自定义理由时显示文本区域 -->
      <textarea
        v-if="selectedReason === 'custom'"
        v-model="customReason"
        placeholder="请输入自定义理由"
        class="textarea"
      ></textarea>
    </radio-group>
  </view>
</template>
<script>
export default {
  data() {
    return {
      reasons: ['健康原因', '个人原因', '未完成任务'],
      selectedReason: '',
      customReason: '' // 用于存储自定义输入的理由
    }
  },
  methods: {
    onChange(event) {
      this.selectedReason = event.detail.value
      console.log('选中的理由:', this.selectedReason)
      if (this.selectedReason !== 'custom') {
        this.customReason = '' // 如果不是自定义理由，清空文本
      } else {
        console.log('选中理由:', this.customReason)
      }
    }
  }
}
</script>
<style>
.container {
  padding: 20px;
}

.radio-label {
  display: block;
  padding: 10px;
  margin-bottom: 5px;
  background-color: #f8f8f8;
  border-radius: 5px;
}

.radio-label radio {
  margin-right: 10px;
}

.textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box; /* 确保padding不影响宽度计算 */
}
</style>
