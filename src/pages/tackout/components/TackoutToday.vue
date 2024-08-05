<!-- CustomModal.vue -->
<template>
  <view v-if="show" class="container">
    <view class="modal" @click.stop>
      <view class="modal-header">
        {{ title }}
      </view>
      <view class="modal-content">
        <slot></slot>
      </view>
      <view class="modal-footer">
        <button class="btn" @click="handleCancel">{{ cancelText }}</button>
        <button class="btn confirm" @click="handleConfirm">{{ confirmText }}</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm')
    },
    handleCancel() {
      this.$emit('cancel')
    },
    handleOverlayClick() {
      this.$emit('overlay-click')
      this.handleCancel() // Optionally close on overlay click
    }
  }
}
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(216, 30, 30, 0.5);
  z-index: 1000; /* 确保这是页面上最高的z-index */
}

.modal {
  background-color: #fff;
  width: 90%;
  max-width: 500px;
  border-radius: 5px;
  overflow: hidden;
}

.modal-header {
  padding: 12px;
  font-size: 16px;
  color: #333;
  background-color: #f2f2f2;
  text-align: center;
}

.modal-content {
  padding: 16px;
}

.modal-footer {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #e7e7e7;
}

.btn {
  flex-grow: 1;
  padding: 10px;
  text-align: center;
  color: #333;
  background-color: #f9f9f9;
  border-left: 1px solid #e7e7e7;
}

.btn.confirm {
  color: #fff;
  background-color: #007aff;
}
</style>
