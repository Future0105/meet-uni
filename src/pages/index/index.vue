<template>
  <view class="container">
    <view class="layout-box">
      <view class="logo-box">
        <image class="logo-img" src="@/static/image/logo/bigpic.png" mode="widthFix" />
        <view class="login-info">
          <text>所在大队：{{ loginTeam }}</text>
          <text>名字：{{ loginName }}</text>
          <button @click="loginOut">退出登录</button>
        </view>
      </view>
      <view class="modules">
        <view class="box" @click="navigateTo(`/pages/tackout/tackout?page=${'waitOut'}`)">
          <uni-icons type="paperplane" size="75" color="#fff"></uni-icons>
          <text>待带出学员</text>
        </view>
        <view class="box" @click="navigateTo(`/pages/tackout/tackout?page=${'todayOut'}`)">
          <uni-icons type="auth" size="75" color="#fff"></uni-icons>
          <text>已带出学员</text>
        </view>
        <view class="box" @click="navigateTo(`/pages/tackout/tackout?page=${'studentsInfo'}`)">
          <uni-icons type="person" size="75" color="#fff"></uni-icons>
          <text>学员信息</text>
        </view>
        <view class="box" @click="navigateTo(`/pages/tackout/tackout?page=${'teachersInfo'}`)">
          <uni-icons type="staff" size="75" color="#fff"></uni-icons>
          <text>民警信息</text>
        </view>
        <view class="box" @click="navigateTo(`/pages/record/record`)">
          <uni-icons type="eye" size="75" color="#fff"></uni-icons>
          <text>探访记录</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
// import HeadFill from '../../components/HeadFill/HeadFill.vue'
import { userLoginStore } from '@/store/login.js'
import { navigateTo } from '@/utils/to.js'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
const loginStore = userLoginStore() // 在 setup 的顶部引入 store
const loginName = ref('未登录')
const loginTeam = ref('未登录')
onLoad(async () => {
  if (loginStore.loginInfo.RealName) {
    loginName.value = loginStore.loginInfo.RealName
  }
  if (loginStore.loginInfo.CollegeName) {
    loginTeam.value = loginStore.loginInfo.CollegeName
  }
})

// 退出登录
const loginOut = () => {
  loginStore.logout() // 调用 store 中的退出登录方法
}
</script>
<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  // padding-top: 10.9863rpx /* 15px -> 10.9863rpx */;
  .layout-box {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 35px;
    background-image: url('@/static/image/slices/loginBgS.png');
    //contain按比例缩放,可能不会覆盖整个背景区域
    //cover按比例缩放以完全覆盖背景区域，可能会裁剪掉部分图像
    background-size: 100% 100%; /* 图像会拉伸以适应背景区域的大小 */
    background-position: center; /* 可选：将背景图像居中 */
    display: flex;
    align-items: center;
    justify-content: center;
    .logo-box {
      position: absolute;
      width: 100%;
      height: 20%;
      top: 20px;
      left: 0;
      .logo-img {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: 256.3477rpx /* 350.0001px -> 256.3477rpx */;
        margin-left: 36.6211rpx /* 50px -> 36.6211rpx */;
      }
      .login-info {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 70%;
        position: absolute;
        top: 50%;
        right: 6%;
        transform: translateY(-50%);
        text {
          max-width: 234.375rpx /* 320px -> 234.375rpx */;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 10.9863rpx /* 15px -> 10.9863rpx */;
          font-size: 12.4512rpx /* 17px -> 12.4512rpx */;
          color: #fff;
        }
        button {
          font-size: 10.2539rpx /* 14px -> 10.2539rpx */;
          color: #fff;
          background-color: rgba(72, 171, 232, 0.9); /* 设置背景色和透明度 */
        }
      }
    }
    .modules {
      width: 88%; /* 父容器宽度为 100% */
      max-height: 65%;
      display: grid;
      grid-template-columns: repeat(5, 1fr); /* 4列，每列宽度相等 */
      gap: 10.9863rpx /* 15px -> 10.9863rpx */; /* 元素之间的间隙 */
      overflow-y: auto;
      box-sizing: border-box; /* 确保宽度计算包含 padding 和 border */
      .box {
        flex-basis: calc((100% - 30.0001px) / 5);
        height: 117.1875rpx /* 160px -> 117.1875rpx */;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 7.3242rpx /* 10px -> 7.3242rpx */; /* 图标和文本之间的间距 */
        font-size: 17.5781rpx /* 24px -> 17.5781rpx */;
        color: #fff;
        background-color: rgba(72, 171, 232, 0.8); /* 设置背景色和透明度 */
        border-radius: 7.3242rpx /* 10px -> 7.3242rpx */;
        backdrop-filter: blur(14.6484rpx /* 19.9999px -> 14.6484rpx */); /* 添加模糊效果 */
        // tetx {
        //   max-width: 100%;
        //   white-space: nowrap;
        //   overflow: hidden;
        //   text-overflow: ellipsis;
        // }
        ::v-deep {
          .uni-icons {
            font-size: 54.9316rpx /* 75px -> 54.9316rpx */ !important;
          }
        }
      }
    }
  }
}
</style>
