<template>
  <HeadFill />
  <view class="container">
    <!-- 顶部,左上Logo -->
    <view class="header">
      <view class="logo-box">
        <image class="logo-img" src="@/static/image/icons/merry-go-round.png" mode="aspectFit" />
        <view class="logo-text">
          <text>探访系统</text>
          <text>安全、高效、便捷、信息化、智能化</text>
        </view>
      </view>
    </view>
    <!-- 主体 -->
    <view class="main">
      <!-- 主体左部,img -->
      <view class="layout-left">
        <image class="" src="@/static/image/images/switch.png" mode="widthFix" />
      </view>
      <!-- 主体右部,form -->
      <view class="layout-right">
        <view class="form-box">
          <text class="form-title">探访系统 欢迎您！</text>
          <view class="form-body">
            <!-- 表单组件 -->
            <uni-forms :model="formData" ref="form" :rules="rules" label-position="top">
              <uni-forms-item label="账号" label-color="#44a433" name="username">
                <uni-easyinput v-model="formData.username" placeholder="请输入账号" @blur="validateField('username')" />
              </uni-forms-item>
              <uni-forms-item label="密码" name="password">
                <uni-easyinput
                  class="i"
                  v-model="formData.password"
                  placeholder="请输入密码"
                  type="password"
                  @blur="validateField('password')"
                />
              </uni-forms-item>
              <view class="from-login-button">
                <uni-button @click="submitForm" type="primary">登 录</uni-button>
              </view>
            </uni-forms>
          </view>
        </view>
      </view>
    </view>
    <!-- 底部,声明 -->
    <view class="footer">
      <text>技术支持：重庆云祥晟科技有限公司</text>
    </view>
  </view>
</template>

<script setup>
import { userLoginStore } from '@/store/login.js'
import { ref } from 'vue'

const loginStore = userLoginStore()
//登录表单数据
const formData = ref({
  username: '', //账号
  password: '' //密码
})

//表单组件验证规则
const rules = {
  username: {
    rules: [
      { required: true, errorMessage: '账号不能为空' }, //必须存在数据
      { pattern: /^[a-zA-Z0-9]{3,16}$/, errorMessage: '账号只能包含字母和数字，长度在3到16个字符之间' }
    ]
  },
  password: {
    rules: [
      { required: true, errorMessage: '密码不能为空' }, //必须存在数据
      {
        pattern: /^[a-zA-Z0-9@#$%^&*]{6,16}$/,
        errorMessage: '密码长度应在6到16个字符之间，且只能包含字母、数字和特殊字符@#$%^&*'
      }
    ]
  }
}
//获取整个表单元素
const form = ref(null)
// 验证单个字段
const validateField = fieldName => {
  form.value.validateField(fieldName).catch(error => {
    console.log(fieldName, '表单校验失败')
  })
}
//提交表单
const submitForm = () => {
  form.value
    .validate()
    .then(async valid => {
      //对象解构
      const { username, password } = formData.value
      //表单规则校验成功,发起登录请求
      await loginStore.login({ username, password })
    })
    .catch(error => {
      ////校验失败
      console.log('表单校验失败', error)
      // uni.showToast({
      //   title: '账号或密码格式有误',
      //   icon: 'none',
      //   duration: 2000 //弹窗持续时间
      // })
    })
}
// 登录逻辑
// const login = async () => {
//   //-------测试---------
//   // let res = await getConstellation_API({
//   //   birthday: '2002-01-05'
//   // })
//   // console.log(res)

//   //--------登录------------
//   // let res = await logi_API({
//   //   username,
//   //   password
//   // })
//   // if (res.code === 200) {
//   if (formData.value.username === 'system' && formData.value.password === 'admin123') {
//     uni.navigateTo({
//       url: '/pages/index/index'
//     })
//   }
//   // res.code ==?
//   else {
//     uni.showToast({
//       title: '请输入正确的账号和密码',
//       icon: 'none',
//       duration: 2000 //弹窗持续时间
//     })
//   }
//   // }
// }
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  /* 背景颜色、图片、定位和尺寸 */
  // background-image: url('@/static/image/images/login-background.png');
  // background-size: 100% 100%;
  .header {
    flex: 2;
    position: relative;
    .logo-box {
      position: absolute;
      left: 36.6211rpx /* 50px -> 36.6211rpx */;
      bottom: 0;
      display: flex;
      // justify-content: center;
      align-items: center;
      width: 300.293rpx /* 410px -> 300.293rpx */;
      height: 43.9453rpx /* 60px -> 43.9453rpx */;
      padding: 3.6621rpx /* 5px -> 3.6621rpx */;
      // background-color: aqua;
      .logo-img {
        width: 36.6211rpx /* 50px -> 36.6211rpx */;
        height: 36.6211rpx /* 50px -> 36.6211rpx */;
        // background-color: #fff;
      }
      .logo-text {
        display: flex;
        flex-direction: column;
        width: 245.3613rpx /* 335px -> 245.3613rpx */;
        margin-left: 10.9863rpx /* 15px -> 10.9863rpx */;
        text:first-child {
          // font-size: 21.9727rpx /* 30px -> 21.9727rpx */;
          font-weight: 500;
          color: #108b89;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        text:last-child {
          font-size: 11.7188rpx /* 16px -> 11.7188rpx */;
          color: #108b89;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    // background-color: rgb(255, 119, 0);
  }
  .main {
    flex: 8;
    display: flex;
    // background-color: rgb(26, 255, 0);
    .layout-left {
      flex: 1;
      // background-color: #108b89;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .layout-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      // background-color: #fff;
      .form-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        // justify-content: center;
        width: 292.9688rpx /* 400px -> 292.9688rpx */;
        height: 300.293rpx /* 410px -> 300.293rpx */;
        padding: 29.2969rpx /* 40px -> 29.2969rpx */;
        border: 0.7324rpx /* 1px -> .7324rpx */ #b0b2ba solid;
        // background-color: #fff;
        // background-color: rgb(192, 134, 134);
        .form-title {
          font-size: 26.3672rpx /* 36px -> 26.3672rpx */;
          padding: 7.3242rpx /* 10px -> 7.3242rpx */;
        }
        .form-body {
          width: 100%;
          margin-top: 14.6484rpx /* 20px -> 14.6484rpx */;
          .from-login-button {
            margin-top: 25.6348rpx /* 35px -> 25.6348rpx */;
            width: 100%;
            height: 25.6348rpx /* 35px -> 25.6348rpx */;
            line-height: 25.6348rpx /* 35px -> 25.6348rpx */;
            text-align: center;
            font-size: 16.1133rpx /* 22px -> 16.1133rpx */;
            font-weight: 600;
            color: #fff;
            background-color: #0055bb;
            border-radius: 18rpx;
          }
        }
      }
    }
  }
  .footer {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
}
</style>
