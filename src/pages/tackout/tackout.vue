<template>
  <view class="container">
    <HeadFill />
    <view class="nav">
      <button class="btn home" @click="redirectTo('/pages/index/index')">
        <uni-icons type="home" size="50"></uni-icons>
      </button>
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
      <WaitOut ref="waitOutRef" v-if="selectPage === 'waitOut'" />
      <TodayOut ref="todayOutRef" v-if="selectPage === 'todayOut'" />
      <StudentInfo ref="studentInfoRef" v-if="selectPage === 'studentInfo'" />
      <FamilyInfo ref="familyInfoRef" v-if="selectPage === 'familyInfo'" />
    </view>
  </view>
</template>
<script setup>
import HeadFill from '../../components/HeadFill/HeadFill.vue'
import { redirectTo } from '@/utils/to.js'
import WaitOut from './components/WaitOut.vue'
import TodayOut from './components/TodayOut.vue'
import StudentInfo from './components/StudentInfo.vue'
import FamilyInfo from './components/FamilyInfo.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
//显示页面(默认-待带出学员)
const selectPage = ref('waitOut')
// 使用 `ref` 引用子组件实例
const waitOutRef = ref(null)
const todayOutRef = ref(null)
const studentInfoRef = ref(null)
const familyInfoRef = ref(null)
//nav点击切换页面
const changePage = page => {
  //这里集中清除,组件内部就不用再清除
  // clearCurrentTimer(); // 在页面切换前清除当前组件的定时器
  selectPage.value = page
}
onLoad(async e => {
  if (e.page) {
    selectPage.value = e.page
  }
})

//-------使用redirectTo页面摧毁,组件内部onUnmounted卸载定时器-----
// (navigateTo页面保留,不会触发onUnmounted)
// 清除当前活动组件的定时器
// const clearCurrentTimer = () => {
//   switch (selectPage.value) {
//     case 'waitOut':
//       if (waitOutRef.value && waitOutRef.value) {
//         waitOutRef.value.clearTimer()
//       }
//       break
//     case 'todayOut':
//       if (todayOutRef.value && todayOutRef.value) {
//         todayOutRef.value.clearTimer()
//       }
//       break
//     case 'studentInfo':
//       if (studentInfoRef.value && studentInfoRef.value) {
//         studentInfoRef.value.clearTimer()
//       }
//       break
//     case 'familyInfo':
//       if (familyInfoRef.value && familyInfoRef.value) {
//         familyInfoRef.value.clearTimer()
//       }
//       break
//     default:
//       break
//   }
// }
//页面导航时清除定时器并跳转到主页
// const navigateToHome = () => {
//   clearCurrentTimer()
//   // 执行页面跳转
//   navigateTo('/pages/index/index')
// }
//--------------
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  .nav {
    height: 12%;
    // flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1% 3%;
    .btn {
      margin: 0;
      width: 18%;
      height: 85%;
      display: flex;
      align-items: center;
      justify-content: center;
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
    .home {
      width: 8%;
      // background-color: #f5f7f8;
    }
  }
  .page {
    height: 85%;
    overflow: hidden;
    // flex: 1;
  }
}
</style>
