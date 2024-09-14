<template>
  <view class="container">
    <view class="layout">
      <view class="nav">
        <button class="btn home" @click="redirectTo('/pages/index/index')">
          <uni-icons type="home" size="50"></uni-icons>
          <text>主页</text>
        </button>
        <button :class="{ active: selectPage === 'waitOut' }" @click="changePage('waitOut')" class="btn">
          待带出学员
        </button>
        <button :class="{ active: selectPage === 'todayOut' }" @click="changePage('todayOut')" class="btn">
          已带出学员
        </button>
        <button :class="{ active: selectPage === 'studentsInfo' }" @click="changePage('studentsInfo')" class="btn">
          学员信息
        </button>
        <button :class="{ active: selectPage === 'teachersInfo' }" @click="changePage('teachersInfo')" class="btn">
          民警信息
        </button>
      </view>
      <view class="page">
        <WaitOut v-if="selectPage === 'waitOut'" />
        <TodayOut v-if="selectPage === 'todayOut'" />
        <StudentsInfo v-if="selectPage === 'studentsInfo'" />
        <TeachersInfo v-if="selectPage === 'teachersInfo'" />
      </view>
    </view>
  </view>
</template>
<script setup>
// import HeadFill from '../../components/HeadFill/HeadFill.vue'
import { userLoginStore } from '@/store/login.js'
import { redirectTo } from '@/utils/to.js' //redirectTo保证返回主页时,清除待带出定时器
import WaitOut from './components/WaitOut.vue'
import TodayOut from './components/TodayOut.vue'
import StudentsInfo from './components/StudentsInfo.vue'
import TeachersInfo from './components/TeachersInfo.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const loginStore = userLoginStore()
//显示页面(默认-待带出学员)
const selectPage = ref('waitOut')
//nav点击切换页面
const changePage = page => {
  selectPage.value = page
}
onLoad(async e => {
  loginStore.getTeamsList() //获取部门信息,公用
  if (e.page) {
    selectPage.value = e.page
  }
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  // padding-top: 10.9863rpx /* 15px -> 10.9863rpx */;
  .layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-image: url('@/static/image/slices/loginBgS.png');
    //contain按比例缩放,可能不会覆盖整个背景区域
    //cover按比例缩放以完全覆盖背景区域，可能会裁剪掉部分图像
    background-size: 100% 100%; /* 图像会拉伸以适应背景区域的大小 */
    background-position: center; /* 可选：将背景图像居中 */
    .nav {
      height: 14%;
      // flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18.3105rpx /* 25px -> 18.3105rpx */ 3% 7.3242rpx /* 10px -> 7.3242rpx */;
      // border-bottom: 0.7324rpx /* 1px -> .7324rpx */ solid #ffffff;
      .btn {
        margin: 0;
        padding: 0;
        width: 16%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
        white-space: nowrap; /* 禁止文本换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        // backdrop-filter: blur(0.7324rpx /* 1px -> .7324rpx */); /* 毛玻璃效果 */
        border-radius: 10.9863rpx /* 15px -> 10.9863rpx */; /* 圆角边框 */
      }
      .active {
        font-size: 16.1133rpx /* 22px -> 16.1133rpx */;
        background-color: #00aaff;
        font-weight: 600;
        color: white;
      }
      .home {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 10%;
        font-size: 13.1836rpx /* 18px -> 13.1836rpx */;
        gap: 3.6621rpx /* 5px -> 3.6621rpx */; /* 图标和文本之间的间距 */
        ::v-deep {
          .uni-icons {
            font-size: 21.9727rpx /* 30px -> 21.9727rpx */ !important;
          }
        }
      }
    }
    .page {
      flex: 1;
      overflow: hidden;
      // background-color: #00aaff;
      // flex: 1;
    }
  }
}
</style>
