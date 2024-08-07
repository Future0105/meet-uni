<template>
  <HeadFill />
  <view class="container">
    <view class="nav">
      <button :class="{ active: selectPage === 'waitOut' }" @click="changePage('waitOut')" class="btn">
        待带出学员
      </button>
      <button :class="{ active: selectPage === 'todayOut' }" @click="changePage('todayOut')" class="btn">
        今日已带学员
      </button>
      <button :class="{ active: selectPage === 'studentInfo' }" @click="changePage('studentInfo')" class="btn">
        学员信息
      </button>
      <button :class="{ active: selectPage === 'familyInfo' }" @click="changePage('familyInfo')" class="btn">
        家属信息
      </button>
    </view>
    <view class="page">
      <WaitOut v-if="selectPage === 'waitOut'" />
      <TodayOut v-if="selectPage === 'todayOut'" />
      <StudentInfo v-if="selectPage === 'studentInfo'" />
      <FamilyInfo v-if="selectPage === 'familyInfo'" />
    </view>
  </view>
</template>
<script setup>
import HeadFill from '../../components/HeadFill/HeadFill.vue'
import WaitOut from './components/WaitOut.vue'
import TodayOut from './components/TodayOut.vue'
import StudentInfo from './components/StudentInfo.vue'
import FamilyInfo from './components/FamilyInfo.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
//显示页面(默认-待带出学员)
const selectPage = ref('waitOut')
//nav点击切换页面
const changePage = page => {
  selectPage.value = page
}
onLoad(async e => {
  if (e.page) {
    selectPage.value = e.page
  }
})
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  .nav {
    height: 15%;
    // flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1% 0;
    .btn {
      width: 18%;
      padding: 7.3242rpx /* 10px -> 7.3242rpx */;
      font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
      white-space: nowrap; /* 禁止文本换行 */
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      border: 0.7324rpx /* 1px -> .7324rpx */ #c6c1c1 solid;
      // backdrop-filter: blur(0.7324rpx /* 1px -> .7324rpx */); /* 毛玻璃效果 */
      border-radius: 10.9863rpx /* 15px -> 10.9863rpx */; /* 圆角边框 */
    }
    .active {
      font-size: 16.1133rpx /* 22px -> 16.1133rpx */;
      background-color: #00aaff;
      font-weight: 600;
      color: white;
      border: 0.7324rpx /* 1px -> .7324rpx */ #a3d5e2 solid;
    }
  }
  .page {
    height: 80%;
    overflow: hidden;
    // flex: 1;
  }
}
</style>
